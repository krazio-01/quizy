import { NextResponse } from 'next/server';
import connectToDB from '@/utils/dbConnect';
import User from '@/models/UserModel';
import { cookies } from 'next/headers';
import sendEmail from '@/utils/sendMail';
import fs from 'fs';
import path from 'path';

export async function POST() {
    await connectToDB();

    try {
        const cookieStore = cookies();
        const email = (await cookieStore).get('regSessionEmail')?.value;

        const user = await User.findOne({ email });

        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

        if (user.isVerified) return NextResponse.json({ message: 'User already verified' }, { status: 400 });

        const now = new Date();
        if (user.lastOtpSentAt && now.getTime() - user.lastOtpSentAt.getTime() < 60_000)
            return NextResponse.json(
                { message: 'Please wait at least 1 minute before requesting another OTP.' },
                { status: 429 }
            );

        const lastSent = user.lastOtpSentAt ? new Date(user.lastOtpSentAt) : null;
        if (lastSent && lastSent.toDateString() === now.toDateString()) {
            if (user.otpRequestCount >= 5) {
                return NextResponse.json(
                    { message: 'Too many OTP requests today. Try again tomorrow.' },
                    { status: 429 }
                );
            }
            user.otpRequestCount += 1;
        } else user.otpRequestCount = 1;

        user.lastOtpSentAt = new Date();

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send email
        const templatePath = path.resolve(process.cwd(), 'src/templates/resendOtp.html');
        const verifyTemplate = fs.readFileSync(templatePath, 'utf8');
        const verificationContent = verifyTemplate
            .replace(/{{name}}/g, `${user.firstName} ${user.lastName}`)
            .replace(/{{otp}}/g, otp);

        await sendEmail(user.email, 'Your Requested OTP for Email Verification', null, verificationContent);

        return NextResponse.json({ message: 'OTP resent successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
    }
}
