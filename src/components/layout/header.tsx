"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/lib/store";
import {
  Menu,
  X,
  Search,
  Bell,
  User,
  ChevronDown,
  Sparkles,
  LogOut,
  Settings,
  LayoutDashboard,
  Heart,
} from "lucide-react";

const navLinks = [
  { href: "/search", label: "Find Buddies" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled || !isHome
          ? "glass-strong shadow-lg shadow-black/5"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 md:w-10 md:h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl rotate-45 group-hover:rotate-[135deg] transition-all duration-500" />
              <Sparkles className="absolute inset-0 m-auto w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <span className="font-display text-xl md:text-2xl font-bold tracking-tight">
              Buddy<span className="gradient-text">Verse</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "text-brand-600 bg-brand-50 dark:bg-brand-950/50"
                    : "text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button className="relative p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                  <Bell className="w-5 h-5 text-surface-600 dark:text-surface-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <Link
                  href={
                    user?.role === "ADMIN"
                      ? "/dashboard/admin"
                      : user?.role === "PARTNER"
                      ? "/dashboard/partner"
                      : "/dashboard/customer"
                  }
                >
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <span className="hidden md:inline text-sm font-medium">
                      {user?.name?.split(" ")[0]}
                    </span>
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="hidden sm:flex">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              {isMobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-surface-200 dark:border-surface-700 glass-strong"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-brand-600 bg-brand-50 dark:bg-brand-950/50"
                      : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-surface-200 dark:border-surface-700" />
              {!isAuthenticated && (
                <div className="flex gap-2 pt-2">
                  <Link
                    href="/auth/login"
                    className="flex-1"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <Button variant="outline" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex-1"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
