import {
    calcMonthlySavings,
    simulatePortfolio,
    estimateYearsToFI,
    runFullSimulation,
} from "../simulate";
import {
    computeFireNumber,
    computeSavingRate,
    computeCoastFireNumber,
    computeLeanFireNumber,
    computeFatFireNumber,
    computeBaristaFireNumber,
    determineFireLadderLevel,
    futureValue,
    presentValue,
    realReturn,
} from "../metrics";

describe("FIRE Metrics", () => {
    describe("computeFireNumber", () => {
        it("should calculate FIRE number with default 4% SWR", () => {
            expect(computeFireNumber(40000)).toBe(1000000);
            expect(computeFireNumber(60000)).toBe(1500000);
        });

        it("should calculate FIRE number with custom SWR", () => {
            expect(computeFireNumber(40000, 3)).toBe(1333333.33);
            expect(computeFireNumber(40000, 5)).toBe(800000);
        });

        it("should return Infinity for zero or negative SWR", () => {
            expect(computeFireNumber(40000, 0)).toBe(Infinity);
            expect(computeFireNumber(40000, -1)).toBe(Infinity);
        });
    });

    describe("computeSavingRate", () => {
        it("should calculate saving rate correctly", () => {
            expect(computeSavingRate(5000, 3000)).toBe(40);
            expect(computeSavingRate(10000, 5000)).toBe(50);
            expect(computeSavingRate(8000, 6000)).toBe(25);
        });

        it("should return 0 for zero income", () => {
            expect(computeSavingRate(0, 1000)).toBe(0);
        });

        it("should cap at 100% when expenses are negative", () => {
            expect(computeSavingRate(5000, -1000)).toBe(100);
        });

        it("should return 0 when expenses exceed income", () => {
            expect(computeSavingRate(3000, 5000)).toBe(0);
        });
    });

    describe("computeCoastFireNumber", () => {
        it("should calculate Coast FI number", () => {
            // With 7% return over 20 years
            const coastFI = computeCoastFireNumber(1000000, 20, 7);
            expect(coastFI).toBeCloseTo(258419.02, 0);
        });

        it("should return target when years is 0", () => {
            expect(computeCoastFireNumber(1000000, 0, 7)).toBe(1000000);
        });
    });

    describe("computeLeanFireNumber", () => {
        it("should calculate Lean FI as 60% of regular FI", () => {
            expect(computeLeanFireNumber(1000000)).toBe(600000);
        });

        it("should use custom ratio", () => {
            expect(computeLeanFireNumber(1000000, 0.5)).toBe(500000);
        });
    });

    describe("computeFatFireNumber", () => {
        it("should calculate Fat FI as 200% of regular FI", () => {
            expect(computeFatFireNumber(1000000)).toBe(2000000);
        });

        it("should use custom ratio", () => {
            expect(computeFatFireNumber(1000000, 2.5)).toBe(2500000);
        });
    });

    describe("computeBaristaFireNumber", () => {
        it("should calculate Barista FI as 50% of regular FI by default", () => {
            expect(computeBaristaFireNumber(1000000)).toBe(500000);
        });

        it("should use custom work coverage ratio", () => {
            expect(computeBaristaFireNumber(1000000, 0.3)).toBe(700000);
        });
    });

    describe("determineFireLadderLevel", () => {
        it("should return FatFI for 150%+ progress", () => {
            expect(determineFireLadderLevel(1.5, 50, 1500000, 40000)).toBe("FatFI");
            expect(determineFireLadderLevel(2.0, 50, 2000000, 40000)).toBe("FatFI");
        });

        it("should return FI for 100%+ progress", () => {
            expect(determineFireLadderLevel(1.0, 50, 1000000, 40000)).toBe("FI");
            expect(determineFireLadderLevel(1.2, 50, 1200000, 40000)).toBe("FI");
        });

        it("should return BaristaFI for 60%+ progress", () => {
            expect(determineFireLadderLevel(0.6, 30, 600000, 40000)).toBe("BaristaFI");
        });

        it("should return LeanFI for 40%+ progress", () => {
            expect(determineFireLadderLevel(0.4, 30, 400000, 40000)).toBe("LeanFI");
        });

        it("should return CoastFI for 15%+ progress and 20%+ saving rate", () => {
            expect(determineFireLadderLevel(0.2, 25, 200000, 40000)).toBe("CoastFI");
        });

        it("should return Surviving for at least 1 month emergency fund", () => {
            expect(determineFireLadderLevel(0.05, 10, 5000, 40000)).toBe("Surviving");
        });

        it("should return Drowning for no buffer", () => {
            expect(determineFireLadderLevel(0, 5, 100, 40000)).toBe("Drowning");
        });
    });

    describe("futureValue", () => {
        it("should calculate future value correctly", () => {
            // $10,000 at 7% for 10 years
            expect(futureValue(10000, 7, 10)).toBeCloseTo(19671.51, 0);
        });
    });

    describe("presentValue", () => {
        it("should calculate present value correctly", () => {
            // $19,671 in 10 years at 7%
            expect(presentValue(19671, 7, 10)).toBeCloseTo(10000, -2);
        });
    });

    describe("realReturn", () => {
        it("should calculate real return correctly", () => {
            // 7% nominal with 3% inflation
            expect(realReturn(7, 3)).toBeCloseTo(3.88, 0);
        });
    });
});

