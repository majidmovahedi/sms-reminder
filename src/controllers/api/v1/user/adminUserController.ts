import { Request, Response } from 'express';
import User from '@models/userModel';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import Subscription from '@models/subscriptionModel';
import Reminder from '@models/reminderModel';
import Payment from '@models/paymentModel';

export async function listUsersController(req: Request, res: Response) {
    try {
        const users = await User.find();
        if (!users) {
            return res.status(404).json('User Does Not Exist!');
        }
        return res.status(200).json(users);
    } catch (err) {
        console.error('Error finding user:', err);
        return res.status(500).json({ message: 'Server error occurred' });
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
            return res.status(404).json('This User Does Not Exist!');
        }

        return res.status(200).json(user);
    } catch (err) {
        console.error('Error finding user by ID:', err);
        return res.status(500).json({ message: 'Server error occurred' });
    }
}

export async function adminRegisterController(req: Request, res: Response) {
    try {
        const { fullname, phoneNumber, password, isActive, adminType } =
            req.body;

        const findUser = await User.findOne({ phoneNumber: phoneNumber });
        if (findUser) {
            return res.status(409).json('This PhoneNumber Exist!');
        }

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
        return res.status(500).json({ message: 'Server error occurred' });
    }
}

export async function adminChangePasswordController(
    req: Request,
    res: Response,
) {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID format.' });
        }
        // Find user by ID
        const user = await User.findById({ _id: new ObjectId(id) });

        if (!user) {
            return res.status(404).json('This User Does Not Exist!');
        }

        await User.findByIdAndUpdate(user, { password: hashedPassword });
        return res.json({ message: 'password is Changed!' });
    } catch (err) {
        console.error('Error During Change Password as Admin: ' + err);
        return res.status(500).json({ message: 'Server error occurred' });
    }
}

export async function adminUpdateProfileController(
    req: Request,
    res: Response,
) {
    try {
        const { id } = req.params;
        const { fullname, phoneNumber, isActive, adminType } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID format.' });
        }
        // Find user by ID
        const user = await User.findById({ _id: new ObjectId(id) });

        if (user?.phoneNumber == phoneNumber) {
            return res.status(409).json('This PhoneNumber is Exist!');
        }
        if (!user) {
            return res.status(404).json('This User Does Not Exist!');
        }

        await User.findByIdAndUpdate(user, {
            fullname,
            phoneNumber,
            isActive,
            adminType,
        });
        return res.status(200).json('Profile Changed Succesfully!');
    } catch (err) {
        console.error('Error During Update User Profile ', err);
        return res.status(500).json({ message: 'Server error occurred' });
    }
}

export async function adminDeleteProfileController(
    req: Request,
    res: Response,
) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID format.' });
        }
        // Find user by ID
        const user = await User.findById({ _id: new ObjectId(id) });

        if (!user) {
            return res.status(404).json('This User Does Not Exist!');
        }

        // Delete User
        await User.findOneAndDelete({ _id: user });
        // Delete subscriptions for the user
        await Subscription.deleteMany({ userId: user._id });
        // Delete reminders for the user
        await Reminder.deleteMany({ userId: user._id });
        // Delete payments for the user
        await Payment.deleteMany({ userId: user._id });

        return res.status(200).json('User Deleted Succesfully!');
    } catch (err) {
        console.error('Error During Delete User ', err);
        return res.status(500).json({ message: 'Server error occurred' });
    }
}
