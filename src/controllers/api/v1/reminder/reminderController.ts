import { Request, Response } from 'express';
import { IUser } from '@models/userModel';
import Reminder from '@models/reminderModel';
import { ObjectId } from 'mongodb';

export async function remindersController(req: Request, res: Response) {
    const userId = (req.user as IUser)._id;
    try {
        const reminders = await Reminder.find({ userId: userId });

        if (reminders.length === 0) {
            return res
                .status(404)
                .json({ message: 'You Dont have any reminders!' });
        }

        return res.status(200).json(reminders);
    } catch (err) {
        console.error('Error finding Reminder by UserId:', err);
        return res.status(500).json({ message: 'Server error occurred' });
    }
}

export async function singleReminderController(req: Request, res: Response) {
    const userId = (req.user as IUser)._id;
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res
                .status(400)
                .json({ error: 'Invalid Reminder ID format.' });
        }
        const reminder = await Reminder.findOne({
            _id: new ObjectId(id),
            userId: userId,
        });

        if (!reminder) {
            return res
                .status(404)
                .json({ message: 'You Dont have any reminders!' });
        }
        if (reminder.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                error: 'You are not authorized to get this reminder.',
            });
        }

        return res.status(200).json(reminder);
    } catch (err) {
        console.error('Error finding Reminder by UserId:', err);
        return res.status(500).json({ message: 'Server error occurred' });
    }
}

export async function createReminderController(req: Request, res: Response) {
    const userId = (req.user as IUser)._id;
    try {
        const { title, reminderText, month, day, hour, minute } = req.body;

        const reminder = new Reminder({
            title,
            reminderText,
            month,
            day,
            hour,
            minute,
            userId,
        });
        await reminder.save();
        return res.status(201).json({ message: 'Reminder Created', reminder });
    } catch (err) {
        console.error('Error During Create Reminder:', err);
        return res.status(500).json({ message: 'Server error occurred' });
    }
}

export async function updateReminderController(req: Request, res: Response) {
    const userId = (req.user as IUser)._id;
    try {
        const { id } = req.params;
        const { title, reminderText, month, day, hour, minute } = req.body;

        if (!ObjectId.isValid(id)) {
            return res
                .status(400)
                .json({ error: 'Invalid Reminder ID format.' });
        }

        const reminder = await Reminder.findById(id);

        if (!reminder) {
            return res.status(404).json({ error: 'Reminder not found.' });
        }

        if (reminder.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                error: 'You are not authorized to update this reminder.',
            });
        }

        await Reminder.findByIdAndUpdate(id, {
            title,
            reminderText,
            month,
            day,
            hour,
            minute,
        });

        return res.status(200).json({ message: 'Reminder Updated' });
    } catch (err) {
        console.error('Error During Update Reminder:', err);
        return res.status(500).json({ message: 'Server error occurred' });
    }
}

export async function deleteReminderController(req: Request, res: Response) {
    const userId = (req.user as IUser)._id;
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res
                .status(400)
                .json({ error: 'Invalid Reminder ID format.' });
        }

        const reminder = await Reminder.findById(id);

        if (!reminder) {
            return res.status(404).json({ error: 'Reminder not found.' });
        }
        if (reminder.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                error: 'You are not authorized to delete this reminder.',
            });
        }

        await Reminder.deleteOne({ _id: reminder.id });

        return res.status(200).json('Reminder Deleted Succesfully!');
    } catch (err) {
        console.error('Error During Delete Reminder:', err);
        return res.status(500).json({ message: 'Server error occurred' });
    }
}
