import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment {
    userId: mongoose.Types.ObjectId;
    orderId: string;
    status: string;
    transactionId: string | null;
    amount: string;

    createdAt: Date;
    updatedAt: Date;
}

type IPaymentDocument = IPayment & Document;

const PaymentSchema: Schema<IPaymentDocument> = new Schema<IPaymentDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        orderId: { type: String, required: true, unique: true },
        status: { type: String, required: true },
        amount: { type: String, required: true },
        transactionId: { type: String, default: null },
    },
    { timestamps: true }
);

const PaymentModel: Model<IPaymentDocument> =
    mongoose.models.Payment || mongoose.model<IPaymentDocument>('Payment', PaymentSchema);

export default PaymentModel;
