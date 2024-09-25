import { Request, Response } from 'express';
import User from '@models/userModel';
import { ObjectId } from 'mongodb';

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

export async function adminRegisterController(req: Request, res: Response) {
    try {
        const { fullname, phoneNumber, password, isActive, adminType } =
            req.body;

        const user = new User({
            fullname,
            phoneNumber,
            password,
            isActive,
            adminType,
        });
        await user.save();

        return res.status(201).json({ message: 'User registered', user });
    } catch (error) {
        return res.status(400).json(error);
    }
}
