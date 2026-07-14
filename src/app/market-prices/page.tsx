import MarketPriceTable from "@/components/MarketPriceTable";
import { marketPrices } from "@/lib/data";

export default function MarketPricesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-600 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Live Market Prices</h1>
          <p className="text-white/80 text-lg">Real-time wholesale prices from major APMC mandis across India</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b flex items-center justify-between">
                <span className="font-semibold text-gray-900">Commodity Prices</span>
                <span className="text-xs text-gray-500">Updated: Today 10:30 AM IST</span>
              </div>
              <MarketPriceTable />
            </div>
          </div>
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Market Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Commodities Tracked</span>
                  <span className="font-medium">{marketPrices.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Price Up</span>
                  <span className="font-medium text-green-600">4</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Price Down</span>
                  <span className="font-medium text-red-600">2</span>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Need a Quote?</h3>
              <p className="text-sm text-gray-600 mb-4">Get the latest export prices and availability for your required products.</p>
              <a href="/contact" className="btn-primary text-sm w-full justify-center">Request Price Quote</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
