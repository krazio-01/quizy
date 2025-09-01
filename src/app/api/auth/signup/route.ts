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

        const parsedDob = new Date(dob);
        const now = new Date();

        if (parsedDob >= now)
            return NextResponse.json({ message: 'Date of birth must be in the past' }, { status: 400 });

        const ageInMs = now.getTime() - parsedDob.getTime();
        const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);

        if (ageInYears <= 8 || ageInYears >= 18)
            return NextResponse.json({ message: 'Age must be between 8 and 18 years' }, { status: 400 });

        if ((password !== confirmPassword) && !userId)
            return NextResponse.json({ message: 'Passwords do not match' }, { status: 400 });

        if (!validateEmail(email)) return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });

        const passwordRegex = /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json(
                {
                    message: 'Password must be at least 8 characters long and include at least one special character',
                },
                { status: 400 }
            );
        }

        const phoneRegex = /^\+\d{1,4}[\s-]?\d{10}$/;
        if (!phoneRegex.test(phone.trim())) {
            return NextResponse.json(
                {
                    message: 'Invalid phone number. Use format like +91 0123456789',
                },
                { status: 400 }
            );
        }

        const userExists = await User.findOne({ email });
        if (userExists && userExists.isVerified)
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
                dob,
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
