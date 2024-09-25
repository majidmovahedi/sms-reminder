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

export const UserVerifySchema = z.object({
    phoneNumber: z
        .string()
        .min(11, 'phoneNumber must be at least 11 characters')
        .max(11, 'phoneNumber must not exceed 11 characters'),
    code: z
        .string()
        .min(5, 'code must be at least 5 numbers')
        .max(5, 'code must not exceed 5 numbers'),
});

export const UserResendSchema = z.object({
    phoneNumber: z
        .string()
        .min(11, 'phoneNumber must be at least 11 characters')
        .max(11, 'phoneNumber must not exceed 11 characters'),
});

export const UserForgetPasswordSchema = z.object({
    phoneNumber: z
        .string()
        .min(11, 'phoneNumber must be at least 11 characters')
        .max(11, 'phoneNumber must not exceed 11 characters'),
});

export const UserNewPasswordSchema = z.object({
    phoneNumber: z
        .string()
        .min(11, 'phoneNumber must be at least 11 characters')
        .max(11, 'phoneNumber must not exceed 11 characters'),
    code: z
        .string()
        .min(5, 'code must be at least 5 numbers')
        .max(5, 'code must not exceed 5 numbers'),
    newPassword: z
        .string()
        .min(8, 'New Password must contain at least 8 characters'),
});

export const UserChangePasswordSchema = z.object({
    password: z.string().min(8, 'Password must contain at least 8 characters'),
    newPassword: z
        .string()
        .min(8, 'New Password must contain at least 8 characters'),
});

export const UserUpdateProfileSchema = z.object({
    fullname: z.string().min(3, 'fullname must be at least 3 characters'),
});
