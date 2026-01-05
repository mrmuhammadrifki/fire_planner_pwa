"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import { AppShell } from "@/components/layout";
import { FinancialForm } from "@/components/fire";
import { useToast } from "@/components/ui/Toast";

export default function PlannerPage() {
    const router = useRouter();
    const { isAuthenticated } = useAppStore();
    const toast = useToast();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null;
    }

    const handleSubmit = () => {
        toast.success("Simulation complete!", "View your results on the Results page.");
        router.push("/results");
    };

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-white">
                        FIRE Planner 🔥
                    </h1>
                    <p className="text-surface-500 dark:text-surface-400 mt-2">
                        Enter your financial details to calculate your path to Financial Independence.
                        All data is stored locally on your device.
                    </p>
                </div>

                {/* Form */}
                <FinancialForm onSubmit={handleSubmit} />
            </div>
        </AppShell>
    );
}
