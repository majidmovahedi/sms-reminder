import mongoose, { Document, Schema } from 'mongoose';

interface IPlan extends Document {
    planName: string;
    description: string;
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
