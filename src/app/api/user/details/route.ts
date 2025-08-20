import { NextResponse } from 'next/server';
import UserModel from '@/models/UserModel';
import PaymentModel from '@/models/PayMentModel';
import connectToDB from '@/utils/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET() {
    await connectToDB();

    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await UserModel.findOne({ email: session.user.email }).lean();
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const payment = await PaymentModel.findOne({ userId: user._id }).sort({ createdAt: -1 });
        if (!payment) {
            return NextResponse.json({
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                profilePhoto: user.avatar || '/default-avatar.png',
                billing: null,
            });
        }

        const billing = {
            description: 'League of Logic',
            hsnSac: '999295',
            qty: 1.0,
            rate: parseFloat(payment.amount).toFixed(2),
            igstPercent: '0%',
            igstAmount: '0.00',
            amount: 75,
            paidAmount: parseFloat(payment.amount).toFixed(2),
            orderId: payment.orderId,
            status: payment.status,
            transactionId: payment.transactionId,
            createdAt: payment.createdAt,
        };

        const userDetails = {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            profilePhoto: user.avatar || '/default-avatar.png',
            billing,
        };

        return NextResponse.json(userDetails);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
