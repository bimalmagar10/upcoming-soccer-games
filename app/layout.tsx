import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

/** Editorial serif, used for the headline and section titles. */
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
  variable: "--font-display",
});

/** Interface face. Its tabular figures carry the clocks and countdowns. */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Matchday — Upcoming Football Fixtures",
  description:
    "Every upcoming fixture from the Champions League, Premier League, La Liga, Serie A, Bundesliga and more — kickoff times in your own timezone, updating live.",
  keywords: [
    "football fixtures",
    "soccer schedule",
    "Premier League",
    "La Liga",
    "Champions League",
    "upcoming matches",
  ],
  openGraph: {
    title: "Matchday — Upcoming Football Fixtures",
    description:
      "Next kickoffs across the world's major leagues, in your timezone, updating live.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#003738",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
