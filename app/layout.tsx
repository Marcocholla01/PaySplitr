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
  generator: "v0.dev",
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
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Payment Distribution Platform",
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
