"use client";

import { useMemo } from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useAppStore } from "@/store";
import { translations } from "@/lib/i18n";

ChartJS.register(ArcElement, Tooltip, Legend);

interface AllocationChartProps {
    contributions: number;
    gains: number;
    currency?: string;
}

export function AllocationChart({ contributions, gains, currency = "IDR" }: AllocationChartProps) {
    const { settings } = useAppStore();
    const t = translations[settings.language || "id"];
    const total = contributions + gains;

    const formatCurrency = (value: number) => {
        const locale = currency === "IDR" ? "id-ID" : "en-US";
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,
            notation: "compact",
            maximumFractionDigits: 1,
        }).format(value);
    };

    const data = useMemo(
        () => ({
            labels: [t.contributions || "Contributions", t.investment_gains || "Investment Gains"],
            datasets: [
                {
                    data: [contributions, gains],
                    backgroundColor: [
                        "rgba(249, 115, 22, 0.8)",
                        "rgba(34, 197, 94, 0.8)",
                    ],
                    borderColor: [
                        "rgb(249, 115, 22)",
                        "rgb(34, 197, 94)",
                    ],
                    borderWidth: 2,
                    hoverOffset: 4,
                },
            ],
        }),
        [contributions, gains, t]
    );

    const options: ChartOptions<"doughnut"> = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            cutout: "70%",
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        usePointStyle: true,
                        pointStyle: "circle",
                        padding: 20,
                        font: {
                            size: 12,
                            family: "Inter",
                        },
                    },
                },
                tooltip: {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    titleFont: {
                        size: 14,
                        family: "Inter",
                    },
                    bodyFont: {
                        size: 13,
                        family: "Inter",
                    },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (context) => {
                            const value = context.raw as number;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${formatCurrency(value)} (${percentage}%)`;
                        },
                    },
                },
            },
        }),
        [total, currency]
    );

    return (
        <div className="h-[300px] w-full flex items-center justify-center">
            <div className="relative w-full max-w-[300px] h-full">
                <Doughnut data={data} options={options} />
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-sm text-surface-500 dark:text-surface-400">{t.total || "Total"}</p>
                    <p className="text-2xl font-bold font-display text-surface-900 dark:text-white">
                        {formatCurrency(total)}
                    </p>
                </div>
            </div>
        </div>
    );
}
