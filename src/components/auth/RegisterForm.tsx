"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, User, Flame, CheckCircle } from "lucide-react";
import { registerSchema, RegisterFormData } from "@/lib/validations";
import { register as registerApi } from "@/lib/api/auth";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";

export function RegisterForm() {
    const router = useRouter();
    const { setAuth } = useAppStore();
    const toast = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const password = watch("password", "");

    const passwordRequirements = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "One uppercase letter", met: /[A-Z]/.test(password) },
        { label: "One lowercase letter", met: /[a-z]/.test(password) },
        { label: "One number", met: /[0-9]/.test(password) },
    ];

    const onSubmit = async (data: RegisterFormData) => {
        const result = await registerApi({
            email: data.email,
            password: data.password,
            name: data.name,
        });

        if (result.success && result.data) {
            setAuth(result.data.user, result.data.token);
            toast.success("Account created!", result.message);
            router.push("/dashboard");
        } else {
            toast.error("Registration failed", result.error);
        }
    };

    return (
        <Card variant="glass" padding="lg" className="animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-fire-500 to-fire-600 shadow-lg shadow-fire-500/25 mb-4">
                    <Flame className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold font-display text-surface-900 dark:text-white">
                    Start Your FIRE Journey
                </h1>
                <p className="text-surface-500 dark:text-surface-400 mt-1">
                    Create your free account today
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    {...register("name")}
                    type="text"
                    label="Full Name"
                    placeholder="John Doe"
                    leftIcon={<User className="w-4 h-4" />}
                    error={errors.name?.message}
                    autoComplete="name"
                />

                <Input
                    {...register("email")}
                    type="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    leftIcon={<Mail className="w-4 h-4" />}
                    error={errors.email?.message}
                    autoComplete="email"
                />

                <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    placeholder="••••••••"
                    leftIcon={<Lock className="w-4 h-4" />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-1 hover:text-primary-500 transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    }
                    error={errors.password?.message}
                    autoComplete="new-password"
                />

                {/* Password requirements */}
                {password && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        {passwordRequirements.map((req) => (
                            <div
                                key={req.label}
                                className={`flex items-center gap-1.5 ${req.met
                                        ? "text-wealth-600 dark:text-wealth-400"
                                        : "text-surface-400 dark:text-surface-500"
                                    }`}
                            >
                                <CheckCircle
                                    className={`w-3.5 h-3.5 ${req.met ? "opacity-100" : "opacity-30"
                                        }`}
                                />
                                {req.label}
                            </div>
                        ))}
                    </div>
                )}

                <Input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    label="Confirm Password"
                    placeholder="••••••••"
                    leftIcon={<Lock className="w-4 h-4" />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="p-1 hover:text-primary-500 transition-colors"
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    }
                    error={errors.confirmPassword?.message}
                    autoComplete="new-password"
                />

                <div className="flex items-start gap-2 text-sm">
                    <input
                        type="checkbox"
                        id="terms"
                        className="mt-1 w-4 h-4 rounded border-surface-300 dark:border-surface-600 
                     text-primary-500 focus:ring-primary-500"
                        required
                    />
                    <label
                        htmlFor="terms"
                        className="text-surface-600 dark:text-surface-300"
                    >
                        I agree to the{" "}
                        <Link
                            href="/terms"
                            className="text-primary-500 hover:underline"
                        >
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/privacy"
                            className="text-primary-500 hover:underline"
                        >
                            Privacy Policy
                        </Link>
                    </label>
                </div>

                <Button
                    type="submit"
                    variant="fire"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full mt-6"
                >
                    Create Account
                </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-surface-200 dark:border-surface-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-surface-800 px-2 text-surface-500 dark:text-surface-400">
                        Already have an account?
                    </span>
                </div>
            </div>

            {/* Login link */}
            <div className="text-center">
                <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                    Sign in instead
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                    </svg>
                </Link>
            </div>
        </Card>
    );
}
