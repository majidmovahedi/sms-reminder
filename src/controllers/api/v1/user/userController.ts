import express, { NextFunction, Request, Response } from 'express';
import User, { IUser } from '@models/userModel';
import jwt from 'jsonwebtoken';
import { sendSMS } from '@utils/sms/sendSms';
import { getRandomInt } from '@utils/sms/codeGenerator';
import redisClient from '@configs/redisClient';
import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import Payment from '@models/paymentModel';
import Subscription, { StatusEnum } from '@models/subscriptionModel';
import Plan from '@models/planModel';
import Reminder from '@models/reminderModel';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ZIBAL_API_URL = process.env.ZIBAL_API_URL as string;
const ZIBAL_VERIFY_URL = process.env.ZIBAL_VERIFY_URL as string;
const MERCHANT_ID = process.env.MERCHANT_ID as string;
const ZIBAL_CALLBACK_URL = process.env.ZIBAL_CALLBACK_URL as string;

export async function prfileController(
    req: express.Request,
    res: express.Response,
) {
    const userId = (req.user as IUser)._id;
    try {
        const user = await User.findById({ _id: userId });
        if (!user) {
            return res.status(404).json('This User Does Not Exist!');
        }
        return res.status(200).json(user);
    } catch (err) {
        console.error('Error finding user by ID:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}

export async function registerController(req: Request, res: Response) {
    try {
        const { fullname, phoneNumber, password } = req.body;
        const generateCode = getRandomInt();

        const findUser = await User.findOne({ phoneNumber: phoneNumber });
        if (findUser) {
            return res.status(409).json('This PhoneNumber is already in use!');
        }

        const user = new User({ fullname, phoneNumber, password });
        await user.save();

        await redisClient.setEx(
            user._id.toString(),
            300,
            generateCode.toString(),
        );
        await sendSMS(`Your Activation Code is ${generateCode}`, phoneNumber);
        return res.status(201).json({
            message: 'Registration successful! Please active your account',
        });
    } catch (err) {
        console.error('Error During Register User' + err);
        return res.status(500).json({ message: 'Server error' });
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
            return res.status(403).json({ error: 'This user is Not Active!' });
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
        console.error('Error During Login User' + err);
        return res.status(500).json({ error: 'Server error' });
    }
}

export async function verifyController(req: Request, res: Response) {
    try {
        const { phoneNumber, code } = req.body;

        // Find user by phone number
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(401).json({
                error: 'The phone number you provided is not registered. You can register using this number.',
            });
        }

        const userIdStr =
            user._id instanceof Types.ObjectId ? user._id.toString() : user._id;

        const storedOtp = await redisClient.get(userIdStr);

        if (storedOtp === code) {
            await User.findByIdAndUpdate(user, { isActive: true });
            return res
                .status(200)
                .json({ message: 'User verified successfully' });
        } else {
            return res.status(400).json({ error: 'Invalid or Expired OTP!' });
        }
    } catch (err) {
        console.error('Error During Verify Account: ' + err);
        return res.status(500).json({ error: 'Server error' });
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
        console.error('Error During Resend Code For User: ' + err);
        return res.status(500).json({ error: 'Server error' });
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
        console.error('Error During Forget Password User: ' + err);
        return res.status(500).json({ error: 'Server error' });
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
            return res
                .status(200)
                .json({ message: 'Your password is Changed!' });
        } else {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }
    } catch (err) {
        console.error('Error During New Password User: ' + err);
        return res.status(500).json({ error: 'Server error' });
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
            return res.status(404).json('This User Does Not Exist!');
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ error: 'Your Password is Incorrect!' });
        }

        await User.findByIdAndUpdate(user, { password: hashedPassword });
        return res.status(200).json({ message: 'Your password is Changed!' });
    } catch (err) {
        console.error('Error During Change Password User: ' + err);
        return res.status(500).json({ error: 'Server error' });
    }
}

