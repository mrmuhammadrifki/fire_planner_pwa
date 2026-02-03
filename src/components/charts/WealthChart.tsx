"use client";

import { useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { SimulationPoint } from "@/types";
import { useAppStore } from "@/store";
import { translations } from "@/lib/i18n";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface WealthChartProps {
    points: SimulationPoint[];
    fireNumber: number;
    currency?: string;
}

export function WealthChart({ points, fireNumber, currency = "IDR" }: WealthChartProps) {
    const { settings } = useAppStore();
    const t = translations[settings.language || "id"];

    const formatCurrency = (value: number) => {
        const locale = currency === "IDR" ? "id-ID" : "en-US";

        // Handle IDR specifically for cleaner look if needed, or rely on Intl
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,
            notation: "compact",
            maximumFractionDigits: 1,
        }).format(value);
    };

    const data = useMemo(
        () => ({
            labels: points.map((p) => `${t.age_col || "Age"} ${p.age}`),
            datasets: [
                {
                    label: t.portfolio_value || "Portfolio Value",
                    data: points.map((p) => p.portfolioValue),
                    borderColor: "rgb(14, 165, 233)",
                    backgroundColor: "rgba(14, 165, 233, 0.1)",
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: "rgb(14, 165, 233)",
                    pointHoverBorderColor: "#fff",
                    pointHoverBorderWidth: 2,
                },
                {
                    label: t.contributions || "Contributions",
                    data: points.map((p) => p.totalContributions),
                    borderColor: "rgb(249, 115, 22)",
                    backgroundColor: "rgba(249, 115, 22, 0.05)",
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                },
                {
                    label: t.fire_number || "FIRE Number",
                    data: points.map(() => fireNumber),
                    borderColor: "rgb(34, 197, 94)",
                    backgroundColor: "transparent",
                    borderWidth: 2,
                    borderDash: [10, 5],
                    pointRadius: 0,
                },
            ],
        }),
        [points, fireNumber, t]
    );

    const options: ChartOptions<"line"> = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false,
            },
            plugins: {
                legend: {
                    position: "top",
                    align: "end",
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
                            const label = context.dataset.label || "";
                            const value = context.raw as number;
                            return `${label}: ${formatCurrency(value)}`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        font: {
                            size: 11,
                            family: "Inter",
                        },
                        maxTicksLimit: 10,
                    },
                },
                y: {
                    grid: {
                        color: "rgba(0, 0, 0, 0.05)",
                    },
                    ticks: {
                        font: {
                            size: 11,
                            family: "Inter",
                        },
                        callback: (value) => formatCurrency(value as number),
                    },
                },
            },
        }),
        []
    );

    return (
        <div className="h-[400px] w-full">
            <Line data={data} options={options} />
        </div>
    );
}
