import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    fullname: string;
    phoneNumber: string;
    password: string;
    isActive: boolean;
    createdAt?: Date;
    adminType: boolean;
}

const userSchema: Schema<IUser> = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    adminType: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
