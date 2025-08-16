import { NextResponse } from 'next/server';
import { PayGlocalClient } from '@/utils/payGlocalAuth';

export async function POST(request) {
    try {
        const body = await request.json();
        const { amount, currency = 'INR', customerEmail, customerPhone, orderId } = body;

        if (!amount || !customerEmail || !customerPhone || !orderId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Missing required fields: amount, customerEmail, customerPhone, orderId',
                },
                { status: 400 }
            );
        }

        const muid = `${orderId}_${Date.now()}`;

        // Fixed payload structure according to PayGlocal docs
        const paymentPayload = {
            merchantTxnId: muid,
            merchantUniqueId: muid,
            merchantCallbackURL: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/webhook`,
            paymentData: {
                totalAmount: String(amount),
                txnCurrency: String(currency),
                billingData: {
                    emailId: customerEmail,
                    callingCode: '+91',
                    phoneNumber: customerPhone,
                },
            },
            riskData: {
                customerData: {
                    merchantAssignedCustomerId: orderId,
                },
                shippingData: {
                    addressCountry: 'IN',
                    emailId: customerEmail,
                },
            },
        };

        console.log('Initiating PayGlocal payment:', { orderId, amount, currency, muid });
        console.log('Payment payload:', JSON.stringify(paymentPayload, null, 2));

        const payglocalClient = new PayGlocalClient();
        const result = await payglocalClient.initiatePayment(paymentPayload);

        return NextResponse.json({
            success: true,
            paymentUrl: result.data?.redirectUrl || result.redirectUrl,
            gid: result.gid,
            muid: muid,
            orderId: orderId,
            message: 'Payment initiated successfully',
        });
    } catch (error) {
        console.error('PayGlocal payment initiation error:', error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || 'Payment initiation failed',
            },
            { status: 500 }
        );
    }
}
