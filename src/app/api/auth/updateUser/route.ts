import { NextResponse, NextRequest } from 'next/server';
import connectToDB from '@/utils/dbConnect';
import User from '@/models/UserModel';

export async function POST(request: NextRequest) {
    await connectToDB();

    try {
        const { email, country, city, school, grade } = await request.json();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Update fields
        user.country = country;
        user.city = city;
        user.school = school;
        user.grade = grade;

        await user.save();

        return NextResponse.json({ message: 'User details updated successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
    }
}
