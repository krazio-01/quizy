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
    isVerified: boolean;

    hasReceivedWelcomeEmail: boolean;

    forgotPasswordToken?: string;
    forgotPasswordTokenExpiry?: number;

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
        isVerified: { type: Boolean, default: false },

        hasReceivedWelcomeEmail: { type: Boolean, default: false },

        forgotPasswordToken: { type: String },
        forgotPasswordTokenExpiry: { type: Number },
    },
    { timestamps: true }
);

const UserModel: Model<IUserDocument> = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export default UserModel;
