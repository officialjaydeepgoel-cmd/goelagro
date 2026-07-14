export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  images: string[];
  specifications: { label: string; value: string }[];
  origin: string;
  moisture: string;
  packaging: string;
  moq: string;
  hsCode: string;
  certifications: string[];
  category: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Wheat",
    slug: "wheat",
    tagline: "High-quality Indian wheat for global markets",
    description: "India is one of the largest producers of wheat in the world. Our premium wheat is sourced from the finest farms of Punjab, Haryana, and Madhya Pradesh, ensuring high protein content and excellent milling quality.",
    images: ["/images/wheat.jpg"],
    specifications: [
      { label: "Protein Content", value: "11-13%" },
      { label: "Gluten Content", value: "8-10%" },
      { label: "Test Weight", value: "78-82 kg/hl" },
      { label: "Foreign Matter", value: "< 1%" },
    ],
    origin: "India (Punjab, Haryana, MP)",
    moisture: "12% Max",
    packaging: "25kg, 50kg PP Bags / Jute Bags",
    moq: "25 Metric Tons",
    hsCode: "1001.19",
    certifications: ["FSSAI", "ISO 22000", "APEDA"],
    category: "Grains",
  },
  {
    id: "2",
    name: "Basmati Rice",
    slug: "rice",
    tagline: "Premium aromatic Basmati rice for export",
    description: "Our premium Basmati rice is known for its long grains, aromatic fragrance, and excellent cooking quality. Sourced from the foothills of the Himalayas, it meets international export standards.",
    images: ["/images/rice.jpg"],
    specifications: [
      { label: "Grain Length", value: "8.4mm+" },
      { label: "Sortex", value: "100% Sortex Cleaned" },
      { label: "Broken Grains", value: "< 1%" },
      { label: "Purity", value: "99.5%" },
    ],
    origin: "India (Haryana, Punjab, UP)",
    moisture: "12% Max",
    packaging: "5kg, 10kg, 25kg, 50kg PP Bags",
    moq: "20 Metric Tons",
    hsCode: "1006.30",
    certifications: ["FSSAI", "APEDA", "ISO 22000", "Organic (NPOP)"],
    category: "Grains",
  },
  {
    id: "3",
    name: "Yellow Maize",
    slug: "maize",
    tagline: "High-grade Indian maize for animal feed & industrial use",
    description: "Indian yellow maize is known for its high starch content and nutritional value. Ideal for animal feed, poultry feed, and industrial applications including ethanol production.",
    images: ["/images/maize.jpg"],
    specifications: [
      { label: "Starch Content", value: "65-68%" },
      { label: "Protein Content", value: "8-10%" },
      { label: "Oil Content", value: "3.5-4.5%" },
      { label: "Aflatoxin", value: "< 20 PPB" },
    ],
    origin: "India (Karnataka, Bihar, Rajasthan)",
    moisture: "14% Max",
    packaging: "25kg, 50kg PP Bags / Bulk",
    moq: "50 Metric Tons",
    hsCode: "1005.90",
    certifications: ["FSSAI", "ISO 9001"],
    category: "Grains",
  },
  {
    id: "4",
    name: "Sweet Corn",
    slug: "corn",
    tagline: "Fresh and frozen sweet corn for international buyers",
    description: "Premium quality sweet corn grown in ideal climatic conditions. Available fresh, frozen, and canned. Non-GMO and naturally sweet.",
    images: ["/images/corn.jpg"],
    specifications: [
      { label: "Sugar Content", value: "14-16%" },
      { label: "Size", value: "18-22 cm" },
      { label: "Color", value: "Golden Yellow" },
      { label: "Gmo", value: "Non-GMO" },
    ],
    origin: "India (Maharashtra, Karnataka, Tamil Nadu)",
    moisture: "75-78% (Fresh)",
    packaging: "Fresh: 12kg Crates / Frozen: 1kg, 500g Bags",
    moq: "10 Metric Tons",
    hsCode: "0710.40",
    certifications: ["FSSAI", "APEDA", "HACCP"],
    category: "Vegetables",
  },
  {
    id: "5",
    name: "Indian Pulses",
    slug: "pulses",
    tagline: "Protein-rich pulses sourced directly from Indian farms",
    description: "India is the world's largest producer of pulses. We offer a wide variety including Toor Dal, Urad Dal, Moong Dal, Chana Dal, and Masoor Dal. Rich in protein and essential nutrients.",
    images: ["/images/pulses.jpg"],
    specifications: [
      { label: "Protein Content", value: "20-25%" },
      { label: "Purity", value: "99% Min" },
      { label: "Moisture", value: "12% Max" },
      { label: "Packing", value: "Vacuum / Standard" },
    ],
    origin: "India (MP, UP, Rajasthan, Maharashtra)",
    moisture: "12% Max",
    packaging: "1kg, 5kg, 25kg, 50kg PP Bags",
    moq: "20 Metric Tons",
    hsCode: "0713.90",
    certifications: ["FSSAI", "APEDA", "ISO 22000"],
    category: "Pulses",
  },
  {
    id: "6",
    name: "Indian Spices",
    slug: "spices",
    tagline: "Aromatic and authentic Indian spices for global cuisine",
    description: "India is known as the 'Spice Bowl of the World'. We export premium quality spices including Turmeric, Red Chili, Cumin, Coriander, Cardamom, Black Pepper, and Garam Masala blends.",
    images: ["/images/spices.jpg"],
    specifications: [
      { label: "Purity", value: "99.5% Min" },
      { label: "Volatile Oil", value: "As per standard" },
      { label: "Color Value", value: "As per standard" },
      { label: "Microbiological", value: "Compliant" },
    ],
    origin: "India (Kerala, Karnataka, Rajasthan, MP)",
    moisture: "8-10% Max",
    packaging: "500g, 1kg, 5kg, 25kg as per requirement",
    moq: "5 Metric Tons",
    hsCode: "0904-0910 (Varies)",
    certifications: ["FSSAI", "ASTA", "ESA", "ISO 22000", "Organic"],
    category: "Spices",
  },
  {
    id: "7",
    name: "Oil Seeds",
    slug: "oil-seeds",
    tagline: "Premium oil seeds for crushing and edible oil production",
    description: "We export high-quality Indian oil seeds including Mustard Seeds, Groundnuts, Sesame Seeds, Soybean, and Sunflower Seeds. Cold-pressed and solvent-extraction grade available.",
    images: ["/images/oil-seeds.jpg"],
    specifications: [
      { label: "Oil Content", value: "38-45%" },
      { label: "FFA", value: "< 2%" },
      { label: "Purity", value: "99% Min" },
      { label: "Protein (Meal)", value: "35-40%" },
    ],
    origin: "India (Gujarat, Rajasthan, MP, Maharashtra)",
    moisture: "7-9% Max",
    packaging: "25kg, 50kg PP Bags / Bulk",
    moq: "25 Metric Tons",
    hsCode: "1207.90",
    certifications: ["FSSAI", "ISO 22000", "APEDA"],
    category: "Oil Seeds",
  },
  {
    id: "8",
    name: "Animal Feed",
    slug: "animal-feed",
    tagline: "Nutritious animal feed for livestock and poultry",
    description: "Our animal feed products are formulated to provide optimal nutrition for cattle, poultry, and aquaculture. Made from high-quality ingredients with balanced protein, energy, and mineral content.",
    images: ["/images/animal-feed.jpg"],
    specifications: [
      { label: "Protein Content", value: "18-22%" },
      { label: "Crude Fiber", value: "6-8%" },
      { label: "Metabolizable Energy", value: "2800-3200 Kcal/kg" },
      { label: "Calcium", value: "0.8-1.2%" },
    ],
    origin: "India (Punjab, Haryana, Gujarat, Andhra Pradesh)",
    moisture: "10% Max",
    packaging: "25kg, 40kg, 50kg PP Bags",
    moq: "25 Metric Tons",
    hsCode: "2309.90",
    certifications: ["ISO 22000", "GMP", "FSSAI"],
    category: "Feed",
  },
];

