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

        if (!this.merchantId || !this.privateKey || !this.publicKey) {
            throw new Error('PayGlocal configuration incomplete. Check environment variables.');
        }

        console.log('PayGlocal Client initialized:', {
            merchantId: this.merchantId,
            baseUrl: this.baseUrl,
            hasPrivateKey: !!this.privateKey,
            hasPublicKey: !!this.publicKey,
            privateKeyId: this.privateKeyId,
            publicKeyId: this.publicKeyId,
        });
    }

    async generateTokens(payload: GenerateTokensPayload): Promise<PayGlocalTokens> {
        try {
            console.log('Generating tokens with payload:', JSON.stringify(payload, null, 2));

            const data = {
                payload,
                publicKey: this.publicKey,
                privateKey: this.privateKey,
                merchantId: this.merchantId,
                privateKeyId: this.privateKeyId,
                publicKeyId: this.publicKeyId,
            };

            const tokens = await generateJWEAndJWS(data);
            console.log('Tokens generated successfully');
            console.log('Tokens \n:', tokens);
            return tokens;
        } catch (error) {
            console.error('PayGlocal token generation failed:', error);
            throw new Error(`Failed to generate PayGlocal tokens: ${error.message}`);
        }
    }

    async makeAPICall(endpoint: string, payload: GenerateTokensPayload): Promise<any> {
        try {
            console.log('Making API call to:', `${this.baseUrl}${endpoint}`);
            console.log('With payload:', JSON.stringify(payload, null, 2));

            const { jweToken, jwsToken } = await this.generateTokens(payload);

            const headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                'x-gl-token-external': jwsToken,
            };

            console.log('Request headers:', headers);

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers,
                body: jweToken,
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API error response:', errorText);
                throw new Error(`PayGlocal API error (${response.status}): ${errorText}`);
            }

            const result = await response.json();
            console.log('API response:', JSON.stringify(result, null, 2));
            return result;
        } catch (error) {
            console.error('PayGlocal API call failed:', error);
            throw error;
        }
    }

    async initiatePayment(paymentData: PayGlocalPayCollectRequest): Promise<any> {
        return this.makeAPICall('/gl/v1/payments/initiate/paycollect', paymentData);
    }

    async checkPaymentStatus(gid: string): Promise<any> {
        return this.makeAPICall(`/gl/v1/payments/${gid}/status`, {});
    }
}
