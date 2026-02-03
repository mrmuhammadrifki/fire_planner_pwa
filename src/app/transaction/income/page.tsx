"use client";

import { AppShell } from "@/components/layout";
import { TrendingUp } from "lucide-react";
import { TransactionForm } from "@/components/transaction/TransactionForm";
import { TransactionList } from "@/components/transaction/TransactionList";

import { useAppStore } from "@/store";
import { translations } from "@/lib/i18n";

export default function IncomePage() {
    const { settings } = useAppStore();
    const language = settings?.language || 'id';
    const t = translations[language as keyof typeof translations] || translations.id;

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-8 h-8 text-wealth-500" />
                        {t.transaction_history} - {t.income}
                    </h1>
                    <p className="text-surface-500 dark:text-surface-400 mt-1">
                        {t.track_income_desc}
                    </p>
                </div>

                <TransactionForm type="income" />

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-surface-900 dark:text-white">{t.history}</h2>
                    <TransactionList type="income" />
                </div>
            </div>
        </AppShell>
    );
}
