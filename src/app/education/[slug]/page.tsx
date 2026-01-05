"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Share2, BookOpen } from "lucide-react";
import { AppShell } from "@/components/layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getArticleBySlug, educationArticles } from "@/data/education";

export default function EducationArticlePage() {
    const params = useParams();
    const slug = params.slug as string;
    const article = getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    // Get related articles from same category
    const relatedArticles = educationArticles
        .filter((a) => a.category === article.category && a.id !== article.id)
        .slice(0, 2);

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto">
                {/* Back link */}
                <Link
                    href="/education"
                    className="inline-flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400 hover:text-primary-500 mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Education
                </Link>

                {/* Article Header */}
                <Card variant="gradient" padding="lg" className="mb-8">
                    <div className="text-center">
                        <div className="text-6xl mb-4">{article.icon}</div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-surface-900 dark:text-white mb-4">
                            {article.title}
                        </h1>
                        <p className="text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto mb-4">
                            {article.summary}
                        </p>
                        <div className="flex items-center justify-center gap-4 text-sm text-surface-500 dark:text-surface-400">
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {article.readTime} min read
                            </span>
                            <span className="capitalize">• {article.category.replace("-", " ")}</span>
                        </div>
                    </div>
                </Card>

                {/* Article Content */}
                <Card padding="lg" className="mb-8">
                    <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary-500 prose-strong:text-surface-900 dark:prose-strong:text-white prose-code:bg-surface-100 dark:prose-code:bg-surface-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                        {/* Render markdown content - simplified for demo */}
                        <div
                            dangerouslySetInnerHTML={{
                                __html: article.content
                                    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                                    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                                    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                    .replace(/`(.*?)`/g, '<code>$1</code>')
                                    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary-500 pl-4 italic text-surface-600 dark:text-surface-400">$1</blockquote>')
                                    .replace(/^- (.*$)/gim, '<li>$1</li>')
                                    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
                                    .replace(/\n\n/g, '</p><p>')
                                    .replace(/\|(.+)\|/g, (match) => {
                                        const cells = match.split('|').filter(c => c.trim());
                                        return `<tr>${cells.map(c => `<td class="py-2 px-4 border border-surface-200 dark:border-surface-700">${c.trim()}</td>`).join('')}</tr>`;
                                    }),
                            }}
                        />
                    </article>
                </Card>

                {/* Share & Actions */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" icon={<Share2 className="w-4 h-4" />}>
                            Share
                        </Button>
                    </div>
                    <Link href="/planner">
                        <Button variant="fire" size="sm">
                            Apply What You Learned
                        </Button>
                    </Link>
                </div>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-lg font-display font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary-500" />
                            Continue Learning
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {relatedArticles.map((related) => (
                                <Link key={related.id} href={`/education/${related.slug}`}>
                                    <Card padding="md" hover>
                                        <div className="flex gap-3">
                                            <div className="text-3xl">{related.icon}</div>
                                            <div>
                                                <h4 className="font-semibold text-surface-900 dark:text-white">
                                                    {related.title}
                                                </h4>
                                                <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                                                    {related.readTime} min read
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
