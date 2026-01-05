/**
 * FIRE Metrics Module
 * Pure functions for calculating FIRE-related metrics
 */

import { FireLadderLevel, FireLadderInfo } from "@/types";

/**
 * Computes the FIRE number (nest egg needed for financial independence)
 * Based on the 4% rule (or custom SWR)
 *
 * @param annualExpense - Annual living expenses
 * @param safeWithdrawalRate - Safe withdrawal rate as percentage (default 4%)
 * @returns The FIRE number
 */
export function computeFireNumber(
    annualExpense: number,
    safeWithdrawalRate: number = 4
): number {
    if (safeWithdrawalRate <= 0) return Infinity;
    return Math.round((annualExpense / (safeWithdrawalRate / 100)) * 100) / 100;
}

/**
 * Computes the saving rate as a percentage
 *
 * @param income - Monthly or annual income
 * @param expenses - Monthly or annual expenses
 * @returns Saving rate as percentage (0-100)
 */
export function computeSavingRate(income: number, expenses: number): number {
    if (income <= 0) return 0;
    const rate = ((income - expenses) / income) * 100;
    return Math.round(Math.max(0, Math.min(100, rate)) * 10) / 10;
}

/**
 * Computes Coast FI number
 * The amount you need invested now to reach FI at a target age without additional contributions
 *
 * @param targetFireNumber - The target FIRE number
 * @param yearsToTarget - Years until target retirement age
 * @param annualReturn - Expected annual return as percentage
 * @returns Coast FI number
 */
export function computeCoastFireNumber(
    targetFireNumber: number,
    yearsToTarget: number,
    annualReturn: number
): number {
    if (yearsToTarget <= 0) return targetFireNumber;
    const r = annualReturn / 100;
    return Math.round((targetFireNumber / Math.pow(1 + r, yearsToTarget)) * 100) / 100;
}

/**
 * Computes Lean FIRE number (typically 60-70% of regular FIRE)
 * Based on minimal but comfortable living expenses
 *
 * @param regularFireNumber - The regular FIRE number
 * @param leanRatio - Ratio of lean to regular (default 0.6)
 * @returns Lean FIRE number
 */
export function computeLeanFireNumber(
    regularFireNumber: number,
    leanRatio: number = 0.6
): number {
    return Math.round(regularFireNumber * leanRatio * 100) / 100;
}

/**
 * Computes Fat FIRE number (typically 150-200% of regular FIRE)
 * For a more luxurious retirement lifestyle
 *
 * @param regularFireNumber - The regular FIRE number
 * @param fatRatio - Ratio of fat to regular (default 2.0)
 * @returns Fat FIRE number
 */
export function computeFatFireNumber(
    regularFireNumber: number,
    fatRatio: number = 2.0
): number {
    return Math.round(regularFireNumber * fatRatio * 100) / 100;
}

/**
 * Computes Barista FIRE number
 * The amount needed to cover some expenses with part-time work covering the rest
 *
 * @param regularFireNumber - The regular FIRE number
 * @param workCoverageRatio - Portion of expenses covered by part-time work (default 0.5)
 * @returns Barista FIRE number
 */
export function computeBaristaFireNumber(
    regularFireNumber: number,
    workCoverageRatio: number = 0.5
): number {
    return Math.round(regularFireNumber * (1 - workCoverageRatio) * 100) / 100;
}

/**
 * FIRE Ladder Level Definitions
 */
