import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Lora } from "next/font/google";
import type React from "react";
import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Lora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Payment Distribution Platform",
    template: "%s | PaySplitr",
  },
  description:
    "Secure platform for distributing payment records to distributors",
  keywords: [
    "PaySplitr",
    "payment distribution",
    "distributors",
    "finance",
    "automated payouts",
    "task assignment",
  ],
  icons: {
    icon: "/shield.svg",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  applicationName: "PaySplitr",
  authors: [{ name: "PaySplitr Team", url: "https://paysplitr.com" }],
  generator: "Next.js 15",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://paysplitr.com"
  ),
  openGraph: {
    title: "Payment Distribution Platform",
    description:
      "Secure platform for distributing payment records to distributors",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://paysplitr.com",
    siteName: "PaySplitr",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PaySplitr Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Payment Distribution Platform",
    creator: "@PaySplitr", // change if you have a Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  category: "Finance",
  themeColor: "#0f172a",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <Providers>
          {children}
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
