import { NextRequest, NextResponse } from 'next/server';
import { PayGlocalClient } from '@/utils/payGlocalAuth';
import UserModel from '@/models/UserModel';

const AMOUNT = '75';
const CURRENCY = 'AED';

export async function POST(request: NextRequest) {
    try {
        const { customerEmail, customerPhone } = await request.json();

        if (!customerEmail || !customerPhone) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Missing required fields: email, phone',
                },
                { status: 400 }
            );
        }

        const user = await UserModel.findOne({ email: customerEmail });
        console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nmd--------user: ', user);
        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

        const orderId = `REG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const convertedAmount = parseFloat(AMOUNT) * 1;

        const merchantTxnId = `TXN_${Date.now()}`.slice(0, 40);
        const merchantUniqueId = String(orderId).slice(0, 40);

        const paymentPayload = {
            merchantTxnId,
            merchantUniqueId,
            merchantCallbackURL: `${process.env.FRONTEND_URL}/api/payment/webhook`,
            paymentData: {
                totalAmount: convertedAmount.toFixed(2),
                txnCurrency: 'AED',
                billingData: {
                    emailId: customerEmail,
                    callingCode: '+91',
                    phoneNumber: customerPhone,
                },
            },
            riskData: {
                customerData: {
                    merchantAssignedCustomerId: user._id.toString(),
                },
                shippingData: {
                    addressCountry: 'IN',
                    emailId: customerEmail,
                },
            },
        };

        const payglocalClient = new PayGlocalClient();
        const result = await payglocalClient.initiatePayment(paymentPayload);

        return NextResponse.json({
            success: true,
            paymentUrl: result.data?.redirectUrl || result.redirectUrl,
            gid: result.gid,
            muid: merchantTxnId,
            orderId: orderId,
            currency: CURRENCY,
            amount: convertedAmount.toFixed(2),
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
