import express, { Request, Response } from 'express';
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
            return res.status(400).json({ error: 'Invalid user ID format.' });
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
