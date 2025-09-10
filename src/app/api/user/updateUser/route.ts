import { NextResponse, NextRequest } from 'next/server';
import connectToDB from '@/utils/dbConnect';
import User from '@/models/UserModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function POST(request: NextRequest) {
    await connectToDB();

    try {
        const { avatar } = await request.json();

        if (!avatar) return NextResponse.json({ field: 'avatar', message: 'Missing image' }, { status: 400 });

        const session = await getServerSession(authOptions);
        const userId = session?.user?._id;
        if (!userId) return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });

        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ field: 'email', message: 'User not found' }, { status: 404 });

        user.avatar = avatar;

        await user.save();

        return NextResponse.json({ message: 'User details updated successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            {
                field: null,
                message: error.message || 'Server error',
            },
            { status: 500 }
        );
    }
}
