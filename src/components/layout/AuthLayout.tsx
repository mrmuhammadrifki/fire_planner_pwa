"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex flex-col">
            {/* Header */}
            <header className="p-4 md:p-6">
                <Link href="/" className="inline-flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-fire-500 to-fire-600 rounded-xl shadow-lg shadow-fire-500/25">
                        <Flame className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-display font-bold text-lg gradient-text-fire">
                        FIRE Planner
                    </span>
                </Link>
            </header>

            {/* Main content */}
            <main className="flex-1 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="p-4 text-center text-sm text-surface-500 dark:text-surface-400">
                <p>© 2024 FIRE Planner. Built for Gen Z financial independence.</p>
            </footer>

            {/* Background decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary-500/10 via-transparent to-transparent rounded-full blur-3xl" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-fire-500/10 via-transparent to-transparent rounded-full blur-3xl" />
            </div>
        </div>
    );
}
