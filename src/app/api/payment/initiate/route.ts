import { NextRequest, NextResponse } from 'next/server';
import { PayGlocalClient } from '@/utils/payGlocalAuth';
import UserModel from '@/models/UserModel';
import axios from 'axios';

const BASE_AMOUNT = 75;
const BASE_CURRENCY = 'AED';

const COMMON_CURRENCIES = new Set([
    'MYR',
    'AZN',
    'SEK',
    'QAR',
    'CNY',
    'USD',
    'SGD',
    'CHF',
    'AUD',
    'ILS',
    'HKD',
    'AED',
    'EUR',
    'DKK',
    'CAD',
    'NOK',
    'INR',
    'GBP',
    'NZD',
]);

const COUNTRY_TO_CURRENCY: Record<string, string> = {
    IN: 'INR',
    AE: 'AED',
    US: 'USD',
    GB: 'GBP',
    SG: 'SGD',
    AU: 'AUD',
    CN: 'CNY',
    HK: 'HKD',
    MY: 'MYR',
    NZ: 'NZD',
    SE: 'SEK',
    CH: 'CHF',
    CA: 'CAD',
    DK: 'DKK',
    NO: 'NOK',
    EU: 'EUR',
};

function getClientIp(req: NextRequest): string {
    return (
        req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        req.headers.get('x-real-ip') ||
        req.headers.get('cf-connecting-ip') ||
        '8.8.8.8'
    );
}

async function getConversionRate(from: string, to: string): Promise<number> {
    try {
        const { data } = await axios.get(
            `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_key}/latest/${from}`
        );
        const { conversion_rates } = data;
        return conversion_rates?.[to] ?? 1;
    } catch (error) {
        console.error(`Exchange rate fetch error (${from} → ${to}):`, error);
        return 1;
    }
}

function generateId(prefix: string, length = 40): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`.slice(0, length);
}

export async function POST(request: NextRequest) {
    try {
        const { customerEmail, customerPhone } = await request.json();

        if (!customerEmail || !customerPhone) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields: email, phone' },
                { status: 400 }
            );
        }

        const user = await UserModel.findOne({ email: customerEmail });
        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

        const ip = getClientIp(request);
        const { data: geoData } = await axios.get(`http://ip-api.com/json/${ip}`);
        const countryCode = geoData?.countryCode ?? 'AE';

        let userCurrency = COUNTRY_TO_CURRENCY[countryCode] ?? 'USD';
        if (!COMMON_CURRENCIES.has(userCurrency)) userCurrency = 'USD';

        const rate = await getConversionRate(BASE_CURRENCY, userCurrency);
        const convertedAmount = +(BASE_AMOUNT * rate).toFixed(2);

        const orderId = generateId('REG');
        const merchantTxnId = generateId('TXN');

        const paymentPayload = {
            merchantTxnId,
            merchantUniqueId: orderId,
            merchantCallbackURL: `${process.env.FRONTEND_URL}/api/payment/webhook`,
            paymentData: {
                totalAmount: convertedAmount.toString(),
                txnCurrency: userCurrency,
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
                    addressCountry: countryCode,
                    emailId: customerEmail,
                },
            },
        };

        const payglocalClient = new PayGlocalClient();
        const result = await payglocalClient.initiatePayment(paymentPayload);

        return NextResponse.json({
            success: true,
            paymentUrl: result.data?.redirectUrl ?? result.redirectUrl,
            gid: result.gid,
            muid: merchantTxnId,
            orderId,
            currency: userCurrency,
            amount: convertedAmount,
            rate,
            baseAmount: BASE_AMOUNT,
            baseCurrency: BASE_CURRENCY,
            message: 'Payment initiated successfully',
        });
    } catch (error: any) {
        console.error('PayGlocal payment initiation error:', error);
        return NextResponse.json(
            { success: false, message: error.message ?? 'Payment initiation failed' },
            { status: 500 }
        );
    }
}
