import Link from "next/link";
import type { Product } from "@/lib/data";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="card p-0 group overflow-hidden">
      <div className="h-48 bg-gray-100 overflow-hidden">
        <img
          src={product.images[0] || "/images/placeholder.jpg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3">{product.tagline}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
            {product.origin.split(",")[0]}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            MOQ: {product.moq}
          </span>
        </div>
        <div className="flex items-center text-primary-600 font-medium text-sm">
          View Details →
        </div>
      </div>
    </Link>
  );
}