export const marketPrices = [
  { commodity: "Wheat", price: "₹2,450", unit: "Per Quintal", change: "+2.3%", trend: "up" },
  { commodity: "Basmati Rice", price: "₹7,800", unit: "Per Quintal", change: "+1.8%", trend: "up" },
  { commodity: "Maize", price: "₹2,180", unit: "Per Quintal", change: "-0.5%", trend: "down" },
  { commodity: "Soybean", price: "₹4,850", unit: "Per Quintal", change: "+3.1%", trend: "up" },
  { commodity: "Mustard", price: "₹5,620", unit: "Per Quintal", change: "+1.2%", trend: "up" },
  { commodity: "Cotton", price: "₹7,450", unit: "Per Quintal", change: "-0.8%", trend: "down" },
];

export const services = [
  {
    title: "Export Documentation",
    description: "Complete handling of all export documentation including Bill of Lading, Certificate of Origin, Phytosanitary Certificate, and customs clearance.",
    icon: "📄",
  },
  {
    title: "Custom Packaging",
    description: "Tailored packaging solutions as per buyer requirements - from retail-ready packs to bulk shipments with your branding.",
    icon: "📦",
  },
  {
    title: "Quality Inspection",
    description: "Third-party quality inspection and certification services to ensure products meet international standards.",
    icon: "✅",
  },
  {
    title: "Logistics",
    description: "End-to-end logistics management including FCL, LCL, and air freight solutions with real-time tracking.",
    icon: "🚢",
  },
  {
    title: "Container Booking",
    description: "Hassle-free container booking with competitive rates from all major shipping lines operating in India.",
    icon: "📋",
  },
  {
    title: "Freight Forwarding",
    description: "Comprehensive freight forwarding services covering sea, air, and multimodal transportation worldwide.",
    icon: "✈️",
  },
];

