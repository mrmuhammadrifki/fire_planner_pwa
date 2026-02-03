/**
 * Authentication Cookie Utilities
 * Helper functions for managing auth cookies
 */

/**
 * Set auth cookie
 */
export function setAuthCookie(token: string, maxAgeInSeconds: number = 7 * 24 * 60 * 60) {
    if (typeof window === 'undefined') return;

    document.cookie = `fire-planner-auth-token=${token}; path=/; max-age=${maxAgeInSeconds}; SameSite=Lax`;
}

/**
 * Clear auth cookie
 */
export function clearAuthCookie() {
    if (typeof window === 'undefined') return;

    document.cookie = 'fire-planner-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

/**
 * Get auth cookie value
 */
export function getAuthCookie(): string | null {
    if (typeof window === 'undefined') return null;

    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('fire-planner-auth-token='));

    if (!authCookie) return null;

    return authCookie.split('=')[1];
}

/**
 * Check if user is authenticated via cookie
 */
export function isAuthenticatedViaCookie(): boolean {
    return !!getAuthCookie();
}
