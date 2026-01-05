"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-100 dark:bg-red-900/30 mb-6">
                    <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-3">
                    Something went wrong!
                </h1>
                <p className="text-surface-600 dark:text-surface-400 mb-8">
                    We apologize for the inconvenience. An unexpected error occurred.
                </p>
                <Button
                    onClick={reset}
                    variant="secondary"
                    icon={<RefreshCw className="w-4 h-4" />}
                >
                    Try again
                </Button>
            </div>
        </div>
    );
}
