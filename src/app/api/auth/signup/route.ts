import { NextResponse, NextRequest } from 'next/server';
import User from '@/models/UserModel';
import connectToDB from '@/utils/dbConnect.js';
import sendEmail from '@/utils/sendMail';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
    // connect to the database
    await connectToDB();

    try {
        const { firstName, lastName, dob, email, password, confirmPassword, phone } = await request.json();

        // validations
        if (!firstName || !lastName || !dob || !phone) {
            return NextResponse.json({ message: 'Please fill all fields' }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ message: 'Passwords do not match' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
        }

        const passwordRegex = /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json(
                {
                    message: 'Password must be at least 8 characters long and include at least one special character',
                },
                { status: 400 }
            );
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ message: 'This account already registered' }, { status: 400 });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // generate unique verifyation token
        const newUser = new User({
            firstName,
            lastName,
            dob,
            email,
            password: hashedPassword,
            phone,
            otp,
            otpExpiry,
            isVerified: false,
        });

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
        subject = 'Account Verification';
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
