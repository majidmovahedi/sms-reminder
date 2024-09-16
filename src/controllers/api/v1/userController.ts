import express, { Request, Response } from 'express';
import User, { IUser } from '@models/userModel';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function singleUser(req: express.Request, res: express.Response) {
    const userId = (req.user as IUser)._id;
    try {
        const user = await User.findById({ _id: userId });
        if (!user) {
            return res.json('This User Does Not Exist!');
            // return null;
        }
        return res.status(200).json(user);
        // return user;
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
    try {
        const { phoneNumber, password } = req.body;

        // Find user by phone number
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res
                .status(401)
                .json({ error: 'Invalid phone number or password' });
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ error: 'Invalid phone number or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, 'secret', {
            expiresIn: '24h',
        });

        // Send the token to the client
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}
