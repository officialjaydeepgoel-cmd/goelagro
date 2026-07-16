"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Plane,
  ShoppingBag,
  Calendar,
  BookOpen,
  Briefcase,
  Globe,
  Dumbbell,
  HeartHandshake,
  Stethoscope,
  MapPin,
  ArrowRight,
} from "lucide-react";

const categories = [
  { icon: Users, label: "Local Friend", desc: "Explore the city together", color: "from-blue-500 to-cyan-500" },
  { icon: Plane, label: "Travel Buddy", desc: "Share your journey", color: "from-emerald-500 to-teal-500" },
  { icon: ShoppingBag, label: "Shopping Buddy", desc: "Shop with company", color: "from-pink-500 to-rose-500" },
  { icon: Calendar, label: "Event Companion", desc: "Never go alone", color: "from-purple-500 to-violet-500" },
  { icon: BookOpen, label: "Study Partner", desc: "Learn together", color: "from-amber-500 to-orange-500" },
  { icon: Briefcase, label: "Business Network", desc: "Expand your network", color: "from-slate-500 to-gray-500" },
  { icon: Globe, label: "Language Partner", desc: "Practice languages", color: "from-indigo-500 to-blue-500" },
  { icon: Dumbbell, label: "Fitness Partner", desc: "Stay fit together", color: "from-green-500 to-lime-500" },
  { icon: HeartHandshake, label: "Senior Assistance", desc: "Care & company", color: "from-red-500 to-rose-500" },
  { icon: Stethoscope, label: "Hospital Companion", desc: "Support when needed", color: "from-teal-500 to-cyan-500" },
  { icon: MapPin, label: "City Guide", desc: "Discover hidden gems", color: "from-violet-500 to-purple-500" },
];

export function CategoriesSection() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Categories
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-4">
            Find Your Perfect{" "}
            <span className="gradient-text">Match</span>
          </h2>
          <p className="text-surface-600 dark:text-surface-400 max-w-xl mx-auto">
            Choose from a wide range of companion categories, each designed for
            your specific needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, i) => (
            <motion.div
              key={category.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Link
                href={`/search?category=${category.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="group glass-card p-5 flex flex-col items-center text-center gap-3 h-full hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${category.color} p-2.5 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <category.icon className="w-full h-full text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-surface-900 dark:text-surface-100">
                    {category.label}
                  </h3>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                    {category.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors group"
          >
            View All Categories
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
