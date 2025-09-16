import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser {
    firstName: string;
    lastName: string;
    dob: Date;
    email: string;
    password: string;
    phone: string;
    avatar: string;

    country: string;
    city: string;
    school: string;
    board: string;
    grade: string;

    otp: string;
    otpExpiry: Date;
    lastOtpSentAt?: Date;
    otpRequestCount?: number;
    isVerified: boolean;

    otpAttempts?: number;
    otpLockUntil?: Date;

    hasReceivedWelcomeEmail: boolean;
    preferences: string[];

    forgotPasswordToken?: string;
    forgotPasswordTokenExpiry?: number;
    lastForgotSentAt?: Date;
    forgotRequestCount?: number;

    isEligibleForCertificate?: boolean;

    currentSessionToken?: string;

    createdAt: Date;
    updatedAt: Date;
}

type IUserDocument = IUser & Document;

const UserSchema: Schema<IUserDocument> = new Schema<IUserDocument>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        dob: { type: Date, required: true },

        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },

        phone: { type: String, required: true },
        avatar: { type: String, required: false },

        country: { type: String },
        city: { type: String },
        school: { type: String },
        board: { type: String },
        grade: { type: String },

        otp: String,
        otpExpiry: Date,
        lastOtpSentAt: { type: Date },
        otpRequestCount: { type: Number, default: 0 },
        isVerified: { type: Boolean, default: false },

        otpAttempts: { type: Number, default: 0 },
        otpLockUntil: { type: Date, default: null },

        hasReceivedWelcomeEmail: { type: Boolean, default: false },
        preferences: { type: [String], default: [] },

        forgotPasswordToken: { type: String },
        forgotPasswordTokenExpiry: { type: Number },
        lastForgotSentAt: { type: Date },
        forgotRequestCount: { type: Number, default: 0 },

        isEligibleForCertificate: { type: Boolean },

        currentSessionToken: { type: String, default: null },
    },
    { timestamps: true }
);

const UserModel: Model<IUserDocument> = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export default UserModel;
