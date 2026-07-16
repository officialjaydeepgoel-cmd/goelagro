"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    desc: "Perfect for getting started",
    features: [
      "Browse companions",
      "Basic search filters",
      "Standard support",
      "Email notifications",
    ],
    cta: "Get Started",
    href: "/auth/register",
    popular: false,
  },
  {
    name: "Pro",
    price: "\u20B9499",
    period: "/month",
    desc: "For regular users",
    features: [
      "AI-powered matching",
      "Advanced search filters",
      "Priority support",
      "Unlimited messaging",
      "Reward points 2x",
      "Cancel anytime",
    ],
    cta: "Start Free Trial",
    href: "/auth/register",
    popular: true,
  },
  {
    name: "Premium",
    price: "\u20B91,499",
    period: "/month",
    desc: "For power users",
    features: [
      "Everything in Pro",
      "VIP companion matching",
      "24/7 dedicated support",
      "Reward points 5x",
      "Exclusive events access",
      "Priority bookings",
      "Verified badge",
    ],
    cta: "Go Premium",
    href: "/auth/register",
    popular: false,
  },
];

export function PricingSection() {
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
            Pricing
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-4">
            Simple, Transparent{" "}
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-surface-600 dark:text-surface-400 max-w-xl mx-auto">
            Choose the plan that fits your needs. No hidden fees. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              className={`relative glass-card p-8 flex flex-col ${
                plan.popular
                  ? "ring-2 ring-brand-500 shadow-xl shadow-brand-500/10 scale-105 md:scale-105"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-500 to-purple-600 text-white text-xs font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-surface-900 dark:text-surface-100 font-display">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-surface-500 dark:text-surface-400">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-2">
                  {plan.desc}
                </p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-brand-600 dark:text-brand-400" />
                    </div>
                    <span className="text-surface-600 dark:text-surface-400">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href={plan.href}>
                <Button
                  variant={plan.popular ? "gradient" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
