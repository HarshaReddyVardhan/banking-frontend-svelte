
import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" })
});

export const transferSchema = z.object({
    toAccountId: z.string().min(1, { message: "Recipient account is required" }),
    amount: z.number().positive({ message: "Amount must be greater than zero" }),
    description: z.string().max(100, { message: "Description too long" }).optional()
});

export type LoginInput = z.infer<typeof loginSchema>;
export type TransferInput = z.infer<typeof transferSchema>;
