"use client";

import Link from "next/link";
import { Clock, ArrowRight, BookOpen, Flame } from "lucide-react";
import { AppShell } from "@/components/layout";
import { Card } from "@/components/ui/Card";
import { getEducationArticles } from "@/data/education";
import { useAppStore } from "@/store";
import { translations } from "@/lib/i18n";

export default function EducationPage() {
    const { settings } = useAppStore();
    const language = settings.language || "id";
    const t = translations[language];
    const educationArticles = getEducationArticles(language);

    const categoryLabels: Record<string, { label: string; color: string }> = {
        basics: { label: t.cat_basics || "FIRE Basics", color: "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300" },
        saving: { label: t.cat_saving || "Saving", color: "bg-wealth-100 dark:bg-wealth-900/50 text-wealth-700 dark:text-wealth-300" },
        investing: { label: t.cat_investing || "Investing", color: "bg-fire-100 dark:bg-fire-900/50 text-fire-700 dark:text-fire-300" },
        "fire-strategies": { label: t.cat_strategies || "Strategies", color: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300" },
        lifestyle: { label: t.cat_lifestyle || "Lifestyle", color: "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300" },
    };

    return (
        <AppShell>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-white">
                            {t.learn_fire_title || "Learn FIRE"}
                        </h1>
                    </div>
                    <p className="text-surface-500 dark:text-surface-400">
                        {t.learn_fire_page_subtitle || "Master the principles of Financial Independence with our curated guides"}
                    </p>
                </div>

                {/* Featured Article */}
                <Link href={`/education/${educationArticles[0].slug}`}>
                    <Card variant="gradient" padding="lg" hover className="mb-8 relative overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="text-6xl">{educationArticles[0].icon}</div>
                            <div className="flex-1">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${categoryLabels[educationArticles[0].category].color}`}>
                                    {t.featured || "Featured"} • {categoryLabels[educationArticles[0].category].label}
                                </span>
                                <h2 className="text-xl sm:text-2xl font-display font-bold text-surface-900 dark:text-white mb-2">
                                    {educationArticles[0].title}
                                </h2>
                                <p className="text-surface-600 dark:text-surface-300 mb-4">
                                    {educationArticles[0].summary}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-surface-500 dark:text-surface-400">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {educationArticles[0].readTime} {t.min_read || "min read"}
                                    </span>
                                    <span className="flex items-center gap-1 text-primary-500">
                                        {t.start_reading || "Start reading"}
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-8 -bottom-8 text-9xl opacity-5">
                            🔥
                        </div>
                    </Card>
                </Link>

                {/* Category filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-4 py-2 rounded-full bg-surface-900 dark:bg-white text-white dark:text-surface-900 text-sm font-medium">
                        {t.all_topics || "All Topics"}
                    </span>
                    {Object.entries(categoryLabels).map(([key, { label, color }]) => (
                        <span
                            key={key}
                            className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity ${color}`}
                        >
                            {label}
                        </span>
                    ))}
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {educationArticles.slice(1).map((article) => (
                        <Link key={article.id} href={`/education/${article.slug}`}>
                            <Card padding="md" hover className="h-full">
                                <div className="flex gap-4">
                                    <div className="text-4xl flex-shrink-0">{article.icon}</div>
                                    <div className="flex-1 min-w-0">
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${categoryLabels[article.category].color}`}>
                                            {categoryLabels[article.category].label}
                                        </span>
                                        <h3 className="font-semibold text-surface-900 dark:text-white mb-1 truncate">
                                            {article.title}
                                        </h3>
                                        <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-2">
                                            {article.summary}
                                        </p>
                                        <div className="flex items-center gap-2 mt-3 text-xs text-surface-400 dark:text-surface-500">
                                            <Clock className="w-3 h-3" />
                                            {article.readTime} {t.min_read || "min read"}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Bottom CTA */}
                <Card variant="glass" padding="lg" className="mt-8 text-center">
                    <div className="text-4xl mb-4">🚀</div>
                    <h3 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-2">
                        {t.ready_to_apply || "Ready to apply what you've learned?"}
                    </h3>
                    <p className="text-surface-500 dark:text-surface-400 mb-4">
                        {t.use_calculator_desc || "Use our FIRE calculator to create your personalized financial independence plan."}
                    </p>
                    <Link href="/planner">
                        <button className="btn-fire inline-flex items-center gap-2">
                            <Flame className="w-4 h-4" />
                            {t.start_planning || "Start Planning"}
                        </button>
                    </Link>
                </Card>
            </div>
        </AppShell>
    );
}
