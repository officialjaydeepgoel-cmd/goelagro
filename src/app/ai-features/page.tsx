export default function AIFeaturesPage() {
  const features = [
    {
      title: "AI Product Recommendation",
      description: "Our AI analyzes your requirements and suggests the best products, grades, and packaging options tailored to your specific needs.",
      icon: "🎯",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "AI Chat Support",
      description: "24/7 intelligent chatbot that answers your queries about products, pricing, shipping, and documentation instantly.",
      icon: "💬",
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Automatic Quotation Generator",
      description: "Generate instant, accurate quotations based on quantity, destination, and specifications with real-time pricing.",
      icon: "📄",
      color: "bg-amber-100 text-amber-600",
    },
    {
      title: "Lead Management Dashboard",
      description: "Smart lead scoring and management system that helps suppliers prioritize and respond to high-value buyers.",
      icon: "📊",
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">🤖 New</span>
            <span className="px-3 py-1 bg-gold-400/20 text-gold-300 rounded-full text-sm">AI-Powered</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">AI Features</h1>
          <p className="text-white/80 text-lg">Leverage artificial intelligence to streamline your agricultural export business</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="card p-8 group hover:-translate-y-1 transition-all duration-300">
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 md:p-12 border border-primary-200">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Try Our AI Assistant
              </h2>
              <p className="text-gray-600 mb-6">
                Get instant answers about products, pricing, shipping, and more. Our AI assistant is available 24/7 to help you with your export needs.
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>⚡ Instant response</span>
                <span>🌐 Multi-language</span>
                <span>🔒 Secure</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">AI</div>
                <div>
                  <p className="font-semibold text-sm">Goel Agro AI Assistant</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="bg-gray-100 rounded-lg p-3 text-sm max-w-xs">
                  Hello! How can I help you with agricultural exports today?
                </div>
                <div className="bg-primary-50 rounded-lg p-3 text-sm max-w-xs ml-auto">
                  I need pricing for Basmati Rice to Dubai
                </div>
                <div className="bg-gray-100 rounded-lg p-3 text-sm max-w-xs">
                  Sure! Our current FOB price for Premium Basmati Rice is $1,150/MT. Would you like a detailed quote?
                </div>
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="Type your message..." className="input-field text-sm" readOnly />
                <button className="btn-primary px-4 py-2 text-sm">Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
