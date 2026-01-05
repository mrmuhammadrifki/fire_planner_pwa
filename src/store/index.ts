import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    UserProfile,
    FinancialInput,
    FireTarget,
    SimulationResult,
    AppSettings,
    Toast,
    AuthToken,
} from "@/types";
import { runFullSimulation } from "@/lib/fire";

interface AppState {
    // Auth state
    isAuthenticated: boolean;
    user: UserProfile | null;
    authToken: AuthToken | null;

    // Financial data
    financialInput: FinancialInput;
    fireTarget: FireTarget;
    simulationResult: SimulationResult | null;

    // App settings
    settings: AppSettings;

    // UI state
    toasts: Toast[];
    isLoading: boolean;
    sidebarOpen: boolean;

    // Auth actions
    setAuth: (user: UserProfile, token: AuthToken) => void;
    logout: () => void;

    // Financial data actions
    setFinancialInput: (input: Partial<FinancialInput>) => void;
    setFireTarget: (target: Partial<FireTarget>) => void;
    runSimulation: () => void;
    clearSimulation: () => void;

    // Settings actions
    setSettings: (settings: Partial<AppSettings>) => void;
    setTheme: (theme: "light" | "dark" | "system") => void;
    setCurrency: (currency: string) => void;
    setLanguage: (language: "en" | "id") => void;

    // Toast actions
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;

    // UI actions
    setLoading: (loading: boolean) => void;
    setSidebarOpen: (open: boolean) => void;

    // Reset
    resetAllData: () => void;
}

const defaultFinancialInput: FinancialInput = {
    monthlyIncome: 10000000,
    monthlyExpenses: 6000000,
    initialSavings: 50000000,
    savingRate: 40,
    currency: "IDR",
};

const defaultFireTarget: FireTarget = {
    currentAge: 25,
    targetAge: 55,
    targetPortfolio: 3000000000,
    annualReturn: 7,
    safeWithdrawalRate: 4,
    inflationRate: 3,
};

const defaultSettings: AppSettings = {
    theme: "dark",
    currency: "IDR",
    locale: "id-ID",
    language: "id",
};

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial state
            isAuthenticated: false,
            user: null,
            authToken: null,
            financialInput: defaultFinancialInput,
            fireTarget: defaultFireTarget,
            simulationResult: null,
            settings: defaultSettings,
            toasts: [],
            isLoading: false,
            sidebarOpen: false,

            // Auth actions
            setAuth: (user, token) =>
                set({
                    isAuthenticated: true,
                    user,
                    authToken: token,
                }),

            logout: () =>
                set({
                    isAuthenticated: false,
                    user: null,
                    authToken: null,
                }),

            // Financial data actions
            setFinancialInput: (input) =>
                set((state) => ({
                    financialInput: { ...state.financialInput, ...input },
                })),

            setFireTarget: (target) =>
                set((state) => ({
                    fireTarget: { ...state.fireTarget, ...target },
                })),

            runSimulation: () => {
                const { financialInput, fireTarget } = get();
                const result = runFullSimulation({
                    monthlyIncome: financialInput.monthlyIncome,
                    monthlyExpenses: financialInput.monthlyExpenses,
                    initialSavings: financialInput.initialSavings,
                    currentAge: fireTarget.currentAge,
                    targetAge: fireTarget.targetAge,
                    annualReturn: fireTarget.annualReturn,
                    safeWithdrawalRate: fireTarget.safeWithdrawalRate,
                });
                set({ simulationResult: result });
            },

            clearSimulation: () => set({ simulationResult: null }),

            // Settings actions
            setSettings: (newSettings) =>
                set((state) => ({
                    settings: { ...state.settings, ...newSettings },
                })),

            setTheme: (theme) =>
                set((state) => ({
                    settings: { ...state.settings, theme },
                })),

            setCurrency: (currency) =>
                set((state) => ({
                    settings: { ...state.settings, currency, locale: currency === "IDR" ? "id-ID" : "en-US" },
                    financialInput: { ...state.financialInput, currency },
                })),

            setLanguage: (language) =>
                set((state) => ({
                    settings: { ...state.settings, language },
                })),

            // Toast actions
            addToast: (toast) =>
                set((state) => ({
                    toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
                })),

            removeToast: (id) =>
                set((state) => ({
                    toasts: state.toasts.filter((t) => t.id !== id),
                })),

            // UI actions
            setLoading: (isLoading) => set({ isLoading }),
            setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

            // Reset
            resetAllData: () =>
                set({
                    financialInput: defaultFinancialInput,
                    fireTarget: defaultFireTarget,
                    simulationResult: null,
                }),
        }),
        {
            name: "fire-planner-storage",
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                authToken: state.authToken,
                financialInput: state.financialInput,
                fireTarget: state.fireTarget,
                simulationResult: state.simulationResult,
                settings: state.settings,
            }),
        }
    )
);
