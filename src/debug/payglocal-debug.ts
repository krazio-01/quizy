// src/utils/payGlocalJWTDebugger.ts
import { generateJWEAndJWS } from 'payglocal-js-client';

export class PayGlocalJWTDebugger {
    private config: any;

    constructor() {
        this.config = {
            merchantId: process.env.PAYGLOCAL_MERCHANT_ID,
            privateKey: process.env.PAYGLOCAL_PRIVATE_KEY,
            publicKey: process.env.PAYGLOCAL_PUBLIC_KEY,
            privateKeyId: process.env.PAYGLOCAL_PRIVATE_KEY_ID,
            publicKeyId: process.env.PAYGLOCAL_PUBLIC_KEY_ID,
            baseUrl: process.env.PAYGLOCAL_BASE_URL,
        };
    }

    // Step 1: Validate environment setup
    validateEnvironment() {
        console.log('\n🔍 === ENVIRONMENT VALIDATION ===');

        const checks = {
            merchantId: {
                exists: !!this.config.merchantId,
                value: this.config.merchantId,
                length: this.config.merchantId?.length || 0,
            },
            baseUrl: {
                exists: !!this.config.baseUrl,
                value: this.config.baseUrl,
                isUAT: this.config.baseUrl?.includes('uat'),
                isProd: this.config.baseUrl?.includes('prod'),
            },
            privateKeyId: {
                exists: !!this.config.privateKeyId,
                value: this.config.privateKeyId,
                format: this.config.privateKeyId?.includes('-') ? 'UUID format' : 'Invalid format',
                length: this.config.privateKeyId?.length || 0,
            },
            publicKeyId: {
                exists: !!this.config.publicKeyId,
                value: this.config.publicKeyId,
                format: this.config.publicKeyId?.includes('-') ? 'UUID format' : 'Invalid format',
                length: this.config.publicKeyId?.length || 0,
            },
            privateKey: {
                exists: !!this.config.privateKey,
                hasBegin: this.config.privateKey?.includes('-----BEGIN PRIVATE KEY-----'),
                hasEnd: this.config.privateKey?.includes('-----END PRIVATE KEY-----'),
                length: this.config.privateKey?.length || 0,
                preview: this.config.privateKey?.substring(0, 50) + '...' || 'Not set',
            },
            publicKey: {
                exists: !!this.config.publicKey,
                hasBegin: this.config.publicKey?.includes('-----BEGIN CERTIFICATE-----'),
                hasEnd: this.config.publicKey?.includes('-----END CERTIFICATE-----'),
                length: this.config.publicKey?.length || 0,
                preview: this.config.publicKey?.substring(0, 50) + '...' || 'Not set',
            },
        };

        console.log('Environment Checks:', JSON.stringify(checks, null, 2));

        // Validation results
        const issues = [];
        if (!checks.merchantId.exists) issues.push('❌ PAYGLOCAL_MERCHANT_ID missing');
        if (!checks.baseUrl.exists) issues.push('❌ PAYGLOCAL_BASE_URL missing');
        if (!checks.privateKeyId.exists) issues.push('❌ PAYGLOCAL_PRIVATE_KEY_ID missing');
        if (!checks.publicKeyId.exists) issues.push('❌ PAYGLOCAL_PUBLIC_KEY_ID missing');
        if (!checks.privateKey.exists) issues.push('❌ PAYGLOCAL_PRIVATE_KEY missing');
        if (!checks.publicKey.exists) issues.push('❌ PAYGLOCAL_PUBLIC_KEY missing');
        if (!checks.privateKey.hasBegin) issues.push('❌ Private key missing BEGIN marker');
        if (!checks.privateKey.hasEnd) issues.push('❌ Private key missing END marker');
        if (!checks.publicKey.hasBegin) issues.push('❌ Public key missing BEGIN marker');
        if (!checks.publicKey.hasEnd) issues.push('❌ Public key missing END marker');

        if (issues.length > 0) {
            console.log('\n🚨 ISSUES FOUND:');
            issues.forEach((issue) => console.log(issue));
        } else {
            console.log('\n✅ All environment variables look good!');
        }

        return { checks, issues };
    }

