import { Request, Response } from 'express';
import User from '@models/userModel';
import jwt from 'jsonwebtoken';

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
