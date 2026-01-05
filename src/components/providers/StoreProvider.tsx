"use client";

import { useEffect, ReactNode, useState } from "react";
import { useAppStore } from "@/store";
import { Toaster } from "@/components/ui/Toast";

interface StoreProviderProps {
    children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // Wait for Zustand to hydrate from localStorage
        setIsHydrated(true);
    }, []);

    if (!isHydrated) {
        // Show loading state while hydrating
        return (
            <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-surface-500 dark:text-surface-400 text-sm">
                        Loading FIRE Planner...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            {children}
            <Toaster />
        </>
    );
}
