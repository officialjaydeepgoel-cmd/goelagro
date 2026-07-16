"use client";

import Link from "next/link";
import { Sparkles, Heart, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  Platform: [
    { href: "/search", label: "Find Buddies" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/pricing", label: "Pricing" },
    { href: "/partner/register", label: "Become a Partner" },
  ],
  Support: [
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact Us" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
  Community: [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/careers", label: "Careers" },
    { href: "/press", label: "Press Kit" },
  ],
};

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg rotate-45" />
                <Sparkles className="absolute inset-0 m-auto w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl font-bold">
                Buddy<span className="gradient-text">Verse</span>
              </span>
            </Link>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 max-w-xs">
              Find trusted local companions for every occasion. Your safety and
              satisfaction are our priority.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
                <Mail className="w-4 h-4" />
                <span>hello@buddyverse.ai</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
                <Phone className="w-4 h-4" />
                <span>+91 1800-BUDDY</span>
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-sm text-surface-900 dark:text-surface-100 mb-4 uppercase tracking-wider">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-surface-200 dark:border-surface-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-surface-400 flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />{" "}
              from India. &copy; {new Date().getFullYear()} BuddyVerse AI. All
              rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-surface-400 px-3 py-1 rounded-full bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                Verified Platform
              </span>
              <span className="text-xs text-surface-400 px-3 py-1 rounded-full bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                Secure Payments
              </span>
              <span className="text-xs text-surface-400 px-3 py-1 rounded-full bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                24/7 Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
