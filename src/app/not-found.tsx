"use client";

import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-surface-200 dark:bg-surface-800 mb-6">
                    <FileQuestion className="w-10 h-10 text-surface-500 dark:text-surface-400" />
                </div>
                <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-3">
                    Page Not Found
                </h1>
                <p className="text-surface-600 dark:text-surface-400 mb-8">
                    The page you are looking for doesn&apos;t exist or has been moved.
                </p>
                <Link href="/">
                    <Button variant="primary" icon={<Home className="w-4 h-4" />}>
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
