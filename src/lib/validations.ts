import { z } from "zod";

// Login form schema
export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Registration form schema
export const registerSchema = z
    .object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name must be less than 50 characters"),
        email: z.string().email("Please enter a valid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export type RegisterFormData = z.infer<typeof registerSchema>;

// Financial input form schema
export const financialInputSchema = z.object({
    monthlyIncome: z
        .number()
        .min(0, "Income must be positive")
        .max(1000000000, "Please enter a realistic income"),
    monthlyExpenses: z
        .number()
        .min(0, "Expenses must be positive")
        .max(1000000000, "Please enter a realistic expense"),
    initialSavings: z
        .number()
        .min(0, "Savings must be positive")
        .max(1000000000000, "Please enter a realistic savings amount"),
    savingRate: z.number().min(0, "Saving rate must be positive").max(100, "Saving rate cannot exceed 100%"),
    currency: z.string().default("IDR"),
});

export type FinancialInputFormData = z.infer<typeof financialInputSchema>;

// FIRE target form schema
export const fireTargetSchema = z.object({
    currentAge: z
        .number()
        .min(16, "Age must be at least 16")
        .max(100, "Age must be less than 100"),
    targetAge: z
        .number()
        .min(20, "Target age must be at least 20")
        .max(100, "Target age must be less than 100"),
    targetPortfolio: z
        .number()
        .min(1000, "Target portfolio must be at least 1,000")
        .max(1000000000000, "Please enter a realistic target"),
    annualReturn: z
        .number()
        .min(0, "Return must be positive")
        .max(50, "Return seems unrealistically high"),
    safeWithdrawalRate: z
        .number()
        .min(1, "Withdrawal rate must be at least 1%")
        .max(10, "Withdrawal rate seems too high"),
    inflationRate: z
        .number()
        .min(0, "Inflation must be positive")
        .max(20, "Inflation rate seems too high"),
});

export type FireTargetFormData = z.infer<typeof fireTargetSchema>;

// Combined planner form
export const plannerFormSchema = z.object({
    // Financial inputs
    monthlyIncome: z.number().min(0, "Income must be positive"),
    monthlyExpenses: z.number().min(0, "Expenses must be positive"),
    initialSavings: z.number().min(0, "Savings must be positive"),

    // FIRE targets
    currentAge: z.number().min(16).max(100),
    targetAge: z.number().min(20).max(100),
    annualReturn: z.number().min(0).max(50),
    safeWithdrawalRate: z.number().min(1).max(10),
    inflationRate: z.number().min(0).max(20),
});

export type PlannerFormData = z.infer<typeof plannerFormSchema>;

// Settings form schema
export const settingsSchema = z.object({
    theme: z.enum(["light", "dark", "system"]),
    currency: z.string().min(3).max(3),
    locale: z.string(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
