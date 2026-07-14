import { marketPrices } from "@/lib/data";

export default function MarketPriceTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-primary-600 text-white">
            <th className="text-left px-6 py-4 font-semibold">Commodity</th>
            <th className="text-left px-6 py-4 font-semibold">Price</th>
            <th className="text-left px-6 py-4 font-semibold">Unit</th>
            <th className="text-right px-6 py-4 font-semibold">Change</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {marketPrices.map((item) => (
            <tr key={item.commodity} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">{item.commodity}</td>
              <td className="px-6 py-4 text-gray-800">{item.price}</td>
              <td className="px-6 py-4 text-gray-500">{item.unit}</td>
              <td className={`px-6 py-4 text-right font-medium ${item.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                <span className="flex items-center justify-end gap-1">
                  {item.trend === "up" ? "↑" : "↓"} {item.change}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
