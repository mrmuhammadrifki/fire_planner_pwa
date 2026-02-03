"use client";

import { useEffect, useMemo, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { AppShell } from "@/components/layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, Download, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useAppStore } from "@/store";
import { fetchTransactions } from "@/lib/api/transaction";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { translations } from "@/lib/i18n";

export default function FinancialReportPage() {
    const { authToken, transactions, setTransactions, financialInput, settings } = useAppStore();
    const [loading, setLoading] = useState(false);
    const currency = financialInput.currency || "IDR";

    // Get translations
    const language = settings?.language || 'id';
    const t = translations[language as keyof typeof translations] || translations.id;

    const formatCurrency = (value: number) => {
        const locale = currency === "IDR" ? "id-ID" : "en-US";
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,
            maximumFractionDigits: 0,
        }).format(value);
    };

    useEffect(() => {
        if (authToken && transactions.length === 0) {
            setLoading(true);
            fetchTransactions(authToken.accessToken)
                .then((res) => {
                    if (res.success && res.data) {
                        setTransactions(res.data);
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [authToken]);

    // Calculate Summary Metrics
    const summary = useMemo(() => {
        const totalIncome = transactions
            .filter(t => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);

        const totalOutcome = transactions
            .filter(t => t.type === "outcome")
            .reduce((sum, t) => sum + t.amount, 0);

        const netSavings = totalIncome - totalOutcome;
        const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

        return { totalIncome, totalOutcome, netSavings, savingsRate };
    }, [transactions]);

    // Data for Monthly Chart
    const monthlyData = useMemo(() => {
        const data: Record<string, { name: string; income: number; outcome: number }> = {};
        const locale = language === 'id' ? 'id-ID' : 'en-US';

        transactions.forEach(t => {
            const date = new Date(t.date);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthName = date.toLocaleDateString(locale, { month: 'short', year: 'numeric' });

            if (!data[key]) {
                data[key] = { name: monthName, income: 0, outcome: 0 };
            }

            if (t.type === "income") {
                data[key].income += t.amount;
            } else {
                data[key].outcome += t.amount;
            }
        });

        return Object.values(data).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
    }, [transactions, language]);

    // Data for Category Pie Charts
    const categoryData = useMemo(() => {
        const incomeCats: Record<string, number> = {};
        const outcomeCats: Record<string, number> = {};

        transactions.forEach(t => {
            if (t.type === "income") {
                incomeCats[t.category] = (incomeCats[t.category] || 0) + t.amount;
            } else {
                outcomeCats[t.category] = (outcomeCats[t.category] || 0) + t.amount;
            }
        });

        const incomeData = Object.entries(incomeCats).map(([name, value]) => ({ name, value }));
        const outcomeData = Object.entries(outcomeCats).map(([name, value]) => ({ name, value }));

        return { incomeData, outcomeData };
    }, [transactions]);

    const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

    const downloadPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text(t.financial_report, 14, 22);
        doc.setFontSize(10);
        doc.text(`${t.generated_on}${new Date().toLocaleDateString()}`, 14, 28);

        // Summary
        doc.setFontSize(14);
        doc.text(t.summary, 14, 40);

        const summaryData = [
            [t.total_income, formatCurrency(summary.totalIncome)],
            [t.total_outcome, formatCurrency(summary.totalOutcome)],
            [t.net_savings, formatCurrency(summary.netSavings)],
            [t.saving_rate, `${summary.savingsRate.toFixed(1)}%`]
        ];

        autoTable(doc, {
            startY: 45,
            head: [["Metrik", "Nilai"]], // Could translate "Metric" and "Value" too but not critical. Let's keep existing or use defaults.
            body: summaryData,
            theme: 'grid',
            headStyles: { fillColor: [249, 115, 22] }
        });

        // Transactions Table
        doc.text(t.transaction_history, 14, (doc as any).lastAutoTable.finalY + 15);

        const tableData = transactions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(tItem => [
                new Date(tItem.date).toLocaleDateString(),
                tItem.type === "income" ? t.income : t.outcome,
                tItem.category,
                formatCurrency(tItem.amount),
                tItem.description || "-"
            ]);

        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 20,
            head: [[t.date, t.type, t.category, t.amount, t.description]],
            body: tableData,
            theme: 'striped',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [59, 130, 246] }
        });

        doc.save("financial_report.pdf");
    };

    return (
        <AppShell>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-white flex items-center gap-2">
                            <FileText className="w-8 h-8 text-primary-500" />
                            {t.financial_report}
                        </h1>
                        <p className="text-surface-500 dark:text-surface-400 mt-1">
                            {t.financial_report_desc}
                        </p>
                    </div>
                    <Button onClick={downloadPDF} variant="secondary" icon={<Download className="w-4 h-4" />}>
                        {t.download_pdf}
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card padding="md" variant="glass">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-wealth-100 dark:bg-wealth-900/30 rounded-lg text-wealth-600">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-surface-500">{t.income}</span>
                        </div>
                        <p className="text-2xl font-bold text-surface-900 dark:text-white">
                            {formatCurrency(summary.totalIncome)}
                        </p>
                    </Card>

                    <Card padding="md" variant="glass">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-fire-100 dark:bg-fire-900/30 rounded-lg text-fire-600">
                                <TrendingDown className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-surface-500">{t.outcome}</span>
                        </div>
                        <p className="text-2xl font-bold text-surface-900 dark:text-white">
                            {formatCurrency(summary.totalOutcome)}
                        </p>
                    </Card>

                    <Card padding="md" variant="glass">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-surface-500">{t.net_savings}</span>
                        </div>
                        <p className={`text-2xl font-bold ${summary.netSavings >= 0 ? "text-wealth-600" : "text-fire-600"}`}>
                            {formatCurrency(summary.netSavings)}
                        </p>
                    </Card>

                    <Card padding="md" variant="glass">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-surface-500">{t.saving_rate}</span>
                        </div>
                        <p className="text-2xl font-bold text-surface-900 dark:text-white">
                            {summary.savingsRate.toFixed(1)}%
                        </p>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Trend */}
                    <Card padding="md" className="lg:col-span-2">
                        <h3 className="text-lg font-semibold mb-6 text-surface-900 dark:text-white">{t.monthly_cash_flow}</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="name" />
                                    <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                                    <Tooltip
                                        formatter={(value: any) => [formatCurrency(value), ""]}
                                        contentStyle={{ backgroundColor: 'rgb(30, 41, 59)', color: 'white', border: 'none' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="income" name={t.income} fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="outcome" name={t.outcome} fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Breakdown Pie Charts - Only show if data exists */}
                    {categoryData.outcomeData.length > 0 && (
                        <Card padding="md">
                            <h3 className="text-lg font-semibold mb-4 text-surface-900 dark:text-white">{t.outcome_categories}</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData.outcomeData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {categoryData.outcomeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: any) => formatCurrency(value)} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    )}

                    {categoryData.incomeData.length > 0 && (
                        <Card padding="md">
                            <h3 className="text-lg font-semibold mb-4 text-surface-900 dark:text-white">{t.income_sources}</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData.incomeData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {categoryData.incomeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: any) => formatCurrency(value)} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Transaction Table */}
                <Card padding="md">
                    <h3 className="text-lg font-semibold mb-4 text-surface-900 dark:text-white">{t.transaction_history}</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-200 dark:border-surface-700">
                                    <th className="text-left py-3 px-4 font-medium text-surface-500">{t.date}</th>
                                    <th className="text-left py-3 px-4 font-medium text-surface-500">{t.category}</th>
                                    <th className="text-left py-3 px-4 font-medium text-surface-500">{t.description}</th>
                                    <th className="text-right py-3 px-4 font-medium text-surface-500">{t.amount}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((tItem) => (
                                    <tr key={tItem._id} className="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-900/50">
                                        <td className="py-3 px-4">{new Date(tItem.date).toLocaleDateString()}</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${tItem.type === 'income'
                                                ? 'bg-wealth-100 text-wealth-700 dark:bg-wealth-900/30 dark:text-wealth-400'
                                                : 'bg-fire-100 text-fire-700 dark:bg-fire-900/30 dark:text-fire-400'
                                                }`}>
                                                {tItem.category}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-surface-500">{tItem.description || "-"}</td>
                                        <td className={`py-3 px-4 text-right font-medium ${tItem.type === 'income' ? 'text-wealth-600' : 'text-fire-600'
                                            }`}>
                                            {tItem.type === 'income' ? '+' : '-'} {formatCurrency(tItem.amount)}
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-surface-500">
                                            {t.no_transactions}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AppShell>
    );
}
