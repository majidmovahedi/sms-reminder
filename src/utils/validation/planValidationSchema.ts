import { z } from 'zod';

//  planName, description, smsCount, price

export const CreatePlanSchema = z.object({
    planName: z.string().min(3, 'planName must be at least 3 characters'),
    description: z
        .string()
        .min(3, 'planName must be at least 3 characters')
        .max(300, 'planName must not exceed 300 characters'),
    smsCount: z.number().int('smsCount must be an integer'),
    price: z.number().int('Price must be an integer'),
});

export const UpdatePlanSchema = z.object({
    planName: z
        .string()
        .min(3, 'planName must be at least 3 characters')
        .optional(),
    description: z
        .string()
        .min(3, 'planName must be at least 3 characters')
        .max(300, 'planName must not exceed 300 characters')
        .optional(),
    smsCount: z.number().int('smsCount must be an integer').optional(),
    price: z.number().int('Price must be an integer').optional(),
});
