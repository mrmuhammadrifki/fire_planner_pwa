"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Calculator,
    TrendingUp,
    BookOpen,
    Flame,
    ArrowRight,
    Target,
    Wallet,
    Calendar,
    TrendingDown,
    FileText
} from "lucide-react";
import { useAppStore } from "@/store";
import { AppShell } from "@/components/layout";
import { Button } from "@/components/ui/Button";
import { Card, StatCard } from "@/components/ui/Card";
import { getFireLadderInfo } from "@/lib/fire/metrics";
import { translations } from "@/lib/i18n";
import { fetchTransactions } from "@/lib/api/transaction";

export default function DashboardPage() {
    const router = useRouter();
    const {
        isAuthenticated,
        user,
        financialInput,
        fireTarget,
        simulationResult,
        runSimulation,
        settings,
        transactions,
        setTransactions,
        authToken
    } = useAppStore();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, router]);

    // Fetch transactions
    useEffect(() => {
        if (authToken && transactions.length === 0) {
            fetchTransactions(authToken.accessToken).then(res => {
                if (res.success && res.data) {
                    setTransactions(res.data);
                }
            });
        }
    }, [authToken]);

    // Compute real-time summary for the current month
    const monthlySummary = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const currentMonthTransactions = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
        });

        const totalIncome = currentMonthTransactions
            .filter(t => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);

        const totalOutcome = currentMonthTransactions
            .filter(t => t.type === "outcome")
            .reduce((sum, t) => sum + t.amount, 0);

        return { totalIncome, totalOutcome, net: totalIncome - totalOutcome };
    }, [transactions]);

    // Run simulation if we have data but no result
    useEffect(() => {
        if (!simulationResult && financialInput && fireTarget) {
            runSimulation();
        }
    }, [simulationResult, financialInput, fireTarget, runSimulation]);

    if (!isAuthenticated) {
        return null;
    }

    const t = translations[settings.language || "id"];
    const currency = financialInput.currency || "IDR";

    const formatCurrency = (value: number) => {
        const locale = currency === "IDR" ? "id-ID" : "en-US";
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,
            maximumFractionDigits: 0,
            notation: "compact",
        }).format(value);
    };

    const currentLadderInfo = simulationResult
        ? getFireLadderInfo(simulationResult.fireLadderLevel)
        : null;

    const quickActions = [
        {
            href: "/transaction/income",
            icon: TrendingUp,
            title: t.record_income,
            description: t.record_income_desc,
            color: "wealth",
        },
        {
            href: "/transaction/outcome",
            icon: TrendingDown,
            title: t.record_outcome,
            description: t.record_outcome_desc,
            color: "fire",
        },
        {
            href: "/transaction/report",
            icon: FileText,
            title: t.nav_report, // Reusing existing key or new t.financial_report from i18n
            description: t.analyze_cashflow,
            color: "primary",
        },
    ];

    const colorStyles = {
        fire: "bg-fire-100 dark:bg-fire-900/50 text-fire-600 dark:text-fire-400",
        primary: "bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400",
        wealth: "bg-wealth-100 dark:bg-wealth-900/50 text-wealth-600 dark:text-wealth-400",
    };

    return (
        <AppShell>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Welcome Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-white">
                            {t.welcome}, {user?.name?.split(" ")[0] || t.explorer}! 👋
                        </h1>
                        <p className="text-surface-500 dark:text-surface-400 mt-1">
                            {t.journey_glance}
                        </p>
                    </div>
                    <Link href="/planner">
                        <Button
                            variant="fire"
                            icon={<Calculator className="w-4 h-4" />}
                        >
                            {t.update_plan}
                        </Button>
                    </Link>
                </div>

                {/* FIRE Ladder Status */}
                {/* FIRE Ladder Status */}
                {currentLadderInfo && (
                    <Card variant="gradient" padding="lg" className="relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                            <div className="text-5xl">{currentLadderInfo.icon}</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2
                                        className="text-2xl font-display font-bold"
                                        style={{ color: currentLadderInfo.color }}
                                    >
                                        {/* Translate the ladder name */}
                                        {
                                            ({
                                                "Drowning": t.drowning_name,
                                                "Surviving": t.surviving_name,
                                                "CoastFI": t.coast_fi_name,
                                                "LeanFI": t.lean_fi_name,
                                                "BaristaFI": t.barista_fi_name,
                                                "FI": t.fi_name,
                                                "FatFI": t.fat_fi_name
                                            }[currentLadderInfo.level] || currentLadderInfo.name)
                                        }
                                    </h2>
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-semibold"
                                        style={{
                                            backgroundColor: `${currentLadderInfo.color}20`,
                                            color: currentLadderInfo.color,
                                        }}
                                    >
                                        {t.current_level}
                                    </span>
                                </div>
                                <p className="text-surface-600 dark:text-surface-300">
                                    {/* Translate the ladder description */}
                                    {
                                        ({
                                            "Drowning": t.drowning_desc,
                                            "Surviving": t.surviving_desc,
                                            "CoastFI": t.coast_fi_desc,
                                            "LeanFI": t.lean_fi_desc,
                                            "BaristaFI": t.barista_fi_desc,
                                            "FI": t.fi_desc,
                                            "FatFI": t.fat_fi_desc
                                        }[currentLadderInfo.level] || currentLadderInfo.description)
                                    }
                                </p>
                            </div>
                            <Link href="/results">
                                <Button variant="secondary" size="sm">
                                    {t.view_ladder}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                        <div className="absolute -right-8 -bottom-8 text-9xl opacity-10">
                            🔥
                        </div>
                    </Card>
                )}

                {/* Key Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        label={t.years_to_fi}
                        value={
                            simulationResult
                                ? simulationResult.yearsToFI === Infinity
                                    ? "∞"
                                    : simulationResult.yearsToFI.toFixed(1)
                                : "—"
                        }
                        variant="primary"
                        icon={<Calendar className="w-5 h-5" />}
                    />
                    <StatCard
                        label={t.fire_number}
                        value={simulationResult ? formatCurrency(simulationResult.fireNumber) : "—"}
                        variant="fire"
                        icon={<Target className="w-5 h-5" />}
                    />
                    <StatCard
                        label={t.saving_rate}
                        value={simulationResult ? `${simulationResult.savingRate}%` : "—"}
                        variant="wealth"
                        icon={<Wallet className="w-5 h-5" />}
                    />
                    <StatCard
                        label={t.monthly_savings}
                        value={formatCurrency(
                            monthlySummary.net
                        )}
                        variant="primary"
                        icon={<TrendingUp className="w-5 h-5" />}
                    />
                </div>

                {/* Quick Actions (RESTORED) */}
                <div>
                    <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-4">
                        {t.quick_actions}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {quickActions.map((action) => (
                            <Link key={action.href} href={action.href}>
                                <Card padding="md" hover className="h-full">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`p-3 rounded-xl ${colorStyles[action.color as keyof typeof colorStyles]
                                                }`}
                                        >
                                            <action.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-surface-900 dark:text-white">
                                                {action.title}
                                            </h3>
                                            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                                                {action.description}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-surface-400 dark:text-surface-500" />
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Current Input Summary (RESTORED) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card padding="md">
                        <h3 className="font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-primary-500" />
                            {t.financial_snapshot}
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                                <span className="text-surface-600 dark:text-surface-400">
                                    {t.monthly_income}
                                </span>
                                <span className="font-semibold text-wealth-600 dark:text-wealth-400">
                                    {formatCurrency(monthlySummary.totalIncome)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                                <span className="text-surface-600 dark:text-surface-400">
                                    {t.monthly_expenses}
                                </span>
                                <span className="font-semibold text-fire-600 dark:text-fire-400">
                                    {formatCurrency(monthlySummary.totalOutcome)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                                <span className="text-surface-600 dark:text-surface-400">
                                    {t.current_savings} ({new Date().toLocaleString('default', { month: 'short' })})
                                </span>
                                <span className="font-semibold text-primary-600 dark:text-primary-400">
                                    {formatCurrency(monthlySummary.net)}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <Card padding="md">
                        <h3 className="font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-fire-500" />
                            {t.fire_settings}
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                                <span className="text-surface-600 dark:text-surface-400">
                                    {t.current_age}
                                </span>
                                <span className="font-semibold">
                                    {fireTarget.currentAge} {t.years}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                                <span className="text-surface-600 dark:text-surface-400">
                                    {t.target_age}
                                </span>
                                <span className="font-semibold">
                                    {fireTarget.targetAge} {t.years}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                                <span className="text-surface-600 dark:text-surface-400">
                                    {t.expected_return}
                                </span>
                                <span className="font-semibold text-wealth-600 dark:text-wealth-400">
                                    {fireTarget.annualReturn}%
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Tips Section (RESTORED) */}
                <Card variant="glass" padding="md" className="border-l-4 border-primary-500">
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400">
                            <Flame className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-surface-900 dark:text-white">
                                💡 {t.quick_tip}
                            </h3>
                            <p className="text-surface-600 dark:text-surface-400 mt-1">
                                {t.quick_tip_text}{" "}
                                <Link
                                    href="/education/power-of-saving-rate"
                                    className="text-primary-500 hover:underline"
                                >
                                    {t.saving_rate_guide}
                                </Link>{" "}
                                {t.to_learn_more}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </AppShell>
    );
}
