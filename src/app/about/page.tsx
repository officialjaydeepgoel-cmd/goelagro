import { certifications } from "@/lib/data";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-primary-600 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">About Us</h1>
          <p className="text-white/80 text-lg">India&apos;s trusted agricultural export partner since 2014</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="section-title">Company Profile</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              BuddyVerse is a premier agricultural export platform based in New Delhi, India. With over a decade of experience, we have been bridging the gap between Indian farmers and international buyers.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We work directly with farmer producer organizations (FPOs), agricultural cooperatives, and certified processing units to ensure the highest quality products at competitive prices.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our commitment to quality, transparency, and timely delivery has made us a preferred partner for importers across 50+ countries.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 border">
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Years in Business", value: "10+" },
                { label: "Export Destinations", value: "50+" },
                { label: "Happy Buyers", value: "500+" },
                { label: "Trusted Suppliers", value: "200+" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="card p-8">
            <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To empower Indian farmers by providing access to global markets and to deliver premium quality agricultural products to buyers worldwide through ethical trading practices.
            </p>
          </div>
          <div className="card p-8">
            <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center text-3xl mb-4">👁️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To be the most trusted and preferred platform for Indian agricultural exports, setting global standards for quality, transparency, and reliability in agri-trade.
            </p>
          </div>
        </div>

        <div>
          <h2 className="section-title text-center mb-8">Our Certifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {certifications.map((cert) => (
              <div key={cert} className="card p-4 text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{cert}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
