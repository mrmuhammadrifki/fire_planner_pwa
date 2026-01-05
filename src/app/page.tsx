"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Flame,
  Target,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppStore();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const features = [
    {
      icon: Target,
      title: "FIRE Calculator",
      description:
        "Calculate your personalized FIRE number and see exactly how long until you reach financial independence.",
      color: "fire",
    },
    {
      icon: TrendingUp,
      title: "Wealth Projections",
      description:
        "Visualize your portfolio growth with interactive charts showing compound growth over time.",
      color: "primary",
    },
    {
      icon: Sparkles,
      title: "FIRE Ladder",
      description:
        "Track your progress through Coast FI, Lean FI, Barista FI, and beyond with clear milestones.",
      color: "wealth",
    },
    {
      icon: BookOpen,
      title: "Learn FIRE",
      description:
        "Educational content designed for Gen Z to understand saving rates, compound interest, and more.",
      color: "primary",
    },
  ];

  const stats = [
    { value: "25x", label: "Annual expenses = FIRE number" },
    { value: "4%", label: "Safe withdrawal rate" },
    { value: "10+", label: "Years earlier than traditional retirement" },
  ];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-lg border-b border-surface-200 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-fire-500 to-fire-600 rounded-xl">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg gradient-text-fire">
                FIRE Planner
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="fire">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-primary-500/20 via-primary-500/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-fire-500/20 via-fire-500/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fire-100 dark:bg-fire-900/30 text-fire-700 dark:text-fire-300 text-sm font-medium mb-8 animate-fade-in">
            <Flame className="w-4 h-4" />
            Built for Gen Z Financial Independence
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-surface-900 dark:text-white leading-tight animate-slide-up">
            Your Path to
            <span className="block mt-2 gradient-text">
              Financial Independence
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto animate-slide-up">
            Calculate your FIRE number, track your progress, and learn the
            strategies that will help you retire decades earlier.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link href="/auth/register">
              <Button
                variant="fire"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
              >
                Start Planning Free
              </Button>
            </Link>
            <Link href="/education">
              <Button variant="secondary" size="lg">
                Learn FIRE Basics
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="p-6 rounded-2xl bg-white/50 dark:bg-surface-800/50 backdrop-blur-sm border border-surface-200 dark:border-surface-700 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl font-display font-bold gradient-text-fire">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-surface-500 dark:text-surface-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-surface-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 dark:text-white">
              Everything You Need to Reach FI
            </h2>
            <p className="mt-4 text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
              Powerful tools designed to make financial planning simple, engaging, and actionable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const colorStyles = {
                fire: "bg-fire-100 dark:bg-fire-900/50 text-fire-600 dark:text-fire-400",
                primary: "bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400",
                wealth: "bg-wealth-100 dark:bg-wealth-900/50 text-wealth-600 dark:text-wealth-400",
              };

              return (
                <Card
                  key={feature.title}
                  padding="lg"
                  hover
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
                >
                  <div
                    className={`inline-flex p-3 rounded-xl ${colorStyles[feature.color as keyof typeof colorStyles]
                      }`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-surface-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-surface-600 dark:text-surface-400">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 dark:text-white">
                Built with Your Privacy
                <span className="block gradient-text">in Mind</span>
              </h2>
              <p className="mt-4 text-lg text-surface-600 dark:text-surface-400">
                Your financial data stays on your device. We use local storage
                so you&apos;re always in control of your information.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { icon: Shield, text: "All data stored locally on your device" },
                  { icon: Zap, text: "Works offline as a Progressive Web App" },
                  { icon: Sparkles, text: "No account required to use basic features" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-wealth-100 dark:bg-wealth-900/50 text-wealth-600 dark:text-wealth-400">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-surface-700 dark:text-surface-300">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative card */}
            <div className="relative">
              <div className="gradient-border animate-gradient-x">
                <div className="gradient-border-inner p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🔥</div>
                      <div>
                        <div className="text-2xl font-bold font-display text-fire-500">
                          $1,200,000
                        </div>
                        <div className="text-sm text-surface-500 dark:text-surface-400">
                          Your FIRE Number
                        </div>
                      </div>
                    </div>
                    <div className="h-px bg-surface-200 dark:bg-surface-700" />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-lg font-semibold text-primary-500">
                          15.3 years
                        </div>
                        <div className="text-xs text-surface-500 dark:text-surface-400">
                          Time to FI
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-wealth-500">
                          42%
                        </div>
                        <div className="text-xs text-surface-500 dark:text-surface-400">
                          Saving Rate
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-fire-500 to-fire-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Start Your Journey to Financial Freedom
          </h2>
          <p className="mt-4 text-lg text-fire-100 max-w-2xl mx-auto">
            Join thousands of Gen Z investors who are taking control of their
            financial future. It&apos;s free to get started.
          </p>
          <div className="mt-8">
            <Link href="/auth/register">
              <Button
                variant="secondary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
                className="bg-white text-fire-600 hover:bg-fire-50"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-surface-900 dark:bg-surface-950 text-surface-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-fire-600 rounded-xl">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-white">
                FIRE Planner
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/education" className="hover:text-white transition-colors">
                Education
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
            </div>
            <div className="text-sm">
              © {new Date().getFullYear()} FIRE Planner. Built with 🔥 for Gen Z.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
