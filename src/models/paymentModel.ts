import mongoose, { Document, Schema } from 'mongoose';

interface IPayment extends Document {
    paymentDate: Date;
    paymentMethod: string;
    amount: number;
    userId: mongoose.Types.ObjectId;
    status: boolean;
}

const PaymentSchema: Schema<IPayment> = new Schema({
    paymentDate: {
        type: Date,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
});

const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
