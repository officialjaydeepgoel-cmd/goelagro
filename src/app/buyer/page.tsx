"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, isAuthenticated, getStoredUser, clearTokens } from "@/lib/api";

type BuyerTab = "dashboard" | "rfqs" | "products" | "profile";

export default function BuyerPage() {
  const router = useRouter();
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [activeTab, setActiveTab] = useState<BuyerTab>("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/login"); return }
    const u = getStoredUser();
    if (u && u.role !== "BUYER") { router.push("/login"); return }
    setUser(u);
    setLoading(false);
  }, [router]);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;

  const tabs: { key: BuyerTab; label: string }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "products", label: "Browse Products" },
    { key: "rfqs", label: "My RFQs" },
    { key: "profile", label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg font-bold text-gray-900">Buyer Portal</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{user?.name as string}</span>
              <button onClick={() => { clearTokens(); router.push("/login") }} className="text-sm text-red-600 hover:text-red-700">Logout</button>
            </div>
          </div>
          <div className="flex gap-4 -mb-px">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === t.key ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "dashboard" && <BuyerDashboard />}
        {activeTab === "products" && <BuyerProducts />}
        {activeTab === "rfqs" && <BuyerRfqs />}
        {activeTab === "profile" && <BuyerProfile user={user} />}
      </div>
    </div>
  );
}

function BuyerDashboard() {
  const [stats, setStats] = useState({ products: 0, rfqs: 0 });

  useEffect(() => {
    api.products.list().then(r => { if (r.success) setStats(s => ({ ...s, products: r.pagination?.total || 0 })) });
    api.rfqs.list().then(r => { if (r.success) setStats(s => ({ ...s, rfqs: r.pagination?.total || 0 })) });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Welcome to Your Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-6"><p className="text-3xl font-bold text-primary-600">{stats.products}</p><p className="text-sm text-gray-500">Products Available</p></div>
        <div className="card p-6"><p className="text-3xl font-bold text-primary-600">{stats.rfqs}</p><p className="text-sm text-gray-500">My RFQs</p></div>
        <div className="card p-6"><p className="text-3xl font-bold text-primary-600">0</p><p className="text-sm text-gray-500">Orders</p></div>
      </div>
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <a href="/buyer/products" className="btn-primary text-sm">Browse Products</a>
          <a href="/buyer/rfqs" className="btn-secondary text-sm">Create RFQ</a>
        </div>
      </div>
    </div>
  );
}

function BuyerProducts() {
  const [products, setProducts] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.products.list().then(r => { if (r.success) setProducts(r.data as unknown[]); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-200 rounded" />)}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Browse Products</h2>
      {products.length === 0 ? (
        <p className="text-gray-500">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(products as Record<string, unknown>[]).map((p) => (
            <div key={String(p.id)} className="card p-5 flex flex-col">
              <h3 className="font-semibold text-gray-900 mb-1">{String(p.name)}</h3>
              <p className="text-sm text-gray-500 mb-2 line-clamp-2">{String(p.description || "")}</p>
              <div className="mt-auto space-y-1 text-sm text-gray-600">
                {String(p.hsCode || "") && <p>HS: {String(p.hsCode)}</p>}
                {String(p.moq || "") && <p>MOQ: {String(p.moq)}</p>}
                {p.pricePerUnit ? <p className="font-medium text-primary-600">${String(p.pricePerUnit)}/{String(p.unit)}</p> : null}
                <p className="text-xs text-gray-400">{(p.seller as Record<string, unknown>)?.name as string}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BuyerRfqs() {
  const [rfqs, setRfqs] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ productId: "", quantity: 0, unit: "Metric Ton", message: "" });
  const [products, setProducts] = useState<unknown[]>([]);

  const load = () => {
    setLoading(true);
    api.rfqs.list().then(r => { if (r.success) setRfqs(r.data as unknown[]); }).finally(() => setLoading(false));
    api.products.list().then(r => { if (r.success) setProducts(r.data as unknown[]); });
  };

  useEffect(() => { load() }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.rfqs.create({ ...form, quantity: form.quantity });
    if (res.success) { setShowForm(false); setForm({ productId: "", quantity: 0, unit: "Metric Ton", message: "" }); load() }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">My RFQs ({rfqs.length})</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm px-4 py-2">{showForm ? "Cancel" : "+ New RFQ"}</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card p-6 space-y-4">
          <select value={form.productId} onChange={e => setForm(f => ({ ...f, productId: e.target.value }))} className="input-field" required>
            <option value="">Select Product</option>
            {(products as Record<string, unknown>[]).map(p => <option key={String(p.id)} value={String(p.id)}>{String(p.name)}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Quantity" value={form.quantity || ""} onChange={e => setForm(f => ({ ...f, quantity: parseFloat(e.target.value) || 0 }))} className="input-field" required />
            <input placeholder="Unit (e.g. Metric Ton)" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} className="input-field" />
          </div>
          <textarea placeholder="Additional requirements or message..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="input-field" rows={3} />
          <button type="submit" className="btn-primary">Submit RFQ</button>
        </form>
      )}

      {rfqs.length === 0 ? (
        <p className="text-gray-500">No RFQs yet.</p>
      ) : (
        <div className="space-y-3">
          {(rfqs as Record<string, unknown>[]).map((rfq) => (
            <div key={String(rfq.id)} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{(rfq.product as Record<string, unknown>)?.name as string || "Product"}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${rfq.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : rfq.status === "QUOTED" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{String(rfq.status)}</span>
              </div>
              <p className="text-sm text-gray-600">Quantity: {String(rfq.quantity)} {String(rfq.unit)}</p>
              {String(rfq.message || "") && <p className="text-sm text-gray-500 mt-1 italic">{String(rfq.message)}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BuyerProfile({ user }: { user: Record<string, unknown> | null }) {
  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Profile</h2>
      <div className="card p-6 space-y-3">
        <div><span className="text-sm text-gray-500">Name:</span><p className="font-medium">{user?.name as string}</p></div>
        <div><span className="text-sm text-gray-500">Email:</span><p className="font-medium">{user?.email as string}</p></div>
        <div><span className="text-sm text-gray-500">Role:</span><p className="font-medium">{user?.role as string}</p></div>
        <div><span className="text-sm text-gray-500">KYC Status:</span><p className="font-medium">{user?.kycStatus as string}</p></div>
      </div>
    </div>
  );
}
