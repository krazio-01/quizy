import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../utils/dbConnect';
import MockQuizModel from '../../../../models/MockQuizModel';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { name, email, grade } = await req.json();

        if (!name || !email || !grade)
            return NextResponse.json({ message: 'Please Fill All Fields First' }, { status: 400 });

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
        if (err.code === 11000) {
            return NextResponse.json({ message: 'Duplicate entry for this grade and email' }, { status: 409 });
        }

        console.error('Start quiz error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
