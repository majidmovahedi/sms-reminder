import { Request, Response } from 'express';
import User from '@models/userModel';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { string } from 'zod';

export async function listUsersController(req: Request, res: Response) {
    try {
        const users = await User.find();
        if (!users) {
            return res.json('User Does Not Exist!');
        }
        return res.status(200).json(users);
    } catch (err) {
        console.error('Error finding user:', err);
    }
}

export async function singleUserController(req: Request, res: Response) {
    try {
        const { id } = req.params;

        // Check if the provided ID is valid
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID format.' });
        }
        // Find user by ID
        const user = await User.findById({ _id: new ObjectId(id) });

        if (!user) {
            return res.json('This User Does Not Exist!');
        }
        return res.status(200).json(user);
    } catch (err) {
        console.error('Error finding user by ID:', err);
    }
}