export async function updateProfileController(req: Request, res: Response) {
    const userId = (req.user as IUser)._id;
    try {
        const { fullname } = req.body;

        const user = await User.findById({ _id: userId });
        if (!user) {
            return res.status(404).json('This User Does Not Exist!');
        }
        await User.findByIdAndUpdate(user, { fullname: fullname });
        return res.status(200).json('Your Name Changed Succesfully!');
    } catch (err) {
        console.error('Error During Update User Profile ', err);
        return res.status(500).json({ message: 'Server error' });
    }
}

export async function deleteProfileController(req: Request, res: Response) {
    const userId = (req.user as IUser)._id;
    try {
        await User.findOneAndDelete({ _id: userId });
        await Subscription.deleteMany({ userId: userId }); // Delete all subscriptions for the user
        await Reminder.deleteMany({ userId: userId }); // Delete all reminders for the user
        await Payment.deleteMany({ userId: userId }); // Delete all payments for the user
        return res.status(200).json('User Deleted Succesfully!');
    } catch (err) {
        console.error('Error During Delete User ', err);
        return res.status(500).json({ message: 'Server error' });
    }
}

export async function paymentController(req: Request, res: Response) {
    const userId = (req.user as IUser)._id;
    const { planId, phoneNumber } = req.body;

    try {
        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        const subscription = new Subscription({
            smsCount: plan.smsCount,
            userId: userId,
            planId: plan._id,
            status: StatusEnum.Pending,
        });
        await subscription.save();

        const amount = plan.price;
        const callbackUrl = `${ZIBAL_CALLBACK_URL}?subscriptionId=${subscription._id}`;

        try {
            const response = await axios.post(ZIBAL_API_URL, {
                merchant: MERCHANT_ID,
                amount: amount,
                callbackUrl: callbackUrl,
                mobile: phoneNumber,
            });

            const { trackId, result } = response.data;

            if (result !== 100) {
                return res
                    .status(400)
                    .json({ message: 'Failed to initiate payment' });
            }

            return res.status(200).json({
                message: 'Payment initiated',
                subscriptionId: subscription._id,
                paymentUrl: `https://gateway.zibal.ir/start/${trackId}`,
            });
        } catch (error) {
            console.error('Error connecting to Zibal:', error);
            return res
                .status(500)
                .json({ message: 'Error initiating payment' });
        }
    } catch (err) {
        console.error('Error During Payment: ' + err);
        return res.status(500).json({ message: 'Server error' });
    }
}

export async function verifyPaymentController(req: Request, res: Response) {
    const userId = (req.user as IUser)._id;
    try {
        const { subscriptionId, trackId } = req.body;

        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        try {
            const response = await axios.post(ZIBAL_VERIFY_URL, {
                merchant: MERCHANT_ID,
                trackId: trackId,
            });

            const { result, amount, paidAt } = response.data;

            if (result === 100) {
                const existingSubscription = await Subscription.findOne({
                    userId: subscription.userId,
                    status: StatusEnum.Active,
                });

                if (existingSubscription) {
                    existingSubscription.smsCount += subscription.smsCount;
                    await existingSubscription.save();
                    await Subscription.findByIdAndDelete(subscriptionId);
                } else {
                    subscription.status = StatusEnum.Active;
                    await subscription.save();
                }

                await Subscription.deleteMany({
                    userId: subscription.userId,
                    status: { $in: [StatusEnum.Pending, StatusEnum.Failed] },
                });

                const payment = new Payment({
                    paymentDate: new Date(paidAt),
                    paymentMethod: 'Zibal',
                    amount: amount,
                    userId: subscription.userId,
                    status: true,
                });
                await payment.save();

                return res.status(200).json({
                    message: 'Payment verified and subscription activated',
                });
            } else {
                subscription.status = StatusEnum.Failed;
                await subscription.save();

                const payment = new Payment({
                    paymentDate: new Date(),
                    paymentMethod: 'Zibal',
                    amount: amount,
                    userId: subscription.userId,
                    status: false,
                });
                await payment.save();

                return res.status(400).json({ message: 'Payment failed' });
            }
        } catch (error) {
            console.error('Error verifying payment with Zibal:', error);
            return res.status(500).json({ message: 'Error verifying payment' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}