export const FIRE_LADDER_LEVELS: FireLadderInfo[] = [
    {
        level: "Drowning",
        name: "Drowning in Debt",
        description: "Negative net worth or no savings. Focus on building an emergency fund.",
        threshold: -1,
        color: "#ef4444", // red
        icon: "😰",
    },
    {
        level: "Surviving",
        name: "Surviving",
        description: "You have some savings but not enough for emergencies. Keep building!",
        threshold: 0,
        color: "#f97316", // orange
        icon: "💪",
    },
    {
        level: "CoastFI",
        name: "Coast FI",
        description: "Your investments will grow to full FI by retirement age with no more contributions.",
        threshold: 0.15,
        color: "#eab308", // yellow
        icon: "🏄",
    },
    {
        level: "LeanFI",
        name: "Lean FI",
        description: "You can cover basic expenses from investments. Frugal but free!",
        threshold: 0.4,
        color: "#22c55e", // green
        icon: "🌱",
    },
    {
        level: "BaristaFI",
        name: "Barista FI",
        description: "Work part-time for benefits while investments cover most expenses.",
        threshold: 0.6,
        color: "#06b6d4", // cyan
        icon: "☕",
    },
    {
        level: "FI",
        name: "Financial Independence",
        description: "Full FI achieved! Work is now optional.",
        threshold: 1.0,
        color: "#8b5cf6", // violet
        icon: "🎉",
    },
    {
        level: "FatFI",
        name: "Fat FI",
        description: "Abundance mode! Live your best life with room to spare.",
        threshold: 1.5,
        color: "#ec4899", // pink
        icon: "👑",
    },
];

/**
 * Determines the current FIRE ladder level based on progress
 *
 * @param progressRatio - Current portfolio / FIRE number
 * @param savingRate - Current saving rate percentage
 * @param currentSavings - Current portfolio value
 * @param annualExpenses - Annual expenses
 * @returns The FIRE ladder level
 */
export function determineFireLadderLevel(
    progressRatio: number,
    savingRate: number,
    currentSavings: number,
    annualExpenses: number
): FireLadderLevel {
    // Check for Fat FI (150%+ of FI number)
    if (progressRatio >= 1.5) return "FatFI";

    // Check for FI (100%+ of FI number)
    if (progressRatio >= 1.0) return "FI";

    // Check for Barista FI (60%+ of FI number or can cover 50%+ expenses)
    if (progressRatio >= 0.6) return "BaristaFI";

    // Check for Lean FI (40%+ of FI number or can cover basic expenses)
    if (progressRatio >= 0.4) return "LeanFI";

    // Check for Coast FI (enough that growth alone will reach FI)
    // Simplified: if progress > 15% and saving rate > 20%
    if (progressRatio >= 0.15 && savingRate >= 20) return "CoastFI";

    // Check for Surviving (has some emergency fund)
    const emergencyFundMonths = currentSavings / (annualExpenses / 12);
    if (emergencyFundMonths >= 1) return "Surviving";

    // Drowning (no buffer)
    return "Drowning";
}

/**
 * Gets the FIRE ladder info for a given level
 */
export function getFireLadderInfo(level: FireLadderLevel): FireLadderInfo {
    return (
        FIRE_LADDER_LEVELS.find((l) => l.level === level) || FIRE_LADDER_LEVELS[0]
    );
}

/**
 * Calculates the time value of money - future value
 *
 * @param presentValue - Current value
 * @param rate - Annual interest rate as percentage
 * @param periods - Number of years
 * @returns Future value
 */
export function futureValue(
    presentValue: number,
    rate: number,
    periods: number
): number {
    return Math.round(presentValue * Math.pow(1 + rate / 100, periods) * 100) / 100;
}

/**
 * Calculates the present value of a future sum
 *
 * @param futureValue - Future value
 * @param rate - Annual discount rate as percentage
 * @param periods - Number of years
 * @returns Present value
 */
export function presentValue(
    futureVal: number,
    rate: number,
    periods: number
): number {
    return Math.round((futureVal / Math.pow(1 + rate / 100, periods)) * 100) / 100;
}

/**
 * Calculates real return adjusted for inflation
 *
 * @param nominalReturn - Nominal return as percentage
 * @param inflationRate - Inflation rate as percentage
 * @returns Real return as percentage
 */
export function realReturn(nominalReturn: number, inflationRate: number): number {
    const nominal = 1 + nominalReturn / 100;
    const inflation = 1 + inflationRate / 100;
    return Math.round(((nominal / inflation - 1) * 100) * 100) / 100;
}
