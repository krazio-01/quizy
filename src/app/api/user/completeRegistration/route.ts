import { NextResponse, NextRequest } from 'next/server';
import connectToDB from '@/utils/dbConnect';
import User from '@/models/UserModel';
import { cookies } from 'next/headers';
import { calculateAge } from '@/utils/helperFn';

const gradeAgeLimits: Record<string, [number, number]> = {
    grade3: [8, 9],
    grade4: [9, 10],
    grade5: [10, 11],
    grade6: [11, 12],
    grade7: [12, 13],
    grade8: [13, 14],
    grade9: [14, 15],
    grade10: [15, 16],
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

export async function POST(request: NextRequest) {
    await connectToDB();
    try {
        const { country, city, school, board, grade } = await request.json();

        const cookieStore = cookies();
        const email = (await cookieStore).get('regSessionEmail')?.value;

        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

        // Normalize
        const normalizedGrade = normalizeGrade(grade);

        // Age validation
        if (user.dob && normalizedGrade && gradeAgeLimits[normalizedGrade]) {
            const userAge = calculateAge(new Date(user.dob));
            const [minAge, maxAge] = gradeAgeLimits[normalizedGrade];

            if (userAge < minAge || userAge > maxAge) {
                return NextResponse.json(
                    {
                        field: 'grade',
                        message: `Age ${userAge} is not eligible for ${grade}.`,
                    },
                    { status: 403 }
                );
            }
        }

        user.country = country;
        user.city = city;
        user.school = school;
        user.board = board;
        user.grade = grade;

        await user.save();

        return NextResponse.json({ message: 'Registration completed' }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
    }
}
