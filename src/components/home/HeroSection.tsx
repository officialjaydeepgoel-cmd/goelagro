"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Shield, Users, Star } from "lucide-react";

const floatingWords = [
  "Local Friend", "Travel Buddy", "Shopping Partner",
  "Event Companion", "Study Partner", "Fitness Coach",
  "City Guide", "Language Partner",
];

const stats = [
  { value: "50K+", label: "Active Buddies" },
  { value: "10K+", label: "Daily Bookings" },
  { value: "4.9", label: "Avg Rating" },
  { value: "99%", label: "Safe Platform" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 aurora-bg opacity-30 dark:opacity-40" />
      <div className="absolute inset-0 mesh-gradient" />

      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-brand-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Floating word bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingWords.map((word, i) => (
          <motion.div
            key={word}
            className="absolute px-4 py-2 rounded-2xl glass text-sm font-medium text-surface-700 dark:text-surface-300"
            style={{
              left: `${10 + (i * 12) % 80}%`,
              top: `${15 + (i * 8) % 70}%`,
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 5 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "easeInOut",
            }}
          >
            {word}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-brand-600 dark:text-brand-400 mb-8 border border-brand-200 dark:border-brand-800">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Companion Matching</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-6 text-balance"
        >
          Find Your Perfect
          <br />
          <span className="gradient-text">Companion</span> Instantly
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-surface-600 dark:text-surface-400 max-w-2xl mx-auto mb-10 text-balance"
        >
          Whether you need a travel buddy, study partner, or event companion — 
          our AI matches you with trusted, verified locals in your city.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link href="/search">
            <Button size="xl" className="gap-3 text-base group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Search className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Find Your Buddy</span>
            </Button>
          </Link>
          <Link href="/auth/register?role=partner">
            <Button variant="glass" size="xl" className="text-base gap-2">
              <Users className="w-5 h-5" />
              Become a Partner
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100">
                {stat.value}
              </div>
              <div className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-12"
        >
          {[
            { icon: Shield, text: "Verified Profiles" },
            { icon: Star, text: "Secure Payments" },
            { icon: Users, text: "24/7 Support" },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/40 dark:bg-surface-900/40 backdrop-blur-sm text-xs text-surface-600 dark:text-surface-400 border border-white/20 dark:border-surface-700/30"
            >
              <item.icon className="w-3.5 h-3.5 text-brand-500" />
              <span>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-surface-950 to-transparent" />
    </section>
  );
}
