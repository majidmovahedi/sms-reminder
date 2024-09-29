import express, { Request, Response } from 'express';
import { IUser } from '@models/userModel';
import Reminder from '@models/reminderModel';

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
