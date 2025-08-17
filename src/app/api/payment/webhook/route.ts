import { PayGlocalClient } from '@/utils/payGlocalAuth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const BASEURL = process.env.FRONTEND_URL;
    const REDIRECT_ENDPOINT = '/api/payment/status';

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

        const { status, gid, merchantUniqueId, merchantTxnId, Amount } = paymentStatus;

        console.log('\n\n\n----------------------------md-paymentStatus:', paymentStatus);

        const payload = {
            merchantTxnId,
            paymentData: {
                totalAmount: Amount,
                txnCurrency: 'AED',
            },
            merchantCallbackURL: `${process.env.FRONTEND_URL}${REDIRECT_ENDPOINT}`,
        };
        const payglocalClient = new PayGlocalClient();
        const response = await payglocalClient.checkPaymentStatus(gid, payload);

        console.log('\n\n\n----------------------------md-response:', response);

        await updatePaymentStatus({
            orderId: merchantUniqueId,
            gid,
            status,
            paymentData: paymentStatus,
        });

        // const statusUrl = new URL(REDIRECT_ENDPOINT, BASEURL);
        // statusUrl.searchParams.set('orderId', merchantUniqueId);
        // statusUrl.searchParams.set('gid', gid);
        // statusUrl.searchParams.set('status', status);

        // return NextResponse.redirect(statusUrl);
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

function isSuccessStatus(status) {
    const successStatuses = ['SENT_FOR_CAPTURE', 'CAPTURED', 'SUCCESS', 'AUTHORIZED', 'SETTLED'];
    return successStatuses.includes(status);
}

function isCancelledStatus(status) {
    const cancelledStatuses = ['CANCELLED', 'USER_CANCELLED', 'ABANDONED', 'EXPIRED', 'TIMEOUT', 'CUSTOMER_CANCELLED'];
    return cancelledStatuses.includes(status);
}

// Placeholder function to update payment status in your database
async function updatePaymentStatus({ orderId, gid, status, paymentData }) {
    try {
        // TODO: Implement your actual database update logic here
        // Example with Prisma:
        // await prisma.order.update({
        //     where: { id: orderId },
        //     data: {
        //         paymentStatus: status,
        //         paymentGid: gid,
        //         paymentData: JSON.stringify(paymentData),
        //         updatedAt: new Date()
        //     }
        // });

        // Handle different status types for business logic
        if (isSuccessStatus(status)) {
            console.log('Payment successful - proceed with order fulfillment');
        } else if (isCancelledStatus(status)) {
            console.log('Payment cancelled - release inventory/booking');
        } else {
            console.log('Payment failed - handle failure case');
        }
    } catch (error) {
        console.error('Database update error:', error);
    }
}
