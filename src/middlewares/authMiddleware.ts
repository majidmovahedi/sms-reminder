import { Request, Response, NextFunction } from 'express';
import passport from '@middlewares/passport';
import User, { IUser } from '@models/userModel';

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    passport.authenticate(
        'jwt',
        { session: false },
        (err: any, user: IUser) => {
            if (err)
                return res.status(500).json({ error: 'Internal Server Error' });
            if (!user) return res.status(401).json({ error: 'Unauthorized' });
            req.user = user;
            next();
        },
    )(req, res, next);
};

export async function adminMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const userId = (req.user as IUser)._id;

    try {
        const user = await User.findById({ _id: userId });
        if (user?.adminType == true) {
            next();
        } else {
            res.status(401).json('You Dont Have Permission!');
        }
    } catch (err) {
        console.error('Error during to find adminType user:', err);
    }
}
