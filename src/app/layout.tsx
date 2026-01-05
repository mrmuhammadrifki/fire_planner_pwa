import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider, StoreProvider } from "@/components/providers";
import { ServiceWorkerRegistration } from "@/components/pwa";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://fireplanner.app"),
  title: "FIRE Planner - Financial Independence Calculator",
  description:
    "Plan your path to Financial Independence and Retire Early. Calculate your FIRE number, track your progress, and learn FIRE principles.",
  keywords: [
    "FIRE",
    "financial independence",
    "retire early",
    "investment calculator",
    "savings calculator",
    "gen z finance",
  ],
  authors: [{ name: "FIRE Planner Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FIRE Planner",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fireplanner.app",
    siteName: "FIRE Planner",
    title: "FIRE Planner - Financial Independence Calculator",
    description:
      "Plan your path to Financial Independence and Retire Early with our free calculator.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FIRE Planner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FIRE Planner",
    description: "Plan your path to Financial Independence and Retire Early",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <StoreProvider>
            <ServiceWorkerRegistration />
            {children}
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
