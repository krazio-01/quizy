import { NextRequest, NextResponse } from 'next/server';
import PaymentModel from '@/models/PayMentModel';

interface UpdatePaymentParams {
    orderId: string;
    transactionId: string;
    status: string;
}

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

        const { status, gid, merchantUniqueId } = paymentStatus;

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

export async function updatePaymentStatus({ orderId, status, transactionId }: UpdatePaymentParams) {
    try {
        if (status !== 'SENT_FOR_CAPTURE') return;
        status = 'success';
        await PaymentModel.findOneAndUpdate({ orderId }, { status, transactionId }, { new: true });
    } catch (error) {
        console.error('Database update error:', error);
        throw error;
    }
}
