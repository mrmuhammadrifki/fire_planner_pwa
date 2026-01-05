"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calculator, Download } from "lucide-react";
import { useAppStore } from "@/store";
import { AppShell } from "@/components/layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { WealthChart, AllocationChart } from "@/components/charts";
import { ResultSummaryCards, FireLadder } from "@/components/fire";

export default function ResultsPage() {
    const router = useRouter();
    const { isAuthenticated, simulationResult, fireTarget, runSimulation, financialInput } = useAppStore();
    const currency = financialInput.currency || "IDR";

    const formatCurrency = (value: number) => {
        const locale = currency === "IDR" ? "id-ID" : "en-US";
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,
            maximumFractionDigits: 0,
        }).format(value);
    };

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (!simulationResult) {
            runSimulation();
        }
    }, [simulationResult, runSimulation]);

    if (!isAuthenticated) {
        return null;
    }

    if (!simulationResult) {
        return (
            <AppShell>
                <div className="max-w-4xl mx-auto text-center py-20">
                    <div className="text-6xl mb-4">📊</div>
                    <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-4">
                        No Simulation Results Yet
                    </h2>
                    <p className="text-surface-500 dark:text-surface-400 mb-8">
                        Run a simulation in the Planner to see your FIRE projections.
                    </p>
                    <Link href="/planner">
                        <Button variant="fire" icon={<Calculator className="w-5 h-5" />}>
                            Go to Planner
                        </Button>
                    </Link>
                </div>
            </AppShell>
        );
    }

    const progress = simulationResult.points[0]
        ? simulationResult.points[0].portfolioValue / simulationResult.fireNumber
        : 0;

    // Get final point for allocation chart
    const finalPoint = simulationResult.points[simulationResult.points.length - 1];

    return (
        <AppShell>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-white">
                            Your FIRE Journey 📈
                        </h1>
                        <p className="text-surface-500 dark:text-surface-400 mt-1">
                            Based on your current financial inputs
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/planner">
                            <Button variant="secondary" icon={<Calculator className="w-4 h-4" />}>
                                Update Inputs
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Summary Cards */}
                <ResultSummaryCards result={simulationResult} currency={currency} />

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Wealth Chart */}
                    <Card padding="md" className="lg:col-span-2">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                                Wealth Projection
                            </h3>
                            <p className="text-sm text-surface-500 dark:text-surface-400">
                                Portfolio growth over time to age {fireTarget.targetAge}
                            </p>
                        </div>
                        <WealthChart
                            points={simulationResult.points.slice(0, fireTarget.targetAge - fireTarget.currentAge + 1)}
                            fireNumber={simulationResult.fireNumber}
                            currency={currency}
                        />
                    </Card>

                    {/* Allocation Chart */}
                    <Card padding="md">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                                Final Breakdown
                            </h3>
                            <p className="text-sm text-surface-500 dark:text-surface-400">
                                Contributions vs. investment gains
                            </p>
                        </div>
                        <AllocationChart
                            contributions={finalPoint.totalContributions}
                            gains={finalPoint.totalGains}
                            currency={currency}
                        />
                    </Card>
                </div>

                {/* FIRE Ladder */}
                <Card padding="lg">
                    <div className="mb-6">
                        <h3 className="text-xl font-display font-bold text-surface-900 dark:text-white">
                            Your FIRE Ladder Progress
                        </h3>
                        <p className="text-surface-500 dark:text-surface-400 mt-1">
                            Track your journey through the stages of financial independence
                        </p>
                    </div>
                    <FireLadder currentLevel={simulationResult.fireLadderLevel} progress={progress} />
                </Card>

                {/* Insights Card */}
                <Card variant="gradient" padding="lg">
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
                        💡 Key Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white/50 dark:bg-surface-800/50">
                            <p className="text-sm text-surface-600 dark:text-surface-300">
                                <strong className="text-surface-900 dark:text-white">Time matters:</strong>{" "}
                                Starting 5 years earlier could mean arriving at FI with{" "}
                                <span className="text-wealth-600 dark:text-wealth-400 font-semibold">
                                    40% more wealth
                                </span>{" "}
                                due to compound growth.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/50 dark:bg-surface-800/50">
                            <p className="text-sm text-surface-600 dark:text-surface-300">
                                <strong className="text-surface-900 dark:text-white">Saving rate power:</strong>{" "}
                                Increasing your saving rate from {simulationResult.savingRate}% to{" "}
                                {Math.min(simulationResult.savingRate + 10, 80)}% could shave{" "}
                                <span className="text-fire-600 dark:text-fire-400 font-semibold">
                                    years off your timeline
                                </span>.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Data Table */}
                <Card padding="md">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                                Year-by-Year Projection
                            </h3>
                            <p className="text-sm text-surface-500 dark:text-surface-400">
                                Detailed breakdown of your portfolio growth
                            </p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-200 dark:border-surface-700">
                                    <th className="text-left py-3 px-4 font-medium text-surface-500 dark:text-surface-400">
                                        Age
                                    </th>
                                    <th className="text-right py-3 px-4 font-medium text-surface-500 dark:text-surface-400">
                                        Portfolio Value
                                    </th>
                                    <th className="text-right py-3 px-4 font-medium text-surface-500 dark:text-surface-400">
                                        Contributions
                                    </th>
                                    <th className="text-right py-3 px-4 font-medium text-surface-500 dark:text-surface-400">
                                        Gains
                                    </th>
                                    <th className="text-center py-3 px-4 font-medium text-surface-500 dark:text-surface-400">
                                        % to FI
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {simulationResult.points
                                    .filter((_, i) => i % 5 === 0 || i === simulationResult.points.length - 1)
                                    .slice(0, 15)
                                    .map((point) => {
                                        const progressPct = Math.min(
                                            (point.portfolioValue / simulationResult.fireNumber) * 100,
                                            100
                                        );
                                        const isFI = point.portfolioValue >= simulationResult.fireNumber;

                                        return (
                                            <tr
                                                key={point.year}
                                                className={`border-b border-surface-100 dark:border-surface-800 ${isFI ? "bg-wealth-50 dark:bg-wealth-900/20" : ""
                                                    }`}
                                            >
                                                <td className="py-3 px-4 font-medium">
                                                    {point.age}
                                                    {isFI && (
                                                        <span className="ml-2 text-xs text-wealth-600 dark:text-wealth-400">
                                                            🎉 FI!
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="text-right py-3 px-4 font-semibold text-primary-600 dark:text-primary-400">
                                                    {formatCurrency(point.portfolioValue)}
                                                </td>
                                                <td className="text-right py-3 px-4 text-fire-600 dark:text-fire-400">
                                                    {formatCurrency(point.totalContributions)}
                                                </td>
                                                <td className="text-right py-3 px-4 text-wealth-600 dark:text-wealth-400">
                                                    {formatCurrency(point.totalGains)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-20 h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all ${isFI
                                                                    ? "bg-wealth-500"
                                                                    : "bg-primary-500"
                                                                    }`}
                                                                style={{ width: `${progressPct}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-medium w-12 text-right">
                                                            {progressPct.toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AppShell>
    );
}
