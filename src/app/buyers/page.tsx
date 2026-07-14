"use client";
import { useState } from "react";
import { buyerFields } from "@/lib/data";

export default function BuyersPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for registering as a buyer. Our trade team will review your details and connect with you within 24 hours.
          </p>
          <a href="/" className="btn-primary">Back to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Become a Buyer</h1>
          <p className="text-white/80 text-lg">Register to access premium Indian agricultural products at competitive prices</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Buyer Registration</h2>
            <p className="text-gray-600 text-sm">Fill in your details and our team will get in touch with product catalogs and pricing.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {buyerFields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea className="input-field" rows={3} placeholder={`Enter ${field.label.toLowerCase()}`} />
                ) : field.type === "select" ? (
                  <select className="input-field" required={field.required}>
                    <option value="">Select...</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input type={field.type} className="input-field" required={field.required} placeholder={`Enter ${field.label.toLowerCase()}`} />
                )}
              </div>
            ))}
            <button type="submit" className="btn-primary w-full justify-center text-lg py-4">
              Submit Registration
            </button>
            <p className="text-xs text-gray-500 text-center">
              By submitting, you agree to our Terms of Service and Privacy Policy. We&apos;ll never share your information with third parties.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
