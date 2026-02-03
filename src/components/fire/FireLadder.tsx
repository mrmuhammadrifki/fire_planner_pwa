"use client";

import { FireLadderLevel } from "@/types";
import { getFireLadderInfo, FIRE_LADDER_LEVELS } from "@/lib/fire/metrics";
import { useAppStore } from "@/store";
import { translations } from "@/lib/i18n";

interface FireLadderProps {
    currentLevel: FireLadderLevel;
    progress: number; // 0-1+ representing progress to FI
}

export function FireLadder({ currentLevel, progress }: FireLadderProps) {
    const { settings } = useAppStore();
    const t = translations[settings.language || "id"];
    const currentLevelInfo = getFireLadderInfo(currentLevel);

    const ladderNameMap: Record<string, string> = {
        "Drowning": t.drowning_name,
        "Surviving": t.surviving_name,
        "CoastFI": t.coast_fi_name,
        "LeanFI": t.lean_fi_name,
        "BaristaFI": t.barista_fi_name,
        "FI": t.fi_name,
        "FatFI": t.fat_fi_name
    };
    const ladderDescMap: Record<string, string> = {
        "Drowning": t.drowning_desc,
        "Surviving": t.surviving_desc,
        "CoastFI": t.coast_fi_desc,
        "LeanFI": t.lean_fi_desc,
        "BaristaFI": t.barista_fi_desc,
        "FI": t.fi_desc,
        "FatFI": t.fat_fi_desc
    };

    return (
        <div className="space-y-6">
            {/* Current Level Display */}
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-surface-100 to-surface-50 dark:from-surface-800 dark:to-surface-900 border border-surface-200 dark:border-surface-700">
                <div className="text-5xl mb-3">{currentLevelInfo.icon}</div>
                <h3
                    className="text-2xl font-bold font-display"
                    style={{ color: currentLevelInfo.color }}
                >
                    {ladderNameMap[currentLevelInfo.level] || currentLevelInfo.name}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-2 max-w-xs mx-auto">
                    {ladderDescMap[currentLevelInfo.level] || currentLevelInfo.description}
                </p>
                <div className="mt-4">
                    <span
                        className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
                        style={{
                            backgroundColor: `${currentLevelInfo.color}20`,
                            color: currentLevelInfo.color,
                        }}
                    >
                        {Math.round(progress * 100)}{t.percent_fi_col || "% to FI"}
                    </span>
                </div>
            </div>

            {/* Ladder Visualization */}
            <div className="relative">
                <div className="space-y-3">
                    {[...FIRE_LADDER_LEVELS].reverse().map((level, index) => {
                        const isCurrentOrPast =
                            FIRE_LADDER_LEVELS.indexOf(getFireLadderInfo(currentLevel)) >=
                            FIRE_LADDER_LEVELS.indexOf(level);
                        const isCurrent = level.level === currentLevel;

                        return (
                            <div
                                key={level.level}
                                className={`
                  relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300
                  ${isCurrent
                                        ? "bg-gradient-to-r from-primary-500/10 to-fire-500/10 border-2"
                                        : isCurrentOrPast
                                            ? "bg-surface-100 dark:bg-surface-800"
                                            : "bg-surface-50 dark:bg-surface-900 opacity-50"
                                    }
                `}
                                style={{
                                    borderColor: isCurrent ? level.color : "transparent",
                                }}
                            >
                                {/* Level icon */}
                                <div
                                    className={`
                    flex items-center justify-center w-12 h-12 rounded-xl text-2xl
                    ${isCurrentOrPast ? "" : "grayscale"}
                  `}
                                    style={{
                                        backgroundColor: isCurrentOrPast
                                            ? `${level.color}20`
                                            : undefined,
                                    }}
                                >
                                    {level.icon}
                                </div>

                                {/* Level info */}
                                <div className="flex-1 min-w-0">
                                    <h4
                                        className={`font-semibold ${isCurrentOrPast
                                            ? "text-surface-900 dark:text-white"
                                            : "text-surface-500 dark:text-surface-500"
                                            }`}
                                    >
                                        {ladderNameMap[level.level] || level.name}
                                    </h4>
                                    <p className="text-sm text-surface-500 dark:text-surface-400 truncate">
                                        {level.threshold > 0
                                            ? `${Math.round(level.threshold * 100)}${t.of_fi_number || "% of FI number"}`
                                            : (t.getting_started || "Getting started")}
                                    </p>
                                </div>

                                {/* Status indicator */}
                                <div className="flex-shrink-0">
                                    {isCurrent ? (
                                        <span
                                            className="px-3 py-1 rounded-full text-xs font-semibold"
                                            style={{
                                                backgroundColor: `${level.color}20`,
                                                color: level.color,
                                            }}
                                        >
                                            {t.current_status || "Current"}
                                        </span>
                                    ) : isCurrentOrPast ? (
                                        <span className="text-wealth-500 text-sm">✓</span>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
