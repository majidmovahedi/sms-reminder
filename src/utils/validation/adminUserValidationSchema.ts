import { z } from 'zod';

export const AdminUserRegisterSchema = z.object({
    fullname: z.string().min(3, 'FullName must be at least 3 characters'),
    phoneNumber: z
        .string()
        .min(11, 'PhoneNumber must be at least 11 characters')
        .max(11, 'PhoneNumber must not exceed 11 characters'),
    password: z.string().min(8, 'Password must contain at least 8 characters'),
    isActive: z.boolean({
        invalid_type_error: 'isActive must be true or false',
    }),
    adminType: z.boolean({
        invalid_type_error: 'adminType must be true or false',
    }),
});

export const AdminUserChangePasswordSchema = z.object({
    newPassword: z
        .string()
        .min(8, 'New Password must contain at least 8 characters'),
});

export const AdminUserUpdateProfileSchema = z.object({
    fullname: z
        .string()
        .min(3, 'FullName must be at least 3 characters')
        .optional(),
    phoneNumber: z
        .string()
        .min(11, 'PhoneNumber must be at least 11 characters')
        .max(11, 'PhoneNumber must not exceed 11 characters')
        .optional(),
    isActive: z
        .boolean({
            invalid_type_error: 'isActive must be true or false',
        })
        .optional(),
    adminType: z
        .boolean({
            invalid_type_error: 'adminType must be true or false',
        })
        .optional(),
});
