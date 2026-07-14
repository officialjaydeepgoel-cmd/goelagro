"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, isAuthenticated, getStoredUser, clearTokens } from "@/lib/api";

type SellerTab = "dashboard" | "products" | "rfqs" | "profile";

export default function SellerPage() {
  const router = useRouter();
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [activeTab, setActiveTab] = useState<SellerTab>("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/login"); return }
    const u = getStoredUser();
    if (u && u.role !== "SELLER") { router.push("/login"); return }
    setUser(u);
    setLoading(false);
  }, [router]);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;

  const tabs: { key: SellerTab; label: string }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "products", label: "My Products" },
    { key: "rfqs", label: "RFQs" },
    { key: "profile", label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg font-bold text-gray-900">Seller Portal</h1>
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
        {activeTab === "dashboard" && <SellerDashboard />}
        {activeTab === "products" && <SellerProducts />}
        {activeTab === "rfqs" && <SellerRfqs />}
        {activeTab === "profile" && <SellerProfile user={user} />}
      </div>
    </div>
  );
}

function SellerDashboard() {
  const [stats, setStats] = useState({ products: 0, rfqs: 0 });

  useEffect(() => {
    api.products.list().then(r => { if (r.success) setStats(s => ({ ...s, products: r.pagination?.total || 0 })) });
    api.rfqs.list().then(r => { if (r.success) setStats(s => ({ ...s, rfqs: r.pagination?.total || 0 })) });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Welcome to Your Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-6"><p className="text-3xl font-bold text-primary-600">{stats.products}</p><p className="text-sm text-gray-500">Your Products</p></div>
        <div className="card p-6"><p className="text-3xl font-bold text-primary-600">{stats.rfqs}</p><p className="text-sm text-gray-500">RFQs Received</p></div>
        <div className="card p-6"><p className="text-3xl font-bold text-primary-600">0</p><p className="text-sm text-gray-500">Orders</p></div>
      </div>
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
        <div className="flex flex-wrap gap-3">
          <a href="/seller/products" className="btn-primary text-sm">Add Product</a>
          <a href="/seller/rfqs" className="btn-secondary text-sm">View RFQs</a>
        </div>
      </div>
    </div>
  );
}

function SellerProducts() {
  const [products, setProducts] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", hsCode: "", moq: "", pricePerUnit: 0, originCountry: "India" });

  const load = () => { setLoading(true); api.products.list().then(r => { if (r.success) setProducts(r.data as unknown[]); }).finally(() => setLoading(false)) };

  useEffect(() => { load() }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const cats = await api.categories.list();
    const catId = (cats.data as Record<string, unknown>[])?.[0]?.id || "";
    await api.products.create({ ...form, categoryId: catId, unit: "Metric Ton", currency: "USD", packagingTypes: [], tags: [], specifications: [], certifications: [] });
    setShowForm(false);
    setForm({ name: "", description: "", hsCode: "", moq: "", pricePerUnit: 0, originCountry: "India" });
    load();
  };

  if (loading) return <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-200 rounded" />)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">My Products ({products.length})</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm px-4 py-2">{showForm ? "Cancel" : "+ Add Product"}</button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card p-6 space-y-4">
          <input placeholder="Product Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" required />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field" rows={3} required />
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="HS Code" value={form.hsCode} onChange={e => setForm(f => ({ ...f, hsCode: e.target.value }))} className="input-field" required />
            <input placeholder="MOQ (e.g. 25 Metric Tons)" value={form.moq} onChange={e => setForm(f => ({ ...f, moq: e.target.value }))} className="input-field" required />
            <input type="number" placeholder="Price per Unit (USD)" value={form.pricePerUnit || ""} onChange={e => setForm(f => ({ ...f, pricePerUnit: parseFloat(e.target.value) || 0 }))} className="input-field" />
            <input placeholder="Origin Country" value={form.originCountry} onChange={e => setForm(f => ({ ...f, originCountry: e.target.value }))} className="input-field" />
          </div>
          <button type="submit" className="btn-primary">Submit for Approval</button>
          <p className="text-xs text-gray-500">Product will be reviewed by admin before publishing.</p>
        </form>
      )}

      <div className="space-y-3">
        {(products as Record<string, unknown>[]).map((p) => (
          <div key={String(p.id)} className="card p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{String(p.name)}</p>
              <p className="text-sm text-gray-500">HS: {String(p.hsCode)} | MOQ: {String(p.moq)} | Status: {String(p.status)}</p>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${p.status === "ACTIVE" ? "bg-green-100 text-green-700" : p.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>{String(p.status)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SellerRfqs() {
  const [rfqs, setRfqs] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.rfqs.list().then(r => { if (r.success) setRfqs(r.data as unknown[]); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-200 rounded" />)}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">RFQs</h2>
      {(rfqs as Record<string, unknown>[]).length === 0 ? (
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
              <p className="text-sm text-gray-500">Buyer: {(rfq.buyer as Record<string, unknown>)?.name as string}</p>
              {String(rfq.message || "") && <p className="text-sm text-gray-500 mt-1 italic">{String(rfq.message)}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SellerProfile({ user }: { user: Record<string, unknown> | null }) {
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
