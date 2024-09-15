import mongoose, { Document, Schema } from 'mongoose';

interface IPlan extends Document {
    planName: string;
    description: string;
    duration: number;
    smsCount: number;
    price: number;
}

const PlanSchema: Schema<IPlan> = new Schema({
    planName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    smsCount: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

const Plan = mongoose.model<IPlan>('Plan', PlanSchema);

export default Plan;
