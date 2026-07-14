"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
    role: "BUYER", companyName: "", companyType: "EXPORTER",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
        companyName: form.companyName || undefined,
        companyType: form.companyType || undefined,
      });

      if (res.success) {
        setSuccess("Registration successful! Please check your email to verify your account.");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(res.message || "Registration failed");
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-xl">GA</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
          <p className="text-gray-500 mt-1">Join Goel Agro Global marketplace</p>
        </div>

        {success ? (
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-600">{success}</p>
          </div>
        ) : (
          <div className="card p-6">
            {/* Steps Indicator */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2].map(s => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-500"}`}>{s}</div>
                  <span className={`text-sm ${step >= s ? "text-primary-600 font-medium" : "text-gray-400"}`}>{s === 1 ? "Account" : "Business"}</span>
                  {s === 1 && <div className="flex-1 h-0.5 bg-gray-200" />}
                </div>
              ))}
            </div>

            <form onSubmit={handleRegister}>
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input value={form.name} onChange={e => update("name", e.target.value)} className="input-field" required placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input type="email" value={form.email} onChange={e => update("email", e.target.value)} className="input-field" required placeholder="you@company.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} className="input-field" required placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                    <input type="password" value={form.password} onChange={e => update("password", e.target.value)} className="input-field" required placeholder="Min 8 characters" minLength={8} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                    <input type="password" value={form.confirmPassword} onChange={e => update("confirmPassword", e.target.value)} className="input-field" required placeholder="Re-enter password" minLength={8} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">I am a *</label>
                    <select value={form.role} onChange={e => update("role", e.target.value)} className="input-field" required>
                      <option value="BUYER">Buyer (I want to purchase)</option>
                      <option value="SELLER">Seller (I want to export)</option>
                    </select>
                  </div>
                  <button type="button" onClick={() => setStep(2)} className="btn-primary w-full justify-center">
                    Next - Business Details
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name <span className="text-gray-400">(optional)</span></label>
                    <input value={form.companyName} onChange={e => update("companyName", e.target.value)} className="input-field" placeholder="Your company name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Type <span className="text-gray-400">(optional)</span></label>
                    <select value={form.companyType} onChange={e => update("companyType", e.target.value)} className="input-field">
                      <option value="EXPORTER">Exporter</option>
                      <option value="IMPORTER">Importer</option>
                      <option value="BOTH">Both</option>
                    </select>
                  </div>
                  {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center">Back</button>
                    <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center disabled:opacity-50">
                      {loading ? "Creating Account..." : "Create Account"}
                    </button>
                  </div>
                </div>
              )}
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
