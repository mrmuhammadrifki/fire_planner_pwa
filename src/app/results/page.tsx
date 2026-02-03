"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calculator, Download, FileText, FileSpreadsheet } from "lucide-react";
import { useAppStore } from "@/store";
import { AppShell } from "@/components/layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { WealthChart, AllocationChart } from "@/components/charts";
import { ResultSummaryCards, FireLadder } from "@/components/fire";
import { exportToCSV, exportToPDF } from "@/lib/export";
import { translations } from "@/lib/i18n";

export default function ResultsPage() {
    const router = useRouter();
    const { isAuthenticated, simulationResult, fireTarget, runSimulation, financialInput, user, settings } = useAppStore();
    const currency = financialInput.currency || "IDR";
    const t = translations[settings.language || "id"];

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

    // Re-run simulation whenever financial inputs or fire targets change
    // This ensures results always reflect the latest data from planner
    useEffect(() => {
        if (isAuthenticated) {
            runSimulation();
        }
    }, [
        isAuthenticated,
        financialInput.monthlyIncome,
        financialInput.monthlyExpenses,
        financialInput.initialSavings,
        fireTarget.currentAge,
        fireTarget.targetAge,
        fireTarget.annualReturn,
        fireTarget.safeWithdrawalRate,
        runSimulation,
    ]);

    const handleExportCSV = () => {
        if (simulationResult) {
            exportToCSV(simulationResult, financialInput);
        }
    };

    const handleExportPDF = () => {
        if (simulationResult) {
            exportToPDF(simulationResult, financialInput, user);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    if (!simulationResult) {
        return (
            <AppShell>
                <div className="max-w-4xl mx-auto text-center py-20">
                    <div className="text-6xl mb-4">📊</div>
                    <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-4">
                        {t.no_simulation || "No Simulation Results Yet"}
                    </h2>
                    <p className="text-surface-500 dark:text-surface-400 mb-8">
                        {t.run_simulation_desc}
                    </p>
                    <Link href="/planner">
                        <Button variant="fire" icon={<Calculator className="w-5 h-5" />}>
                            {t.update_plan}
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
                            {t.your_fire_journey} 📈
                        </h1>
                        <p className="text-surface-500 dark:text-surface-400 mt-1">
                            {t.fire_journey_subtitle}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="ghost" size="sm" onClick={handleExportPDF}>
                            <FileText className="w-4 h-4 mr-2" /> PDF
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleExportCSV}>
                            <FileSpreadsheet className="w-4 h-4 mr-2" /> CSV
                        </Button>
                        <Link href="/planner">
                            <Button variant="secondary" icon={<Calculator className="w-4 h-4" />}>
                                {t.update_plan}
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
                                {t.wealth_projection}
                            </h3>
                            <p className="text-sm text-surface-500 dark:text-surface-400">
                                {t.wealth_projection_subtitle} {fireTarget.targetAge}
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
                                {t.final_breakdown}
                            </h3>
                            <p className="text-sm text-surface-500 dark:text-surface-400">
                                {t.final_breakdown_subtitle}
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
                            {t.fire_ladder_progress}
                        </h3>
                        <p className="text-surface-500 dark:text-surface-400 mt-1">
                            {t.fire_ladder_subtitle}
                        </p>
                    </div>
                    <FireLadder currentLevel={simulationResult.fireLadderLevel} progress={progress} />
                </Card>

                {/* Insights Card */}
                <Card variant="gradient" padding="lg">
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
                        💡 {t.key_insights}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white/50 dark:bg-surface-800/50">
                            <p className="text-sm text-surface-600 dark:text-surface-300">
                                <strong className="text-surface-900 dark:text-white">{t.time_matters_title}</strong>{" "}
                                {t.time_matters_desc}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/50 dark:bg-surface-800/50">
                            <p className="text-sm text-surface-600 dark:text-surface-300">
                                <strong className="text-surface-900 dark:text-white">{t.saving_power_title}</strong>{" "}
                                {t.saving_power_desc}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Data Table */}
                <Card padding="md">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                                {t.year_by_year}
                            </h3>
                            <p className="text-sm text-surface-500 dark:text-surface-400">
                                {t.year_by_year_desc}
                            </p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-200 dark:border-surface-700">
                                    <th className="text-left py-3 px-4 font-medium text-surface-500 dark:text-surface-400">
                                        {t.age_col}
                                    </th>
                                    <th className="text-right py-3 px-4 font-medium text-surface-500 dark:text-surface-400">
                                        {t.portfolio_col}
                                    </th>
                                    <th className="text-right py-3 px-4 font-medium text-surface-500 dark:text-surface-400">
                                        {t.contribution_col}
                                    </th>
                                    <th className="text-right py-3 px-4 font-medium text-surface-500 dark:text-surface-400">
                                        {t.gains_col}
                                    </th>
                                    <th className="text-center py-3 px-4 font-medium text-surface-500 dark:text-surface-400">
                                        {t.percent_fi_col}
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
