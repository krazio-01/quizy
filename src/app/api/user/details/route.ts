import { NextResponse } from 'next/server';
import UserModel from '@/models/UserModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const user = await UserModel.findOne({ email: session.user.email }).select(
            '-password -confirmPassword -createdAt -updatedAt -hasReceivedWelcomeEmail -__v'
        );

        if (!user) return NextResponse.json({ message: 'user not found' }, { status: 404 });

        return NextResponse.json(user);
    } catch (error) {
        console.error('User fetch failed:', error);
        return NextResponse.json({ message: 'processing-error' }, { status: 500 });
    }
}
