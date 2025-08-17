import fs from 'fs';
import { NextRequest } from 'next/server';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        console.log('-------\nPayment status requested');

        const url = new URL(req.url);
        const orderId = url.searchParams.get('orderId') || 'N/A';
        const gid = url.searchParams.get('gid') || 'N/A';
        const status = url.searchParams.get('status') || 'pending';
        const error = url.searchParams.get('error') || '';

        // Map status to text and class
        let statusText = 'Payment Status';
        let message = '';
        let statusClass = 'unknown';

        switch (status) {
            case 'SENT_FOR_CAPTURE':
                statusText = 'Payment Successful';
                message = 'Your payment has been processed successfully.';
                statusClass = 'success';
                break;
            case 'failed':
                statusText = 'Payment Failed';
                message = error || 'There was an issue processing your payment.';
                statusClass = 'failed';
                break;
            case 'CUSTOMER_CANCELLED':
                statusText = 'Payment Cancelled';
                message = 'You cancelled the payment.';
                statusClass = 'cancelled';
                break;
            case 'pending':
                statusText = 'Checking Payment...';
                message = 'We are verifying your payment status.';
                statusClass = 'unknown';
                break;
            default:
                statusText = 'Payment Status';
                message = '';
                statusClass = 'unknown';
        }

        // Read HTML template
        const templatePath = path.resolve(process.cwd(), 'src/templates/paymentStatus.html');
        let html = fs.readFileSync(templatePath, 'utf-8');

        // Replace placeholders
        html = html
            .replace('{{statusClass}}', statusClass)
            .replace('{{statusText}}', statusText)
            .replace('{{message}}', message)
            .replace('{{orderId}}', orderId)
            .replace('{{gid}}', gid);

        return new Response(html, {
            headers: { 'Content-Type': 'text/html' },
        });
    } catch (err) {
        console.error('Payment status rendering error:', err);
        return new Response('Internal Server Error', { status: 500 });
    }
}
