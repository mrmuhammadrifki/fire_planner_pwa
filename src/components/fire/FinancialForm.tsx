"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { plannerFormSchema, PlannerFormData } from "@/lib/validations";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
    Calculator,
    DollarSign,
    TrendingUp,
    Percent,
    User,
    Target,
} from "lucide-react";
import { translations } from "@/lib/i18n";

interface FinancialFormProps {
    onSubmit: () => void;
}

export function FinancialForm({ onSubmit }: FinancialFormProps) {
    const { financialInput, fireTarget, setFinancialInput, setFireTarget, runSimulation, settings } =
        useAppStore();

    const t = translations[settings.language || "id"];
    const currency = financialInput.currency || "IDR";
    const isIDR = currency === "IDR";

    // Currency indicator
    const CurrencyIcon = isIDR
        ? <span className="text-sm font-bold text-surface-500">Rp</span>
        : <DollarSign className="w-4 h-4" />;

    const placeholders = isIDR
        ? { income: "10000000", expenses: "6000000", savings: "50000000" }
        : { income: "5000", expenses: "3000", savings: "10000" };

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PlannerFormData>({
        resolver: zodResolver(plannerFormSchema),
        defaultValues: {
            monthlyIncome: financialInput.monthlyIncome,
            monthlyExpenses: financialInput.monthlyExpenses,
            initialSavings: financialInput.initialSavings,
            currentAge: fireTarget.currentAge,
            targetAge: fireTarget.targetAge,
            annualReturn: fireTarget.annualReturn,
            safeWithdrawalRate: fireTarget.safeWithdrawalRate,
            inflationRate: fireTarget.inflationRate,
        },
    });

    const handleFormSubmit = (data: PlannerFormData) => {
        console.log('📝 Form submitted with data:', data);

        // Update store with new financial data
        setFinancialInput({
            monthlyIncome: data.monthlyIncome,
            monthlyExpenses: data.monthlyExpenses,
            initialSavings: data.initialSavings,
        });

        // Update store with new fire target data
        setFireTarget({
            currentAge: data.currentAge,
            targetAge: data.targetAge,
            annualReturn: data.annualReturn,
            safeWithdrawalRate: data.safeWithdrawalRate,
            inflationRate: data.inflationRate,
        });

        // Run simulation with the new data
        // Using setTimeout to ensure state updates are complete
        setTimeout(() => {
            console.log('🔄 Running simulation after state update...');
            runSimulation();
            onSubmit();
        }, 100);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Financial Inputs */}
            <Card padding="md">
                <CardHeader
                    title={t.financial_details_title}
                    subtitle={`${t.financial_details_subtitle} (${currency})`}
                    icon={<DollarSign className="w-5 h-5" />}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                        name="monthlyIncome"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                label={t.monthly_income}
                                placeholder={placeholders.income}
                                leftIcon={CurrencyIcon}
                                error={errors.monthlyIncome?.message}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                        )}
                    />

                    <Controller
                        name="monthlyExpenses"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                label={t.monthly_expenses}
                                placeholder={placeholders.expenses}
                                leftIcon={CurrencyIcon}
                                error={errors.monthlyExpenses?.message}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                        )}
                    />

                    <Controller
                        name="initialSavings"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                label={t.current_savings_investments}
                                placeholder={placeholders.savings}
                                leftIcon={CurrencyIcon}
                                error={errors.initialSavings?.message}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                        )}
                    />
                </div>
            </Card>

            {/* Age & Target */}
            <Card padding="md">
                <CardHeader
                    title={t.age_and_goals_title}
                    subtitle={t.age_and_goals_subtitle}
                    icon={<Target className="w-5 h-5" />}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                        name="currentAge"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                label={t.current_age_placeholder}
                                placeholder="25"
                                leftIcon={<User className="w-4 h-4" />}
                                error={errors.currentAge?.message}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                        )}
                    />

                    <Controller
                        name="targetAge"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                label={t.target_retire_age_placeholder}
                                placeholder="55"
                                leftIcon={<Target className="w-4 h-4" />}
                                error={errors.targetAge?.message}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                        )}
                    />
                </div>
            </Card>

            {/* Assumptions */}
            <Card padding="md">
                <CardHeader
                    title={t.investment_assumptions_title}
                    subtitle={t.investment_assumptions_subtitle}
                    icon={<TrendingUp className="w-5 h-5" />}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Controller
                        name="annualReturn"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                step="0.1"
                                label={t.annual_return}
                                placeholder="7"
                                leftIcon={<TrendingUp className="w-4 h-4" />}
                                rightIcon={<Percent className="w-4 h-4" />}
                                error={errors.annualReturn?.message}
                                hint="Historical stock market avg: 7-10%"
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                        )}
                    />

                    <Controller
                        name="safeWithdrawalRate"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                step="0.1"
                                label={t.safe_withdrawal_rate}
                                placeholder="4"
                                leftIcon={<Percent className="w-4 h-4" />}
                                error={errors.safeWithdrawalRate?.message}
                                hint="4% is the traditional rule"
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                        )}
                    />

                    <Controller
                        name="inflationRate"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                step="0.1"
                                label={t.inflation_rate}
                                placeholder="3"
                                leftIcon={<Percent className="w-4 h-4" />}
                                error={errors.inflationRate?.message}
                                hint="Historical avg: 2-3%"
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                        )}
                    />
                </div>
            </Card>

            {/* Submit */}
            <div className="flex justify-end">
                <Button
                    type="submit"
                    variant="fire"
                    size="lg"
                    isLoading={isSubmitting}
                    icon={<Calculator className="w-5 h-5" />}
                >
                    {t.run_simulation}
                </Button>
            </div>
        </form>
    );
}
