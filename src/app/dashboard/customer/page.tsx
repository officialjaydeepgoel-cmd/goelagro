"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  CalendarDays,
  Clock,
  MapPin,
  Star,
  Wallet,
  Gift,
  Heart,
  Bell,
  Ticket,
  Users,
  ArrowRight,
  CreditCard,
  MessageCircle,
  Settings,
  Shield,
  Phone,
  Activity,
  LogOut,
  Menu,
  X,
  Home,
  BookOpen,
  FileText,
  HelpCircle,
  ChevronRight,
  Search,
} from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard/customer", active: true },
  { icon: CalendarDays, label: "My Bookings", href: "/dashboard/customer/bookings" },
  { icon: Wallet, label: "Wallet", href: "/dashboard/customer/wallet" },
  { icon: Gift, label: "Rewards", href: "/dashboard/customer/rewards" },
  { icon: Heart, label: "Saved Partners", href: "/dashboard/customer/saved-partners" },
  { icon: Bell, label: "Notifications", href: "/dashboard/customer/notifications" },
  { icon: Ticket, label: "Coupons", href: "/dashboard/customer/rewards" },
  { icon: Users, label: "Referrals", href: "/dashboard/customer/referrals" },
  { icon: FileText, label: "Invoices", href: "/dashboard/customer/invoices" },
  { icon: HelpCircle, label: "Support", href: "/dashboard/customer/support" },
  { icon: Settings, label: "Settings", href: "/dashboard/customer/settings" },
];

const upcomingBookings = [
  {
    id: "1",
    partner: "Priya Sharma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    type: "Travel Buddy",
    date: "2024-03-20",
    time: "10:00 AM",
    location: "Mumbai Airport",
    status: "CONFIRMED",
    amount: 1499,
  },
  {
    id: "2",
    partner: "Rahul Verma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    type: "Local Friend",
    date: "2024-03-22",
    time: "2:00 PM",
    location: "Colaba, Mumbai",
    status: "PENDING",
    amount: 899,
  },
];

export default function CustomerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Header />
      <div className="min-h-screen pt-16 md:pt-20 flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col fixed left-0 top-16 md:top-20 bottom-0 border-r border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50">
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  item.active
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-500/25"
                    : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-surface-200 dark:border-surface-700">
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 w-full transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/25 flex items-center justify-center"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-surface-950 shadow-2xl">
              <nav className="p-4 space-y-1 pt-20 overflow-y-auto h-full">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      item.active
                        ? "bg-brand-600 text-white"
                        : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Welcome */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold font-display text-surface-900 dark:text-surface-100">
                Welcome back, John! 👋
              </h1>
              <p className="text-surface-500 dark:text-surface-400 mt-1">
                Here&apos;s what&apos;s happening with your companions today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Bookings", value: "24", icon: CalendarDays, color: "from-brand-500 to-purple-500" },
                { label: "Active Now", value: "1", icon: Clock, color: "from-emerald-500 to-teal-500" },
                { label: "Reward Points", value: "2,450", icon: Gift, color: "from-amber-500 to-orange-500" },
                { label: "Wallet Balance", value: "₹4,299", icon: Wallet, color: "from-pink-500 to-rose-500" },
              ].map((stat) => (
                <Card key={stat.label} className="glass-card border-none">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                        {stat.label}
                      </span>
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} p-2 flex items-center justify-center`}>
                        <stat.icon className="w-full h-full text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-surface-900 dark:text-surface-100 font-display">
                      {stat.value}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Upcoming Bookings */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  Upcoming Bookings
                </h2>
                <Link
                  href="/dashboard/customer/bookings"
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                >
                  View all
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id} className="glass-card border-none">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12 ring-2 ring-brand-500/20">
                            <AvatarImage src={booking.avatar} />
                            <AvatarFallback>{booking.partner[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-surface-900 dark:text-surface-100">
                              {booking.partner}
                            </h3>
                            <p className="text-sm text-surface-500 dark:text-surface-400">
                              {booking.type}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-surface-500 dark:text-surface-400">
                              <span className="flex items-center gap-1">
                                <CalendarDays className="w-3 h-3" />
                                {booking.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {booking.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {booking.location}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              booking.status === "CONFIRMED"
                                ? "success"
                                : "warning"
                            }
                          >
                            {booking.status}
                          </Badge>
                          <div className="mt-2 text-lg font-bold text-surface-900 dark:text-surface-100">
                            ₹{booking.amount}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Search, label: "Find Buddies", href: "/search", color: "from-brand-500 to-purple-500" },
                  { icon: MessageCircle, label: "Messages", href: "#", color: "from-emerald-500 to-teal-500" },
                  { icon: Wallet, label: "Add Money", href: "/dashboard/customer/wallet", color: "from-amber-500 to-orange-500" },
                  { icon: Shield, label: "Safety Center", href: "#", color: "from-rose-500 to-pink-500" },
                ].map((action) => (
                  <Link key={action.label} href={action.href}>
                    <Card className="glass-card border-none cursor-pointer hover:shadow-lg transition-shadow group">
                      <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} p-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <action.icon className="w-full h-full text-white" />
                        </div>
                        <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                          {action.label}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
      <Footer />
    </>
  );
}


