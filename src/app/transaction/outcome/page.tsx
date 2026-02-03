"use client";

import { AppShell } from "@/components/layout";
import { TrendingDown } from "lucide-react";
import { TransactionForm } from "@/components/transaction/TransactionForm";
import { TransactionList } from "@/components/transaction/TransactionList";

import { useAppStore } from "@/store";
import { translations } from "@/lib/i18n";

export default function OutcomePage() {
    const { settings } = useAppStore();
    const language = settings?.language || 'id';
    const t = translations[language as keyof typeof translations] || translations.id;

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-white flex items-center gap-2">
                        <TrendingDown className="w-8 h-8 text-fire-500" />
                        {t.transaction_history} - {t.outcome}
                    </h1>
                    <p className="text-surface-500 dark:text-surface-400 mt-1">
                        {t.track_outcome_desc}
                    </p>
                </div>

                <TransactionForm type="outcome" />

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-surface-900 dark:text-white">{t.history}</h2>
                    <TransactionList type="outcome" />
                </div>
            </div>
        </AppShell>
    );
}
