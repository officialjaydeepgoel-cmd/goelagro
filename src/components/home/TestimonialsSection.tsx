"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Travel Enthusiast",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    text: "BuddyVerse made my solo trip to Goa incredible! Found an amazing travel buddy who showed me all the hidden beaches. The AI matching is spot on!",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "Student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    text: "My study partner from BuddyVerse helped me ace my exams. We met twice a week and the progress was incredible. Highly recommended for students!",
    rating: 5,
  },
  {
    name: "Ananya Gupta",
    role: "Fitness Enthusiast",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
    text: "Found my running partner on BuddyVerse. We've been training together for 3 months now. The accountability feature keeps us both motivated!",
    rating: 5,
  },
  {
    name: "Arjun Patel",
    role: "Business Owner",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    text: "Attended a networking event with a BuddyVerse companion. Made 20+ new contacts and felt more confident. This platform is a game-changer!",
    rating: 5,
  },
];

export function TestimonialsSection() {
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
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-4">
            Loved by{" "}
            <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-surface-600 dark:text-surface-400 max-w-xl mx-auto">
            Hear from our community of companions and customers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 group hover:shadow-xl transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-brand-200 dark:text-brand-800 mb-4" />
              <p className="text-surface-700 dark:text-surface-300 leading-relaxed mb-6">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 ring-2 ring-brand-500/20">
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm text-surface-900 dark:text-surface-100">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-surface-500 dark:text-surface-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
