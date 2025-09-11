import { NextResponse, NextRequest } from 'next/server';
import connectToDB from '@/utils/dbConnect';
import { cookies } from 'next/headers';
import User from '@/models/UserModel';

const MAX_ATTEMPTS = 7;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

export async function POST(request: NextRequest) {
    await connectToDB();

    try {
        const { otp } = await request.json();

        const cookieStore = cookies();
        const email = (await cookieStore).get('regSessionEmail')?.value;

        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
        if (user.isVerified) return NextResponse.json({ message: 'User already verified' }, { status: 400 });

        if (user.otpLockUntil && user.otpLockUntil.getTime() > Date.now()) {
            const msLeft = user.otpLockUntil.getTime() - Date.now();
            const minutesLeft = Math.ceil(msLeft / 1000 / 60);

            return NextResponse.json(
                { message: `Too many failed attempts. Try again in ${minutesLeft} minute(s).` },
                { status: 429 }
            );
        }

        const isOtpExpired = user.otpExpiry && new Date(user.otpExpiry).getTime() < Date.now();
        if (user.otp !== otp || isOtpExpired) {
            user.otpAttempts = (user.otpAttempts || 0) + 1;

            if (user.otpAttempts >= MAX_ATTEMPTS) {
                user.otpLockUntil = new Date(Date.now() + LOCK_TIME);
                user.otpAttempts = 0;
            }

            await user.save();
            return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
        }

        user.otp = undefined;
        user.otpExpiry = undefined;
        user.isVerified = true;
        user.otpAttempts = 0;
        user.otpLockUntil = null;

        await user.save();

        return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
    }
}
