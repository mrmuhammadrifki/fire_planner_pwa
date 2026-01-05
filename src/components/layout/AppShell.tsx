"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Flame,
    LayoutDashboard,
    Calculator,
    TrendingUp,
    BookOpen,
    Settings,
    Menu,
    X,
    LogOut,
    Sun,
    Moon,
    Download,
} from "lucide-react";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/Button";
import { translations } from "@/lib/i18n";

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout, settings, setTheme } = useAppStore();
    const t = translations[settings.language || "id"];

    const navItems = [
        { href: "/dashboard", label: t.nav_dashboard, icon: LayoutDashboard },
        { href: "/planner", label: t.nav_planner, icon: Calculator },
        { href: "/results", label: t.nav_results, icon: TrendingUp },
        { href: "/education", label: t.nav_learn, icon: BookOpen },
        { href: "/settings", label: t.nav_settings, icon: Settings },
    ];

    const toggleTheme = () => {
        setTheme(settings.theme === "dark" ? "light" : "dark");
    };

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
            {/* Mobile header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-surface-900/80 backdrop-blur-lg border-b border-surface-200 dark:border-surface-800">
                <div className="flex items-center justify-between px-4 h-16">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-fire-500 to-fire-600 rounded-xl">
                            <Flame className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-display font-bold text-lg">FIRE Planner</span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            {/* Desktop sidebar */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-50 w-72 
          bg-white dark:bg-surface-900 
          border-r border-surface-200 dark:border-surface-800
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-surface-200 dark:border-surface-800">
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-fire-500 to-fire-600 rounded-xl shadow-lg shadow-fire-500/25">
                                <Flame className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="font-display font-bold text-xl gradient-text-fire">
                                    FIRE Planner
                                </span>
                                <p className="text-xs text-surface-500 dark:text-surface-400">
                                    Financial Independence
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium
                    transition-all duration-200
                    ${isActive
                                            ? "bg-gradient-to-r from-primary-500/10 to-primary-500/5 text-primary-600 dark:text-primary-400"
                                            : "text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
                                        }
                  `}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? "text-primary-500" : ""}`} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-surface-200 dark:border-surface-800">
                        {user && (
                            <div className="mb-4 p-3 rounded-xl bg-surface-50 dark:bg-surface-800">
                                <p className="font-medium text-sm text-surface-900 dark:text-white">
                                    {user.name}
                                </p>
                                <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                                    {user.email}
                                </p>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleTheme}
                                className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl
                         bg-surface-100 dark:bg-surface-800 
                         hover:bg-surface-200 dark:hover:bg-surface-700
                         transition-colors"
                                aria-label="Toggle theme"
                            >
                                {settings.theme === "dark" ? (
                                    <Sun className="w-4 h-4 text-fire-500" />
                                ) : (
                                    <Moon className="w-4 h-4 text-primary-500" />
                                )}
                            </button>
                            <Link
                                href="/auth/login"
                                onClick={() => {
                                    logout();
                                    setSidebarOpen(false);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl
                         bg-surface-100 dark:bg-surface-800 
                         hover:bg-red-100 dark:hover:bg-red-900/30
                         text-surface-600 dark:text-surface-300
                         hover:text-red-600 dark:hover:text-red-400
                         transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0">
                <div className="p-4 lg:p-8">{children}</div>
            </main>

            {/* Install PWA Button (shown when available) */}
            <InstallPWAButton />
        </div>
    );
}

function InstallPWAButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstall, setShowInstall] = useState(false);

    // Listen for the beforeinstallprompt event
    if (typeof window !== "undefined") {
        window.addEventListener("beforeinstallprompt", (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstall(true);
        });
    }

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setShowInstall(false);
        }
        setDeferredPrompt(null);
    };

    if (!showInstall) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
            <Button
                variant="fire"
                onClick={handleInstall}
                icon={<Download className="w-4 h-4" />}
                className="shadow-xl"
            >
                Install App
            </Button>
        </div>
    );
}
