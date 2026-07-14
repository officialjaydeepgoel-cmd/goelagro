"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { api, isAuthenticated, getStoredUser, clearTokens } from "@/lib/api";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Market Prices", href: "/market-prices" },
  { label: "Services", href: "/services" },
  { label: "AI Features", href: "/ai-features" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [auth, setAuth] = useState({ loggedIn: false, role: "", name: "" });
  const [siteLogo, setSiteLogo] = useState("");

  useEffect(() => {
    setAuth({
      loggedIn: isAuthenticated(),
      role: (getStoredUser()?.role as string) || "",
      name: (getStoredUser()?.name as string) || "",
    });
    api.admin.settings().then(r => {
      if (r.success) {
        const d = r.data as Record<string, string>;
        if (d.site_logo) setSiteLogo(d.site_logo);
      }
    }).catch(() => {});
  }, []);

  const handleLogout = () => {
    clearTokens();
    setAuth({ loggedIn: false, role: "", name: "" });
    router.push("/");
  };

  const dashboardHref = auth.role === "ADMIN" || auth.role === "SUPER_ADMIN"
    ? "/admin" : auth.role === "SELLER" ? "/seller" : auth.role === "BUYER" ? "/buyer" : "/control-panel";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center overflow-hidden">
              {siteLogo ? <img src={siteLogo} alt="Logo" className="w-full h-full object-cover" /> : <span className="text-white font-bold text-lg">GA</span>}
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900">Goel Agro</span>
              <span className="text-xl font-bold text-primary-600"> Global</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {auth.loggedIn && (
              <Link href="/control-panel" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors border border-primary-200 rounded-lg px-3 py-1">
                Control Panel
              </Link>
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {auth.loggedIn ? (
              <>
                <Link href={dashboardHref} className="btn-primary text-sm px-4 py-2">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-secondary text-sm px-4 py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-sm px-4 py-2">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm px-4 py-2">
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {auth.loggedIn && (
              <Link href="/control-panel" className="block px-4 py-2 text-primary-600 font-semibold hover:bg-primary-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                Control Panel
              </Link>
            )}
            <hr className="my-3" />
            {auth.loggedIn ? (
              <>
                <Link href={dashboardHref} className="block text-center btn-primary" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="block w-full text-center btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-center btn-secondary" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="block text-center btn-primary" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
