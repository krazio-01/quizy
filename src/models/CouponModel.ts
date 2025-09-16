import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICoupon {
    code: string;
    discountType: 'flat' | 'percent';
    discountValue: number;
    expiry: Date;
    maxUsage: number;
    usedBy: Types.ObjectId[];
    usedCount: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

type ICouponDocument = ICoupon & Document;

interface ICouponModel extends Model<ICouponDocument> {
    markAsUsed(code: string, userId: Types.ObjectId): Promise<ICouponDocument | null>;
    validateForUser(
        code: string,
        userId: Types.ObjectId
    ): Promise<{ valid: boolean; reason?: string; coupon?: ICouponDocument }>;
}

const CouponSchema: Schema<ICouponDocument> = new Schema(
    {
        code: { type: String, required: true, unique: true, uppercase: true, index: true },
        discountType: { type: String, enum: ['flat', 'percent'], required: true },
        discountValue: { type: Number, required: true },
        expiry: { type: Date, required: true },
        maxUsage: { type: Number, default: 1 },
        usedBy: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
        usedCount: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

CouponSchema.statics.markAsUsed = async function (code: string, userId: Types.ObjectId) {
    const upper = code?.toUpperCase();
    const now = new Date();

    const filter = {
        code: upper,
        isActive: true,
        expiry: { $gt: now },
        usedBy: { $ne: userId },
        $expr: { $lt: [{ $size: '$usedBy' }, '$maxUsage'] },
    };

    const update = {
        $push: { usedBy: userId },
        $inc: { usedCount: 1 },
    };
    return this.findOneAndUpdate(filter, update, { new: true }).exec();
};

CouponSchema.statics.validateForUser = async function (code: string, userId: Types.ObjectId) {
    if (!code) return { valid: false, reason: 'no_code' };
    const upper = code.toUpperCase();
    const coupon = await this.findOne({ code: upper }).lean();

    if (!coupon) return { valid: false, reason: 'invalid' };
    if (!coupon.isActive) return { valid: false, reason: 'inactive' };
    if (coupon.expiry < new Date()) return { valid: false, reason: 'expired' };
    if (coupon.usedBy?.some((id: any) => id.toString() === userId.toString()))
        return { valid: false, reason: 'already_used' };
    if (coupon.maxUsage && (coupon.usedBy?.length ?? 0) >= coupon.maxUsage)
        return { valid: false, reason: 'limit_reached' };

    return { valid: true, coupon };
};

const CouponModel =
    (mongoose.models.Coupon as ICouponModel) || mongoose.model<ICouponDocument, ICouponModel>('Coupon', CouponSchema);

export default CouponModel;
