"use client";

import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps {
    children: ReactNode;
    variant?: "primary" | "secondary" | "fire" | "wealth" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    className?: string;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
}

const variantStyles = {
    primary: `bg-gradient-to-r from-primary-500 to-primary-600 
            hover:from-primary-600 hover:to-primary-700 
            text-white shadow-lg shadow-primary-500/25`,
    secondary: `bg-surface-100 dark:bg-surface-800 
              hover:bg-surface-200 dark:hover:bg-surface-700 
              text-surface-700 dark:text-surface-200
              border border-surface-200 dark:border-surface-700`,
    fire: `bg-gradient-to-r from-fire-500 to-fire-600 
         hover:from-fire-600 hover:to-fire-700 
         text-white shadow-lg shadow-fire-500/25`,
    wealth: `bg-gradient-to-r from-wealth-500 to-wealth-600 
           hover:from-wealth-600 hover:to-wealth-700 
           text-white shadow-lg shadow-wealth-500/25`,
    ghost: `hover:bg-surface-100 dark:hover:bg-surface-800 
          text-surface-600 dark:text-surface-300`,
    danger: `bg-gradient-to-r from-red-500 to-red-600 
           hover:from-red-600 hover:to-red-700 
           text-white shadow-lg shadow-red-500/25`,
};

const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
};

export function Button({
    children,
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled = false,
    type = "button",
    onClick,
    className = "",
    icon,
    iconPosition = "left",
}: ButtonProps) {
    const isDisabled = disabled || isLoading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-xl
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        dark:focus:ring-offset-surface-900
        transition-all duration-200 active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {!isLoading && icon && iconPosition === "left" && icon}
            {children}
            {!isLoading && icon && iconPosition === "right" && icon}
        </button>
    );
}
