import nodemailer from 'nodemailer';

const sendEmail = async (userEmail, subject, text, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            port: process.env.EMAIL_PORT,
            secure: process.env.SECURE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.PASSWORD,
            },
        });

        const mail_configs = {
            from: `"League Of Logic" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: subject,
            text: text,
            html: html,
        };

        await transporter.sendMail(mail_configs);
        return transporter;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export default sendEmail;
