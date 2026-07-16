import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "@/components/layout/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const calSans = localFont({
  src: "../fonts/CalSans-SemiBold.woff2",
  variable: "--font-cal-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "BuddyVerse AI — Find Trusted Local Companions Instantly",
    template: "%s | BuddyVerse AI",
  },
  description:
    "Discover trusted local companions for every occasion. From travel buddies to study partners, connect with verified companions in your city.",
  keywords: [
    "local companion",
    "travel buddy",
    "friend finder",
    "event companion",
    "study partner",
    "AI matching",
  ],
  authors: [{ name: "BuddyVerse AI" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "BuddyVerse AI",
    title: "BuddyVerse AI — Find Trusted Local Companions Instantly",
    description:
      "Discover trusted local companions for every occasion. From travel buddies to study partners, connect with verified companions in your city.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BuddyVerse AI — Find Trusted Local Companions Instantly",
    description:
      "Discover trusted local companions for every occasion. From travel buddies to study partners, connect with verified companions in your city.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BuddyVerse AI",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${calSans.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
