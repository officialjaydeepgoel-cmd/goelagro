"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does BuddyVerse AI match me with companions?",
    a: "Our AI algorithm analyzes your preferences, location, interests, and requirements to find the perfect companion match. We consider factors like skills, languages, availability, ratings, and past experiences to ensure the best possible pairing.",
  },
  {
    q: "Is my safety guaranteed on the platform?",
    a: "Absolutely. All companions go through a rigorous verification process including government ID verification, selfie verification, and background checks. We also have SOS features, real-time tracking, and 24/7 support to ensure your safety.",
  },
  {
    q: "How does payment work?",
    a: "Payments are processed securely through Razorpay. Your payment is held in escrow and released to the companion only after the booking is completed. This ensures both parties are protected. You can pay via UPI, cards, net banking, or wallet.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes, you can cancel a booking based on our cancellation policy. Free cancellation is available up to 24 hours before the booking. Cancellations after that may incur a fee. Refunds are processed within 3-5 business days.",
  },
  {
    q: "How do I become a companion?",
    a: "Register as a partner, complete your profile with skills and experience, verify your identity through our KYC process, and start accepting bookings. We review every partner application to maintain quality standards.",
  },
  {
    q: "What if I have an issue during a booking?",
    a: "Our support team is available 24/7 via chat, phone, and email. You can also use the SOS button in the app for emergencies. We take every issue seriously and have a dedicated resolution team.",
  },
];

export function FAQSection() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            FAQ
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-4">
            Got <span className="gradient-text">Questions?</span>
          </h2>
          <p className="text-surface-600 dark:text-surface-400 max-w-xl mx-auto">
            Find answers to common questions about our platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-left font-medium text-surface-900 dark:text-surface-100 hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-surface-600 dark:text-surface-400 leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
