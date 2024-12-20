import mongoose, { Document, Schema } from 'mongoose';

export enum StatusEnum {
    Expired = 'Expired',
    Pending = 'Pending',
    Active = 'Active',
    Failed = 'Failed',
}

interface ISubscription extends Document {
    smsCount: number;
    userId: mongoose.Types.ObjectId;
    planId: mongoose.Types.ObjectId;
    status: StatusEnum;
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
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true,
    },
    status: {
        type: String,
        enum: ['Expired', 'Pending', 'Active', 'Failed'],
        required: true,
    },
});

const Subscription = mongoose.model<ISubscription>(
    'Subscription',
    SubscriptionSchema,
);

export default Subscription;
