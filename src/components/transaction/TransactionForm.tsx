"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { useAppStore } from "@/store";
import { addTransaction } from "@/lib/api/transaction";
import { TransactionType } from "@/types";
import { translations } from "@/lib/i18n";

const transactionSchema = z.object({
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Amount must be a positive number",
    }),
    category: z.string().min(1, "Category is required"),
    date: z.string().min(1, "Date is required"),
    description: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
    type: TransactionType;
}

export function TransactionForm({ type }: TransactionFormProps) {
    const { authToken, addTransactionToStore, settings } = useAppStore();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get translations
    const language = settings?.language || 'id'; // Default to Indonesian if not set? Or English? Let's check store default. Store default is often ID based on previous edits.
    const t = translations[language as keyof typeof translations] || translations.id;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
        },
    });

    const onSubmit = async (data: TransactionFormData) => {
        if (!authToken) {
            toast.error(t.login_required_transaction);
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await addTransaction(authToken.accessToken, {
                type,
                amount: Number(data.amount),
                category: data.category,
                date: new Date(data.date),
                description: data.description,
            });

            if (result.success && result.data) {
                addTransactionToStore(result.data);
                toast.success(type === 'income' ? t.income_added : t.outcome_added);
                // Reset form values to initial state
                reset({
                    amount: "",
                    category: "",
                    description: "",
                    date: new Date().toISOString().split("T")[0]
                });
            } else {
                toast.error(t.failed_add_transaction, result.error);
            }
        } catch (error) {
            toast.error(t.unexpected_error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const typeLabel = type === "income" ? t.income : t.outcome;

    return (
        <Card padding="md" className="mb-8">
            <h3 className="text-lg font-semibold mb-4 capitalize">{type === "income" ? t.add_new_income : t.add_new_outcome}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label={t.amount}
                        type="number"
                        {...register("amount")}
                        error={errors.amount?.message}
                        placeholder="0"
                    />
                    <Input
                        label={t.category}
                        {...register("category")}
                        error={errors.category?.message}
                        placeholder={t.category_placeholder}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label={t.date}
                        type="date"
                        {...register("date")}
                        error={errors.date?.message}
                    />
                    <Input
                        label={t.description_optional}
                        {...register("description")}
                        error={errors.description?.message}
                        placeholder={t.description_placeholder}
                    />
                </div>
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        variant={type === "income" ? "wealth" : "fire"}
                        isLoading={isSubmitting}
                        icon={<Plus className="w-4 h-4" />}
                    >
                        {type === "income" ? t.save_income : t.save_outcome}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
