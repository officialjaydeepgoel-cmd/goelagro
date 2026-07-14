import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";

export default function ProductsPage() {
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-600 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Products</h1>
          <p className="text-white/80 text-lg">Premium quality Indian agricultural products for global export</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3 mb-10">
          <span className="text-sm font-semibold text-gray-700 py-2">Categories:</span>
          {categories.map((cat) => (
            <span key={cat} className="text-sm bg-primary-100 text-primary-700 px-4 py-2 rounded-full font-medium">
              {cat}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-16 bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Can&apos;t Find What You&apos;re Looking For?</h2>
          <p className="text-gray-600 mb-6">We also export a variety of other agricultural products. Contact us with your requirements.</p>
          <Link href="/contact" className="btn-primary">
            Send Your Requirements
          </Link>
        </div>
      </div>
    </div>
  );
}
