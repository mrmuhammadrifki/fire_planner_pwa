"use client";

import { SimulationResult } from "@/types";
import { Card } from "@/components/ui/Card";
import { Target, Calendar, TrendingUp, Wallet, Percent, Flame } from "lucide-react";
import { useAppStore } from "@/store";
import { translations } from "@/lib/i18n";

interface ResultSummaryCardsProps {
    result: SimulationResult;
    currency?: string;
}

export function ResultSummaryCards({
    result,
    currency = "IDR",
}: ResultSummaryCardsProps) {
    const { settings } = useAppStore();
    const t = translations[settings.language || "id"];

    const formatCurrency = (value: number) => {
        const locale = currency === "IDR" ? "id-ID" : "en-US";

        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,
            notation: "compact",
            maximumFractionDigits: 1,
        }).format(value);
    };

    const cards = [
        {
            label: t.years_to_fi,
            value: result.yearsToFI === Infinity ? "∞" : result.yearsToFI.toFixed(1),
            sublabel: result.yearsToFI === Infinity ? (t.not_achievable || "Not achievable") : t.years,
            icon: Calendar,
            color: "primary",
        },
        {
            label: t.fire_age,
            value:
                result.yearsToFI === Infinity ? "—" : Math.round(result.fireAge).toString(),
            sublabel: t.years_old || "years old",
            icon: Target,
            color: "fire",
        },
        {
            label: t.fire_number,
            value: formatCurrency(result.fireNumber),
            sublabel: t.target_portfolio || "target portfolio",
            icon: Flame,
            color: "fire",
        },
        {
            label: t.saving_rate,
            value: `${result.savingRate}%`,
            sublabel: t.of_income_saved || "of income saved",
            icon: Percent,
            color: "wealth",
        },
        {
            label: t.projected_value,
            value: formatCurrency(result.projectedFinalValue),
            sublabel: t.at_target_age,
            icon: TrendingUp,
            color: "primary",
        },
        {
            label: t.passive_income,
            value: formatCurrency(result.monthlyPassiveIncome),
            sublabel: t.per_month_current,
            icon: Wallet,
            color: "wealth",
        },
    ];

    const colorStyles = {
        primary: {
            icon: "bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400",
            value: "text-primary-600 dark:text-primary-400",
        },
        fire: {
            icon: "bg-fire-100 dark:bg-fire-900/50 text-fire-600 dark:text-fire-400",
            value: "text-fire-600 dark:text-fire-400",
        },
        wealth: {
            icon: "bg-wealth-100 dark:bg-wealth-900/50 text-wealth-600 dark:text-wealth-400",
            value: "text-wealth-600 dark:text-wealth-400",
        },
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => {
                const style = colorStyles[card.color as keyof typeof colorStyles];
                return (
                    <Card key={card.label} variant="glass" padding="md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
                                    {card.label}
                                </p>
                                <p className={`text-2xl lg:text-3xl font-bold font-display mt-1 ${style.value}`}>
                                    {card.value}
                                </p>
                                <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
                                    {card.sublabel}
                                </p>
                            </div>
                            <div className={`p-2.5 rounded-xl ${style.icon}`}>
                                <card.icon className="w-5 h-5" />
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
