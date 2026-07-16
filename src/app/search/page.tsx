"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  MapPin,
  Star,
  Filter,
  SlidersHorizontal,
  Clock,
  Shield,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const mockPartners = [
  {
    id: "1",
    name: "Priya Sharma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    category: "Travel Buddy",
    city: "Mumbai",
    rating: 4.9,
    reviews: 128,
    price: 499,
    experience: 3,
    languages: ["Hindi", "English", "Marathi"],
    isOnline: true,
    isVerified: true,
  },
  {
    id: "2",
    name: "Arjun Patel",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    category: "Study Partner",
    city: "Bangalore",
    rating: 4.8,
    reviews: 96,
    price: 349,
    experience: 2,
    languages: ["Hindi", "English", "Kannada"],
    isOnline: true,
    isVerified: true,
  },
  {
    id: "3",
    name: "Ananya Gupta",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
    category: "Fitness Partner",
    city: "Delhi",
    rating: 4.9,
    reviews: 215,
    price: 599,
    experience: 5,
    languages: ["Hindi", "English"],
    isOnline: false,
    isVerified: true,
  },
  {
    id: "4",
    name: "Rahul Verma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    category: "Local Friend",
    city: "Pune",
    rating: 4.7,
    reviews: 74,
    price: 299,
    experience: 1,
    languages: ["Hindi", "English", "Marathi"],
    isOnline: true,
    isVerified: true,
  },
  {
    id: "5",
    name: "Neha Singh",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha",
    category: "Shopping Buddy",
    city: "Mumbai",
    rating: 4.9,
    reviews: 167,
    price: 449,
    experience: 4,
    languages: ["Hindi", "English", "Gujarati"],
    isOnline: true,
    isVerified: true,
  },
  {
    id: "6",
    name: "Vikram Joshi",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
    category: "City Guide",
    city: "Jaipur",
    rating: 4.8,
    reviews: 143,
    price: 399,
    experience: 6,
    languages: ["Hindi", "English", "Rajasthani"],
    isOnline: false,
    isVerified: true,
  },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Search Header */}
        <section className="bg-surface-50 dark:bg-surface-900/50 border-b border-surface-200 dark:border-surface-700">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-display text-surface-900 dark:text-surface-100">
                  Find Your Buddy
                </h1>
                <p className="text-surface-500 dark:text-surface-400 mt-1">
                  Discover trusted companions near you
                </p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <Input
                    placeholder="Search by name, skill, city..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="shrink-0">
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {[
                "All",
                "Travel Buddy",
                "Study Partner",
                "Fitness Partner",
                "Local Friend",
                "Shopping Buddy",
                "Event Companion",
                "City Guide",
              ].map((filter) => (
                <button
                  key={filter}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filter === "All"
                      ? "bg-brand-600 text-white"
                      : "bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-surface-700 hover:border-brand-500 hover:text-brand-600"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Showing <span className="font-medium text-surface-900 dark:text-surface-100">128</span> companions
            </p>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-surface-400" />
              <select className="text-sm bg-transparent border-none text-surface-600 dark:text-surface-400 focus:outline-none cursor-pointer">
                <option>Sort by: Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: Highest</option>
                <option>Experience: Most</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockPartners.map((partner, i) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/partners/${partner.id}`} className="block group">
                  <div className="glass-card p-5 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-14 h-14 ring-2 ring-brand-500/20">
                            <AvatarImage src={partner.avatar} />
                            <AvatarFallback>{partner.name[0]}</AvatarFallback>
                          </Avatar>
                          {partner.isOnline && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-surface-900 rounded-full" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-surface-900 dark:text-surface-100 group-hover:text-brand-600 transition-colors">
                            {partner.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {partner.city}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {partner.category}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-surface-500 dark:text-surface-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-medium text-surface-700 dark:text-surface-300">
                          {partner.rating}
                        </span>
                        <span>({partner.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {partner.experience} yr
                      </div>
                      {partner.isVerified && (
                        <div className="flex items-center gap-1 text-brand-600">
                          <Shield className="w-3.5 h-3.5" />
                          Verified
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {partner.languages.map((lang) => (
                        <span
                          key={lang}
                          className="px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-xs text-surface-600 dark:text-surface-400"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-surface-100 dark:border-surface-800">
                      <div>
                        <span className="text-xl font-bold text-surface-900 dark:text-surface-100">
                          ₹{partner.price}
                        </span>
                        <span className="text-xs text-surface-400">/hr</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:gap-2 transition-all">
                        View Profile
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-12">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                  page === 1
                    ? "bg-brand-600 text-white"
                    : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
