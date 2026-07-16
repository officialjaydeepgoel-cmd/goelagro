"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Star,
  MapPin,
  Clock,
  Shield,
  CheckCircle,
  MessageCircle,
  Calendar,
  ArrowLeft,
  ChevronRight,
  Phone,
  Mail,
  Globe,
  Award,
  BookOpen,
  Heart,
  Share2,
  Flag,
} from "lucide-react";

const partnerData = {
  id: "1",
  name: "Priya Sharma",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
  coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
  category: "Travel Buddy",
  city: "Mumbai",
  rating: 4.9,
  reviews: 128,
  price: 499,
  experience: 3,
  about: "Passionate traveler and local guide with 3+ years of experience showing people the hidden gems of Mumbai. I speak Hindi, English, and Marathi fluently. Whether you want to explore street food, visit historical sites, or just need company for your trip, I'm here to make your experience unforgettable.",
  skills: ["Travel Planning", "Local Guide", "Photography", "Food Tour", "Language Translation"],
  languages: ["Hindi", "English", "Marathi", "Gujarati"],
  availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  isVerified: true,
  isOnline: true,
  responseTime: 5,
  completionRate: 99,
};

const reviews = [
  { name: "Ananya Gupta", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya", rating: 5, text: "Amazing companion! Showed me all the best spots in Mumbai. Highly recommend!", date: "2 weeks ago" },
  { name: "Rahul Verma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul", rating: 5, text: "Priya is incredibly knowledgeable and friendly. Made my solo trip so much better!", date: "1 month ago" },
  { name: "Neha Singh", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha", rating: 5, text: "Best travel companion ever! Very professional and punctual. 10/10 experience.", date: "2 months ago" },
];

export default function PartnerProfilePage() {
  const params = useParams();

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 md:pt-20">
        {/* Cover Image */}
        <div className="relative h-48 md:h-72 overflow-hidden">
          <img src={partnerData.coverImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Link href="/search" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to search
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 -mt-20 relative z-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 md:p-8"
              >
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <Avatar className="w-24 h-24 ring-4 ring-white dark:ring-surface-900 shadow-xl">
                    <AvatarImage src={partnerData.avatar} />
                    <AvatarFallback className="text-2xl">{partnerData.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h1 className="text-2xl md:text-3xl font-bold font-display text-surface-900 dark:text-surface-100">
                        {partnerData.name}
                      </h1>
                      {partnerData.isVerified && (
                        <Badge variant="success" className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </Badge>
                      )}
                      {partnerData.isOnline && (
                        <Badge variant="default" className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          Online
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-surface-500 dark:text-surface-400 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {partnerData.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {partnerData.rating} ({partnerData.reviews} reviews)
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {partnerData.experience} years experience
                      </span>
                    </div>
                    <p className="text-surface-600 dark:text-surface-400 leading-relaxed">
                      {partnerData.about}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Skills & Languages */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
              >
                <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">Skills & Services</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {partnerData.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
                <h3 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {partnerData.languages.map((lang) => (
                    <span key={lang} className="px-3 py-1.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Reviews */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                    Reviews ({reviews.length})
                  </h2>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-semibold text-surface-900 dark:text-surface-100">{partnerData.rating}</span>
                    <span className="text-surface-400">/5</span>
                  </div>
                </div>
                <div className="space-y-6">
                  {reviews.map((review, i) => (
                    <div key={i} className="flex gap-4 pb-6 border-b border-surface-100 dark:border-surface-800 last:border-0 last:pb-0">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={review.avatar} />
                        <AvatarFallback>{review.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm text-surface-900 dark:text-surface-100">{review.name}</span>
                          <span className="text-xs text-surface-400">{review.date}</span>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                          {Array.from({ length: review.rating }).map((_, j) => (
                            <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="text-sm text-surface-600 dark:text-surface-400">{review.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:sticky lg:top-24 space-y-4"
              >
                <div className="glass-card p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-surface-900 dark:text-surface-100 font-display">
                      ₹{partnerData.price}
                      <span className="text-base font-normal text-surface-400">/hr</span>
                    </div>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">No hidden fees</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-surface-500 dark:text-surface-400">Response Time</span>
                      <span className="font-medium text-surface-900 dark:text-surface-100">&lt; {partnerData.responseTime} min</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-surface-500 dark:text-surface-400">Completion Rate</span>
                      <span className="font-medium text-surface-900 dark:text-surface-100">{partnerData.completionRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-surface-500 dark:text-surface-400">Available</span>
                      <span className="font-medium text-emerald-500">{partnerData.availability.length} days/week</span>
                    </div>
                  </div>

                  <Link href={`/booking?partner=${partnerData.id}`}>
                    <Button className="w-full mb-3" size="lg">
                      Book Now
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full gap-2" size="lg">
                    <MessageCircle className="w-4 h-4" />
                    Send Message
                  </Button>

                  <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-surface-100 dark:border-surface-800">
                    <button className="flex items-center gap-1.5 text-xs text-surface-500 hover:text-surface-700 transition-colors">
                      <Heart className="w-4 h-4" />
                      Save
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-surface-500 hover:text-surface-700 transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-surface-500 hover:text-surface-700 transition-colors">
                      <Flag className="w-4 h-4" />
                      Report
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
