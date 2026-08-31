import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Manrope } from "next/font/google";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

import "./globals.css";

/**
 * Manrope carries the entire interface — headings and body alike —
 * per the design system's single-font-family direction. Inter loads
 * alongside purely as the specified fallback family (Manrope is
 * self-hosted via next/font so it's essentially never needed).
 * IBM Plex Mono is unchanged: it's a data/numerals utility font, not
 * part of the visual redesign's color/type-family scope.
 */
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
