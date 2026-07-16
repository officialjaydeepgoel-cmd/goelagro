"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Search,
  UserCheck,
  Calendar,
  CreditCard,
  MessageCircle,
  Star,
  ArrowRight,
} from "lucide-react";

const steps = [
  { icon: Search, title: "1. Search", desc: "Browse through hundreds of verified companions in your city. Use filters to find the perfect match based on your needs.", color: "from-brand-500 to-purple-500" },
  { icon: UserCheck, title: "2. Choose", desc: "View detailed profiles with reviews, ratings, video introductions, and availability calendars. Pick your ideal companion.", color: "from-purple-500 to-pink-500" },
  { icon: Calendar, title: "3. Book", desc: "Select your preferred date, time, and duration. Apply coupons for discounts and confirm your booking in seconds.", color: "from-pink-500 to-rose-500" },
  { icon: CreditCard, title: "4. Pay", desc: "Pay securely through our platform. Your payment is held safely and released only after the booking is completed.", color: "from-rose-500 to-orange-500" },
  { icon: MessageCircle, title: "5. Connect", desc: "Chat in real-time, share your location, and stay connected throughout your booking. Our platform keeps you safe.", color: "from-orange-500 to-amber-500" },
  { icon: Star, title: "6. Review", desc: "Share your experience, rate your companion, and earn reward points. Your feedback helps the community.", color: "from-amber-500 to-yellow-500" },
];

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">Simple Process</span>
              <h1 className="font-display text-5xl md:text-6xl font-bold mt-4 mb-4">
                How It <span className="gradient-text">Works</span>
              </h1>
              <p className="text-surface-600 dark:text-surface-400 max-w-xl mx-auto text-lg">
                Finding your perfect companion is as easy as 1-2-3. Get started in minutes.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-8 text-center"
                >
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} p-4 flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-3">{step.title}</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center mt-12">
              <Link href="/search">
                <Button size="lg" className="gap-2">
                  Find Your Buddy <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Safety section */}
        <section className="py-20 bg-surface-50 dark:bg-surface-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Verified Profiles", desc: "Every companion undergoes rigorous ID verification, background checks, and in-person verification before being listed on our platform." },
                { title: "Secure Payments", desc: "Your payments are held in escrow and only released after you confirm the booking is complete. Full refund protection included." },
                { title: "24/7 Support", desc: "Our dedicated support team is available around the clock. Emergency SOS features ensure your safety at all times." },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-8"
                >
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-3">{item.title}</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
