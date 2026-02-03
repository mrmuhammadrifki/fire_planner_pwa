/**
 * Real Authentication API
 * Connects to MongoDB via Next.js API Routes.
 */

import { UserProfile, AuthToken, ApiResponse, LoginCredentials, RegisterData, FinancialInput, FireTarget } from "@/types";
import { apiFetch, success, error } from "./client";

/**
 * Login user via API
 */
export async function login(
    credentials: LoginCredentials
): Promise<ApiResponse<{
    user: UserProfile;
    token: AuthToken;
    financialInput?: FinancialInput;
    fireTarget?: FireTarget;
}>> {
    return apiFetch<{
        user: UserProfile;
        token: AuthToken;
        financialInput?: FinancialInput;
        fireTarget?: FireTarget;
    }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
    });
}

/**
 * Register new user via API
 */
export async function register(
    data: RegisterData
): Promise<ApiResponse<{ user: UserProfile; token: AuthToken }>> {
    return apiFetch<{ user: UserProfile; token: AuthToken }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

/**
 * Logout - mostly client side, but could tell server to invalidate token
 */
export async function logout(): Promise<ApiResponse<void>> {
    // In a stateless JWT setup, we just return success
    return success(undefined, "Logged out successfully.");
}

/**
 * Refresh token
 */
export async function refreshToken(
    refreshToken: string
): Promise<ApiResponse<AuthToken>> {
    // Implementing refresh logic if needed
    // For now, return mock success or not implemented
    // The current simplified backend implementation issues long-lived tokens
    return error("Refresh token not implemented in MVP");
}

/**
 * Request password reset
 */
export async function requestPasswordReset(
    email: string
): Promise<ApiResponse<void>> {
    // TODO: Implement backend endpoint for password reset
    return success(undefined, "If an account exists, a reset link will be sent.");
}
