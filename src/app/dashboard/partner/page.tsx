"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  CalendarDays,
  Clock,
  MapPin,
  Star,
  Wallet,
  Users,
  TrendingUp,
  DollarSign,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Briefcase,
  MessageCircle,
  HelpCircle,
  ChevronRight,
  Activity,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard/partner", active: true },
  { icon: CalendarDays, label: "My Bookings", href: "/dashboard/partner/bookings" },
  { icon: DollarSign, label: "Earnings", href: "/dashboard/partner/earnings" },
  { icon: Wallet, label: "Wallet", href: "/dashboard/partner/wallet" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/partner/analytics" },
  { icon: Star, label: "Reviews", href: "/dashboard/partner/reviews" },
  { icon: Bell, label: "Notifications", href: "#" },
  { icon: MessageCircle, label: "Messages", href: "#" },
  { icon: Settings, label: "Settings", href: "/dashboard/partner/settings" },
  { icon: HelpCircle, label: "Support", href: "#" },
];

export default function PartnerDashboard() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-16 md:pt-20 flex">
        <aside className="hidden lg:flex w-64 flex-col fixed left-0 top-16 md:top-20 bottom-0 border-r border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50">
          <div className="p-4 border-b border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-brand-500/20">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Partner" />
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                  Priya Sharma
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Online
                </div>
              </div>
            </div>
          </div>
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
          <div className="p-4 border-t border-surface-200 dark:border-surface-700 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-500 dark:text-surface-400">Status</span>
              <Badge variant="success" className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Available
              </Badge>
            </div>
            <Button variant="outline" size="sm" className="w-full gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        <main className="flex-1 lg:ml-64 p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold font-display text-surface-900 dark:text-surface-100">
                Partner Dashboard
              </h1>
              <p className="text-surface-500 dark:text-surface-400 mt-1">
                Manage your companion services and earnings.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Earnings", value: "₹48,299", icon: DollarSign, color: "from-emerald-500 to-teal-500", change: "+12%" },
                { label: "Bookings", value: "86", icon: CalendarDays, color: "from-brand-500 to-purple-500", change: "+8%" },
                { label: "Rating", value: "4.9", icon: Star, color: "from-amber-500 to-orange-500", change: "" },
                { label: "Completion Rate", value: "98%", icon: CheckCircle2, color: "from-green-500 to-emerald-500", change: "" },
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
                    {stat.change && (
                      <div className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {stat.change} this month
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Bookings */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <Card className="glass-card border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                      Recent Bookings
                    </h2>
                    <Link href="/dashboard/partner/bookings" className="text-sm text-brand-600 font-medium flex items-center gap-1">
                      View all <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {[
                      { customer: "Ananya Gupta", service: "Shopping Buddy", date: "Today, 2:00 PM", amount: 899, status: "CONFIRMED" },
                      { customer: "Rahul Verma", service: "Local Friend", date: "Tomorrow, 10:00 AM", amount: 499, status: "PENDING" },
                      { customer: "Neha Singh", service: "Travel Buddy", date: "Mar 25, 4:00 PM", amount: 1499, status: "CONFIRMED" },
                    ].map((booking, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-surface-800 last:border-0">
                        <div>
                          <div className="font-medium text-sm text-surface-900 dark:text-surface-100">
                            {booking.customer}
                          </div>
                          <div className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                            {booking.service} &middot; {booking.date}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={booking.status === "CONFIRMED" ? "success" : "warning"} className="text-xs">
                            {booking.status}
                          </Badge>
                          <div className="text-sm font-semibold text-surface-900 dark:text-surface-100 mt-1">
                            ₹{booking.amount}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                      Performance
                    </h2>
                    <Link href="/dashboard/partner/analytics" className="text-sm text-brand-600 font-medium flex items-center gap-1">
                      Analytics <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Response Rate", value: "95%", color: "bg-emerald-500" },
                      { label: "Acceptance Rate", value: "88%", color: "bg-brand-500" },
                      { label: "On-Time Arrival", value: "99%", color: "bg-amber-500" },
                      { label: "Customer Satisfaction", value: "4.9/5", color: "bg-purple-500" },
                    ].map((metric) => (
                      <div key={metric.label}>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="text-surface-600 dark:text-surface-400">{metric.label}</span>
                          <span className="font-semibold text-surface-900 dark:text-surface-100">{metric.value}</span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${metric.color} transition-all duration-500`}
                            style={{ width: metric.value }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick actions */}
            <div>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: CalendarDays, label: "Manage Availability", href: "#", color: "from-brand-500 to-purple-500" },
                  { icon: DollarSign, label: "Withdraw Earnings", href: "/dashboard/partner/withdraw", color: "from-emerald-500 to-teal-500" },
                  { icon: Activity, label: "View Analytics", href: "/dashboard/partner/analytics", color: "from-amber-500 to-orange-500" },
                  { icon: Settings, label: "Update Profile", href: "/dashboard/partner/settings", color: "from-rose-500 to-pink-500" },
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
