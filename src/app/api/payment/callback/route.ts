import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const orderId = url.searchParams.get('orderId') || 'N/A';
        const gid = url.searchParams.get('gid') || 'N/A';
        const status = url.searchParams.get('status') || 'pending';
        const baseUrl = process.env.FRONTEND_URL;
        const error = url.searchParams.get('error') || '';

        let statusText = 'Payment Status';
        let message = '';
        let statusClass = 'unknown';
        let redirectUrl = `${baseUrl}`;

        switch (status) {
            case 'SENT_FOR_CAPTURE':
                statusText = 'Payment Successful';
                message = 'Your payment has been processed successfully.';
                statusClass = 'success';
                redirectUrl = `${baseUrl}/quiz/contest/welcome`;
                break;
            case 'ABANDONED':
                statusText = 'Payment Failed';
                message = 'Payment timed out.';
                statusClass = 'failed';
                break;
            case 'CUSTOMER_CANCELLED':
                statusText = 'Payment Cancelled';
                message = 'You cancelled the payment.';
                statusClass = 'cancelled';
                break;
            case 'SYSTEM_ERROR':
                statusText = 'System Error';
                message = 'Transaction failed. No charges applied.';
                statusClass = 'error';
                break;
            case 'ISSUER_DECLINE':
                statusText = 'Payment Declined';
                message = 'Your bank declined the payment. Please try another payment method.';
                statusClass = 'error';
                break;
            default:
                statusText = 'Payment Status';
                message = '';
                statusClass = 'unknown';
        }

        const templatePath = path.resolve(process.cwd(), 'src/templates/paymentStatus.html');
        let html = fs.readFileSync(templatePath, 'utf-8');

        html = html
            .replace('{{statusClass}}', statusClass)
            .replace('{{statusText}}', statusText)
            .replace('{{message}}', message)
            .replace('{{orderId}}', orderId)
            .replace('{{gid}}', gid)
            .replace('{{redirectUrl}}', redirectUrl);

        return new Response(html, {
            headers: { 'Content-Type': 'text/html' },
        });
    } catch (err) {
        console.error('Payment status rendering error:', err);
        return new Response('Internal Server Error', { status: 500 });
    }
}
