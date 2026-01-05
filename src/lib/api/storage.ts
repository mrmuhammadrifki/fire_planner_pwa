/**
 * Mock Storage API
 * Handles persisting user data to localStorage.
 * Can be replaced with IndexedDB or real API calls.
 */

import { FinancialInput, FireTarget, SimulationResult } from "@/types";

const STORAGE_KEYS = {
    USERS: "fire_planner_users",
    FINANCIAL_DATA: "fire_planner_financial",
    FIRE_TARGET: "fire_planner_target",
    SIMULATION: "fire_planner_simulation",
    SETTINGS: "fire_planner_settings",
} as const;

interface StoredUser {
    id: string;
    email: string;
    password: string; // Would be hashed in production
    name: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Gets all stored users (mock database)
 */
export function getStoredUsers(): StoredUser[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
}

/**
 * Finds a user by email
 */
export function findUserByEmail(email: string): StoredUser | undefined {
    const users = getStoredUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Saves a new user
 */
export function saveUser(user: StoredUser): void {
    if (typeof window === "undefined") return;
    const users = getStoredUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

/**
 * Updates an existing user
 */
export function updateUser(
    userId: string,
    updates: Partial<StoredUser>
): StoredUser | null {
    if (typeof window === "undefined") return null;
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) return null;

    users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return users[index];
}

/**
 * Saves financial input data
 */
export function saveFinancialData(data: FinancialInput): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.FINANCIAL_DATA, JSON.stringify(data));
}

/**
 * Gets financial input data
 */
export function getFinancialData(): FinancialInput | null {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(STORAGE_KEYS.FINANCIAL_DATA);
    return data ? JSON.parse(data) : null;
}

/**
 * Saves FIRE target data
 */
export function saveFireTarget(data: FireTarget): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.FIRE_TARGET, JSON.stringify(data));
}

/**
 * Gets FIRE target data
 */
export function getFireTarget(): FireTarget | null {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(STORAGE_KEYS.FIRE_TARGET);
    return data ? JSON.parse(data) : null;
}

/**
 * Saves simulation results
 */
export function saveSimulationResult(data: SimulationResult): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.SIMULATION, JSON.stringify(data));
}

/**
 * Gets simulation results
 */
export function getSimulationResult(): SimulationResult | null {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(STORAGE_KEYS.SIMULATION);
    return data ? JSON.parse(data) : null;
}

/**
 * Clears all stored data for a fresh start
 */
export function clearAllData(): void {
    if (typeof window === "undefined") return;
    Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
    });
}

/**
 * Exports all data as JSON (for backup)
 */
export function exportAllData(): string {
    if (typeof window === "undefined") return "{}";

    const data = {
        financialData: getFinancialData(),
        fireTarget: getFireTarget(),
        simulation: getSimulationResult(),
        exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
}

/**
 * Imports data from JSON backup
 */
export function importData(jsonString: string): boolean {
    if (typeof window === "undefined") return false;

    try {
        const data = JSON.parse(jsonString);

        if (data.financialData) {
            saveFinancialData(data.financialData);
        }
        if (data.fireTarget) {
            saveFireTarget(data.fireTarget);
        }
        if (data.simulation) {
            saveSimulationResult(data.simulation);
        }

        return true;
    } catch {
        return false;
    }
}
