import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Public_Sans } from "next/font/google";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

import "./globals.css";

/**
 * Three roles, three faces — Fraunces carries anything editorial
 * (route names, fare headlines), Public Sans runs the interface,
 * IBM Plex Mono renders every number that needs to be scanned and
 * compared (fares, ETAs, distances). Self-hosted via next/font so
 * there is zero layout shift and no third-party request on a
 * network that is frequently 3G.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: "variable",
  axes: ["opsz"],
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "ReturnGo — Every Return Journey Matters",
    template: "%s · ReturnGo",
  },
  description:
    "ReturnGo coordinates travel demand across Coastal Karnataka, matching drivers' empty return legs to passengers already waiting for that exact journey.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${publicSans.variable} ${plexMono.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
