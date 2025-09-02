import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../utils/dbConnect';
import MockQuizModel from '../../../../models/MockQuizModel';
import UserModel from '../../../../models/UserModel';
import { calculateAge } from '@/utils/helperFn';
import { validateEmail } from '@/utils/helperFn';

const gradeAgeLimits: Record<string, [number, number]> = {
    'Grade 3-4': [8, 10],
    'Grade 5-6': [10, 12],
    'Grade 7-8': [12, 14],
    'Grade 9-10': [14, 16],
};

function yearToGrade(year: number): string | null {
    if (year >= 4 && year <= 11) return `grade${year - 1}`;
    return null;
}

function normalizeGrade(value: string): string | null {
    if (!value) return null;

    if (value.startsWith('year')) {
        const yearNum = parseInt(value.replace('year', ''), 10);
        return yearToGrade(yearNum);
    }
    return value;
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { name, email, grade } = await req.json();

        if (!name || !email || !grade)
            return NextResponse.json({ message: 'Please Fill All Fields First' }, { status: 400 });

        if (!validateEmail(email)) return NextResponse.json({ message: 'Please enter valid email' }, { status: 400 });

        const user = await UserModel.findOne({ email });

        const normalizedGrade = normalizeGrade(grade);

        if (user?.dob && normalizedGrade && gradeAgeLimits[normalizedGrade]) {
            const userAge = calculateAge(new Date(user?.dob));
            const [minAge, maxAge] = gradeAgeLimits[normalizedGrade];

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

            return NextResponse.json({ isExistingUser: user ? true : false, status: 200 });
        }

        await MockQuizModel.create({
            name,
            email,
            grade,
            attempts: [attemptEntry],
            attemptCount: 1,
        });

        return NextResponse.json({ isExistingUser: user ? true : false }, { status: 201 });
    } catch (err: any) {
        console.error('\n\nmd-Error in /api/quiz/mockTest:', err);
        if (err.code === 11000)
            return NextResponse.json({ message: 'Duplicate entry for this grade and email' }, { status: 409 });
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
