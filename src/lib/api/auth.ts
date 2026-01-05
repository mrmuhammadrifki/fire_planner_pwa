/**
 * Mock Authentication API
 * Simulates authentication endpoints for development.
 * Replace with real API calls when backend is available.
 */

import { UserProfile, AuthToken, ApiResponse, LoginCredentials, RegisterData } from "@/types";
import { delay, success, error } from "./client";
import { getStoredUsers, saveUser, findUserByEmail } from "./storage";

/**
 * Mock login - validates credentials against localStorage
 */
export async function login(
    credentials: LoginCredentials
): Promise<ApiResponse<{ user: UserProfile; token: AuthToken }>> {
    await delay(800); // Simulate network delay

    const { email, password } = credentials;

    // Find user in mock storage
    const storedUser = findUserByEmail(email);

    if (!storedUser) {
        return error("User not found. Please register first.");
    }

    // Simple password check (in real app, this would be hashed)
    if (storedUser.password !== password) {
        return error("Invalid email or password.");
    }

    // Generate mock token
    const token: AuthToken = {
        accessToken: `mock_access_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        refreshToken: `mock_refresh_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    const user: UserProfile = {
        id: storedUser.id,
        email: storedUser.email,
        name: storedUser.name,
        createdAt: storedUser.createdAt,
        updatedAt: new Date().toISOString(),
    };

    return success({ user, token }, "Login successful!");
}

/**
 * Mock registration - stores user in localStorage
 */
export async function register(
    data: RegisterData
): Promise<ApiResponse<{ user: UserProfile; token: AuthToken }>> {
    await delay(1000); // Simulate network delay

    const { email, password, name } = data;

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
        return error("An account with this email already exists.");
    }

    // Create new user
    const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        email,
        password, // In real app, this would be hashed!
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    // Save to mock storage
    saveUser(newUser);

    // Generate mock token
    const token: AuthToken = {
        accessToken: `mock_access_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        refreshToken: `mock_refresh_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    const user: UserProfile = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
    };

    return success({ user, token }, "Account created successfully!");
}

/**
 * Mock logout - clears token
 */
export async function logout(): Promise<ApiResponse<void>> {
    await delay(300);
    return success(undefined, "Logged out successfully.");
}

/**
 * Mock token refresh
 */
export async function refreshToken(
    refreshToken: string
): Promise<ApiResponse<AuthToken>> {
    await delay(500);

    if (!refreshToken || !refreshToken.startsWith("mock_refresh_")) {
        return error("Invalid refresh token.");
    }

    const newToken: AuthToken = {
        accessToken: `mock_access_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        refreshToken: `mock_refresh_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    return success(newToken);
}

/**
 * Mock password reset request
 */
export async function requestPasswordReset(
    email: string
): Promise<ApiResponse<void>> {
    await delay(1000);

    const user = findUserByEmail(email);
    if (!user) {
        // Don't reveal if user exists
        return success(undefined, "If an account exists, a reset link will be sent.");
    }

    return success(undefined, "Password reset link sent to your email.");
}
