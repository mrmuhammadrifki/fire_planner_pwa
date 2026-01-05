// User Profile
export interface UserProfile {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

// Financial Input Data
export interface FinancialInput {
    monthlyIncome: number;
    monthlyExpenses: number;
    initialSavings: number;
    savingRate: number; // percentage 0-100
    currency: string;
}

// FIRE Target Configuration
export interface FireTarget {
    targetAge: number;
    currentAge: number;
    targetPortfolio: number;
    annualReturn: number; // percentage, e.g., 7 for 7%
    safeWithdrawalRate: number; // percentage, e.g., 4 for 4%
    inflationRate: number; // percentage, e.g., 3 for 3%
}

// Simulation Point (single data point in simulation)
export interface SimulationPoint {
    year: number;
    age: number;
    portfolioValue: number;
    totalContributions: number;
    totalGains: number;
    annualContribution: number;
    fireNumber: number;
}

// Complete Simulation Result
export interface SimulationResult {
    points: SimulationPoint[];
    yearsToFI: number;
    fireAge: number;
    fireNumber: number;
    totalContributions: number;
    projectedFinalValue: number;
    savingRate: number;
    fireLadderLevel: FireLadderLevel;
    monthlyPassiveIncome: number;
}

// FIRE Ladder Levels
export type FireLadderLevel =
    | "Drowning"
    | "Surviving"
    | "CoastFI"
    | "LeanFI"
    | "BaristaFI"
    | "FI"
    | "FatFI";

export interface FireLadderInfo {
    level: FireLadderLevel;
    name: string;
    description: string;
    threshold: number; // percentage of FI number
    color: string;
    icon: string;
}

// Authentication
export interface AuthToken {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// App Settings
export interface AppSettings {
    theme: "light" | "dark" | "system";
    currency: string;
    locale: string;
    language?: "en" | "id";
}

// Chart Data Types
export interface ChartDataPoint {
    label: string;
    value: number;
}

export interface WealthChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
        fill?: boolean;
    }[];
}

// Education Content
export interface EducationArticle {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    category: EducationCategory;
    readTime: number; // minutes
    icon: string;
}

export type EducationCategory =
    | "basics"
    | "saving"
    | "investing"
    | "fire-strategies"
    | "lifestyle";

// Toast/Notification
export interface Toast {
    id: string;
    type: "success" | "error" | "info" | "warning";
    title: string;
    message?: string;
    duration?: number;
}

// Form validation schemas will be in separate file
