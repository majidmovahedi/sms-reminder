import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from './../../../models/userModel';

// export const listUsers = (req: Request, res: Response): void => {
//     res.send('List of users');
// };

export async function listUsers(ureq: Request, res: Response) {
    try {
        const user = await User.find();
        if (user) {
            console.log('User found:', user);
            return user;
        } else {
            console.log('User not found');
            return null;
        }
    } catch (err) {
        console.error('Error finding user by ID:', err);
    }
}

export async function addNewUser(req: Request, res: Response) {
    try {
        const newUser = new User({
            fullname: 'fullname',
            phoneNumber: 'phonuheNumber',
            password: 'password',
            isActive: true,
            adminType: true,
        });

        const savedUser = await newUser.save();
        return res.json(savedUser);
    } catch (err) {
        console.error('Error adding new user:', err);
    }
}
