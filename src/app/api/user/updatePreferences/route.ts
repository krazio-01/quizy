import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/utils/dbConnect';
import UserModel from '@/models/UserModel';

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const { email, preferences } = await req.json();

        console.log('\n\nmd-email: ', email);
        console.log('md-preferences: ', preferences);

        if (!email || !Array.isArray(preferences))
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

        if (preferences.length < 1) {
            return NextResponse.json(
                { error: 'Please select at least one preference.' },
                { status: 400 }
            );
        }

        const user = await UserModel.findOneAndUpdate({ email }, { $set: { preferences } }, { new: true });
        
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving preferences:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
