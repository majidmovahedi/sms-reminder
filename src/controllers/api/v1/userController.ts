import express, { NextFunction, Request, Response } from 'express';
import User, { IUser } from '@models/userModel';
import jwt from 'jsonwebtoken';
import { sendSMS } from '@utils/sms/sendSms';
import { getRandomInt } from '@utils/sms/codeGenerator';
import redisClient from '@configs/redisClient';
import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import {
    UserLoginSchema,
    UserRegisterSchema,
} from '@utils/validation/validationSchema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function prfileController(
    req: express.Request,
    res: express.Response,
) {
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

export async function registerController(req: Request, res: Response) {
    try {
        const { fullname, phoneNumber, password } = req.body;
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

export async function loginController(req: Request, res: Response) {
    try {
        const { phoneNumber, password } = req.body;

        // Find user by phone number
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res
                .status(401)
                .json({ error: 'Invalid phone number or password' });
        }
        if (user.isActive == false) {
            return res.status(409).json({ error: 'This user is Not Active!' });
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

export async function verifyController(req: Request, res: Response) {
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

export async function resendController(req: Request, res: Response) {
    try {
        const { phoneNumber } = req.body;

        // Find user by phone number
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res
                .status(401)
                .json({ error: 'phone number does not exist!' });
        }
        if (user.isActive == true) {
            return res.status(409).json({ error: 'This user is Active!' });
        }
        const generateCode = getRandomInt();

        await redisClient.setEx(
            user._id.toString(),
            300,
            generateCode.toString(),
        );
        await sendSMS(`Your Activation Code is ${generateCode}`, phoneNumber);
        return res.status(200).json({ message: 'Code Send to Mobile' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

export async function forgetPasswordController(req: Request, res: Response) {
    try {
        const { phoneNumber } = req.body;

        // Find user by phone number
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res
                .status(401)
                .json({ error: 'phone number does not exist!' });
        }
        if (user.isActive == false) {
            return res.status(409).json({ error: 'This user is Not Active!' });
        }
        const generateCode = getRandomInt();

        await redisClient.setEx(
            user._id.toString(),
            300,
            generateCode.toString(),
        );
        await sendSMS(`Your Recover Code is ${generateCode}`, phoneNumber);
        return res.status(200).json({ message: 'Code Send to Mobile' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

export async function newPasswordController(req: Request, res: Response) {
    try {
        const { phoneNumber, code, newPassword } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

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
            await User.findByIdAndUpdate(user, { password: hashedPassword });
            return res.json({ message: 'Your password is Changed!' });
        } else {
            res.status(400).json({ error: 'Invalid or expired OTP' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

export async function changePasswordController(req: Request, res: Response) {
    try {
        const userId = (req.user as IUser)._id;
        const { password, newPassword } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const user = await User.findById({ _id: userId });
        if (!user) {
            return res.json('This User Does Not Exist!');
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ error: 'Your Password is Incorrect!' });
        }

        await User.findByIdAndUpdate(user, { password: hashedPassword });
        return res.json({ message: 'Your password is Changed!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

export async function updateProfileController(req: Request, res: Response) {
    const userId = (req.user as IUser)._id;
    try {
        const { fullname } = req.body;

        const user = await User.findById({ _id: userId });
        if (!user) {
            return res.json('This User Does Not Exist!');
        }
        await User.findByIdAndUpdate(user, { fullname: fullname });
        return res.status(200).json('Your Name Changed Succesfully!');
    } catch (err) {
        console.error('Error During Update User Profile ', err);
    }
}
