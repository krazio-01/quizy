import { NextResponse } from 'next/server';
import UserModel from '@/models/UserModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const cookieStore = cookies();
        const cookieEmail = (await cookieStore).get('regSessionEmail')?.value;

        const email = session?.user?.email || cookieEmail;

        if (!email) return NextResponse.json({ message: 'email required' }, { status: 400 });

        const user = await UserModel.findOne({ email }).select(
            '-password -otp -otpExpiry -createdAt -updatedAt -hasReceivedWelcomeEmail -__v'
        );

        if (!user) return NextResponse.json({ message: 'user not found' }, { status: 404 });

        return NextResponse.json(user);
    } catch (error) {
        console.error('User fetch failed:', error);
        return NextResponse.json({ message: 'processing-error' }, { status: 500 });
    }
}
