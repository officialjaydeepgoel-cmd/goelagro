import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">BV</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white">Buddy</span>
                <span className="text-xl font-bold text-primary-400">Verse</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Connecting Indian Farmers to Global Buyers. Your trusted partner for premium Indian agricultural exports through BuddyVerse.
            </p>
            <div className="flex gap-3 mt-4">
              {["facebook", "twitter", "linkedin", "instagram"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label={social}
                >
                  <span className="text-xs uppercase">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "Market Prices", href: "/market-prices" },
                { label: "Services", href: "/services" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              {["Wheat", "Rice", "Maize", "Corn", "Pulses", "Spices", "Oil Seeds", "Animal Feed"].map((p) => (
                <li key={p}>
                  <Link href={`/products/${p.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-primary-400 transition-colors">
                    {p}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>123, Agri Export House, New Delhi - 110001, India</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <span>info@buddyverse.ai</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🕐</span>
                <span>Mon-Sat: 9:00 AM - 6:00 PM (IST)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-sm">
          <p>&copy; {new Date().getFullYear()} BuddyVerse. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary-400">Privacy Policy</a>
            <a href="#" className="hover:text-primary-400">Terms of Service</a>
            <a href="#" className="hover:text-primary-400">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
