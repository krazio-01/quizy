import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/utils/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import UserModel from '@/models/UserModel';

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const body = await req.json();

        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await UserModel.findOne({ email: session.user.email }).lean();
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const updatedUser = await UserModel.findOneAndUpdate({ _id: user._id }, { $set: body }, { new: true });

        if (!updatedUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({ status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
