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
    Transaction,
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

    // Transaction actions
    transactions: Transaction[];
    setTransactions: (transactions: Transaction[]) => void;
    addTransactionToStore: (transaction: Transaction) => void;
    removeTransactionFromStore: (id: string) => void;

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
            setAuth: (user, token) => {
                // Save to cookies for middleware
                if (typeof window !== 'undefined') {
                    document.cookie = `fire-planner-auth-token=${token.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
                }

                set({
                    isAuthenticated: true,
                    user,
                    authToken: token,
                });
            },

            logout: () => {
                // Clear cookies
                if (typeof window !== 'undefined') {
                    document.cookie = 'fire-planner-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                }

                set({
                    isAuthenticated: false,
                    user: null,
                    authToken: null,
                });
            },

            // Financial data actions
            setFinancialInput: (input) => {
                set((state) => {
                    const newState = {
                        financialInput: { ...state.financialInput, ...input },
                    };

                    // Sync with backend if authenticated
                    const { isAuthenticated, authToken } = state;
                    if (isAuthenticated && authToken) {
                        import("@/lib/api/user").then(({ updateFinancialData }) => {
                            updateFinancialData(authToken.accessToken, {
                                financialInput: newState.financialInput
                            }).catch(console.error);
                        });
                    }

                    return newState;
                });
            },

            setFireTarget: (target) => {
                set((state) => {
                    const newState = {
                        fireTarget: { ...state.fireTarget, ...target },
                    };

                    // Sync with backend if authenticated
                    const { isAuthenticated, authToken } = state;
                    if (isAuthenticated && authToken) {
                        import("@/lib/api/user").then(({ updateFinancialData }) => {
                            updateFinancialData(authToken.accessToken, {
                                fireTarget: newState.fireTarget
                            }).catch(console.error);
                        });
                    }

                    return newState;
                });
            },

            runSimulation: () => {
                const { financialInput, fireTarget } = get();

                // Debug: Log input parameters
                console.log('🔥 Running FIRE Simulation with:', {
                    monthlyIncome: financialInput.monthlyIncome,
                    monthlyExpenses: financialInput.monthlyExpenses,
                    initialSavings: financialInput.initialSavings,
                    currentAge: fireTarget.currentAge,
                    targetAge: fireTarget.targetAge,
                    annualReturn: fireTarget.annualReturn,
                    safeWithdrawalRate: fireTarget.safeWithdrawalRate,
                });

                const result = runFullSimulation({
                    monthlyIncome: financialInput.monthlyIncome,
                    monthlyExpenses: financialInput.monthlyExpenses,
                    initialSavings: financialInput.initialSavings,
                    currentAge: fireTarget.currentAge,
                    targetAge: fireTarget.targetAge,
                    annualReturn: fireTarget.annualReturn,
                    safeWithdrawalRate: fireTarget.safeWithdrawalRate,
                });

                // Debug: Log result
                console.log('📊 Simulation Result:', {
                    yearsToFI: result.yearsToFI,
                    fireAge: result.fireAge,
                    fireNumber: result.fireNumber,
                    savingRate: result.savingRate,
                });

                set({ simulationResult: result });
            },

            clearSimulation: () => set({ simulationResult: null }),

            // Settings actions
            setSettings: (newSettings) =>
                set((state) => {
                    const newState = {
                        settings: { ...state.settings, ...newSettings },
                    };

                    // Sync with backend if authenticated
                    const { isAuthenticated, authToken } = state;
                    if (isAuthenticated && authToken) {
                        import("@/lib/api/user").then(({ updateUserProfile }) => {
                            updateUserProfile(authToken.accessToken, {
                                settings: newState.settings
                            }).catch(console.error);
                        });
                    }

                    return newState;
                }),

            setTheme: (theme) => {
                get().setSettings({ theme });
            },

            setCurrency: (currency) => {
                const { setSettings, setFinancialInput } = get();
                setSettings({
                    currency,
                    locale: currency === "IDR" ? "id-ID" : "en-US"
                });
                setFinancialInput({ currency });
            },

            setLanguage: (language) => {
                get().setSettings({ language });
            },

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

            // Transaction actions
            transactions: [],
            setTransactions: (transactions) => set({ transactions }),
            addTransactionToStore: (transaction) =>
                set((state) => ({ transactions: [transaction, ...state.transactions] })),
            removeTransactionFromStore: (id) =>
                set((state) => ({ transactions: state.transactions.filter(t => t._id !== id) })),

            // Reset
            resetAllData: () =>
                set({
                    financialInput: defaultFinancialInput,
                    fireTarget: defaultFireTarget,
                    simulationResult: null,
                    transactions: [],
                }),
        }),
        {
            name: "fire-planner-storage",
            partialize: (state) => ({
                // Only persist auth and UI settings
                // Financial data should come from MongoDB, not localStorage
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                authToken: state.authToken,
                settings: state.settings,
                // DO NOT persist: financialInput, fireTarget, simulationResult
                // These will be loaded from MongoDB on login
            }),
        }
    )
);