describe("FIRE Simulation", () => {
    describe("calcMonthlySavings", () => {
        it("should calculate monthly savings correctly", () => {
            expect(calcMonthlySavings(5000, 3000)).toBe(2000);
            expect(calcMonthlySavings(10000, 4000)).toBe(6000);
        });

        it("should return 0 when expenses exceed income", () => {
            expect(calcMonthlySavings(3000, 5000)).toBe(0);
        });
    });

    describe("simulatePortfolio", () => {
        it("should return correct number of points", () => {
            const result = simulatePortfolio({
                initial: 10000,
                monthlyContribution: 500,
                annualReturn: 7,
                years: 10,
                currentAge: 25,
                annualExpense: 40000,
                safeWithdrawalRate: 4,
            });

            expect(result).toHaveLength(11); // Year 0 + 10 years
        });

        it("should start with initial value at year 0", () => {
            const result = simulatePortfolio({
                initial: 10000,
                monthlyContribution: 500,
                annualReturn: 7,
                years: 5,
                currentAge: 25,
                annualExpense: 40000,
                safeWithdrawalRate: 4,
            });

            expect(result[0].portfolioValue).toBe(10000);
            expect(result[0].year).toBe(0);
            expect(result[0].age).toBe(25);
        });

        it("should show portfolio growth over time", () => {
            const result = simulatePortfolio({
                initial: 10000,
                monthlyContribution: 500,
                annualReturn: 7,
                years: 10,
                currentAge: 25,
                annualExpense: 40000,
                safeWithdrawalRate: 4,
            });

            // Each year should have higher value than previous (with positive contributions and returns)
            for (let i = 1; i < result.length; i++) {
                expect(result[i].portfolioValue).toBeGreaterThan(
                    result[i - 1].portfolioValue
                );
            }
        });

        it("should calculate fire number correctly in each point", () => {
            const result = simulatePortfolio({
                initial: 10000,
                monthlyContribution: 500,
                annualReturn: 7,
                years: 5,
                currentAge: 25,
                annualExpense: 40000,
                safeWithdrawalRate: 4,
            });

            // All points should have the same FIRE number
            const expectedFireNumber = 40000 / 0.04; // 1,000,000
            result.forEach((point) => {
                expect(point.fireNumber).toBe(expectedFireNumber);
            });
        });
    });

    describe("estimateYearsToFI", () => {
        it("should return 0 if already at FI", () => {
            const years = estimateYearsToFI({
                currentPortfolio: 1000000,
                annualExpense: 40000,
                safeWithdrawalRate: 4,
                annualReturn: 7,
                annualContribution: 24000,
            });

            expect(years).toBe(0);
        });

        it("should return Infinity if no positive growth", () => {
            const years = estimateYearsToFI({
                currentPortfolio: 10000,
                annualExpense: 40000,
                safeWithdrawalRate: 4,
                annualReturn: 0,
                annualContribution: 0,
            });

            expect(years).toBe(Infinity);
        });

        it("should calculate years correctly for typical scenario", () => {
            const years = estimateYearsToFI({
                currentPortfolio: 50000,
                annualExpense: 40000,
                safeWithdrawalRate: 4,
                annualReturn: 7,
                annualContribution: 24000, // $2k/month
            });

            // Should be roughly 18-22 years with these numbers
            expect(years).toBeGreaterThan(15);
            expect(years).toBeLessThan(25);
        });
    });

    describe("runFullSimulation", () => {
        it("should return complete simulation results", () => {
            const result = runFullSimulation({
                monthlyIncome: 6000,
                monthlyExpenses: 4000,
                initialSavings: 50000,
                currentAge: 25,
                targetAge: 65,
                annualReturn: 7,
                safeWithdrawalRate: 4,
            });

            expect(result).toHaveProperty("points");
            expect(result).toHaveProperty("yearsToFI");
            expect(result).toHaveProperty("fireAge");
            expect(result).toHaveProperty("fireNumber");
            expect(result).toHaveProperty("savingRate");
            expect(result).toHaveProperty("fireLadderLevel");
            expect(result).toHaveProperty("monthlyPassiveIncome");
        });

        it("should calculate correct saving rate", () => {
            const result = runFullSimulation({
                monthlyIncome: 6000,
                monthlyExpenses: 4000,
                initialSavings: 50000,
                currentAge: 25,
                targetAge: 65,
                annualReturn: 7,
                safeWithdrawalRate: 4,
            });

            expect(result.savingRate).toBeCloseTo(33.3, 0);
        });

        it("should calculate correct FIRE number", () => {
            const result = runFullSimulation({
                monthlyIncome: 6000,
                monthlyExpenses: 4000,
                initialSavings: 50000,
                currentAge: 25,
                targetAge: 65,
                annualReturn: 7,
                safeWithdrawalRate: 4,
            });

            // 4000 * 12 = 48000 annual expenses / 0.04 = 1,200,000
            expect(result.fireNumber).toBe(1200000);
        });
    });
});
