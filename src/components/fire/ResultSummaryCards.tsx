"use client";

import { SimulationResult } from "@/types";
import { Card } from "@/components/ui/Card";
import { Target, Calendar, TrendingUp, Wallet, Percent, Flame } from "lucide-react";

interface ResultSummaryCardsProps {
    result: SimulationResult;
    currency?: string;
}

export function ResultSummaryCards({
    result,
    currency = "IDR",
}: ResultSummaryCardsProps) {
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
            label: "Years to FI",
            value: result.yearsToFI === Infinity ? "∞" : result.yearsToFI.toFixed(1),
            sublabel: result.yearsToFI === Infinity ? "Not achievable" : "years",
            icon: Calendar,
            color: "primary",
        },
        {
            label: "FIRE Age",
            value:
                result.yearsToFI === Infinity ? "—" : Math.round(result.fireAge).toString(),
            sublabel: "years old",
            icon: Target,
            color: "fire",
        },
        {
            label: "FIRE Number",
            value: formatCurrency(result.fireNumber),
            sublabel: "target portfolio",
            icon: Flame,
            color: "fire",
        },
        {
            label: "Saving Rate",
            value: `${result.savingRate}%`,
            sublabel: "of income saved",
            icon: Percent,
            color: "wealth",
        },
        {
            label: "Projected Value",
            value: formatCurrency(result.projectedFinalValue),
            sublabel: "at target age",
            icon: TrendingUp,
            color: "primary",
        },
        {
            label: "Passive Income",
            value: formatCurrency(result.monthlyPassiveIncome),
            sublabel: "per month (current)",
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
