import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
        ],
    },

    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: `
                            default-src 'self';
                            script-src 'self' 'unsafe-inline' 'unsafe-eval'
                                https://www.google.com https://www.gstatic.com
                                https://www.google-analytics.com https://www.googletagmanager.com
                                https://recaptcha.google.com https://www.recaptcha.net
                                https://js.payglocal.com;
                            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
                            img-src 'self' data: blob: https://res.cloudinary.com https://www.google.com https://www.gstatic.com;
                            font-src 'self' https://fonts.gstatic.com;
                            frame-src 'self' https://www.youtube.com https://www.google.com https://recaptcha.google.com https://www.recaptcha.net;
                            connect-src 'self' https://res.cloudinary.com https://*.google.com https://*.googleapis.com https://www.google-analytics.com https://js.payglocal.com https://ipapi.co;
                            object-src 'none';
                            base-uri 'self';
                            form-action 'self';
                            frame-ancestors 'self';
                            `
                            .replace(/\s{2,}/g, ' ')
                            .trim(),
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