export const certifications = [
  "FSSAI Certified",
  "ISO 22000:2018",
  "APEDA Registered",
  "HACCP Certified",
  "Organic (NPOP/NOP)",
  "GMP Certified",
  "Halal Certified",
  "FDA Registered",
];

export const testimonials = [
  {
    name: "Ahmed Al-Rashid",
    company: "Gulf Foods Trading LLC",
    location: "Dubai, UAE",
    text: "Goel Agro Global has been our trusted partner for Indian rice and spices. Their quality consistency and timely delivery are exceptional.",
    rating: 5,
  },
  {
    name: "John Miller",
    company: "Miller Grains Inc.",
    location: "New York, USA",
    text: "The best Indian wheat we've imported. Excellent protein content and milling quality. Highly recommended for millers worldwide.",
    rating: 5,
  },
  {
    name: "Mohammed Al-Saud",
    company: "Al-Riyadh Trading",
    location: "Riyadh, KSA",
    text: "Professional team with deep knowledge of agricultural exports. Their documentation and logistics are flawless.",
    rating: 5,
  },
];

export interface AdminStats {
  totalProducts: number;
  totalBuyers: number;
  totalSuppliers: number;
  totalInquiries: number;
  pendingQuotes: number;
  monthlyRevenue: string;
}

export const adminStats: AdminStats = {
  totalProducts: 48,
  totalBuyers: 234,
  totalSuppliers: 89,
  totalInquiries: 1247,
  pendingQuotes: 18,
  monthlyRevenue: "₹5.8 Cr",
};

export const buyerFields = [
  { name: "companyName", label: "Company Name", type: "text", required: true },
  { name: "contactPerson", label: "Contact Person", type: "text", required: true },
  { name: "email", label: "Business Email", type: "email", required: true },
  { name: "phone", label: "Phone Number", type: "tel", required: true },
  { name: "country", label: "Country", type: "text", required: true },
  { name: "products", label: "Products Interested In", type: "select", required: true, options: ["Wheat", "Rice", "Maize", "Corn", "Pulses", "Spices", "Oil Seeds", "Animal Feed", "Multiple"] },
  { name: "quantity", label: "Monthly Requirement (MT)", type: "number", required: true },
  { name: "message", label: "Message", type: "textarea", required: false },
];

export const supplierFields = [
  { name: "farmName", label: "Farm / Company Name", type: "text", required: true },
  { name: "ownerName", label: "Owner / Contact Person", type: "text", required: true },
  { name: "email", label: "Email Address", type: "email", required: true },
  { name: "phone", label: "Phone Number", type: "tel", required: true },
  { name: "state", label: "State", type: "text", required: true },
  { name: "products", label: "Products Supplied", type: "select", required: true, options: ["Wheat", "Rice", "Maize", "Corn", "Pulses", "Spices", "Oil Seeds", "Animal Feed", "Multiple"] },
  { name: "capacity", label: "Monthly Supply Capacity (MT)", type: "number", required: true },
  { name: "certifications", label: "Certifications (if any)", type: "text", required: false },
];
