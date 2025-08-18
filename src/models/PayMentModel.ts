import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment {
    userId: mongoose.Types.ObjectId;
    orderId: string;
    transactionId: string;
    status: string;
    amount?: number;

    createdAt: Date;
    updatedAt: Date;
}

type IPaymentDocument = IPayment & Document;

const PaymentSchema: Schema<IPaymentDocument> = new Schema<IPaymentDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        orderId: { type: String, required: true, unique: true },
        transactionId: { type: String, required: true },
        status: { type: String, required: true },
        amount: { type: Number },
    },
    { timestamps: true }
);

const PaymentModel: Model<IPaymentDocument> =
    mongoose.models.Payment || mongoose.model<IPaymentDocument>('Payment', PaymentSchema);

export default PaymentModel;
