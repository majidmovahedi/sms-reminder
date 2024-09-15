import mongoose, { Document, Schema } from 'mongoose';

interface ISubscription extends Document {
    startDate: Date;
    endDate: Date;
    smsCount: number;
    userId: mongoose.Types.ObjectId;
    planId: mongoose.Types.ObjectId;
    status: string;
}

const SubscriptionSchema: Schema<ISubscription> = new Schema({
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
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
        enum: ['Expired', 'Pending', 'Active'],
        required: true,
    },
});

const Subscription = mongoose.model<ISubscription>(
    'Reminder',
    SubscriptionSchema,
);

export default Subscription;
