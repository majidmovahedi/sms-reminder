import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './userModel';

interface IReminder extends Document {
    title: string;
    reminderText: string;
    month: number;
    day: number;
    hour: number;
    minute: number;
    userId: IUser;
}

const ReminderSchema: Schema<IReminder> = new Schema({
    title: {
        type: String,
        required: true,
    },
    reminderText: {
        type: String,
        required: true,
    },
    month: { type: Number, required: true },
    day: { type: Number, required: true },
    hour: { type: Number, required: true },
    minute: { type: Number, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Reminder = mongoose.model<IReminder>('Reminder', ReminderSchema);

export default Reminder;
