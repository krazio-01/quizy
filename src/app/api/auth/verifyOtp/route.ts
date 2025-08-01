import { NextResponse, NextRequest } from 'next/server';
import connectToDB from '@/utils/dbConnect';
import User from '@/models/UserModel';

export async function POST(request: NextRequest) {
    await connectToDB();

    try {
        const { email, otp } = await request.json();

        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

        if (user.isVerified) return NextResponse.json({ message: 'User already verified' }, { status: 400 });

        const isOtpExpired = user.otpExpiry && new Date(user.otpExpiry).getTime() < Date.now();
        if (user.otp !== otp || isOtpExpired) {
            return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
        }

        user.otp = undefined;
        user.otpExpiry = undefined;
        user.isVerified = true;

        await user.save();

        return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
    }
}
