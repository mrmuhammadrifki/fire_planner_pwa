"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, leftIcon, rightIcon, className = "", type = "text", id, ...props }, ref) => {
        const inputId = id || props.name;

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="label">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        type={type}
                        className={`
              input
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
              ${error ? "input-error" : ""}
              ${className}
            `}
                        aria-invalid={error ? "true" : "false"}
                        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p id={`${inputId}-error`} className="error-message" role="alert">
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p id={`${inputId}-hint`} className="text-sm text-surface-500 mt-1">
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

interface NumberInputProps extends Omit<InputProps, 'type' | 'onChange'> {
    value: number | undefined;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    prefix?: string;
    suffix?: string;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    ({ value, onChange, min, max, step = 1, prefix, suffix, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value.replace(/[^0-9.-]/g, "");
            const numValue = parseFloat(rawValue);

            if (isNaN(numValue)) {
                onChange(0);
            } else {
                let clampedValue = numValue;
                if (min !== undefined) clampedValue = Math.max(min, clampedValue);
                if (max !== undefined) clampedValue = Math.min(max, clampedValue);
                onChange(clampedValue);
            }
        };

        return (
            <Input
                ref={ref}
                type="text"
                inputMode="decimal"
                value={value?.toString() || ""}
                onChange={handleChange}
                leftIcon={prefix ? <span className="text-sm font-medium">{prefix}</span> : undefined}
                rightIcon={suffix ? <span className="text-sm font-medium">{suffix}</span> : undefined}
                {...props}
            />
        );
    }
);

NumberInput.displayName = "NumberInput";
