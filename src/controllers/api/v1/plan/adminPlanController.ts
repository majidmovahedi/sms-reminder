import express, { Request, Response } from 'express';
import Plan from '@models/planModel';

export async function planController(req: Request, res: Response) {
    try {
        const plans = await Plan.find();

        if (plans.length === 0) {
            return res
                .status(404)
                .json({ message: 'You Dont Create any Plan!' });
        }

        return res.status(200).json(plans);
    } catch (err) {
        console.error('Error finding Plans:', err);
        return res.status(500).json({ message: 'Server error occurred' });
    }
}
