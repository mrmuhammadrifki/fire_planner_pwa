"use client";

import { useEffect, useState } from "react";
import { Trash2, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { useAppStore } from "@/store";
import { fetchTransactions, deleteTransaction } from "@/lib/api/transaction";
import { Transaction, TransactionType } from "@/types";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

import { translations } from "@/lib/i18n";

interface TransactionListProps {
    type: TransactionType;
}

export function TransactionList({ type }: TransactionListProps) {
    const { authToken, transactions, setTransactions, removeTransactionFromStore, financialInput, settings } = useAppStore();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    // Get translations
    const language = settings?.language || 'id';
    const t = translations[language as keyof typeof translations] || translations.id;

    const currency = financialInput.currency || "IDR";

    const formatCurrency = (value: number) => {
        const locale = currency === "IDR" ? "id-ID" : "en-US";
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        const locale = language === 'id' ? 'id-ID' : 'en-US';
        return new Date(dateString).toLocaleDateString(locale, {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
        });
    }

    useEffect(() => {
        if (authToken) {
            setLoading(true);
            // Only fetch if transaction list is empty or stale? 
            // For simplicity, fetch always for now to ensure sync with this specific type page view
            fetchTransactions(authToken.accessToken, type)
                .then(result => {
                    if (result.success && result.data) {
                        // We need to merge with existing transactions of other types potentially
                        // But simpler approach: fetching by type should update just those in store?
                        // Actually store holds ALL, so fetching filtered list might overwrite others if we just use setTransactions.
                        // A better approach for this simple app: fetch ALL on load once, or just simple list management here.
                        // Let's just fetch all filtering by type and update UI locally? No, store is source of truth.

                        // OPTIMIZATION: To avoid wiping other types, let's just fetch filtered here, 
                        // but for the stores `setTransactions`, we might need logic.
                        // Let's assume we want to view ONLY this type here. 
                        // But wait, the `transactions` in store is global array.
                        // Let's fetch ALL transactions for consistency if we overwrite store.

                        // Revised plan: Fetch just this type and merge into store? Or just list locally?
                        // Let's fetch just this type and Display from props?
                        // Ideally we fetch all transactions generally.

                        // Let's implement fetch ALL logic for simplicity in `useEffect` here if we want to be safe, 
                        // OR just filtering filtering existing store transactions.
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [authToken, type]);

    // Actually, let's just use what's in store and assume it's populated or we populate it.
    // Let's trigger a fetch specific to this type and merge it carefully or just rely on global sync.
    // For MVP: Fetch this type and update store is tricky if store resets.
    // Let's change strategy: fetchTransactions returns array. 
    // Let's just use local state for the list view if we don't want to complicate the global store sync logic right now,
    // OR update global store properly.

    // Let's go with: Load from API on mount, update store. Store contains all.
    // We need an API that returns ALL or we append to store.

    const filteredTransactions = transactions
        .filter(t => t.type === type)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Initial fetch on mount
    useEffect(() => {
        if (authToken && transactions.length === 0) {
            setLoading(true);
            fetchTransactions(authToken.accessToken).then(res => {
                if (res.success && res.data) {
                    setTransactions(res.data);
                }
            }).finally(() => setLoading(false));
        }
    }, [authToken]);


    const handleDelete = async (id: string) => {
        if (!authToken) return;
        if (!confirm(t.confirm_delete_transaction)) return;

        try {
            const result = await deleteTransaction(authToken.accessToken, id);
            if (result.success) {
                removeTransactionFromStore(id);
                toast.success(t.transaction_deleted);
            } else {
                toast.error(t.failed_delete, result.error);
            }
        } catch (e) {
            toast.error(t.error_deleting);
        }
    };

    if (loading && filteredTransactions.length === 0) {
        return <div className="p-8 text-center text-surface-500">{t.loading_transactions}</div>;
    }

    const typeLabel = type === 'income' ? t.income : t.outcome;

    if (filteredTransactions.length === 0) {
        return (
            <Card padding="lg" className="text-center py-12">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${type === 'income' ? 'bg-wealth-100 text-wealth-600' : 'bg-fire-100 text-fire-600'}`}>
                    {type === 'income' ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
                </div>
                <h3 className="text-lg font-medium text-surface-900 dark:text-white">{type === 'income' ? t.no_income_history : t.no_outcome_history}</h3>
                <p className="text-surface-500 dark:text-surface-400 mt-2">{t.start_tracking}</p>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {filteredTransactions.map((tItem) => (
                <Card key={tItem._id} padding="md" className="group">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${type === 'income' ? 'bg-wealth-100 dark:bg-wealth-900/30 text-wealth-600 dark:text-wealth-400' : 'bg-fire-100 dark:bg-fire-900/30 text-fire-600 dark:text-fire-400'}`}>
                                {type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                            </div>
                            <div>
                                <h4 className="font-semibold text-surface-900 dark:text-white">{tItem.category}</h4>
                                <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(tItem.date)}
                                    {tItem.description && <span>• {tItem.description}</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`font-bold font-display ${type === 'income' ? 'text-wealth-600 dark:text-wealth-400' : 'text-fire-600 dark:text-fire-400'}`}>
                                {type === 'income' ? '+' : '-'} {formatCurrency(tItem.amount)}
                            </span>
                            <button
                                onClick={() => handleDelete(tItem._id)}
                                className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title={t.delete}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
