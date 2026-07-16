"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    category: "General",
    items: [
      { q: "What is BuddyVerse AI?", a: "BuddyVerse AI is a premium marketplace platform that connects you with verified local companions for various activities including travel, shopping, events, study, fitness, and more." },
      { q: "Is BuddyVerse available in my city?", a: "We are currently operational in 50+ cities across India including Mumbai, Delhi, Bangalore, Pune, Hyderabad, Chennai, Kolkata, and expanding rapidly." },
      { q: "How does the AI matching work?", a: "Our AI algorithm analyzes your preferences, location, interests, past bookings, and requirements to find the most compatible companion matches." },
    ],
  },
  {
    category: "Safety & Verification",
    items: [
      { q: "How are companions verified?", a: "All companions undergo a multi-step verification process including government ID verification, selfie verification, background checks, and in-person interviews." },
      { q: "Is my personal information safe?", a: "Yes, we use enterprise-grade encryption, secure servers, and strict data protection policies. Your data is never shared without your consent." },
      { q: "What if I feel unsafe during a booking?", a: "We have an SOS button, real-time location sharing, and 24/7 support team. Press the SOS button for immediate assistance." },
    ],
  },
  {
    category: "Payments",
    items: [
      { q: "What payment methods are accepted?", a: "We accept UPI, credit/debit cards, net banking, and wallet payments. All payments are processed securely through Razorpay." },
      { q: "How does the refund policy work?", a: "Free cancellation up to 24 hours before the booking. Cancellations within 24 hours may incur a fee based on our cancellation policy." },
      { q: "When is the companion paid?", a: "Payment is released to the companion only after you confirm the booking is complete and you've had a satisfactory experience." },
    ],
  },
  {
    category: "Partners",
    items: [
      { q: "How do I become a companion?", a: "Register as a partner, complete your profile with skills and experience, verify your identity, and start accepting bookings." },
      { q: "How much commission does BuddyVerse charge?", a: "We charge a competitive commission of 15-20% depending on your tier. Premium partners enjoy reduced commission rates." },
      { q: "When can I withdraw my earnings?", a: "Earnings are available for withdrawal 24 hours after booking completion. Withdrawals are processed within 1-3 business days." },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">FAQ</span>
              <h1 className="font-display text-5xl md:text-6xl font-bold mt-4 mb-4">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h1>
              <p className="text-surface-600 dark:text-surface-400 max-w-xl mx-auto text-lg">
                Everything you need to know about BuddyVerse AI.
              </p>
            </motion.div>

            <div className="space-y-12">
              {faqs.map((section) => (
                <div key={section.category}>
                  <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">{section.category}</h2>
                  <Accordion type="single" collapsible className="space-y-3">
                    {section.items.map((item, i) => (
                      <AccordionItem key={i} value={`${section.category}-${i}`} className="glass-card px-6 border-none">
                        <AccordionTrigger className="text-left font-medium text-surface-900 dark:text-surface-100 py-5">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-surface-600 dark:text-surface-400 leading-relaxed pb-5">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
