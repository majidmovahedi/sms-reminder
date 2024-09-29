import mongoose, { Document, Schema } from 'mongoose';

interface ISubscription extends Document {
    smsCount: number;
    userId: mongoose.Types.ObjectId;
    // planId: mongoose.Types.ObjectId;
    status: string;
}

const SubscriptionSchema: Schema<ISubscription> = new Schema({
    smsCount: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    status: {
        type: String,
        enum: ['Expired', 'Pending', 'Active'],
        required: true,
    },
});

const Subscription = mongoose.model<ISubscription>(
    'Subscription',
    SubscriptionSchema,
);

export default Subscription;
