"use client";

import { motion } from "framer-motion";
import { Search, UserCheck, Calendar, CreditCard, MessageCircle, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search & Discover",
    desc: "Browse verified companions by category, city, or let our AI recommend the perfect match.",
    color: "from-brand-500 to-purple-500",
  },
  {
    icon: UserCheck,
    title: "View Profiles",
    desc: "Check reviews, ratings, skills, and availability. Watch intro videos and verify credentials.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Calendar,
    title: "Book Instantly",
    desc: "Select your date, time, and duration. Apply coupons and confirm with one click.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    desc: "Pay securely through our platform. Your money is held safely until the booking completes.",
    color: "from-rose-500 to-orange-500",
  },
  {
    icon: MessageCircle,
    title: "Connect & Chat",
    desc: "Message your companion in real-time. Share updates, locations, and stay connected.",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Star,
    title: "Rate & Review",
    desc: "Share your experience, earn reward points, and help others find great companions.",
    color: "from-amber-500 to-yellow-500",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 md:py-32 bg-surface-50 dark:bg-surface-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Simple Process
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-surface-600 dark:text-surface-400 max-w-xl mx-auto">
            Get started in minutes. Three simple steps to find your perfect companion.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className="glass-card p-8 h-full hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} p-3.5 flex items-center justify-center shadow-lg`}
                  >
                    <step.icon className="w-full h-full text-white" />
                  </div>
                  <span className="text-4xl font-bold text-surface-200 dark:text-surface-700 font-display">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-brand-500/50 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
