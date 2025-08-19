import { generateJWEAndJWS, generateJWS } from 'payglocal-js-client';

interface PayGlocalPayCollectRequest {
    merchantTxnId: string;
    merchantCallbackURL: string;
    merchantUniqueId?: string;
    paymentData: {
        totalAmount: string;
        txnCurrency: string;
        billingData?: object;
    };
    riskData?: {
        customerData?: {
            merchantAssignedCustomerId?: string;
        };
        shippingData?: {
            addressCountry: string;
            emailId: string;
        };
        [key: string]: any;
    };
}

export class PayGlocalClient {
    private merchantId: string;
    private privateKey: string;
    private publicKey: string;
    private privateKeyId?: string;
    private publicKeyId?: string;
    private baseUrl: string;

    constructor() {
        this.merchantId = process.env.PAYGLOCAL_MERCHANT_ID ?? '';
        this.privateKey = process.env.PAYGLOCAL_PRIVATE_KEY ?? '';
        this.publicKey = process.env.PAYGLOCAL_PUBLIC_KEY ?? '';
        this.privateKeyId = process.env.PAYGLOCAL_PRIVATE_KEY_ID;
        this.publicKeyId = process.env.PAYGLOCAL_PUBLIC_KEY_ID;
        this.baseUrl = process.env.PAYGLOCAL_BASE_URL ?? '';

        if (!this.merchantId || !this.privateKey || !this.publicKey)
            throw new Error('PayGlocal configuration incomplete. Check environment variables.');
    }

    private async requestAPI(
        endpoint: string,
        method: 'GET' | 'POST',
        headers: Record<string, string>,
        body?: string
    ): Promise<any> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method,
            headers,
            body,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`PayGlocal API error (${response.status}): ${errorText}`);
        }

        return await response.json();
    }

    async initiatePayment(payload: PayGlocalPayCollectRequest): Promise<any> {
        const signedPayload = {
            payload,
            publicKey: this.publicKey,
            privateKey: this.privateKey,
            merchantId: this.merchantId,
            privateKeyId: this.privateKeyId,
            publicKeyId: this.publicKeyId,
        };

        const { jweToken, jwsToken } = await generateJWEAndJWS(signedPayload);

        return this.requestAPI(
            '/gl/v1/payments/initiate/paycollect',
            'POST',
            {
                accept: 'application/json',
                'x-gl-token-external': jwsToken,
                'Content-Type': 'application/json',
            },
            jweToken
        );
    }

    async checkPaymentStatus(gid: string): Promise<any> {
        const statusUri = `/gl/v1/payments/${gid}/status`;
        const signedPayload = {
            payload: statusUri,
            privateKey: this.privateKey,
            merchantId: this.merchantId,
            privateKeyId: this.privateKeyId,
        };

        const jwsToken = await generateJWS(signedPayload);

        return this.requestAPI(statusUri, 'GET', {
            accept: 'application/json',
            'x-gl-token-external': jwsToken,
        });
    }
}
