import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../utils/dbConnect';
import MockQuizModel from '../../../../models/MockQuizModel';
import UserModel from '../../../../models/UserModel';
import { calculateAge } from '@/utils/helperFn';

const gradeAgeLimits: Record<string, [number, number]> = {
    'Grade 3-4': [8, 10],
    'Grade 5-6': [10, 12],
    'Grade 7-8': [12, 14],
    'Grade 9-10': [14, 16],
};

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { name, email, grade } = await req.json();

        if (!name || !email || !grade)
            return NextResponse.json({ message: 'Please Fill All Fields First' }, { status: 400 });

        const user = await UserModel.findOne({ email });

        if (user && user.dob && gradeAgeLimits[grade]) {
            const userAge = calculateAge(user.dob);
            const [minAge, maxAge] = gradeAgeLimits[grade];

            if (userAge < minAge || userAge > maxAge) {
                return NextResponse.json(
                    { message: `You are not eligible for ${grade} based on your age.` },
                    { status: 403 }
                );
            }
        }

        const now = new Date();

        const existing = await MockQuizModel.findOne({ email, grade });

        const attemptEntry = {
            score: null,
            attemptedAt: now,
        };

        if (existing) {
            existing.attempts.push(attemptEntry);
            existing.attemptCount = existing.attempts.length;
            await existing.save();

            return NextResponse.json({ message: 'Best Of Luck!', data: existing }, { status: 200 });
        }

        const newRecord = await MockQuizModel.create({
            name,
            email,
            grade,
            attempts: [attemptEntry],
            attemptCount: 1,
        });

        return NextResponse.json({ message: 'Quiz Started!', data: newRecord }, { status: 201 });
    } catch (err: any) {
        if (err.code === 11000)
            return NextResponse.json({ message: 'Duplicate entry for this grade and email' }, { status: 409 });
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
