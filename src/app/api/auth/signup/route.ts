import { NextResponse, NextRequest } from 'next/server';
import User from '@/models/UserModel';
import connectToDB from '@/utils/dbConnect';
import sendEmail from '@/utils/sendMail';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { validateEmail } from '@/utils/helperFn';

export async function POST(request: NextRequest) {
    // connect to the database
    await connectToDB();

    try {
        const { firstName, lastName, dob, email, password, confirmPassword, phone, userId } = await request.json();

        const missingFields = [];
        if (!firstName) missingFields.push('firstName');
        if (!lastName) missingFields.push('lastName');
        if (!dob) missingFields.push('dob');
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');
        if (!confirmPassword) missingFields.push('confirmPassword');
        if (!phone) missingFields.push('phone');

        // validations
        if (missingFields.length > 0) {
            return NextResponse.json(
                { message: 'Please fill all required fields', fields: missingFields },
                { status: 400 }
            );
        }

        function parseLocalDate(dob: string): Date | null {
            if (!dob) return null;

            const datePart = dob.slice(0, 10);
            if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return null;

            const [year, month, day] = datePart.split('-').map(Number);
            const parsed = new Date(Date.UTC(year, month - 1, day));
            return isNaN(parsed.getTime()) ? null : parsed;
        }

        const parsedDob = parseLocalDate(dob);
        parsedDob.setUTCHours(0, 0, 0, 0);
        const now = new Date();
        now.setUTCHours(0, 0, 0, 0);

        if (!parsedDob) return NextResponse.json({ message: 'Invalid date format. Use YYYY-MM-DD.' }, { status: 400 });

        if (parsedDob >= now)
            return NextResponse.json({ message: 'Date of birth must be in the past' }, { status: 400 });

        function isAgeBetween(dob: Date, min: number, max: number, today: Date = new Date()): boolean {
            let age = today.getUTCFullYear() - dob.getUTCFullYear();
            const m = today.getUTCMonth() - dob.getUTCMonth();
            const d = today.getUTCDate() - dob.getUTCDate();

            if (m < 0 || (m === 0 && d < 0)) age--;

            if (age < min) return false;
            if (age > max) return false;

            if (age === max && (m > 0 || (m === 0 && d > 0))) return false;

            return true;
        }

        if (!isAgeBetween(parsedDob, 8, 16, now))
            return NextResponse.json({ message: 'Age must be between 8 and 16 years' }, { status: 400 });

        if (password !== confirmPassword && !userId)
            return NextResponse.json({ message: 'Passwords do not match' }, { status: 400 });

        if (!validateEmail(email)) return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });

        const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!passwordRegex.test(password) && !userId) {
            return NextResponse.json(
                {
                    message: 'Password must be 8+ chars, with at least 1 uppercase letter and 1 special character.',
                },
                { status: 400 }
            );
        }

        const phoneRegex = /^\+\d{1,4}[\s-]?\d{6,15}$/;
        if (!phoneRegex.test(phone.trim())) {
            return NextResponse.json(
                {
                    message: 'Invalid phone number. Use format like +91 0123456789',
                },
                { status: 400 }
            );
        }

        const userExists = await User.findOne({ email });
        if (userExists && !userId)
            return NextResponse.json({ message: 'This account already registered' }, { status: 400 });

        let newUser = null;

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        if (password === '*********' && confirmPassword === '*********' && userId) {
            newUser = await User.findById(userId);

            newUser.email = email;
            newUser.phone = phone;
            newUser.isVerified = false;
            newUser.otp = otp;
            newUser.otpExpiry = otpExpiry;
        } else {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // generate unique verifyation token
            newUser = new User({
                firstName,
                lastName,
                dob: parsedDob,
                email,
                password: hashedPassword,
                phone,
                otp,
                otpExpiry,
                isVerified: false,
            });
        }

        const user = await newUser.save();

        // Send verification email
        const to = user.email;
        let subject = null,
            html = null;

        const templatePath = path.resolve(process.cwd(), 'src/templates/verificationTemplate.html');

        const verifyTemplate = fs.readFileSync(templatePath, 'utf8');

        const verificationContent = verifyTemplate
            .replace(/{{name}}/g, user.firstName + ' ' + user.lastName)
            .replace(/{{otp}}/g, user.otp);

        // send verification mail to the user
        subject = 'Verify Your Email Address with League of Logic';
        html = verificationContent;
        await sendEmail(to, subject, null, html);

        return NextResponse.json(
            {
                message: 'Registration successful',
                user: user,
            },
            { status: 201 }
        );
    } catch (error) {
        let errorMessage = 'Internal server error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
