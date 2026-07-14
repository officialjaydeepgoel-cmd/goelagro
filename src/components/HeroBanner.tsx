import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold-400 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              India&apos;s Premier Agri-Export Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Export Premium Indian Agricultural Products{" "}
              <span className="text-gold-400">Worldwide</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl">
              Connecting Indian farmers and suppliers with global buyers. 
              Trusted source for high-quality grains, spices, pulses, and more.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="btn-gold text-lg px-8 py-4">
                Request a Quote
              </Link>
              <Link href="/products" className="border-2 border-white text-white hover:bg-white hover:text-primary-800 font-semibold px-8 py-4 rounded-lg transition-all duration-200 text-lg inline-flex items-center gap-2">
                View Products
              </Link>
              <Link href="/buyers" className="border-2 border-white/50 text-white/90 hover:border-white hover:text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 text-lg">
                Become a Buyer
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8 text-sm text-white/60">
              <span>✅ 500+ Buyers Worldwide</span>
              <span>✅ 50+ Export Destinations</span>
              <span>✅ Quality Guaranteed</span>
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {["Wheat", "Rice", "Spices", "Pulses"].map((item, i) => (
              <div
                key={item}
                className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 ${i === 1 || i === 2 ? "translate-y-8" : ""}`}
              >
                <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center text-2xl mb-3">
                  {["🌾", "🍚", "🌶️", "🫘"][i]}
                </div>
                <h3 className="font-semibold text-white mb-1">{item}</h3>
                <p className="text-sm text-white/60">Premium Export Quality</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
