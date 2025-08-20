import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/utils/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import UserModel from '@/models/UserModel';
import { validateEmail } from '@/utils/helperFn';

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const body = await req.json();

        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        if (body.email && !validateEmail(body.email))
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });

        if (body.email) {
            const existingUser = await UserModel.findOne({ email: body.email });
            if (existingUser && existingUser._id.toString() !== session.user._id)
                return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
        }

        const user = await UserModel.findOne({ _id: session.user._id }).lean();
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const updatedUser = await UserModel.findOneAndUpdate({ _id: user._id }, { $set: body }, { new: true });

        if (!updatedUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({ message: 'User updated successfully', status: 200 });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
