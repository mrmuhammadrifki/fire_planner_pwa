"use client";

import { ReactNode, CSSProperties } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: "default" | "glass" | "gradient";
    padding?: "none" | "sm" | "md" | "lg";
    hover?: boolean;
    style?: CSSProperties;
}

const variantStyles = {
    default: "bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700",
    glass: "bg-white/80 dark:bg-surface-800/80 backdrop-blur-lg border border-white/20 dark:border-surface-700/50 shadow-glass",
    gradient: "bg-gradient-to-br from-primary-500/10 via-transparent to-fire-500/10 border border-primary-200/50 dark:border-primary-800/50",
};

const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
};

export function Card({
    children,
    className = "",
    variant = "default",
    padding = "md",
    hover = false,
    style,
}: CardProps) {
    return (
        <div
            className={`
        rounded-2xl shadow-sm
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hover ? "hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer" : ""}
        ${className}
      `}
            style={style}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps {
    title: string;
    subtitle?: string;
    action?: ReactNode;
    icon?: ReactNode;
}

export function CardHeader({ title, subtitle, action, icon }: CardHeaderProps) {
    return (
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
                {icon && (
                    <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400">
                        {icon}
                    </div>
                )}
                <div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

interface StatCardProps {
    label: string;
    value: string | number;
    change?: {
        value: number;
        type: "increase" | "decrease" | "neutral";
    };
    icon?: ReactNode;
    variant?: "default" | "primary" | "fire" | "wealth";
}

const statVariantStyles = {
    default: "text-surface-900 dark:text-white",
    primary: "text-primary-600 dark:text-primary-400",
    fire: "text-fire-600 dark:text-fire-400",
    wealth: "text-wealth-600 dark:text-wealth-400",
};

const statIconBgStyles = {
    default: "bg-surface-100 dark:bg-surface-700",
    primary: "bg-primary-100 dark:bg-primary-900/50",
    fire: "bg-fire-100 dark:bg-fire-900/50",
    wealth: "bg-wealth-100 dark:bg-wealth-900/50",
};

export function StatCard({ label, value, change, icon, variant = "default" }: StatCardProps) {
    return (
        <Card variant="glass" padding="md" className="relative overflow-hidden">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
                        {label}
                    </p>
                    <p className={`text-2xl font-bold font-display mt-1 ${statVariantStyles[variant]}`}>
                        {typeof value === "number" ? value.toLocaleString() : value}
                    </p>
                    {change && (
                        <div className="flex items-center gap-1 mt-2">
                            <span
                                className={`text-xs font-medium ${change.type === "increase"
                                    ? "text-wealth-600 dark:text-wealth-400"
                                    : change.type === "decrease"
                                        ? "text-red-600 dark:text-red-400"
                                        : "text-surface-500 dark:text-surface-400"
                                    }`}
                            >
                                {change.type === "increase" ? "+" : change.type === "decrease" ? "-" : ""}
                                {Math.abs(change.value)}%
                            </span>
                            <span className="text-xs text-surface-400 dark:text-surface-500">
                                vs last month
                            </span>
                        </div>
                    )}
                </div>
                {icon && (
                    <div className={`p-3 rounded-xl ${statIconBgStyles[variant]}`}>
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    );
}
