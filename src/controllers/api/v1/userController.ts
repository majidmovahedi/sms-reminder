import { Request, Response } from 'express';

export const listUsers = (req: Request, res: Response): void => {
    res.send('List of users');
};
