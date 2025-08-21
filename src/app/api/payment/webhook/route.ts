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
        if (status !== 'SENT_FOR_CAPTURE') return;
        status = 'success';

        const payment = await PaymentModel.findOneAndUpdate({ orderId }, { status, transactionId }, { new: true });

        // if (payment) {
        //     const user = await UserModel.findById(payment.userId);

        //     if (user?.email) {
        //         const to = user.email;

        //         if (!user.hasReceivedWelcomeEmail) {
        //             const accountTemplatePath = path.resolve(process.cwd(), 'src/templates/accountCreation.html');
        //             const accountContent = generateMailTemplate(accountTemplatePath, {
        //                 name: `${user.firstName} ${user.lastName}`,
        //                 otp: user.otp,
        //             });

        //             await sendEmail(to, 'Successful Account Creation', null, accountContent);
        //             user.hasReceivedWelcomeEmail = true;
        //             await user.save();
        //         }

        //         const paymentTemplatePath = path.resolve(process.cwd(), 'src/templates/paymentSuccess.html');
        //         const paymentContent = generateMailTemplate(paymentTemplatePath, {
        //             name: `${user.firstName} ${user.lastName}`,
        //             amount: parseFloat(payment.amount).toFixed(2),
        //             orderId: payment.orderId,
        //             transactionId: payment.transactionId,
        //             createdAt: payment.createdAt.toLocaleString(),
        //         });

        //         await sendEmail(to, 'Payment Successful', null, paymentContent);
        //     }
        // }
    } catch (error) {
        console.error('Database update error:', error);
        throw error;
    }
}
