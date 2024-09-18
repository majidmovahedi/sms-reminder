import express, { Request, Response } from 'express';
import User, { IUser } from '@models/userModel';
import jwt from 'jsonwebtoken';
import { sendSMS } from '@utils/sms/sendSms';
import { getRandomInt } from '@utils/sms/codeGenerator';
import redisClient from '@configs/redisClient';
import { Types } from 'mongoose';
import { UserRegisterSchema } from '@utils/validation/validationSchema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function singleUser(req: express.Request, res: express.Response) {
    const userId = (req.user as IUser)._id;
    try {
        const user = await User.findById({ _id: userId });
        if (!user) {
            return res.json('This User Does Not Exist!');
        }
        return res.status(200).json(user);
    } catch (err) {
        console.error('Error finding user by ID:', err);
    }
}

export async function register(req: Request, res: Response) {
    try {
        const { fullname, phoneNumber, password } = UserRegisterSchema.parse(
            req.body,
        );
        const generateCode = getRandomInt();
        const user = new User({ fullname, phoneNumber, password });
        await user.save();

        await redisClient.setEx(
            user._id.toString(),
            300,
            generateCode.toString(),
        );
        await sendSMS(`Your Activation Code is ${generateCode}`, phoneNumber);
        return res.status(201).json({ message: 'User registered' });
    } catch (error) {
        return res.status(400).json(error);
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
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: '24h',
        });
        return res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

export async function verify(req: Request, res: Response) {
    try {
        const { phoneNumber, code } = req.body;

        // Find user by phone number
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res
                .status(401)
                .json({ error: 'phone number does not exist!' });
        }
        const userIdStr =
            user._id instanceof Types.ObjectId ? user._id.toString() : user._id;

        const storedOtp = await redisClient.get(userIdStr);

        if (storedOtp === code) {
            await User.findByIdAndUpdate(user, { isActive: true });
            return res.json({ message: 'User verified successfully' });
        } else {
            res.status(400).json({ error: 'Invalid or expired OTP' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}
