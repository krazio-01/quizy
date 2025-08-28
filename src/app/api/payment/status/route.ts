import { NextRequest, NextResponse } from 'next/server';
import { PayGlocalClient } from '@/utils/payGlocalAuth';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const transactionId = searchParams.get('transactionId');

        if (!transactionId) return NextResponse.json({ message: 'missing-transaction-id' }, { status: 400 });

        const payglocalClient = new PayGlocalClient();
        const result = await payglocalClient.checkPaymentStatus(transactionId);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Payment status check failed:', error);
        return NextResponse.json({ message: 'processing-error' }, { status: 500 });
    }
}
