"use client";

import { useEffect, ReactNode } from "react";
import { useAppStore } from "@/store";

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const { settings } = useAppStore();

    useEffect(() => {
        const root = document.documentElement;

        if (settings.theme === "system") {
            const systemDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            root.classList.toggle("dark", systemDark);

            const listener = (e: MediaQueryListEvent) => {
                root.classList.toggle("dark", e.matches);
            };

            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            mediaQuery.addEventListener("change", listener);

            return () => mediaQuery.removeEventListener("change", listener);
        } else {
            root.classList.toggle("dark", settings.theme === "dark");
        }
    }, [settings.theme]);

    return <>{children}</>;
}
