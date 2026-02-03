/**
 * Mock API Client
 * This module provides a mock API layer that can be swapped with real API calls later.
 * All functions return Promises to simulate async behavior.
 */

import { ApiResponse } from "@/types";

const API_DELAY = 500; // Simulated network delay

/**
 * Simulates an API delay
 */
export function delay(ms: number = API_DELAY): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a successful API response
 */
export function success<T>(data: T, message?: string): ApiResponse<T> {
    return {
        success: true,
        data,
        message,
    };
}

/**
 * Creates an error API response
 */
export function error<T>(errorMessage: string): ApiResponse<T> {
    return {
        success: false,
        error: errorMessage,
    };
}

/**
 * Base API configuration
 * Replace this with your actual API base URL when integrating with a backend
 */
export const API_CONFIG = {
    baseUrl: "/api",
    timeout: 10000,
};

/**
 * Generic fetch wrapper for real API calls
 * Currently unused but ready for backend integration
 */
export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        const responseData = await response.json();

        // If the response is not OK, we still try to return the error message from the body
        if (!response.ok) {
            return error(responseData.error || responseData.message || "An error occurred");
        }

        // Return the raw response data (which is already in ApiResponse format from our API)
        return responseData as ApiResponse<T>;
    } catch (err) {
        return error(err instanceof Error ? err.message : "Network error");
    }
}
