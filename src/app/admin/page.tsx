"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, isAuthenticated, getStoredUser, clearTokens } from "@/lib/api";

type AdminTab = "dashboard" | "products" | "users" | "leads" | "prices" | "settings" | "logs";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login");
      return;
    }
    const u = getStoredUser();
    setUser(u);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    clearTokens();
    router.push("/admin/login");
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;

  const tabs: { key: AdminTab; label: string }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "products", label: "Products" },
    { key: "users", label: "Users" },
    { key: "leads", label: "Leads" },
    { key: "prices", label: "Prices" },
    { key: "settings", label: "Settings" },
    { key: "logs", label: "Audit Logs" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      <aside className="w-56 bg-gray-950 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">BV</span>
            </div>
            <span className="font-bold text-sm">BuddyVerse Admin</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.key ? "bg-primary-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-900/20 transition-colors">
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {activeTab === "dashboard" && <AdminDashboard />}
          {activeTab === "products" && <AdminProducts />}
          {activeTab === "users" && <AdminUsers />}
          {activeTab === "leads" && <AdminLeads />}
          {activeTab === "prices" && <AdminPrices />}
          {activeTab === "settings" && <AdminSettings />}
          {activeTab === "logs" && <AdminLogs />}
        </div>
      </main>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.dashboard().then((res) => {
      if (res.success) setStats(res.data as Record<string, unknown>);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-800 rounded w-48" /><div className="grid grid-cols-3 gap-4"><div className="h-24 bg-gray-800 rounded" /><div className="h-24 bg-gray-800 rounded" /><div className="h-24 bg-gray-800 rounded" /></div></div>;

  const cards = [
    { label: "Total Users", value: stats?.totalUsers ?? 0, color: "bg-blue-500" },
    { label: "Sellers", value: stats?.totalSellers ?? 0, color: "bg-green-500" },
    { label: "Buyers", value: stats?.totalBuyers ?? 0, color: "bg-amber-500" },
    { label: "Products", value: stats?.totalProducts ?? 0, color: "bg-primary-600" },
    { label: "Active Products", value: stats?.activeProducts ?? 0, color: "bg-teal-500" },
    { label: "Pending Products", value: stats?.pendingProducts ?? 0, color: "bg-red-500" },
    { label: "Total RFQs", value: stats?.totalRfqs ?? 0, color: "bg-purple-500" },
    { label: "Total Orders", value: stats?.totalOrders ?? 0, color: "bg-indigo-500" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-2xl font-bold">{String(c.value)}</p>
            <p className="text-sm text-gray-400">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.admin.pendingProducts().then((res) => {
      if (res.success) setProducts(res.data as unknown[]);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load() }, []);

  const handleApprove = async (id: string, status: string) => {
    const res = await api.admin.approveProduct(id, { status });
    if (res.success) load();
  };

  if (loading) return <div className="animate-pulse space-y-3"><div className="h-8 bg-gray-800 rounded w-48" />{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-800 rounded" />)}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Pending Product Approvals</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">No pending approvals.</p>
      ) : (
        <div className="space-y-3">
          {(products as Record<string, unknown>[]).map((p) => (
            <div key={String(p.id)} className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center justify-between">
              <div>
                <p className="font-semibold">{String(p.name)}</p>
                <p className="text-sm text-gray-400">Seller: {String((p.seller as Record<string, unknown>)?.name || "N/A")}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleApprove(String(p.id), "ACTIVE")} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors">Approve</button>
                <button onClick={() => handleApprove(String(p.id), "REJECTED")} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.users().then((res) => {
      if (res.success) setUsers(res.data as unknown[]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-3"><div className="h-8 bg-gray-800 rounded w-48" />{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-800 rounded" />)}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Name</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Email</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Role</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">KYC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {(users as Record<string, unknown>[]).map((u) => (
              <tr key={String(u.id)} className="hover:bg-gray-750">
                <td className="px-4 py-3">{String(u.name)}</td>
                <td className="px-4 py-3 text-gray-400">{String(u.email)}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-700 rounded text-xs">{String(u.role)}</span></td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs ${u.status === "ACTIVE" ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300"}`}>{String(u.status)}</span></td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs ${u.kycStatus === "VERIFIED" ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300"}`}>{String(u.kycStatus)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminLeads() {
  const [leads, setLeads] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.leads().then((res) => {
      if (res.success) setLeads(res.data as unknown[]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-3"><div className="h-8 bg-gray-800 rounded w-48" />{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-800 rounded" />)}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Leads</h1>
      <div className="grid gap-3">
        {(leads as Record<string, unknown>[]).map((l) => (
          <div key={String(l.id)} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{String(l.name)}</h3>
              <span className="text-xs text-gray-400">{String(l.source)}</span>
            </div>
            <p className="text-sm text-gray-400 mb-2">{String(l.requirement || "")}</p>
            <div className="flex items-center gap-3 text-xs">
              <span className={`px-2 py-0.5 rounded-full ${l.status === "NEW" ? "bg-blue-900 text-blue-300" : l.status === "CONTACTED" ? "bg-yellow-900 text-yellow-300" : "bg-green-900 text-green-300"}`}>{String(l.status)}</span>
              {String(l.email || "") && <span>{String(l.email)}</span>}
              {String(l.phone || "") && <span>{String(l.phone)}</span>}
              <span>Score: {String(l.score)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPrices() {
  const [commodities, setCommodities] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.marketPrices.commodities().then((res) => {
      if (res.success) setCommodities(res.data as unknown[]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-3"><div className="h-8 bg-gray-800 rounded w-48" />{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-800 rounded" />)}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Market Prices</h1>
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Commodity</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Market</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Min</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Max</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Modal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {(commodities as Record<string, unknown>[]).map((c, i) => (
              <tr key={i} className="hover:bg-gray-750">
                <td className="px-4 py-3 font-medium">{String(c.commodityName)}</td>
                <td className="px-4 py-3 text-gray-400">{String(c.market)}</td>
                <td className="px-4 py-3">₹{String(c.minPrice)}</td>
                <td className="px-4 py-3">₹{String(c.maxPrice)}</td>
                <td className="px-4 py-3 font-medium">₹{String(c.modalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.settings().then((res) => {
      if (res.success) setSettings(res.data as Record<string, unknown>);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-3"><div className="h-8 bg-gray-800 rounded w-48" />{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-800 rounded" />)}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Site Settings</h1>
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
        {settings ? (
          <div className="space-y-2 text-sm">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4 py-2 border-b border-gray-700 last:border-0">
                <span className="text-gray-400 w-40 flex-shrink-0">{key}</span>
                <span className="text-gray-200 break-all">{typeof value === "string" ? value : JSON.stringify(value)}</span>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-500">No settings found.</p>}
      </div>
    </div>
  );
}

function AdminLogs() {
  const [logs, setLogs] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.auditLogs().then((res) => {
      if (res.success) setLogs(res.data as unknown[]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-3"><div className="h-8 bg-gray-800 rounded w-48" />{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-800 rounded" />)}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Audit Logs</h1>
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Time</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">User</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Action</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Entity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {(logs as Record<string, unknown>[]).map((l, i) => (
              <tr key={i} className="hover:bg-gray-750">
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(String(l.createdAt)).toLocaleString()}</td>
                <td className="px-4 py-3">{(l.user as Record<string, unknown>)?.name as string || "N/A"}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-700 rounded text-xs">{String(l.action)}</span></td>
                <td className="px-4 py-3 text-gray-400">{String(l.entity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
