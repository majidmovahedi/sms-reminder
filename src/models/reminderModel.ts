import mongoose, { CallbackError, Document, Schema } from 'mongoose';

interface IReminder extends Document {
    title: string;
    reminderText: string;
    reminderDate: Date;
    userId: mongoose.Types.ObjectId;
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
    reminderDate: {
        type: Date,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Reminder = mongoose.model<IReminder>('Reminder', ReminderSchema);

export default Reminder;
