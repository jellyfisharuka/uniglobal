import * as z from 'zod';

export const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    telephone: z.string().optional(),
    city: z.string().min(2, "City is required"),
    gender: z.enum(["male", "female"], {
        required_error: "Please select your gender",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

