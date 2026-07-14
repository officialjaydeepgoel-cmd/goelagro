"use client";
import { useState, useEffect, useCallback } from "react";
import { api, isAuthenticated, getStoredUser, clearTokens } from "@/lib/api";
import { useRouter } from "next/navigation";
import DragDropUpload from "@/components/DragDropUpload";

type Tab = "dashboard"|"services"|"bookings"|"users"|"leads"|"crm"|"testimonials"|"banners"|"blog"|"media"|"photos"|"settings";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "dashboard", label: "Dashboard", icon: "??" }, { key: "services", label: "Services", icon: "??" },
  { key: "bookings", label: "Bookings", icon: "??" }, { key: "users", label: "Users", icon: "??" },
  { key: "leads", label: "Leads", icon: "??" }, { key: "crm", label: "CRM", icon: "??" },
  { key: "testimonials", label: "Testimonials", icon: "?" }, { key: "banners", label: "Banners", icon: "??" },
  { key: "blog", label: "Blog", icon: "??" }, { key: "media", label: "Media", icon: "??" },
  { key: "photos", label: "Photos", icon: "??" }, { key: "settings", label: "Settings", icon: "??" },
];

function Badge({ s, c }: { s: string; c: Record<string, string> }) {
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${c[s] || "bg-gray-100 text-gray-600"}`}>{s}</span>;
}

const ST = { ACTIVE: "bg-emerald-100 text-emerald-700", DRAFT: "bg-amber-100 text-amber-700", PENDING: "bg-blue-100 text-blue-700", NEW: "bg-violet-100 text-violet-700", CONTACTED: "bg-amber-100 text-amber-700", CLOSED: "bg-emerald-100 text-emerald-700" };

function Card({ c, x = "" }: { c: React.ReactNode; x?: string }) { return <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${x}`}>{c}</div>; }