    // Step 2: Test token generation
    async testTokenGeneration(testPayload?: any) {
        console.log('\n🔑 === TOKEN GENERATION TEST ===');

        const defaultPayload = {
            merchantTxnId: `debug_${Date.now()}`,
            merchantUniqueId: `debug_unique_${Date.now()}`,
            paymentData: {
                totalAmount: '10.00',
                txnCurrency: 'INR',
            },
            merchantCallbackURL: 'https://example.com/callback',
        };

        const payload = testPayload || defaultPayload;
        console.log('Test payload:', JSON.stringify(payload, null, 2));

        try {
            const tokenData = {
                payload,
                publicKey: this.config.publicKey,
                privateKey: this.config.privateKey,
                merchantId: this.config.merchantId,
                privateKeyId: this.config.privateKeyId,
                publicKeyId: this.config.publicKeyId,
            };

            console.log('Token generation config:', {
                merchantId: tokenData.merchantId,
                privateKeyId: tokenData.privateKeyId,
                publicKeyId: tokenData.publicKeyId,
                hasPrivateKey: !!tokenData.privateKey,
                hasPublicKey: !!tokenData.publicKey,
                privateKeyLength: tokenData.privateKey?.length,
                publicKeyLength: tokenData.publicKey?.length,
            });

            const startTime = Date.now();
            const { jweToken, jwsToken } = await generateJWEAndJWS(tokenData);
            const generationTime = Date.now() - startTime;

            console.log('\n✅ TOKEN GENERATION SUCCESSFUL!');
            console.log(`⏱️  Generation time: ${generationTime}ms`);
            console.log(`📏 JWE token length: ${jweToken.length}`);
            console.log(`📏 JWS token length: ${jwsToken.length}`);
            console.log(`🔍 JWE starts with: ${jweToken.substring(0, 100)}...`);
            console.log(`🔍 JWS starts with: ${jwsToken.substring(0, 100)}...`);

            // Try to decode JWS header (it's base64 encoded)
            try {
                const jwtParts = jwsToken.split('.');
                if (jwtParts.length >= 2) {
                    const header = JSON.parse(Buffer.from(jwtParts[0], 'base64url').toString());
                    console.log('🔍 JWS Header:', JSON.stringify(header, null, 2));
                }
            } catch (e) {
                console.log('❌ Could not decode JWS header:', e.message);
            }

            return {
                success: true,
                tokens: { jweToken, jwsToken },
                generationTime,
                lengths: { jwe: jweToken.length, jws: jwsToken.length },
            };
        } catch (error) {
            console.log('\n❌ TOKEN GENERATION FAILED!');
            console.log('Error:', error.message);
            console.log('Stack:', error.stack);

            return {
                success: false,
                error: error.message,
                stack: error.stack,
            };
        }
    }

    // Step 3: Test actual API call
    async testAPICall(payload?: any) {
        console.log('\n🌐 === API CALL TEST ===');

        const tokenResult = await this.testTokenGeneration(payload);
        if (!tokenResult.success) {
            return { success: false, error: 'Token generation failed', tokenResult };
        }

        const { jweToken, jwsToken } = tokenResult.tokens;
        const url = `${this.config.baseUrl}/gl/v1/payments/initiate/paycollect`;

        console.log('Making API call to:', url);
        console.log('Headers will include:', {
            'Content-Type': 'application/json',
            accept: 'application/json',
            'x-gl-token-external': `${jwsToken.substring(0, 50)}...`,
        });

        try {
            const startTime = Date.now();

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    'x-gl-token-external': jwsToken,
                },
                body: jweToken,
            });

            const callTime = Date.now() - startTime;
            console.log(`⏱️  API call time: ${callTime}ms`);
            console.log(`📤 Request sent to: ${url}`);
            console.log(`📥 Response status: ${response.status}`);
            console.log(`📋 Response headers:`, Object.fromEntries(response.headers.entries()));

            const responseText = await response.text();
            console.log(`📄 Raw response: ${responseText}`);

            let responseData;
            try {
                responseData = JSON.parse(responseText);
                console.log('📊 Parsed response:', JSON.stringify(responseData, null, 2));
            } catch (e) {
                console.log('❌ Could not parse response as JSON');
                responseData = { rawText: responseText };
            }

            return {
                success: response.ok,
                status: response.status,
                headers: Object.fromEntries(response.headers.entries()),
                data: responseData,
                callTime,
                tokenGeneration: tokenResult,
            };
        } catch (error) {
            console.log('❌ API CALL FAILED!');
            console.log('Error:', error.message);

            return {
                success: false,
                error: error.message,
                stack: error.stack,
                tokenGeneration: tokenResult,
            };
        }
    }

    // Complete debug run
    async runCompleteDebug(testPayload?: any) {
        console.log('\n🚀 === COMPLETE PAYGLOCAL JWT DEBUG SESSION ===');
        console.log(`🕐 Started at: ${new Date().toISOString()}`);

        const results = {
            timestamp: new Date().toISOString(),
            environment: this.validateEnvironment(),
            tokenGeneration: await this.testTokenGeneration(testPayload),
            apiCall: await this.testAPICall(testPayload),
        };

        console.log('\n📋 === DEBUG SUMMARY ===');
        console.log(`Environment Issues: ${results.environment.issues.length}`);
        console.log(`Token Generation: ${results.tokenGeneration.success ? '✅ Success' : '❌ Failed'}`);
        console.log(`API Call: ${results.apiCall.success ? '✅ Success' : '❌ Failed'}`);

        if (!results.apiCall.success) {
            console.log('\n🔍 === DEBUGGING HINTS ===');

            if (results.environment.issues.length > 0) {
                console.log('1. Fix environment issues first');
            }

            if (!results.tokenGeneration.success) {
                console.log('2. Token generation is failing - check your keys');
            } else if (results.apiCall.status === 401) {
                console.log('2. 401 Unauthorized - Check:');
                console.log('   - Are you using UAT keys with UAT URL?');
                console.log('   - Is your merchant ID correct?');
                console.log('   - Are your key IDs extracted correctly from filenames?');
            }
        }

        return results;
    }
}
