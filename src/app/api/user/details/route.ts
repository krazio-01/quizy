import { NextResponse } from 'next/server';
import UserModel from '@/models/UserModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        let email: string | null = null;

        if (session?.user?.email) email = session.user.email;
        else {
            const { searchParams } = new URL(req.url);
            email = searchParams.get('email');
        }

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
