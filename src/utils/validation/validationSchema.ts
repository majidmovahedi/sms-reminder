import { z } from 'zod';

export const UserRegisterSchema = z.object({
    fullname: z.string().min(3, 'fullname must be at least 3 characters'),
    phoneNumber: z
        .string()
        .min(11, 'phoneNumber must be at least 11 characters')
        .max(11, 'phoneNumber must not exceed 11 characters'),
    password: z.string().min(8, 'Password must contain at least 8 characters'),
});

export const UserLoginSchema = z.object({
    phoneNumber: z
        .string()
        .min(11, 'phoneNumber must be at least 11 characters')
        .max(11, 'phoneNumber must not exceed 11 characters'),
    password: z.string().min(8, 'Password must contain at least 8 characters'),
});
