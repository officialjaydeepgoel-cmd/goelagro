"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, setTokens, storeUser } from "@/lib/api";

export default function LoginPage() {
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

        const role = (res.data.user as Record<string, string>).role;
        if (role === "ADMIN" || role === "SUPER_ADMIN") router.push("/admin");
        else if (role === "SELLER") router.push("/seller");
        else router.push("/buyer");
      } else {
        setError(res.message || "Invalid credentials");
      }
    } catch {
      setError("Server error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">BV</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your BuddyVerse account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="Enter your password" />
            </div>

            {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-lg py-3 disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Demo credentials:</p>
            <p className="mt-1 font-mono text-xs text-gray-400">
              Admin: admin@buddyverse.ai<br/>
              Seller: rajesh@punjabgrains.com<br/>
              Buyer: ahmed@dubaiimports.com<br/>
              Password: Password@123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
