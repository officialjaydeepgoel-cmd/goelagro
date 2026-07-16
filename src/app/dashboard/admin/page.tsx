"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCheck,
  CalendarDays,
  DollarSign,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Shield,
  Bell,
  FileText,
  HelpCircle,
  ChevronRight,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard/admin", active: true },
  { icon: Users, label: "Users", href: "/dashboard/admin/users" },
  { icon: UserCheck, label: "Partners", href: "/dashboard/admin/partners" },
  { icon: CalendarDays, label: "Bookings", href: "/dashboard/admin/bookings" },
  { icon: DollarSign, label: "Payments", href: "/dashboard/admin/payments" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/admin/analytics" },
  { icon: Shield, label: "Reports", href: "/dashboard/admin/reports" },
  { icon: Bell, label: "Notifications", href: "#" },
  { icon: FileText, label: "CMS", href: "/dashboard/admin/cms" },
  { icon: Settings, label: "Settings", href: "/dashboard/admin/settings" },
];

const recentActivities = [
  { action: "New user registered", user: "john@email.com", time: "2 min ago", type: "user" },
  { action: "Partner KYC approved", user: "Priya Sharma", time: "15 min ago", type: "partner" },
  { action: "Payment of ₹1,499", user: "Booking #BV-2024", time: "1 hour ago", type: "payment" },
  { action: "New support ticket", user: "Payment issue", time: "2 hours ago", type: "support" },
  { action: "Partner verification pending", user: "Rahul Verma", time: "3 hours ago", type: "verification" },
];

export default function AdminDashboard() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-16 md:pt-20 flex">
        <aside className="hidden lg:flex w-64 flex-col fixed left-0 top-16 md:top-20 bottom-0 border-r border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50">
          <div className="p-4 border-b border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <div>
                <div className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                  Admin Panel
                </div>
                <div className="text-xs text-surface-500 dark:text-surface-400">
                  Super Admin
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
          <div className="p-4 border-t border-surface-200 dark:border-surface-700">
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
                Admin Dashboard
              </h1>
              <p className="text-surface-500 dark:text-surface-400 mt-1">
                Enterprise overview of BuddyVerse platform.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Revenue", value: "₹12,84,299", icon: DollarSign, color: "from-emerald-500 to-teal-500", change: "+23.5%", positive: true },
                { label: "Active Users", value: "24,891", icon: Users, color: "from-brand-500 to-purple-500", change: "+12.2%", positive: true },
                { label: "Total Bookings", value: "8,456", icon: CalendarDays, color: "from-amber-500 to-orange-500", change: "+18.7%", positive: true },
                { label: "Pending Verifications", value: "23", icon: UserCheck, color: "from-rose-500 to-pink-500", change: "-5.2%", positive: false },
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
                    <div className={`text-xs mt-1 flex items-center gap-1 ${
                      stat.positive ? "text-emerald-500" : "text-red-500"
                    }`}>
                      {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.change} vs last month
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts & Activity */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <Card className="glass-card border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                      Revenue Overview
                    </h2>
                    <select className="text-xs bg-transparent border border-surface-200 dark:border-surface-700 rounded-lg px-2 py-1 text-surface-500">
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                    </select>
                  </div>
                  <div className="h-48 flex items-end gap-2">
                    {[45, 52, 38, 65, 48, 72, 58].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="w-full rounded-lg bg-gradient-to-t from-brand-500 to-purple-500 transition-all duration-300 group-hover:opacity-80" style={{ height: `${height}%` }} />
                        <span className="text-[10px] text-surface-400">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                      Recent Activity
                    </h2>
                    <Link href="/dashboard/admin/audit-logs" className="text-sm text-brand-600 font-medium flex items-center gap-1">
                      View all <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {recentActivities.map((activity, i) => (
                      <div key={i} className="flex items-start gap-3 py-2 border-b border-surface-100 dark:border-surface-800 last:border-0">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${
                          activity.type === "user" ? "bg-brand-500" :
                          activity.type === "partner" ? "bg-emerald-500" :
                          activity.type === "payment" ? "bg-amber-500" : "bg-purple-500"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-surface-900 dark:text-surface-100">
                            {activity.action}
                          </div>
                          <div className="text-xs text-surface-500 dark:text-surface-400">
                            {activity.user} &middot; {activity.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Management */}
            <div>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                Quick Management
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Users, label: "Manage Users", href: "/dashboard/admin/users", count: "24K", color: "from-brand-500 to-purple-500" },
                  { icon: UserCheck, label: "Verify Partners", href: "/dashboard/admin/partners", count: "23", color: "from-emerald-500 to-teal-500" },
                  { icon: Shield, label: "Reports", href: "/dashboard/admin/reports", count: "12", color: "from-amber-500 to-orange-500" },
                  { icon: HelpCircle, label: "Support Tickets", href: "/dashboard/admin/support", count: "8", color: "from-rose-500 to-pink-500" },
                ].map((action) => (
                  <Link key={action.label} href={action.href}>
                    <Card className="glass-card border-none cursor-pointer hover:shadow-lg transition-shadow group">
                      <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} p-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                            <action.icon className="w-full h-full text-white" />
                          </div>
                          {action.count && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                              {action.count}
                            </span>
                          )}
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
