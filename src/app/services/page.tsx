import ServiceCard from "@/components/ServiceCard";
import { services } from "@/lib/data";

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-primary-600 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Services</h1>
          <p className="text-white/80 text-lg">Comprehensive export services to make global trade seamless</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl border p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Why Choose Our Services?</h2>
              <ul className="space-y-3">
                {[
                  "10+ years of export experience",
                  "Presence in 50+ countries worldwide",
                  "End-to-end documentation support",
                  "Competitive freight rates",
                  "Quality assurance at every step",
                  "Dedicated account manager",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Need Custom Solutions?</h3>
              <p className="text-gray-600 text-sm mb-4">Our team can tailor services to your specific requirements.</p>
              <a href="/contact" className="btn-primary">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
