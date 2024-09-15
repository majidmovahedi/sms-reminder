import { Request, Response } from 'express';
import User from '@models/userModel';
import jwt from 'jsonwebtoken';

export async function listUsers(req: Request, res: Response) {
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

export async function register(req: Request, res: Response) {
    const { fullname, phoneNumber, password } = req.body;
    try {
        const user = new User({ fullname, phoneNumber, password });
        await user.save();
        res.status(201).json({ message: 'User registered' });
    } catch (error) {
        res.status(400).json(error);
    }
}

export async function login(req: Request, res: Response) {
    const { phoneNumber, password } = req.body;
    try {
        const user = await User.findOne({ phoneNumber });
        if (!user)
            return res.status(404).json({ error: 'User Does Not Exist!' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            return res.status(400).json({ error: 'Password is Incorrect!' });

        const payload = { id: user._id };
        const token = jwt.sign(payload, 'your_jwt_secret', {
            expiresIn: '24h',
        });

        res.json({ token: `Bearer ${token}` });
    } catch (error) {
        res.status(500).json(error);
    }
}
