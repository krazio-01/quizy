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
    let statusClass = 'unknown';
    let statusText = 'Unknown Status';
    let message = 'We were unable to determine your payment status.';
    let containerColor = '#ffd382';
    let containerStyle = `style="background-color: ${containerColor}`;

    switch (status?.toUpperCase()) {
        case 'SUCCESS':
        case 'SENT_FOR_CAPTURE':
            statusClass = 'success';
            statusText = 'Payment Successful';
            message = `Your payment of ₹${parseFloat(payment.amount).toFixed(2)} has been processed successfully.`;
            containerColor = '#28a745';
            break;

        case 'ABANDONED':
            statusClass = 'failed';
            statusText = 'Payment Failed';
            message = 'Unfortunately, your payment could not be processed. Please try again.';
            containerColor = '#dc3545';
            break;

        case 'SYSTEM_ERROR':
            statusClass = 'error';
            statusText = 'Payment Error';
            message = 'An unexpected error occurred while processing your payment.';
            containerColor = '#ffc107';
            break;

        case 'CUSTOMER_CANCELLED':
            statusClass = 'cancelled';
            statusText = 'Payment Cancelled';
            message = 'You have cancelled the payment. No amount has been deducted.';
            containerColor = '#6c757d';
            break;

        default:
            statusClass = 'unknown';
            statusText = 'Unknown Status';
            message = 'We were unable to verify your payment status. Please contact support.';
            containerColor = '#17a2b8';
            break;
    }

    return {
        statusClass,
        statusText,
        message,
        containerStyle,
        name: `${user.firstName} ${user.lastName}`,
        orderId: payment.orderId,
        transactionId: transactionId ?? payment.transactionId,
        amount: `₹${parseFloat(payment.amount).toFixed(2)}`,
        createdAt: new Date(payment.createdAt).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }),
    };
}
