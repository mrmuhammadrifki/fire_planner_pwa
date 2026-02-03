"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import { AppShell } from "@/components/layout";
import { FinancialForm } from "@/components/fire";
import { useToast } from "@/components/ui/Toast";
import { translations } from "@/lib/i18n";

export default function PlannerPage() {
    const router = useRouter();
    const { isAuthenticated, settings } = useAppStore();
    const toast = useToast();
    const t = translations[settings.language || "id"];

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null;
    }

    const handleSubmit = () => {
        toast.success(t.simulation_complete || "Simulation complete!", t.view_results_toast || "View your results on the Results page.");
        router.push("/results");
    };

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-white flex items-center gap-2">
                        {t.fire_planner_title} <span className="text-2xl">🔥</span>
                    </h1>
                    <p className="text-surface-500 dark:text-surface-400 mt-2">
                        {t.fire_planner_subtitle}
                    </p>
                </div>

                {/* Form */}
                <FinancialForm onSubmit={handleSubmit} />
            </div>
        </AppShell>
    );
}