function Head({ t, n, onAdd, addLabel }: { t: string; n?: number; onAdd?: () => void; addLabel?: string }) {
  return <div className="flex items-center justify-between mb-5"><div><h2 className="text-xl font-bold text-gray-900">{t}</h2>{n !== undefined && <p className="text-sm text-gray-400 mt-0.5">{n} total</p>}</div>{onAdd && <button onClick={onAdd} className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-md"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>{addLabel || "Add New"}</button>}</div>;
}

function Inp({ p, v, s }: { p: string; v: string; s: (x: string) => void }) { return <input placeholder={p} value={v} onChange={e => s(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all" required />; }

function TA({ p, v, s }: { p: string; v: string; s: (x: string) => void }) { return <textarea placeholder={p} value={v} onChange={e => s(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all resize-none" rows={3} required />; }

function Tbl({ h, children }: { h: string[]; children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-xl border border-gray-100"><table className="w-full text-sm"><thead><tr className="bg-gray-50 border-b border-gray-100">{h.map(x => <th key={x} className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{x}</th>)}</tr></thead><tbody className="divide-y divide-gray-50">{children}</tbody></table></div>;
}

function Td({ c, x = "" }: { c: React.ReactNode; x?: string }) { return <td className={`px-4 py-3.5 text-sm ${x}`}>{c}</td>; }

function Sk({ l = 3 }: { l?: number }) { return <div className="animate-pulse space-y-3">{[...Array(l)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg" />)}</div>; }

function Mt({ i, t, sub }: { i: string; t: string; sub?: string }) { return <Card c={<div className="p-12 text-center"><div className="text-5xl mb-4 opacity-60">{i}</div><p className="text-gray-900 font-semibold">{t}</p>{sub && <p className="text-gray-400 text-sm mt-1">{sub}</p>}</div>} />; }

function Av({ n, src, sz = "md" }: { n: string; src?: string; sz?: string }) {
  const s = sz === "sm" ? "w-8 h-8 text-xs" : sz === "lg" ? "w-14 h-14 text-lg" : "w-10 h-10 text-sm";
  if (src) return <img src={src} className={`${s} rounded-full object-cover ring-2 ring-white`} alt={n} />;
  const cl = ["bg-violet-500","bg-emerald-500","bg-amber-500","bg-rose-500","bg-cyan-500","bg-indigo-500"];
  return <div className={`${s} ${cl[n.length % cl.length]} rounded-full flex items-center justify-center text-white font-bold ring-2 ring-white`}>{(n?.charAt(0) || "?").toUpperCase()}</div>;
}

function Md({ show, onClose, t, children }: { show: boolean; onClose: () => void; t: string; children: React.ReactNode }) {
  if (!show) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between p-5 border-b border-gray-100"><h3 className="text-lg font-bold text-gray-900">{t}</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>;
}

function Ts({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t) }, [onClose]);
  return <div className="fixed bottom-6 right-6 z-50 animate-slide-up"><div className="bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2"><span>?</span>{msg}</div></div>;
}

export default function ControlPanelPage() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [loading, setLoading] = useState(true);
  const [side, setSide] = useState(false);

  useEffect(() => { if (!isAuthenticated()) { router.push("/login"); return } setUser(getStoredUser()); setLoading(false) }, [router]);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="flex flex-col items-center gap-3"><div className="animate-spin w-10 h-10 border-[3px] border-gray-900 border-t-transparent rounded-full" /><p className="text-sm text-gray-400 font-medium">Loading panel...</p></div></div>;

  const uname = (user?.name as string) || "";
  const urole = (user?.role as string) || "";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-gray-900 text-white flex flex-col transition-transform duration-300 ${side ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Av n={uname} />
            <div className="min-w-0"><p className="font-semibold text-sm truncate">{uname}</p><p className="text-xs text-gray-400 truncate">{urole}</p></div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {TABS.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setSide(false) }} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${tab === t.key ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <span className="text-lg">{t.icon}</span><span>{t.label}</span>
              {tab === t.key && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <button onClick={() => { clearTokens(); router.push("/login") }} className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-red-500/10 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-gray-100 lg:hidden sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 h-14">
            <button onClick={() => setSide(!side)} className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <h1 className="text-base font-bold text-gray-900">Control Panel</h1>
            <Av n={uname} sz="sm" />
          </div>
        </header>
        {side && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSide(false)} />}
        <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
          {tab === "dashboard" && <Db />}{tab === "services" && <Sv />}{tab === "bookings" && <Bk />}
          {tab === "users" && <Us />}{tab === "leads" && <Ld />}{tab === "crm" && <Cr />}
          {tab === "testimonials" && <Tm />}{tab === "banners" && <Bn />}{tab === "blog" && <Bl />}
          {tab === "media" && <MdSec />}{tab === "photos" && <Ph />}{tab === "settings" && <St />}
        </main>
      </div>
    </div>
  );
}

function Db() {
  const [s, setS] = useState<any | null>(null);
  useEffect(() => { api.admin.dashboard().then(r => { if (r.success) setS(r.data as any) }) }, []);
  const cards = [
    { label: "Total Users", value: s?.totalUsers ?? 0, icon: "??", g: "from-violet-500 to-purple-600" },
    { label: "Products", value: s?.totalProducts ?? 0, icon: "??", g: "from-blue-500 to-cyan-600" },
    { label: "Leads", value: s?.totalLeads ?? 0, icon: "??", g: "from-rose-500 to-pink-600" },
    { label: "Orders", value: s?.totalOrders ?? 0, icon: "??", g: "from-emerald-500 to-teal-600" },
  ];
  return <div className="space-y-6">
    <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Dashboard</h1><p className="text-sm text-gray-400">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(c => <div key={c.label} className={`relative overflow-hidden bg-gradient-to-br ${c.g} rounded-2xl p-5 text-white shadow-lg`}><div className="absolute top-3 right-3 text-3xl opacity-20">{c.icon}</div><p className="text-3xl font-bold tracking-tight">{String(c.value)}</p><p className="text-sm mt-1 text-white/80 font-medium">{c.label}</p></div>)}
    </div>
    {s?.recentUsers ? <Card c={<div className="p-5"><h3 className="font-semibold text-gray-900 mb-3">Recent Users</h3><div className="space-y-2">{(s.recentUsers as any[]).slice(0, 5).map((u: any, i: number) => <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"><Av n={String(u.name || "")} sz="sm" /><div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{String(u.name || "")}</p><p className="text-xs text-gray-400 truncate">{String(u.email || "")}</p></div><Badge s={String(u.role || "")} c={{ BUYER: "bg-blue-50 text-blue-600", SELLER: "bg-green-50 text-green-600", ADMIN: "bg-purple-50 text-purple-600" }} /></div>)}</div></div>} /> : <Card c={<div className="p-5"><Sk l={4} /></div>} />}
  </div>;
}

function Sv() {
  const [d, setD] = useState<any[]>([]); const [l, setL] = useState(true); const [sh, setSh] = useState(false);
  const [n, setN] = useState(""); const [des, setDes] = useState(""); const [s, setS] = useState(""); const [i, setI] = useState("");
  const get = useCallback(() => { setL(true); api.cms.services.list().then(r => { if (r.success) setD(r.data as any[]) }).finally(() => setL(false)) }, []);
  useEffect(() => { get() }, [get]);
  const add = async (e: any) => { e.preventDefault(); await api.cms.services.create({ name: n, description: des, shortDesc: s, icon: i }); setN(""); setDes(""); setS(""); setI(""); setSh(false); get() };
  const del = async (id: string) => { if (!confirm("Delete?")) return; await api.cms.services.delete(id); get() };
  return <div className="space-y-4"><Head t="Services" n={d.length} onAdd={() => setSh(!sh)} addLabel={sh ? "Cancel" : "+ Add"} />
    <Md show={sh} onClose={() => setSh(false)} t="Add Service"><form onSubmit={add} className="space-y-4"><Inp p="Service Name" v={n} s={setN} /><Inp p="Short Description" v={s} s={setS} /><div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-medium text-gray-500 mb-1.5">Icon Image</label><DragDropUpload onUpload={x => setI(x)} label="Drop icon" /></div><Inp p="Or emoji (e.g. ??)" v={i} s={setI} /></div><TA p="Full Description" v={des} s={setDes} /><button className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-all">Save Service</button></form></Md>
    {l ? <Sk l={4} /> : d.length === 0 ? <Mt i="??" t="No services yet" sub="Click 'Add New' to create your first service" /> : <div className="grid gap-3">{d.map(x => <Card key={String(x.id)} c={<div className="p-4 flex items-center justify-between hover:shadow-md transition-shadow"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-lg">{String(x.icon || "??")}</div><div><p className="font-semibold text-gray-900 text-sm">{String(x.name)}</p><p className="text-xs text-gray-400">{String(x.shortDesc || "")}</p></div></div><div className="flex items-center gap-2"><Badge s={x.isActive ? "ACTIVE" : "DRAFT"} c={ST} /><button onClick={() => del(String(x.id))} className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors">Delete</button></div></div>} />)}</div>}
  </div>;
}

function Bk() {
  const [d, setD] = useState<any[]>([]); const [l, setL] = useState(true);
  const get = useCallback(() => { setL(true); api.cms.bookings.list().then(r => { if (r.success) setD(r.data as any[]) }).finally(() => setL(false)) }, []);
  useEffect(() => { get() }, [get]);
  const upd = async (id: string, st: string) => { await api.cms.bookings.update(id, { status: st }); get() };
  const BG = { PENDING: "bg-amber-50 text-amber-600", CONFIRMED: "bg-emerald-50 text-emerald-600", CANCELLED: "bg-red-50 text-red-600" };
  return <div className="space-y-4"><Head t="Bookings" n={d.length} />
    {l ? <Sk l={5} /> : d.length === 0 ? <Mt i="??" t="No bookings yet" sub="Bookings from customers will appear here" /> : <div className="grid gap-3">{d.map(x => <Card key={String(x.id)} c={<div className="p-4"><div className="flex items-start justify-between"><div className="flex items-start gap-3"><Av n={String(x.name)} /><div><p className="font-semibold text-gray-900">{String(x.name)}</p><p className="text-sm text-gray-500">{String(x.email)}</p><p className="text-xs text-gray-400 mt-1">Service: {String(x.service)} {x.date ? `| ${new Date(String(x.date)).toLocaleDateString()}` : ""}</p>{String(x.message || "") && <p className="text-sm text-gray-500 mt-2 italic border-l-2 border-gray-200 pl-3">{String(x.message)}</p>}</div></div><div className="flex items-center gap-2"><Badge s={String(x.status)} c={BG} /><select value={String(x.status)} onChange={e => upd(String(x.id), e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-600 focus:ring-2 focus:ring-gray-900/10 outline-none"><option value="PENDING">Pending</option><option value="CONFIRMED">Confirmed</option><option value="CANCELLED">Cancelled</option></select></div></div></div>} />)}</div>}
  </div>;
}

function Us() {
  const [d, setD] = useState<any[]>([]); const [l, setL] = useState(true);
  useEffect(() => { setL(true); api.admin.users().then(r => { if (r.success) setD(r.data as any[]) }).finally(() => setL(false)) }, []);
  const RB = { BUYER: "bg-blue-50 text-blue-600", SELLER: "bg-emerald-50 text-emerald-600", ADMIN: "bg-purple-50 text-purple-600", SUPER_ADMIN: "bg-red-50 text-red-600" };
  const SB = { ACTIVE: "bg-emerald-50 text-emerald-600", PENDING: "bg-amber-50 text-amber-600", SUSPENDED: "bg-red-50 text-red-600" };
  const KB = { VERIFIED: "bg-emerald-50 text-emerald-600", NOT_SUBMITTED: "bg-gray-50 text-gray-500", PENDING: "bg-amber-50 text-amber-600" };
  return <div className="space-y-4"><Head t="Users" n={d.length} />
    {l ? <Sk l={6} /> : d.length === 0 ? <Mt i="??" t="No users found" /> : <Tbl h={["User","Email","Role","Status","KYC"]}>{d.map(u => <tr key={String(u.id)} className="hover:bg-gray-50/50 transition-colors"><Td c={<div className="flex items-center gap-3"><Av n={String(u.name)} /><span className="font-medium text-gray-900">{String(u.name)}</span></div>} /><Td c={String(u.email)} x="text-gray-500" /><Td c={<Badge s={String(u.role)} c={RB} />} /><Td c={<Badge s={String(u.status)} c={SB} />} /><Td c={<Badge s={String(u.kycStatus)} c={KB} />} /></tr>)}</Tbl>}
  </div>;
}

function Ld() {
  const [d, setD] = useState<any[]>([]); const [l, setL] = useState(true);
  useEffect(() => { setL(true); api.admin.leads().then(r => { if (r.success) setD(r.data as any[]) }).finally(() => setL(false)) }, []);
  return <div className="space-y-4"><Head t="Leads" n={d.length} />
    {l ? <Sk l={6} /> : d.length === 0 ? <Mt i="??" t="No leads yet" /> : <Tbl h={["Name","Contact","Requirement","Status","Score","Date"]}>{d.map(l => <tr key={String(l.id)} className="hover:bg-gray-50/50 transition-colors"><Td c={<span className="font-medium text-gray-900">{String(l.name)}</span>} /><Td c={<>{String(l.email || "")}<br />{String(l.phone || "")}</>} x="text-gray-500 text-xs" /><Td c={String(l.requirement || "")} x="text-gray-500 max-w-[200px] truncate text-xs" /><Td c={<Badge s={String(l.status)} c={ST} />} /><Td c={<span className="font-mono text-sm font-medium">{l.score != null ? String(l.score) : "-"}</span>} /><Td c={new Date(String(l.createdAt)).toLocaleDateString()} x="text-gray-400 text-xs" /></tr>)}</Tbl>}
  </div>;
}

function Cr() {
  const [d, setD] = useState<any[]>([]); const [l, setL] = useState(true);
  useEffect(() => { setL(true); api.admin.leads().then(r => { if (r.success) setD(r.data as any[]) }).finally(() => setL(false)) }, []);
  return <div className="space-y-4"><Head t="CRM - Lead Management" n={d.length} />
    {l ? <Sk l={5} /> : d.length === 0 ? <Mt i="??" t="No CRM data" /> : <div className="grid gap-3">{d.map(l => <Card key={String(l.id)} c={<div className="p-4"><div className="flex items-start justify-between"><div className="flex items-start gap-3"><Av n={String(l.name)} /><div><h3 className="font-semibold text-gray-900">{String(l.name)}</h3><p className="text-sm text-gray-500">{String(l.email || "")} {l.phone ? `| ${String(l.phone)}` : ""}</p>{String(l.requirement || "") && <p className="text-sm text-gray-500 mt-1.5 border-l-2 border-gray-200 pl-3">{String(l.requirement)}</p>}</div></div><div className="flex items-center gap-2"><Badge s={String(l.status)} c={ST} />{String(l.score ?? "") && <span className="text-xs font-mono bg-gray-50 px-2 py-1 rounded-lg text-gray-500">Score: {String(l.score)}</span>}</div></div></div>} />)}</div>}
  </div>;
}

function Tm() {
  const [d, setD] = useState<any[]>([]); const [l, setL] = useState(true); const [sh, setSh] = useState(false);
  const [n, setN] = useState(""); const [m, setM] = useState(""); const [des, setDes] = useState(""); const [r, setR] = useState("5"); const [ph, setPh] = useState("");
  const get = useCallback(() => { setL(true); api.cms.testimonials.list().then(r => { if (r.success) setD(r.data as any[]) }).finally(() => setL(false)) }, []);
  useEffect(() => { get() }, [get]);
  const add = async (e: any) => { e.preventDefault(); await api.cms.testimonials.create({ name: n, message: m, designation: des, rating: parseInt(r) || 5, photo: ph } as any); setN(""); setM(""); setDes(""); setR("5"); setPh(""); setSh(false); get() };
  const del = async (id: any) => { if (!confirm("Delete?")) return; await api.cms.testimonials.delete(id); get() };
  const tog = async (id: any, v: any) => { await api.cms.testimonials.update(id, { approved: !v }); get() };
  return <div className="space-y-4"><Head t="Testimonials" n={d.length} onAdd={() => setSh(!sh)} addLabel={sh ? "Cancel" : "+ Add"} />
    <Md show={sh} onClose={() => setSh(false)} t="Add Testimonial"><form onSubmit={add} className="space-y-4"><div className="grid grid-cols-2 gap-3"><Inp p="Name" v={n} s={setN} /><Inp p="Designation" v={des} s={setDes} /></div><Inp p="Rating (1-5)" v={r} s={setR} /><div><label className="block text-xs font-medium text-gray-500 mb-1.5">Photo</label><DragDropUpload onUpload={x => setPh(x)} label="Drop photo here" /></div><TA p="Testimonial message..." v={m} s={setM} /><button className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-all">Save Testimonial</button></form></Md>
    {l ? <Sk l={4} /> : d.length === 0 ? <Mt i="?" t="No testimonials" sub="Add your first testimonial" /> : <div className="grid gap-3">{d.map(x => <Card key={String(x.id)} c={<div className="p-4"><div className="flex items-start justify-between"><div className="flex items-start gap-3"><Av n={String(x.name)} src={String(x.photo || "")} /><div><p className="font-semibold text-gray-900">{String(x.name)}</p>{x.designation && <p className="text-xs text-gray-400">{String(x.designation)}</p>}<div className="text-amber-400 text-xs mt-1">{'\u2605'.repeat(Math.min(Number(x.rating) || 5, 5))}{'\u2606'.repeat(Math.max(5 - (Number(x.rating) || 5), 0))}</div><p className="text-sm text-gray-600 mt-2 italic">&ldquo;{String(x.message)}&rdquo;</p></div></div><div className="flex items-center gap-2"><button onClick={() => tog(String(x.id), Boolean(x.approved))} className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${x.approved ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>{x.approved ? "Approved" : "Pending"}</button><button onClick={() => del(String(x.id))} className="text-xs text-red-400 hover:text-red-600 font-medium">Delete</button></div></div></div>} />)}</div>}
  </div>;
}

function Bn() {
  const [d, setD] = useState<any[]>([]); const [l, setL] = useState(true); const [sh, setSh] = useState(false);
  const [ti, setTi] = useState(""); const [sub, setSub] = useState(""); const [des, setDes] = useState(""); const [img, setImg] = useState(""); const [lnk, setLnk] = useState(""); const [lnkT, setLnkT] = useState(""); const [pos, setPos] = useState("hero");
  const get = useCallback(() => { setL(true); api.cms.banners.list().then(r => { if (r.success) setD(r.data as any[]) }).finally(() => setL(false)) }, []);
  useEffect(() => { get() }, [get]);
  const add = async (e: any) => { e.preventDefault(); await api.cms.banners.create({ title: ti, subtitle: sub, description: des, image: img, link: lnk, linkText: lnkT, position: pos }); setTi(""); setSub(""); setDes(""); setImg(""); setLnk(""); setLnkT(""); setSh(false); get() };
  const del = async (id: string) => { if (!confirm("Delete?")) return; await api.cms.banners.delete(id); get() };
  const tog = async (id: string, v: boolean) => { await api.cms.banners.update(id, { isActive: !v }); get() };
  return <div className="space-y-4"><Head t="Banners" n={d.length} onAdd={() => setSh(!sh)} addLabel={sh ? "Cancel" : "+ Add"} />
    <Md show={sh} onClose={() => setSh(false)} t="Add Banner"><form onSubmit={add} className="space-y-4"><div className="grid grid-cols-2 gap-3"><Inp p="Title" v={ti} s={setTi} /><Inp p="Subtitle" v={sub} s={setSub} /></div><div className="grid grid-cols-2 gap-3"><Inp p="Link URL" v={lnk} s={setLnk} /><Inp p="Link Text" v={lnkT} s={setLnkT} /></div><select value={pos} onChange={e => setPos(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/10 outline-none bg-white"><option value="hero">Hero Banner</option><option value="promo">Promo Banner</option><option value="sidebar">Sidebar</option></select><div><label className="block text-xs font-medium text-gray-500 mb-1.5">Banner Image</label><DragDropUpload onUpload={x => setImg(x)} label="Drop banner image here" /></div><TA p="Description" v={des} s={setDes} /><button className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-all">Save Banner</button></form></Md>
    {l ? <Sk l={4} /> : d.length === 0 ? <Mt i="??" t="No banners" sub="Create your first banner" /> : <div className="grid gap-3">{d.map(x => <Card key={String(x.id)} c={<div className="p-4 flex items-start gap-4 hover:shadow-md transition-shadow">{String(x.image || "") && <img src={String(x.image)} className="w-28 h-20 object-cover rounded-xl flex-shrink-0" alt="" />}<div className="flex-1 min-w-0"><p className="font-semibold text-gray-900">{String(x.title)}</p><p className="text-sm text-gray-500">{String(x.subtitle || "")}</p><p className="text-xs text-gray-400 mt-1">Position: <span className="font-medium">{String(x.position)}</span></p></div><div className="flex items-center gap-2 flex-shrink-0"><button onClick={() => tog(String(x.id), Boolean(x.isActive))} className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${String(x.isActive) === "true" ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-500"}`}>{String(x.isActive) === "true" ? "Active" : "Inactive"}</button><button onClick={() => del(String(x.id))} className="text-red-400 hover:text-red-600 text-xs font-medium">Delete</button></div></div>} />)}</div>}
  </div>;
}

function Bl() {
  const [d, setD] = useState<any[]>([]); const [l, setL] = useState(true);
  const [ti, setTi] = useState(""); const [ct, setCt] = useState(""); const [eid, setEid] = useState<string | null>(null);
  const get = useCallback(() => { setL(true); api.cms.blogs.list().then(r => { if (r.success) setD(r.data as any[]) }).finally(() => setL(false)) }, []);
  useEffect(() => { get() }, [get]);
  const save = async (e: any) => { e.preventDefault(); if (!ti.trim() || !ct.trim()) return; if (eid) { await api.cms.blogs.update(eid, { title: ti, content: ct }) } else { await api.cms.blogs.create({ title: ti, content: ct, published: false }) } setTi(""); setCt(""); setEid(null); get() };
  const ed = (p: any) => { setEid(String(p.id)); setTi(String(p.title)); setCt(String(p.content)) };
  const del = async (id: string) => { if (!confirm("Delete?")) return; await api.cms.blogs.delete(id); get() };
  const tog = async (p: any) => { await api.cms.blogs.update(String(p.id), { published: !p.published }); get() };
  return <div className="space-y-4"><Head t="Blog Posts" n={d.length} />
    <Card c={<div className="p-5"><h3 className="font-semibold text-gray-900 text-sm mb-3">{eid ? "Edit Post" : "New Post"}</h3><form onSubmit={save} className="space-y-3"><Inp p="Post title" v={ti} s={setTi} /><TA p="Write your content..." v={ct} s={setCt} /><div className="flex gap-2"><button className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-all">{eid ? "Update" : "Publish"}</button>{eid && <button type="button" onClick={() => { setEid(null); setTi(""); setCt("") }} className="border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold px-5 py-2.5 rounded-lg transition-all">Cancel</button>}</div></form></div>} />
    {l ? <Sk l={4} /> : d.length === 0 ? <Mt i="??" t="No blog posts" /> : <div className="grid gap-3">{d.map(p => <Card key={String(p.id)} c={<div className="p-4 hover:shadow-md transition-shadow"><div className="flex items-start justify-between"><div className="flex-1 min-w-0"><h3 className="font-semibold text-gray-900">{String(p.title)}</h3><p className="text-sm text-gray-500 mt-1 line-clamp-2">{String(p.content)}</p><p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>{new Date(String(p.createdAt)).toLocaleDateString()}</p></div><div className="flex items-center gap-2 ml-4"><button onClick={() => tog(p)} className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${p.published ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>{p.published ? "Published" : "Draft"}</button><button onClick={() => ed(p)} className="text-gray-400 hover:text-gray-600 text-xs font-medium">Edit</button><button onClick={() => del(String(p.id))} className="text-red-400 hover:text-red-600 text-xs font-medium">Delete</button></div></div></div>} />)}</div>}
  </div>;
}


function MdSec() {
  const [d, setD] = useState<any[]>([]); const [l, setL] = useState(true);
  const [ti, setTi] = useState(""); const [u, setU] = useState(""); const [tp, setTp] = useState("video"); const [des, setDes] = useState("");
  const get = useCallback(() => { setL(true); api.cms.media.list().then(r => { if (r.success) setD(r.data as any[]) }).finally(() => setL(false)) }, []);
  useEffect(() => { get() }, [get]);
  const add = async (e: any) => { e.preventDefault(); if (!ti.trim() || !u.trim()) return; await api.cms.media.create({ title: ti, url: u, type: tp, description: des } as any); setTi(""); setU(""); setDes(""); get() };
  const del = async (id: any) => { if (!confirm("Delete?")) return; await api.cms.media.delete(id); get() };
  return <div>Media</div>;
}


function Ph() {
  const [d, setD] = useState<any[]>([]); const [l, setL] = useState(true);
  const get = useCallback(() => { setL(true); api.cms.photos.list().then(r => { if (r.success) setD(r.data as any[]) }).finally(() => setL(false)) }, []);
  useEffect(() => { get() }, [get]);
  const del = async (id: string) => { if (!confirm("Delete?")) return; await api.cms.photos.delete(id); get() };
  return <div className="space-y-4"><Head t="Photo Gallery" n={d.length} />
    <DragDropUpload onUpload={async (url, file) => { await api.cms.photos.create({ name: file.name, url, fileSize: file.size, mimeType: file.type }); get() }} label="Drop photos here or click to browse" />
    {l ? <Sk l={4} /> : d.length === 0 ? <Mt i="??" t="No photos yet" sub="Drop images above to get started" /> : <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{d.map(p => <div key={String(p.id)} className="group relative rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 hover:shadow-lg transition-all"><img src={String(p.url)} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" alt="" /><div className="p-2.5 flex items-center justify-between bg-white"><p className="text-xs font-medium text-gray-700 truncate">{String(p.name)}</p><button onClick={() => del(String(p.id))} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium">Delete</button></div></div>)}</div>}
  </div>;
}

function St() {
  const [settings, setSettings] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [l, setL] = useState(true); const [logoUrl, setLogoUrl] = useState(""); const [toast, setToast] = useState("");
  useEffect(() => { api.admin.settings().then(r => { if (r.success) { const d = r.data as any; setSettings(d); const f: Record<string, string> = {}; Object.entries(d).forEach(([k, v]) => { f[k] = String(v) }); setForm(f); if (d.site_logo) setLogoUrl(String(d.site_logo)) } }).finally(() => setL(false)) }, []);
  const save = async () => { await api.admin.updateSettings(form); setToast("Settings saved!") };
  if (l) return <Sk l={6} />;
  return <div className="space-y-4">{toast && <Ts msg={toast} onClose={() => setToast("")} />}<Head t="Site Settings" />
    <Card c={<div className="p-5 space-y-5"><h3 className="font-semibold text-gray-900">Logo & Branding</h3><div className="flex items-center gap-5"><div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">{logoUrl ? <img src={logoUrl} className="w-full h-full object-cover" alt="Logo" /> : <span className="text-white font-bold text-xl">GA</span>}</div><div className="flex-1 space-y-2"><DragDropUpload onUpload={x => { setForm(f => ({ ...f, site_logo: x })); setLogoUrl(x) }} label="Drop logo here" /><div><label className="block text-xs text-gray-500 font-medium mb-1.5">Or enter Logo URL</label><input value={form.site_logo || ""} onChange={e => { setForm(f => ({ ...f, site_logo: e.target.value })); setLogoUrl(e.target.value) }} className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/10 outline-none" placeholder="https://example.com/logo.png" /></div></div></div></div>} />
    {settings && Object.keys(settings).length === 0 ? <Mt i="??" t="No settings" /> : <Card c={<div className="p-5 space-y-3">{Object.keys(settings || {}).map(k => <div key={k}><label className="block text-xs text-gray-500 font-medium mb-1 uppercase">{k.replace(/_/g, " ")}</label><input value={form[k] || ""} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/10 outline-none transition-all" /></div>)}<button onClick={save} className="mt-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all shadow-md">Save Settings</button></div>} />}
  </div>;
}
