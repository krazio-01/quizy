import { NextRequest, NextResponse } from 'next/server';
import PaymentModel from '@/models/PayMentModel';
import UserModel from '@/models/UserModel';
import path from 'path';
import sendEmail from '@/utils/sendMail';
import { generateMailTemplate } from '@/utils/helperFn';

interface UpdatePaymentParams {
    orderId: string;
    transactionId: string;
    status: string;
}

export async function POST(request: NextRequest) {
    const BASEURL = process.env.FRONTEND_URL;
    const REDIRECT_ENDPOINT = '/api/payment/callback';

    try {
        const formData = await request.formData();
        const token = formData.get('x-gl-token');

        if (!token) {
            const failureUrl = new URL(REDIRECT_ENDPOINT, BASEURL);
            failureUrl.searchParams.set('error', 'no-token');
            return NextResponse.redirect(failureUrl);
        }

        const paymentStatus = decodePayGlocalToken(token);

        if (!paymentStatus) {
            const failureUrl = new URL(REDIRECT_ENDPOINT, BASEURL);
            failureUrl.searchParams.set('error', 'invalid-token');
            return NextResponse.redirect(failureUrl);
        }

        const { status, gid, merchantUniqueId } = paymentStatus;

        // Update the payment status in the database
        await updatePaymentStatus({
            orderId: merchantUniqueId,
            status,
            transactionId: gid,
        });

        const url = new URL(REDIRECT_ENDPOINT, BASEURL);
        url.searchParams.set('orderId', merchantUniqueId);
        url.searchParams.set('gid', gid);
        url.searchParams.set('status', status);

        return NextResponse.redirect(url);
    } catch (error) {
        const failureUrl = new URL(REDIRECT_ENDPOINT, BASEURL);
        failureUrl.searchParams.set('error', 'processing-error');
        return NextResponse.redirect(failureUrl);
    }
}

function decodePayGlocalToken(token) {
    try {
        const tokenParts = token.split('.');

        if (tokenParts.length !== 3) throw new Error('Invalid JWT token format');
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64url').toString());

        return payload;
    } catch (error) {
        console.error('Token decoding error:', error);
        return null;
    }
}

async function updatePaymentStatus({ orderId, status, transactionId }: UpdatePaymentParams) {
    try {
        const payment = await PaymentModel.findOne({ orderId });

        if (!payment) return;

        const user = await UserModel.findById(payment.userId);

        if (user?.email) {
            const to = user.email;

            if (!user.hasReceivedWelcomeEmail) {
                const accountTemplatePath = path.resolve(process.cwd(), 'src/templates/accountCreation.html');
                const accountContent = generateMailTemplate(accountTemplatePath, {
                    name: `${user.firstName} ${user.lastName}`,
                });

                await sendEmail(to, 'Successful Account Creation', null, accountContent);
                user.hasReceivedWelcomeEmail = true;
                await user.save();
            }

            const paymentTemplatePath = path.resolve(process.cwd(), 'src/templates/paymentStatusMail.html');
            const templateData = getPaymentTemplateData(status, payment, user, transactionId);
            const paymentContent = generateMailTemplate(paymentTemplatePath, templateData);

            await sendEmail(to, templateData?.statusText, null, paymentContent);
        }

        if (status === 'SENT_FOR_CAPTURE') {
            payment.status = 'success';
            payment.transactionId = transactionId;
            await payment.save();
        }
    } catch (error) {
        console.error('Database update error:', error);
        throw error;
    }
}

function getPaymentTemplateData(status: string, payment: any, user: any, transactionId: string | null) {
    let statusText = 'Unknown Status';
    let message = 'We were unable to determine your payment status.';
    let extraNote = '';

    const [value, currency] = payment?.amount.split(' ');

    switch (status?.toUpperCase()) {
        case 'SUCCESS':
        case 'SENT_FOR_CAPTURE':
            statusText = 'Payment Confirmation';
            message = `We are pleased to inform you that your payment of ${currency}${parseFloat(value).toFixed(
                2
            )} has been successfully processed.`;
            extraNote =
                'You can now log in with your credentials to download your invoice, practice papers, test guidelines, and more from your dashboard.';
            break;

        case 'CUSTOMER_CANCELLED':
            statusText = 'Payment Cancellation Notification';
            message = 'Your payment has been successfully cancelled, and no amount has been deducted.';
            extraNote =
                'Thank you for choosing us. If you wish to proceed with your payment again, you can easily do so by logging into your account and completing the transaction directly from your USER Dashboard using your login credentials.';
            break;

        case 'ABANDONED':
        case 'FAILED':
            statusText = 'Payment Unsuccessful - Action Required';
            message = `We regret to inform you that your recent payment attempt of ${currency}${parseFloat(
                value
            ).toFixed(2)} was unsuccessful.`;
            extraNote =
                'Unfortunately, the payment did not go through, and no amount has been deducted from your account. Please log in and try again.';
            break;

        case 'SYSTEM_ERROR':
            statusText = 'Payment Unsuccessful - Action Required';
            message = 'An unexpected error occurred while processing your payment.';
            extraNote = 'Please try again later or contact our support team if the issue persists.';
            break;
    }

    return {
        statusText,
        message,
        extraNote,
        name: `${user.firstName} ${user.lastName}`,
        orderId: payment.orderId,
        transactionId: transactionId ?? payment.transactionId,
        amount: `${currency}${parseFloat(value).toFixed(2)}`,
        createdAt: new Date(payment.createdAt).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }),
    };
}
