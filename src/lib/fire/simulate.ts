/**
 * FIRE Simulation Module
 * Pure TypeScript functions for calculating compound growth and FIRE projections
 */

import { SimulationPoint, SimulationResult, FireLadderLevel } from "@/types";
import { computeFireNumber, computeSavingRate, determineFireLadderLevel } from "./metrics";

export interface SimulatePortfolioParams {
    initial: number;
    monthlyContribution: number;
    annualReturn: number; // percentage, e.g., 7 for 7%
    years: number;
    currentAge: number;
    annualExpense: number;
    safeWithdrawalRate: number;
}

export interface SimulatePortfolioPoint {
    year: number;
    age: number;
    portfolioValue: number;
    totalContributions: number;
    totalGains: number;
    annualContribution: number;
    fireNumber: number;
}

/**
 * Simulates portfolio growth over time with compound interest and monthly contributions
 * Uses monthly compounding for more accurate results
 */
export function simulatePortfolio(
    params: SimulatePortfolioParams
): SimulatePortfolioPoint[] {
    const {
        initial,
        monthlyContribution,
        annualReturn,
        years,
        currentAge,
        annualExpense,
        safeWithdrawalRate,
    } = params;

    const points: SimulatePortfolioPoint[] = [];
    const monthlyReturn = annualReturn / 100 / 12;
    const fireNumber = computeFireNumber(annualExpense, safeWithdrawalRate);

    let currentValue = initial;
    let totalContributions = initial;

    // Add starting point
    points.push({
        year: 0,
        age: currentAge,
        portfolioValue: Math.round(currentValue * 100) / 100,
        totalContributions: Math.round(totalContributions * 100) / 100,
        totalGains: 0,
        annualContribution: monthlyContribution * 12,
        fireNumber,
    });

    // Simulate each year
    for (let year = 1; year <= years; year++) {
        // Compound monthly
        for (let month = 0; month < 12; month++) {
            currentValue = currentValue * (1 + monthlyReturn) + monthlyContribution;
        }

        totalContributions += monthlyContribution * 12;
        const totalGains = currentValue - totalContributions;

        points.push({
            year,
            age: currentAge + year,
            portfolioValue: Math.round(currentValue * 100) / 100,
            totalContributions: Math.round(totalContributions * 100) / 100,
            totalGains: Math.round(totalGains * 100) / 100,
            annualContribution: monthlyContribution * 12,
            fireNumber,
        });
    }

    return points;
}

export interface EstimateYearsToFIParams {
    currentPortfolio: number;
    annualExpense: number;
    safeWithdrawalRate: number; // percentage, e.g., 4 for 4%
    annualReturn: number; // percentage, e.g., 7 for 7%
    annualContribution: number;
}

/**
 * Estimates the number of years until financial independence
 * Returns the number of years (can be fractional)
 */
export function estimateYearsToFI(params: EstimateYearsToFIParams): number {
    const {
        currentPortfolio,
        annualExpense,
        safeWithdrawalRate,
        annualReturn,
        annualContribution,
    } = params;

    const fireNumber = computeFireNumber(annualExpense, safeWithdrawalRate);

    // If already at FI, return 0
    if (currentPortfolio >= fireNumber) {
        return 0;
    }

    // If no positive growth trajectory, return Infinity
    if (annualContribution <= 0 && annualReturn <= 0) {
        return Infinity;
    }

    const r = annualReturn / 100;
    const P = currentPortfolio;
    const C = annualContribution;
    const FV = fireNumber;

    // Use iterative approach for more accuracy
    // FV = P * (1 + r)^n + C * (((1 + r)^n - 1) / r)
    // This is a transcendental equation, so we solve iteratively

    let years = 0;
    let currentValue = P;
    const maxYears = 100;

    while (currentValue < FV && years < maxYears) {
        currentValue = currentValue * (1 + r) + C;
        years++;
    }

    // Refine with fractional year
    if (years > 0 && currentValue >= FV) {
        const prevValue = (currentValue - C) / (1 + r);
        const growthThisYear = FV - prevValue;
        const totalGrowthThisYear = currentValue - prevValue;
        const fraction = growthThisYear / totalGrowthThisYear;
        years = years - 1 + Math.min(1, Math.max(0, fraction));
    }

    return Math.round(years * 10) / 10;
}

export interface RunFullSimulationParams {
    monthlyIncome: number;
    monthlyExpenses: number;
    initialSavings: number;
    currentAge: number;
    targetAge: number;
    annualReturn: number;
    safeWithdrawalRate: number;
}

/**
 * Runs a complete FIRE simulation and returns comprehensive results
 */
export function runFullSimulation(
    params: RunFullSimulationParams
): SimulationResult {
    const {
        monthlyIncome,
        monthlyExpenses,
        initialSavings,
        currentAge,
        targetAge,
        annualReturn,
        safeWithdrawalRate,
    } = params;

    const monthlySavings = calcMonthlySavings(monthlyIncome, monthlyExpenses);
    const annualExpense = monthlyExpenses * 12;
    const annualContribution = monthlySavings * 12;
    const savingRate = computeSavingRate(monthlyIncome, monthlyExpenses);
    const fireNumber = computeFireNumber(annualExpense, safeWithdrawalRate);

    // Calculate years to simulate (at least to target age, or until FI + buffer)
    const yearsToTarget = Math.max(targetAge - currentAge, 0);
    const yearsToSimulate = Math.max(yearsToTarget, 50); // Simulate at least 50 years

    // Run simulation
    const points = simulatePortfolio({
        initial: initialSavings,
        monthlyContribution: monthlySavings,
        annualReturn,
        years: yearsToSimulate,
        currentAge,
        annualExpense,
        safeWithdrawalRate,
    });

    // Estimate years to FI
    const yearsToFI = estimateYearsToFI({
        currentPortfolio: initialSavings,
        annualExpense,
        safeWithdrawalRate,
        annualReturn,
        annualContribution,
    });

    const fireAge = currentAge + yearsToFI;

    // Get the final simulated point
    const finalPoint = points[points.length - 1];

    // Determine FIRE ladder level based on current progress
    const currentProgress = initialSavings / fireNumber;
    const fireLadderLevel = determineFireLadderLevel(
        currentProgress,
        savingRate,
        initialSavings,
        annualExpense
    );

    // Calculate monthly passive income at current portfolio
    const monthlyPassiveIncome =
        (initialSavings * (safeWithdrawalRate / 100)) / 12;

    return {
        points: points as SimulationPoint[],
        yearsToFI,
        fireAge: Math.round(fireAge * 10) / 10,
        fireNumber,
        totalContributions: finalPoint.totalContributions,
        projectedFinalValue: finalPoint.portfolioValue,
        savingRate,
        fireLadderLevel,
        monthlyPassiveIncome: Math.round(monthlyPassiveIncome * 100) / 100,
    };
}

/**
 * Calculates monthly savings from income and expenses
 */
export function calcMonthlySavings(income: number, expenses: number): number {
    return Math.max(0, income - expenses);
}
