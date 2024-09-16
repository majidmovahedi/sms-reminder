import { Request, Response, NextFunction } from 'express';
import passport from '@middlewares/passport';
import { IUser } from '@models/userModel';

// Middleware to protect routes
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
