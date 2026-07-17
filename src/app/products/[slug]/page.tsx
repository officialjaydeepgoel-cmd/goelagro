import Link from "next/link";
import { products } from "@/lib/data";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary-600">Products</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <div className="bg-white rounded-2xl p-8 flex items-center justify-center h-80 shadow-sm border">
              <span className="text-8xl opacity-80">
                {getProductEmoji(product.slug)}
              </span>
            </div>
            <div className="flex gap-3 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-20 h-20 bg-white rounded-xl border flex items-center justify-center text-3xl opacity-60 cursor-pointer hover:opacity-100 transition-opacity">
                  {getProductEmoji(product.slug)}
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="inline-block bg-primary-100 text-primary-700 text-sm font-medium px-3 py-1 rounded-full mb-3">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
            <p className="text-lg text-gray-600 mb-6">{product.tagline}</p>
            <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

            <div className="bg-white rounded-xl border divide-y mb-8">
              {product.specifications.map((spec) => (
                <div key={spec.label} className="flex items-center justify-between px-6 py-3">
                  <span className="text-gray-500">{spec.label}</span>
                  <span className="font-medium text-gray-900">{spec.value}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: "Origin", value: product.origin },
                { label: "Moisture", value: product.moisture },
                { label: "Packaging", value: product.packaging },
                { label: "MOQ", value: product.moq },
                { label: "HS Code", value: product.hsCode },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-lg border p-4">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {product.certifications.map((cert) => (
                  <span key={cert} className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full border border-green-200">
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <Link href={`/contact?product=${product.slug}`} className="btn-primary w-full justify-center text-lg py-4">
              Request Quote for {product.name}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function getProductEmoji(slug: string): string {
  const map: Record<string, string> = {
    wheat: "🌾",
    rice: "🍚",
    maize: "🌽",
    corn: "🌽",
    pulses: "🫘",
    spices: "🌶️",
    "oil-seeds": "🫒",
    "animal-feed": "🐄",
  };
  return map[slug] || "📦";
}
