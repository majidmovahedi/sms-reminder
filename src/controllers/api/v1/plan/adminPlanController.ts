import express, { Request, Response } from 'express';
import Plan from '@models/planModel';
import { ObjectId } from 'mongodb';

export async function plansController(req: Request, res: Response) {
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

export async function singlePlanController(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid Plan ID format.' });
        }
        const plan = await Plan.findOne({ _id: new ObjectId(id) });

        if (!plan) {
            return res
                .status(404)
                .json({ message: 'This Plan Does Not Exist!' });
        }

        return res.status(200).json(plan);
    } catch (err) {
        console.error('Error finding Plan by ID:', err);
        return res.status(500).json({ message: 'Server error occurred' });
    }
}

export async function createPlanController(req: Request, res: Response) {
    try {
        const { planName, description, smsCount, price } = req.body;

        const newPlan = new Plan({
            planName,
            description,
            smsCount,
            price,
        });
        await newPlan.save();
        return res.status(201).json({ message: 'Plan Created', newPlan });
    } catch (err) {
        console.error('Error During Create Plan:', err);
        return res.status(500).json({ message: 'Server error occurred' });
    }
}
