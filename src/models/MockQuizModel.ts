import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuizAttempt {
    score: number | null;
    attemptedAt: Date;
}

export interface IQuizStats extends Document {
    name: string;
    email: string;
    grade: string;
    attempts: IQuizAttempt[];
    attemptCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const quizAttemptSchema = new Schema<IQuizAttempt>({
    score: {
        type: Number,
        required: false,
    },
    attemptedAt: {
        type: Date,
        default: Date.now,
    },
});

const quizStatsSchema = new Schema<IQuizStats>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        grade: { type: String, required: true },
        attempts: {
            type: [quizAttemptSchema],
            default: [],
        },
        attemptCount: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
);

quizStatsSchema.index({ email: 1, grade: 1 }, { unique: true });

const QuizStatsModel: Model<IQuizStats> =
    mongoose.models.QuizStats || mongoose.model<IQuizStats>('QuizStats', quizStatsSchema);

export default QuizStatsModel;
