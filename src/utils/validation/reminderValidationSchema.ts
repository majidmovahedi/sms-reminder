import { z } from 'zod';

// title, reminderText, month, day, hour, minute

export const CreateReminderSchema = z.object({
    title: z.string().min(3, 'title must be at least 3 characters'),
    reminderText: z
        .string()
        .min(3, 'reminderText must be at least 3 characters')
        .max(60, 'reminderText must not exceed 60 characters'),
    month: z
        .number()
        .int('Month must be an integer')
        .min(1, 'The value must be a number between 1 and 12')
        .max(12, 'The value must be a number between 1 and 12'),
    day: z
        .number()
        .int('Day must be an integer')
        .min(1, 'The value must be a number between 1 and 31')
        .max(31, 'The value must be a number between 1 and 31'),
    hour: z
        .number()
        .int('Hour must be an integer')
        .min(0, 'The value must be a number between 0 and 23')
        .max(23, 'The value must be a number between 0 and 23'),
    minute: z
        .number()
        .int('Minute must be an integer')
        .min(0, 'The value must be a number between 0 and 60')
        .max(60, 'The value must be a number between 0 and 60'),
});

export const UpdateReminderSchema = z.object({
    title: z.string().min(3, 'title must be at least 3 characters').optional(),
    reminderText: z
        .string()
        .min(3, 'reminderText must be at least 3 characters')
        .max(60, 'reminderText must not exceed 60 characters')
        .optional(),
    month: z
        .number()
        .int('Month must be an integer')
        .min(1, 'The value must be a number between 1 and 12')
        .max(12, 'The value must be a number between 1 and 12')
        .optional(),
    day: z
        .number()
        .int('Day must be an integer')
        .min(1, 'The value must be a number between 1 and 31')
        .max(31, 'The value must be a number between 1 and 31')
        .optional(),
    hour: z
        .number()
        .int('Hour must be an integer')
        .min(0, 'The value must be a number between 0 and 23')
        .max(23, 'The value must be a number between 0 and 23')
        .optional(),
    minute: z
        .number()
        .int('Minute must be an integer')
        .min(0, 'The value must be a number between 0 and 60')
        .max(60, 'The value must be a number between 0 and 60')
        .optional(),
});
