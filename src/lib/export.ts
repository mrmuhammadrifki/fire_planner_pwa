import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SimulationResult, UserProfile, FinancialInput } from "@/types";

/**
 * Formats currency for export
 */
const formatCurrency = (value: number, currency: string) => {
    const locale = currency === "IDR" ? "id-ID" : "en-US";
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        maximumFractionDigits: 0,
    }).format(value);
};

/**
 * Export simulation results to CSV
 */
export const exportToCSV = (
    result: SimulationResult,
    financialInput: FinancialInput
) => {
    const currency = financialInput.currency || "IDR";

    // Header based on table columns
    const headers = ["Age", "Portfolio Value", "Total Contributions", "Total Gains", "% to FI"];

    // Data rows
    const rows = result.points.map(point => {
        const progressPct = Math.min(
            (point.portfolioValue / result.fireNumber) * 100,
            100
        ).toFixed(1);

        return [
            point.age,
            point.portfolioValue,
            point.totalContributions,
            point.totalGains,
            `${progressPct}%`
        ].join(",");
    });

    // Combine headers and rows
    const csvContent = [headers.join(","), ...rows].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `fire_planner_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Export simulation results to PDF
 */
export const exportToPDF = (
    result: SimulationResult,
    financialInput: FinancialInput,
    user: UserProfile | null
) => {
    const currency = financialInput.currency || "IDR";
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("FIRE Planner Report", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated for: ${user?.name || "Guest User"}`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 36);

    // Summary Metrics
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Summary", 14, 50);

    const metrics = [
        [`FIRE Number (${currency})`, formatCurrency(result.fireNumber, currency)],
        [`Projected FIRE Age`, `${Math.round(result.fireAge)} years old`],
        [`Years to FI`, result.yearsToFI === Infinity ? "Never" : `${result.yearsToFI.toFixed(1)} years`],
        [`Saving Rate`, `${result.savingRate}%`],
        [`Projected Value`, formatCurrency(result.projectedFinalValue, currency)],
        [`Monthly Passive Income`, formatCurrency(result.monthlyPassiveIncome, currency)]
    ];

    autoTable(doc, {
        startY: 55,
        head: [["Metric", "Value"]],
        body: metrics,
        theme: 'grid',
        headStyles: { fillColor: [14, 165, 233] }, // primary color roughly
        styles: { fontSize: 10 }
    });

    // Detailed Projection Table
    doc.setFontSize(14);
    doc.text("Year-by-Year Projection (Snapshot)", 14, (doc as any).lastAutoTable.finalY + 15);

    const tableData = result.points
        .filter((_, i) => i % 5 === 0 || i === result.points.length - 1) // Every 5 years + last year
        .slice(0, 25) // Limit rows to fit nicely or avoid too many pages for now
        .map(point => {
            const progressPct = Math.min(
                (point.portfolioValue / result.fireNumber) * 100,
                100
            ).toFixed(1);

            return [
                point.age,
                formatCurrency(point.portfolioValue, currency),
                formatCurrency(point.totalContributions, currency),
                formatCurrency(point.totalGains, currency),
                `${progressPct}%`
            ];
        });

    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [["Age", "Portfolio Value", "Contributions", "Gains", "% to FI"]],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [249, 115, 22] }, // fire/orange color roughly
        styles: { fontSize: 9 }
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Created with FIRE Planner App', 14, doc.internal.pageSize.height - 10);
        doc.text('Page ' + i + ' of ' + pageCount, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
    }

    doc.save(`fire_planner_report_${new Date().toISOString().split('T')[0]}.pdf`);
};
