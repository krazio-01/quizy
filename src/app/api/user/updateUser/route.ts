import { NextResponse, NextRequest } from 'next/server';
import connectToDB from '@/utils/dbConnect';
import User from '@/models/UserModel';
import { calculateAge } from '@/utils/helperFn';

const gradeAgeLimits: Record<string, [number, number]> = {
    grade3: [8, 10],
    grade4: [8, 10],
    grade5: [10, 12],
    grade6: [10, 12],
    grade7: [12, 14],
    grade8: [12, 14],
    grade9: [14, 16],
    grade10: [14, 16],
    grade11: [16, 18],
    grade12: [16, 18],
};

export async function POST(request: NextRequest) {
    await connectToDB();

    try {
        // const { email, country, city, school, board, grade } = await request.json();

        // const user = await User.findOne({ email });
        // if (!user) {
        //     return NextResponse.json({ field: 'email', message: 'User not found' }, { status: 404 });
        // }

        // // Age validation
        // if (user.dob && gradeAgeLimits[grade]) {
        //     const userAge = calculateAge(new Date(user.dob));
        //     const [minAge, maxAge] = gradeAgeLimits[grade];

        //     if (userAge < minAge || userAge > maxAge) {
        //         return NextResponse.json(
        //             {
        //                 field: 'grade',
        //                 message: `Age ${userAge} is not eligible for ${grade}.`,
        //             },
        //             { status: 403 }
        //         );
        //     }
        // }

        // // Update fields
        // user.country = country;
        // user.city = city;
        // user.school = school;
        // user.board = board;
        // user.grade = grade;

        // await user.save();

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
