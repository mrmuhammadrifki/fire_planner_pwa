"use client";

import Link from "next/link";
import { WifiOff, RefreshCw, Home } from "lucide-react";

export default function OfflineView() {
    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-surface-200 dark:bg-surface-800 mb-6">
                    <WifiOff className="w-10 h-10 text-surface-500 dark:text-surface-400" />
                </div>
                <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-3">
                    You&apos;re Offline
                </h1>
                <p className="text-surface-600 dark:text-surface-400 mb-8">
                    It looks like you&apos;ve lost your internet connection. Don&apos;t worry—your data is saved
                    locally and will sync when you&apos;re back online.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary w-full sm:w-auto"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </button>
                    <Link href="/" className="btn-secondary w-full sm:w-auto">
                        <Home className="w-4 h-4 mr-2" />
                        Go Home
                    </Link>
                </div>

                {/* Tips */}
                <div className="mt-12 p-6 rounded-2xl bg-surface-100 dark:bg-surface-800/50 text-left">
                    <h3 className="font-semibold text-surface-900 dark:text-white mb-3">
                        💡 While you&apos;re offline:
                    </h3>
                    <ul className="text-sm text-surface-600 dark:text-surface-400 space-y-2">
                        <li>• Your financial data is stored locally and safe</li>
                        <li>• You can still view previously loaded pages</li>
                        <li>• Any changes will be available when you reconnect</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
