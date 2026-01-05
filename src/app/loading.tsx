import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                <p className="text-surface-500 dark:text-surface-400 animate-pulse">
                    Loading FIRE Planner...
                </p>
            </div>
        </div>
    );
}
