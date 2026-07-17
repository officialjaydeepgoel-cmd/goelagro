import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import MarketPriceTable from "@/components/MarketPriceTable";
import ServiceCard from "@/components/ServiceCard";
import { products, marketPrices, services, testimonials } from "@/lib/data";

export default function Home() {
  return (
    <>
      <HeroBanner />

      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Products</h2>
            <p className="section-subtitle">Premium quality Indian agricultural products sourced directly from certified farms</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/products" className="btn-primary">
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Live Market Prices</h2>
            <p className="section-subtitle">Real-time market prices for key agricultural commodities in India</p>
          </div>
          <div className="card overflow-hidden">
            <MarketPriceTable />
          </div>
          <div className="text-center mt-6 text-sm text-gray-500">
            * Prices updated daily from major APMC mandis across India
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">End-to-end export services to ensure smooth global trade</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">What Our Buyers Say</h2>
            <p className="section-subtitle">Trusted by importers and distributors across 50+ countries</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-6">
                <div className="flex text-gold-500 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j}>★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4 italic">&#34;{t.text}&#34;</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.company}, {t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join hundreds of global buyers who trust BuddyVerse for premium Indian agricultural products.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-gold text-lg px-8 py-4">
              Request a Quote
            </Link>
            <Link href="/buyers" className="border-2 border-white text-white hover:bg-white hover:text-primary-800 font-semibold px-8 py-4 rounded-lg transition-all duration-200 text-lg">
              Register as Buyer
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
