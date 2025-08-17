import { generateJWEAndJWS } from 'payglocal-js-client';

interface PayGlocalTokens {
    jweToken: string;
    jwsToken: string;
}

interface GenerateTokensPayload {
    [key: string]: any;
}

interface PayGlocalPayCollectRequest {
    merchantTxnId: string;
    merchantCallbackURL: string;
    merchantUniqueId?: string;
    paymentData: {
        totalAmount: string;
        txnCurrency: string;
        billingData?: {
            firstName?: string;
            lastName?: string;
            emailId: string;
            callingCode?: string;
            phoneNumber: string;
            addressStreet1?: string;
            addressCity?: string;
            addressState?: string;
            addressPostalCode?: string;
            addressCountry?: string;
        };
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

    async generateTokens(payload: GenerateTokensPayload): Promise<PayGlocalTokens> {
        try {
            const data = {
                payload,
                publicKey: this.publicKey,
                privateKey: this.privateKey,
                merchantId: this.merchantId,
                privateKeyId: this.privateKeyId,
                publicKeyId: this.publicKeyId,
            };

            const tokens = await generateJWEAndJWS(data);
            return tokens;
        } catch (error) {
            console.error('PayGlocal token generation failed:', error);
            throw new Error(`Failed to generate PayGlocal tokens: ${error.message}`);
        }
    }

    async makeAPICall(
        endpoint: string,
        payload: GenerateTokensPayload | null,
        includeBody: boolean = true
    ): Promise<any> {
        try {
            console.log(`\n\n\n\nMaking PayGlocal API call to ${endpoint} with payload:`, payload);

            const { jweToken, jwsToken } = await this.generateTokens(payload);

            const headers: Record<string, string> = {
                accept: 'application/json',
                'x-gl-token-external': jwsToken,
            };

            const fetchOptions: RequestInit = {
                method: 'POST',
                headers,
            };

            if (includeBody && payload) {
                headers['Content-Type'] = 'application/json';
                fetchOptions.body = jweToken;
            }

            const response = await fetch(`${this.baseUrl}${endpoint}`, fetchOptions);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`PayGlocal API error (${response.status}): ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('PayGlocal API call failed:', error);
            throw error;
        }
    }

    async initiatePayment(paymentData: PayGlocalPayCollectRequest): Promise<any> {
        return this.makeAPICall('/gl/v1/payments/initiate/paycollect', paymentData, true);
    }

    async checkPaymentStatus(gid: string, payload: GenerateTokensPayload): Promise<any> {
        return this.makeAPICall(`/gl/v1/payments/${gid}/status`, payload, false);
    }
}
