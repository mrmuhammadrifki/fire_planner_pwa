"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, Flame } from "lucide-react";
import { loginSchema, LoginFormData } from "@/lib/validations";
import { login } from "@/lib/api/auth";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";

export function LoginForm() {
    const router = useRouter();
    const { setAuth } = useAppStore();
    const toast = useToast();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        const result = await login(data);

        if (result.success && result.data) {
            setAuth(result.data.user, result.data.token);
            toast.success("Welcome back!", result.message);
            router.push("/dashboard");
        } else {
            toast.error("Login failed", result.error);
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
                    Welcome Back
                </h1>
                <p className="text-surface-500 dark:text-surface-400 mt-1">
                    Sign in to continue your FIRE journey
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    autoComplete="current-password"
                />

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-surface-300 dark:border-surface-600 
                       text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-surface-600 dark:text-surface-300">
                            Remember me
                        </span>
                    </label>
                    <Link
                        href="/auth/forgot-password"
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                    >
                        Forgot password?
                    </Link>
                </div>

                <Button
                    type="submit"
                    variant="fire"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full mt-6"
                >
                    Sign In
                </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-surface-200 dark:border-surface-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-surface-800 px-2 text-surface-500 dark:text-surface-400">
                        New to FIRE Planner?
                    </span>
                </div>
            </div>

            {/* Register link */}
            <div className="text-center">
                <Link
                    href="/auth/register"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                    Create an account
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

            {/* Demo credentials hint */}
            <div className="mt-6 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
                <p className="text-xs text-primary-700 dark:text-primary-300">
                    <strong>Demo:</strong> Register a new account to get started, or use any
                    email/password after registering.
                </p>
            </div>
        </Card>
    );
}
