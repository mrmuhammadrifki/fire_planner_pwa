import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for Authentication
 * Runs on server-side before page renders
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get auth token from cookies
    const authToken = request.cookies.get('fire-planner-auth-token');
    const isAuthenticated = !!authToken?.value;

    // Define protected routes
    const protectedRoutes = [
        '/dashboard',
        '/planner',
        '/results',
        '/settings',
        '/education',
        '/transaction',
    ];

    // Check if current path is protected
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    // Public routes (accessible without login)
    const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // Redirect logic
    if (isProtectedRoute && !isAuthenticated) {
        // Redirect to login if trying to access protected route without auth
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname); // Save intended destination
        return NextResponse.redirect(loginUrl);
    }

    if (isPublicRoute && isAuthenticated) {
        // Redirect to dashboard if already logged in and trying to access auth pages
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Special case: redirect root to dashboard if authenticated, otherwise to login
    if (pathname === '/') {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         * - api routes (they handle auth separately)
         */
        '/((?!_next/static|_next/image|favicon.ico|icons|images|manifest.json|sw.js|workbox-.*\\.js|api).*)',
    ],
};
