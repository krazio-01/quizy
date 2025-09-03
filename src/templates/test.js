import sendEmail from '../utils/sendMail.js';
import path from 'path';
import { generateMailTemplate } from '../utils/generateMailTemplate.js';

const to = 'md.krazio@gmail.com';

const paymentTemplatePath = path.resolve(process.cwd(), 'src/templates/paymentStatusMail.html');
const templateData = {
    statusClass,
    statusText,
    message,
    containerStyle,
    name: `${user.firstName} ${user.lastName}`,
    orderId: payment.orderId,
    transactionId: transactionId ?? payment.transactionId,
    amount: `₹${parseFloat(payment.amount).toFixed(2)}`,
    createdAt: new Date(payment.createdAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }),
}

const paymentContent = generateMailTemplate(paymentTemplatePath, templateData);

await sendEmail(to, templateData?.statusText, null, paymentContent);
