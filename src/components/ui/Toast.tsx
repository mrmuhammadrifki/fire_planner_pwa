"use client";

import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useAppStore } from "@/store";
import { Toast as ToastType } from "@/types";

const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
};

const styles = {
    success: "bg-wealth-50 dark:bg-wealth-900/30 border-wealth-200 dark:border-wealth-800 text-wealth-800 dark:text-wealth-200",
    error: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
    info: "bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800 text-primary-800 dark:text-primary-200",
    warning: "bg-fire-50 dark:bg-fire-900/30 border-fire-200 dark:border-fire-800 text-fire-800 dark:text-fire-200",
};

const iconStyles = {
    success: "text-wealth-500",
    error: "text-red-500",
    info: "text-primary-500",
    warning: "text-fire-500",
};

function ToastItem({ toast }: { toast: ToastType }) {
    const { removeToast } = useAppStore();
    const Icon = icons[toast.type];

    useEffect(() => {
        const duration = toast.duration || 5000;
        const timer = setTimeout(() => {
            removeToast(toast.id);
        }, duration);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, removeToast]);

    return (
        <div
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-slide-down ${styles[toast.type]}`}
            role="alert"
        >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconStyles[toast.type]}`} />
            <div className="flex-1 min-w-0">
                <p className="font-medium">{toast.title}</p>
                {toast.message && (
                    <p className="text-sm opacity-80 mt-0.5">{toast.message}</p>
                )}
            </div>
            <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="Dismiss notification"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

export function Toaster() {
    const { toasts } = useAppStore();

    if (toasts.length === 0) return null;

    return (
        <div
            className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm"
            aria-live="polite"
            aria-atomic="true"
        >
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
    );
}

export function useToast() {
    const { addToast, removeToast } = useAppStore();

    const toast = {
        success: (title: string, message?: string) =>
            addToast({ type: "success", title, message }),
        error: (title: string, message?: string) =>
            addToast({ type: "error", title, message }),
        info: (title: string, message?: string) =>
            addToast({ type: "info", title, message }),
        warning: (title: string, message?: string) =>
            addToast({ type: "warning", title, message }),
        dismiss: removeToast,
    };

    return toast;
}
