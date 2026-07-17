"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, setTokens, storeUser } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.auth.login(email, password);
      if (res.success && res.data) {
        setTokens(res.data.accessToken, res.data.refreshToken);
        storeUser(res.data.user as Record<string, unknown>);
        router.push("/admin");
      } else {
        setError(res.message || "Invalid credentials");
      }
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">BV</span>
            </div>
            <h1 className="text-xl font-bold text-white">Admin Login</h1>
            <p className="text-gray-400 text-sm mt-1">Goel Agro Global CMS</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
            <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
            {error && <p className="text-red-400 text-sm bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
