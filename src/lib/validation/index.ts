import { z } from 'zod';

export const SignupValidation = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters' })
        .max(100, { message: 'Name must be less than 100 characters' }),

    username: z
        .string()
        .min(2, { message: 'Username must be at least 2 characters' })
        .max(100, { message: 'Username must be less than 100 characters' }),

    email: z.string().email({
        message: 'Invalid email'
    }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(100, { message: 'Password must be less than 100 characters' })
});

export const SigninValidation = z.object({
    email: z.string().email({
        message: 'Invalid email'
    }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(100, { message: 'Password must be less than 100 characters' })
});

export const PasswordRecoveryValidation = z.object({
    email: z.string().email({
        message: 'Invalid email'
    })
});

const passwordSchema = z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(100, { message: 'Password must be less than 100 characters' });

export const ResetPasswordValidation = z
    .object({
        password: passwordSchema,
        confirmPassword: passwordSchema
    })
    .refine((data) => data.password == data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    });
