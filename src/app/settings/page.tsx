"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sun, Moon, Monitor, Trash2, Download, Upload, Globe } from "lucide-react";
import { useAppStore } from "@/store";
import { AppShell } from "@/components/layout";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { exportAllData, clearAllData } from "@/lib/api/storage";
import { translations } from "@/lib/i18n";

export default function SettingsPage() {
    const router = useRouter();
    const { isAuthenticated, settings, setTheme, setCurrency, setLanguage, resetAllData } = useAppStore();
    const toast = useToast();
    const t = translations[settings.language || "id"];

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null;
    }

    const themeOptions = [
        { value: "light", label: t.light, icon: Sun },
        { value: "dark", label: t.dark, icon: Moon },
        { value: "system", label: t.system, icon: Monitor },
    ] as const;

    const currencies = [
        { value: "IDR", label: "Indonesian Rupiah (Rp)" },
        { value: "USD", label: "US Dollar ($)" },
        { value: "EUR", label: "Euro (€)" },
        { value: "GBP", label: "British Pound (£)" },
        { value: "CAD", label: "Canadian Dollar ($)" },
        { value: "AUD", label: "Australian Dollar ($)" },
    ];

    const languages = [
        { value: "en", label: "English" },
        { value: "id", label: "Bahasa Indonesia" },
    ];

    const handleExport = () => {
        const data = exportAllData();
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `fire-planner-backup-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Data exported!", "Your data has been downloaded as a JSON file.");
    };

    const handleImport = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            try {
                const text = await file.text();
                const { importData } = await import("@/lib/api/storage");
                const success = importData(text);
                if (success) {
                    toast.success("Data imported!", "Your data has been restored from the backup.");
                    window.location.reload();
                } else {
                    toast.error("Import failed", "The file format is invalid.");
                }
            } catch {
                toast.error("Import failed", "Could not read the file.");
            }
        };
        input.click();
    };

    const handleReset = () => {
        const confirmMessage = settings.language === 'en'
            ? "Are you sure you want to reset all data? This cannot be undone."
            : "Apakah Anda yakin ingin mereset semua data? Ini tidak dapat dibatalkan.";

        if (window.confirm(confirmMessage)) {
            // Reset data in store
            resetAllData();
            clearAllData();

            // Clear localStorage to remove persisted data
            localStorage.removeItem('fire-planner-storage');

            // Show success message
            toast.success(
                settings.language === 'en' ? "Data reset" : "Data direset",
                settings.language === 'en'
                    ? "All your financial data has been cleared."
                    : "Semua data keuangan Anda telah dihapus."
            );

            // Reload page to ensure fresh state
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    };

    return (
        <AppShell>
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-white">
                        {t.settings} ⚙️
                    </h1>
                    <p className="text-surface-500 dark:text-surface-400 mt-1">
                        {t.customize_experience}
                    </p>
                </div>

                {/* Language Settings */}
                <Card padding="md">
                    <CardHeader
                        title={t.language}
                        subtitle={t.select_language}
                        icon={<Globe className="w-5 h-5" />}
                    />
                    <select
                        value={settings.language || "id"}
                        onChange={(e) => setLanguage(e.target.value as "en" | "id")}
                        className="input"
                    >
                        {languages.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </Card>

                {/* Theme Settings */}
                <Card padding="md">
                    <CardHeader
                        title={t.appearance}
                        subtitle={t.choose_theme}
                        icon={<Sun className="w-5 h-5" />}
                    />
                    <div className="grid grid-cols-3 gap-3">
                        {themeOptions.map((option) => {
                            const isSelected = settings.theme === option.value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => setTheme(option.value)}
                                    className={`
                    flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                    ${isSelected
                                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                                            : "border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600"
                                        }
                  `}
                                >
                                    <option.icon
                                        className={`w-6 h-6 ${isSelected
                                            ? "text-primary-500"
                                            : "text-surface-500 dark:text-surface-400"
                                            }`}
                                    />
                                    <span
                                        className={`text-sm font-medium ${isSelected
                                            ? "text-primary-600 dark:text-primary-400"
                                            : "text-surface-600 dark:text-surface-300"
                                            }`}
                                    >
                                        {option.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </Card>

                {/* Currency Settings */}
                <Card padding="md">
                    <CardHeader
                        title={t.currency}
                        subtitle={t.select_currency}
                        icon={<Globe className="w-5 h-5" />}
                    />
                    <select
                        value={settings.currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="input"
                    >
                        {currencies.map((currency) => (
                            <option key={currency.value} value={currency.value}>
                                {currency.label}
                            </option>
                        ))}
                    </select>
                </Card>

                {/* Data Management */}
                <Card padding="md">
                    <CardHeader
                        title={t.data_management}
                        subtitle={t.export_import_reset}
                        icon={<Download className="w-5 h-5" />}
                    />
                    <div className="space-y-3">
                        <Button
                            variant="secondary"
                            onClick={handleExport}
                            icon={<Download className="w-4 h-4" />}
                            className="w-full justify-start"
                        >
                            {t.export_data}
                            <span className="ml-auto text-xs text-surface-500 dark:text-surface-400">
                                {t.download_json}
                            </span>
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleImport}
                            icon={<Upload className="w-4 h-4" />}
                            className="w-full justify-start"
                        >
                            {t.import_data}
                            <span className="ml-auto text-xs text-surface-500 dark:text-surface-400">
                                {t.restore_backup}
                            </span>
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleReset}
                            icon={<Trash2 className="w-4 h-4" />}
                            className="w-full justify-start"
                        >
                            {t.reset_all_data}
                            <span className="ml-auto text-xs text-red-200">
                                {t.cannot_undo}
                            </span>
                        </Button>
                    </div>
                </Card>

                {/* About */}
                <Card padding="md">
                    <CardHeader title={t.about} subtitle="FIRE Planner PWA" />
                    <div className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
                        <p>
                            <strong className="text-surface-900 dark:text-white">{t.version}:</strong> 1.0.0
                        </p>
                        <p>
                            <strong className="text-surface-900 dark:text-white">{t.data_storage}:</strong> {t.data_storage_text}
                        </p>
                        <p>
                            <strong className="text-surface-900 dark:text-white">{t.privacy}:</strong> {t.privacy_text}
                        </p>
                    </div>
                </Card>

                {/* PWA Info */}
                <Card variant="glass" padding="md" className="border-l-4 border-primary-500">
                    <h3 className="font-semibold text-surface-900 dark:text-white mb-2">
                        📱 {t.install_app}
                    </h3>
                    <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
                        {t.install_app_text}
                    </p>
                    <p className="text-xs text-surface-500 dark:text-surface-500">
                        {t.install_instruction}
                    </p>
                </Card>
            </div>
        </AppShell>
    );
}
