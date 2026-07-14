import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Goel Agro Global database...");

  // Clean existing data
  await prisma.leadAssignment.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.savedSupplier.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.rFQ.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.marketPrice.deleteMany();
  await prisma.productSpecification.deleteMany();
  await prisma.product.deleteMany();
  await prisma.specificationTemplate.deleteMany();
  await prisma.category.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.buyerProfile.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  await prisma.service.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.pageContent.deleteMany();

  const passwordHash = await bcrypt.hash("Password@123", 12);

  // ─── SUPER ADMIN ───
  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "admin@goelagroglobal.com",
      phone: "+919999999999",
      passwordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      isVerified: true,
      kycStatus: "VERIFIED",
    },
  });
  console.log("✅ Super Admin created");

  // ─── COMPANIES ───
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: "Goel Agro Global Pvt. Ltd.",
        gstNumber: "07AABCU9603R1Z7",
        iecCode: "0798000123",
        address: "123, Agri Export House, Karol Bagh",
        city: "New Delhi",
        state: "Delhi",
        country: "India",
        pincode: "110001",
        website: "https://goelagroglobal.com",
        verifiedBadge: true,
        companyType: "EXPORTER",
        establishedYear: 2014,
        employeeCount: 150,
        annualRevenue: "₹50 Cr+",
      },
    }),
    prisma.company.create({
      data: {
        name: "Punjab Grains Exports",
        gstNumber: "03BOPPG1234R1Z7",
        iecCode: "0798000456",
        address: "456, Grain Market, Mandi Gobindgarh",
        city: "Ludhiana",
        state: "Punjab",
        country: "India",
        verifiedBadge: true,
        companyType: "EXPORTER",
        establishedYear: 2010,
      },
    }),
    prisma.company.create({
      data: {
        name: "Kerala Spice Traders",
        gstNumber: "32AABCK5678R1Z7",
        iecCode: "0798000789",
        address: "789, Spice Bazaar, Mattancherry",
        city: "Kochi",
        state: "Kerala",
        country: "India",
        verifiedBadge: true,
        companyType: "EXPORTER",
        establishedYear: 2008,
      },
    }),
    prisma.company.create({
      data: {
        name: "Gujarat Agro Exports",
        gstNumber: "24AABCG9012R1Z7",
        iecCode: "0798001011",
        address: "56, Agri Complex, CG Road",
        city: "Ahmedabad",
        state: "Gujarat",
        country: "India",
        verifiedBadge: false,
        companyType: "BOTH",
        establishedYear: 2016,
      },
    }),
    prisma.company.create({
      data: {
        name: "Dubai Food Imports LLC",
        address: "Jebel Ali Free Zone",
        city: "Dubai",
        country: "UAE",
        verifiedBadge: true,
        companyType: "IMPORTER",
        establishedYear: 2015,
      },
    }),
    prisma.company.create({
      data: {
        name: "Saudi Grains Company",
        address: "King Fahd Road",
        city: "Riyadh",
        country: "Saudi Arabia",
        verifiedBadge: true,
        companyType: "IMPORTER",
        establishedYear: 2012,
      },
    }),
  ]);

  console.log("✅ Companies created");

  // ─── SELLERS ───
  const sellers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Rajesh Kumar",
        email: "rajesh@punjabgrains.com",
        phone: "+919876543210",
        passwordHash,
        role: "SELLER",
        status: "ACTIVE",
        isVerified: true,
        kycStatus: "VERIFIED",
        companyId: companies[1].id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Sunil Varma",
        email: "sunil@keralaspice.com",
        phone: "+919876543211",
        passwordHash,
        role: "SELLER",
        status: "ACTIVE",
        isVerified: true,
        kycStatus: "VERIFIED",
        companyId: companies[2].id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Amit Patel",
        email: "amit@gujaratagro.com",
        phone: "+919876543212",
        passwordHash,
        role: "SELLER",
        status: "ACTIVE",
        isVerified: true,
        kycStatus: "PENDING",
        companyId: companies[3].id,
      },
    }),
  ]);

  await Promise.all([
    prisma.sellerProfile.create({
      data: {
        companyId: companies[1].id,
        businessType: "Grain Exporter",
        productCapacity: "5000 MT/month",
        minOrderValue: "$10,000",
        exportCountries: JSON.stringify(["UAE", "Saudi Arabia", "Bangladesh", "Nepal", "Indonesia"]),
        certifications: JSON.stringify(["FSSAI", "APEDA", "ISO 22000"]),
      },
    }),
    prisma.sellerProfile.create({
      data: {
        companyId: companies[2].id,
        businessType: "Spice Exporter",
        productCapacity: "1000 MT/month",
        minOrderValue: "$5,000",
        exportCountries: JSON.stringify(["USA", "UK", "Canada", "Australia", "Germany", "France"]),
        certifications: JSON.stringify(["FSSAI", "APEDA", "ISO 22000", "Organic", "Halal", "ASTA"]),
      },
    }),
    prisma.sellerProfile.create({
      data: {
        companyId: companies[3].id,
        businessType: "Multi-commodity Exporter",
        productCapacity: "3000 MT/month",
        minOrderValue: "$8,000",
        exportCountries: JSON.stringify(["UAE", "Oman", "Qatar", "Kuwait"]),
        certifications: JSON.stringify(["FSSAI"]),
      },
    }),
  ]);

  // ─── BUYERS ───
  const buyers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Ahmed Al-Rashid",
        email: "ahmed@dubaiimports.com",
        phone: "+971501234567",
        passwordHash,
        role: "BUYER",
        status: "ACTIVE",
        isVerified: true,
        kycStatus: "VERIFIED",
        companyId: companies[4].id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Khalid Al-Saud",
        email: "khalid@saudigrains.com",
        phone: "+966501234567",
        passwordHash,
        role: "BUYER",
        status: "ACTIVE",
        isVerified: true,
        kycStatus: "VERIFIED",
        companyId: companies[5].id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Priya Sharma",
        email: "priya@testbuyer.com",
        phone: "+919876543213",
        passwordHash,
        role: "BUYER",
        status: "ACTIVE",
        isVerified: true,
        kycStatus: "VERIFIED",
      },
    }),
  ]);

  await Promise.all([
    prisma.buyerProfile.create({
      data: {
        companyId: companies[4].id,
        businessType: "Food Importer & Distributor",
        interestedCategories: JSON.stringify(["Rice", "Spices", "Pulses", "Wheat"]),
        preferredOrigins: JSON.stringify(["India", "Thailand", "Vietnam"]),
      },
    }),
    prisma.buyerProfile.create({
      data: {
        companyId: companies[5].id,
        businessType: "Grain Importer",
        interestedCategories: JSON.stringify(["Wheat", "Barley", "Corn"]),
        preferredOrigins: JSON.stringify(["India", "Australia", "USA"]),
      },
    }),
  ]);

  console.log("✅ Users (sellers + buyers) created");

  // ─── CATEGORIES ───
  const allCats: { id: string; slug: string }[] = [];
  const categoryData = [
    { name: "Cereals & Grains", slug: "cereals-grains", icon: "🌾", children: [
      { name: "Wheat", slug: "wheat", icon: "🌾" },
      { name: "Rice", slug: "rice", icon: "🍚" },
      { name: "Maize / Corn", slug: "maize-corn", icon: "🌽" },
      { name: "Barley", slug: "barley", icon: "🌾" },
      { name: "Sorghum (Jowar)", slug: "sorghum", icon: "🌾" },
      { name: "Millets", slug: "millets", icon: "🌾" },
    ]},
    { name: "Pulses & Legumes", slug: "pulses-legumes", icon: "🫘", children: [
      { name: "Chickpeas (Chana)", slug: "chickpeas", icon: "🫘" },
      { name: "Lentils (Masoor)", slug: "lentils", icon: "🫘" },
      { name: "Pigeon Peas (Toor)", slug: "pigeon-peas", icon: "🫘" },
      { name: "Black Gram (Urad)", slug: "black-gram", icon: "🫘" },
      { name: "Green Gram (Moong)", slug: "green-gram", icon: "🫘" },
      { name: "Kidney Beans (Rajma)", slug: "kidney-beans", icon: "🫘" },
    ]},
    { name: "Oil Seeds", slug: "oil-seeds", icon: "🫒", children: [
      { name: "Soybean", slug: "soybean", icon: "🫒" },
      { name: "Mustard / Rapeseed", slug: "mustard", icon: "🫒" },
      { name: "Groundnut", slug: "groundnut", icon: "🥜" },
      { name: "Sunflower Seed", slug: "sunflower-seed", icon: "🌻" },
      { name: "Sesame Seed", slug: "sesame-seed", icon: "🫒" },
      { name: "Castor Seed", slug: "castor-seed", icon: "🫒" },
    ]},
    { name: "Spices", slug: "spices", icon: "🌶️", children: [
      { name: "Turmeric", slug: "turmeric", icon: "🟡" },
      { name: "Red Chili", slug: "red-chili", icon: "🌶️" },
      { name: "Cumin", slug: "cumin", icon: "🌶️" },
      { name: "Coriander", slug: "coriander", icon: "🌿" },
      { name: "Black Pepper", slug: "black-pepper", icon: "⚫" },
      { name: "Cardamom", slug: "cardamom", icon: "🟢" },
    ]},
    { name: "Animal Feed", slug: "animal-feed", icon: "🐄", children: [] },
    { name: "Fresh Fruits", slug: "fresh-fruits", icon: "🍎", children: [] },
    { name: "Fresh Vegetables", slug: "fresh-vegetables", icon: "🥔", children: [] },
    { name: "Processed Foods", slug: "processed-foods", icon: "🍯", children: [] },
    { name: "Fibers & Cash Crops", slug: "fibers-cash-crops", icon: "🧵", children: [] },
    { name: "Organic Products", slug: "organic-products", icon: "🌱", children: [] },
  ];

  for (const cat of categoryData) {
    const parent = await prisma.category.create({
      data: { name: cat.name, slug: cat.slug, icon: cat.icon, description: `Premium ${cat.name} for export` },
    });
    allCats.push(parent);

    for (const child of cat.children) {
      const c = await prisma.category.create({
        data: {
          name: child.name,
          slug: child.slug,
          icon: child.icon,
          parentId: parent.id,
          description: `High-quality ${child.name} sourced from Indian farms`,
        },
      });
      allCats.push(c);
    }
  }

  console.log("✅ Categories created");

  // ─── PRODUCTS ───
  const getCatId = (slug: string) => allCats.find((c) => c.slug === slug)?.id || "";

  const productsData = [
    {
      name: "Premium Basmati Rice (1121)",
      slug: "premium-basmati-rice-1121",
      categorySlug: "rice",
      sellerId: sellers[0].id,
      companyId: companies[1].id,
      description: "Premium quality 1121 Basmati Rice with extra-long grains, aromatic fragrance. Sourced from finest farms of Punjab and Haryana.",
      shortDescription: "Extra-long grain aromatic Basmati rice, premium export quality",
      originCountry: "India",
      originState: "Punjab",
      moisturePercent: "12% Max",
      packagingTypes: JSON.stringify(["5kg PP Bags", "10kg PP Bags", "25kg PP Bags", "50kg PP Bags"]),
      packagingDetails: "Vacuum-packed available for retail; 25kg/50kg for bulk",
      moq: "25 Metric Tons",
      unit: "Metric Ton",
      pricePerUnit: 1150,
      currency: "USD",
      hsCode: "1006.30",
      specifications: JSON.stringify([
        { key: "Moisture", value: "12% Max" },
        { key: "Grain Length", value: "8.4mm+" },
        { key: "Broken Grains", value: "< 1%" },
        { key: "Sortex", value: "100% Sortex Cleaned" },
        { key: "Purity", value: "99.5%" },
        { key: "Crop Year", value: "2024-2025" },
      ]),
      certifications: JSON.stringify(["FSSAI", "APEDA", "ISO 22000"]),
      tags: JSON.stringify(["Basmati", "Rice", "Premium", "1121", "Aromatic"]),
      isOrganic: false,
      status: "ACTIVE",
      cropYear: "2024-2025",
      featured: true,
    },
    {
      name: "Premium Wheat (Sharbati)",
      slug: "premium-wheat-sharbati",
      categorySlug: "wheat",
      sellerId: sellers[0].id,
      companyId: companies[1].id,
      description: "High-protein Sharbati wheat known for excellent milling quality and superior gluten content. Grown in fertile fields of Madhya Pradesh.",
      shortDescription: "High-protein Sharbati wheat for premium milling",
      originCountry: "India",
      originState: "Madhya Pradesh",
      moisturePercent: "12% Max",
      packagingTypes: JSON.stringify(["25kg PP Bags", "50kg PP Bags", "Jumbo Bags"]),
      moq: "50 Metric Tons",
      unit: "Metric Ton",
      pricePerUnit: 320,
      currency: "USD",
      hsCode: "1001.19",
      specifications: JSON.stringify([
        { key: "Moisture", value: "12% Max" },
        { key: "Protein", value: "12-13%" },
        { key: "Gluten", value: "9-10%" },
        { key: "Test Weight", value: "80 kg/hl" },
        { key: "Foreign Matter", value: "< 0.5%" },
      ]),
      certifications: JSON.stringify(["FSSAI", "APEDA", "ISO 22000"]),
      tags: JSON.stringify(["Wheat", "Sharbati", "Premium", "Milling"]),
      isOrganic: false,
      status: "ACTIVE",
      cropYear: "2024-2025",
      featured: true,
    },
    {
      name: "Indian Yellow Maize",
      slug: "indian-yellow-maize",
      categorySlug: "maize-corn",
      sellerId: sellers[0].id,
      companyId: companies[1].id,
      description: "High-quality Indian yellow maize with excellent starch content. Ideal for animal feed, poultry feed, and industrial applications.",
      shortDescription: "Premium yellow maize for feed and industrial use",
      originCountry: "India",
      originState: "Karnataka",
      moisturePercent: "14% Max",
      packagingTypes: JSON.stringify(["25kg PP Bags", "50kg PP Bags", "Bulk"]),
      moq: "50 Metric Tons",
      unit: "Metric Ton",
      pricePerUnit: 245,
      currency: "USD",
      hsCode: "1005.90",
      specifications: JSON.stringify([
        { key: "Moisture", value: "14% Max" },
        { key: "Starch Content", value: "65-68%" },
        { key: "Protein", value: "8-10%" },
        { key: "Oil Content", value: "3.5-4.5%" },
        { key: "Aflatoxin", value: "< 20 PPB" },
      ]),
      certifications: JSON.stringify(["FSSAI", "ISO 9001"]),
      tags: JSON.stringify(["Maize", "Corn", "Yellow", "Feed"]),
      isOrganic: false,
      status: "ACTIVE",
    },
    {
      name: "Premium Indian Turmeric (Alleppey)",
      slug: "premium-turmeric-alleppey",
      categorySlug: "turmeric",
      sellerId: sellers[1].id,
      companyId: companies[2].id,
      description: "Premium quality Alleppey turmeric with high curcumin content (5%+). Sourced from turmeric heartland of Kerala, naturally sun-dried.",
      shortDescription: "High-curcumin Alleppey turmeric, 5%+ curcumin content",
      originCountry: "India",
      originState: "Kerala",
      moisturePercent: "8% Max",
      packagingTypes: JSON.stringify(["500g Pouch", "1kg Pouch", "5kg Bag", "25kg Bag"]),
      moq: "5 Metric Tons",
      unit: "Metric Ton",
      pricePerUnit: 2800,
      currency: "USD",
      hsCode: "0910.30",
      specifications: JSON.stringify([
        { key: "Curcumin Content", value: "5% Min" },
        { key: "Moisture", value: "8% Max" },
        { key: "Volatile Oil", value: "4% Min" },
        { key: "Color Value", value: "60+ CU" },
        { key: "Purity", value: "99.5%" },
      ]),
      certifications: JSON.stringify(["FSSAI", "APEDA", "ISO 22000", "Organic (NPOP)", "ASTA"]),
      tags: JSON.stringify(["Turmeric", "Spice", "Alleppey", "Curcumin", "Organic"]),
      isOrganic: true,
      status: "ACTIVE",
      featured: true,
    },
    {
      name: "Byadgi Red Chili",
      slug: "byadgi-red-chili",
      categorySlug: "red-chili",
      sellerId: sellers[1].id,
      companyId: companies[2].id,
      description: "Premium Byadgi red chili from Karnataka, renowned for deep red color and moderate heat.",
      shortDescription: "Deep red Byadgi chili with excellent color value",
      originCountry: "India",
      originState: "Karnataka",
      moisturePercent: "10% Max",
      packagingTypes: JSON.stringify(["1kg Bag", "5kg Bag", "10kg Bag", "25kg Bag"]),
      moq: "5 Metric Tons",
      unit: "Metric Ton",
      pricePerUnit: 2100,
      currency: "USD",
      hsCode: "0904.21",
      specifications: JSON.stringify([
        { key: "Color Value (ASTA)", value: "150+ CU" },
        { key: "SHU", value: "15,000-20,000" },
        { key: "Moisture", value: "10% Max" },
        { key: "Foreign Matter", value: "< 0.5%" },
      ]),
      certifications: JSON.stringify(["FSSAI", "APEDA", "ISO 22000", "ASTA"]),
      tags: JSON.stringify(["Chili", "Red Chili", "Byadgi", "Spice"]),
      isOrganic: false,
      status: "ACTIVE",
    },
    {
      name: "Indian Soybean (Non-GMO)",
      slug: "indian-soybean-non-gmo",
      categorySlug: "soybean",
      sellerId: sellers[2].id,
      companyId: companies[3].id,
      description: "Non-GMO Indian soybean with high protein and oil content. Suitable for crushing, meal production, and direct export.",
      shortDescription: "Non-GMO Indian soybean, high protein & oil",
      originCountry: "India",
      originState: "Madhya Pradesh",
      moisturePercent: "10% Max",
      packagingTypes: JSON.stringify(["25kg PP Bags", "50kg PP Bags", "Bulk"]),
      moq: "50 Metric Tons",
      unit: "Metric Ton",
      pricePerUnit: 480,
      currency: "USD",
      hsCode: "1201.90",
      specifications: JSON.stringify([
        { key: "Oil Content", value: "18-20%" },
        { key: "Protein", value: "38-40%" },
        { key: "Moisture", value: "10% Max" },
        { key: "Foreign Matter", value: "< 1%" },
        { key: "GMO", value: "Non-GMO" },
      ]),
      certifications: JSON.stringify(["FSSAI", "ISO 22000"]),
      tags: JSON.stringify(["Soybean", "Oil Seed", "Non-GMO"]),
      isOrganic: false,
      status: "PENDING",
    },
    {
      name: "Organic Moringa Powder",
      slug: "organic-moringa-powder",
      categorySlug: "organic-products",
      sellerId: sellers[1].id,
      companyId: companies[2].id,
      description: "Certified organic moringa leaf powder, finely ground from fresh moringa leaves. Rich in vitamins and minerals.",
      shortDescription: "Certified organic moringa powder, nutrient-rich",
      originCountry: "India",
      originState: "Tamil Nadu",
      moisturePercent: "5% Max",
      packagingTypes: JSON.stringify(["250g Pouch", "500g Pouch", "1kg Bag", "5kg Bag", "25kg Bag"]),
      moq: "1 Metric Ton",
      unit: "Metric Ton",
      pricePerUnit: 4500,
      currency: "USD",
      hsCode: "1211.90",
      specifications: JSON.stringify([
        { key: "Purity", value: "100% Pure Moringa" },
        { key: "Moisture", value: "5% Max" },
        { key: "Protein", value: "25-27%" },
        { key: "Fiber", value: "8-10%" },
      ]),
      certifications: JSON.stringify(["USDA Organic", "NPOP", "FSSAI", "ISO 22000", "HACCP", "GMP"]),
      tags: JSON.stringify(["Moringa", "Organic", "Superfood"]),
      isOrganic: true,
      status: "ACTIVE",
      featured: true,
    },
  ];

  for (const p of productsData) {
    const { categorySlug, ...productData } = p;
    const categoryId = getCatId(categorySlug);
    await prisma.product.create({
      data: { ...productData, categoryId },
    });
  }

  console.log("✅ Products created");

  // ─── MARKET PRICES ───
  const marketPriceData = [
    { commodityName: "Wheat", market: "Azadpur Mandi", state: "Delhi", minPrice: 2400, maxPrice: 2600, modalPrice: 2525, unit: "Per Quintal", source: "AGMARKNET" },
    { commodityName: "Wheat", market: "Khanna Mandi", state: "Punjab", minPrice: 2350, maxPrice: 2580, modalPrice: 2480, unit: "Per Quintal", source: "AGMARKNET" },
    { commodityName: "Basmati Rice (1121)", market: "Karnal Mandi", state: "Haryana", minPrice: 7500, maxPrice: 8500, modalPrice: 7800, unit: "Per Quintal", source: "AGMARKNET" },
    { commodityName: "Maize", market: "Davangere Mandi", state: "Karnataka", minPrice: 2100, maxPrice: 2300, modalPrice: 2180, unit: "Per Quintal", source: "AGMARKNET" },
    { commodityName: "Soybean", market: "Indore Mandi", state: "Madhya Pradesh", minPrice: 4600, maxPrice: 5100, modalPrice: 4850, unit: "Per Quintal", source: "AGMARKNET" },
    { commodityName: "Mustard (Yellow)", market: "Alwar Mandi", state: "Rajasthan", minPrice: 5400, maxPrice: 5800, modalPrice: 5620, unit: "Per Quintal", source: "AGMARKNET" },
    { commodityName: "Cotton (Kapas)", market: "Rajkot Mandi", state: "Gujarat", minPrice: 7200, maxPrice: 7700, modalPrice: 7450, unit: "Per Quintal", source: "AGMARKNET" },
    { commodityName: "Chickpeas (Chana)", market: "Bhopal Mandi", state: "Madhya Pradesh", minPrice: 5200, maxPrice: 5700, modalPrice: 5450, unit: "Per Quintal", source: "AGMARKNET" },
    { commodityName: "Turmeric", market: "Erode Mandi", state: "Tamil Nadu", minPrice: 12000, maxPrice: 14500, modalPrice: 13200, unit: "Per Quintal", source: "AGMARKNET" },
    { commodityName: "Red Chili", market: "Guntur Mandi", state: "Andhra Pradesh", minPrice: 18000, maxPrice: 22000, modalPrice: 20000, unit: "Per Quintal", source: "AGMARKNET" },
  ];

  const baseDate = new Date();
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    for (const mp of marketPriceData) {
      const variation = (Math.random() - 0.5) * 200;
      await prisma.marketPrice.create({
        data: {
          ...mp,
          minPrice: Math.round(mp.minPrice + variation),
          maxPrice: Math.round(mp.maxPrice + variation),
          modalPrice: Math.round(mp.modalPrice + variation * 0.5),
          date: new Date(baseDate.getTime() - dayOffset * 86400000),
        },
      });
    }
  }

  console.log("✅ Market prices created (30 days of data)");

  // ─── SERVICES ───
  const servicesData = [
    {
      name: "Export Documentation",
      slug: "export-documentation",
      description: "Complete handling of all export documentation including Bill of Lading, Certificate of Origin, Phytosanitary Certificate, and customs clearance.",
      shortDesc: "End-to-end export documentation services",
      icon: "📄",
      features: JSON.stringify(["Bill of Lading", "Certificate of Origin", "Phytosanitary Certificate", "GSP Certificate", "Customs Clearance"]),
      sortOrder: 1,
    },
    {
      name: "Custom Packaging & Labelling",
      slug: "custom-packaging",
      description: "Tailored packaging solutions from retail-ready branded packs to bulk industrial shipments.",
      shortDesc: "Custom packaging with your branding",
      icon: "📦",
      features: JSON.stringify(["Custom Branding", "Retail Packaging", "Bulk Packaging", "Vacuum Packing"]),
      sortOrder: 2,
    },
    {
      name: "Quality Inspection",
      slug: "quality-inspection",
      description: "Comprehensive quality inspection and certification services with SGS, Bureau Veritas, and Intertek.",
      shortDesc: "Third-party quality inspection services",
      icon: "✅",
      features: JSON.stringify(["Pre-shipment Inspection", "Lab Testing", "Container Loading Supervision", "Quality Certification"]),
      sortOrder: 3,
    },
    {
      name: "Logistics & Freight",
      slug: "logistics-freight",
      description: "End-to-end logistics management including FCL, LCL, and air freight solutions with all major shipping lines.",
      shortDesc: "Competitive freight rates worldwide",
      icon: "🚢",
      features: JSON.stringify(["FCL Shipping", "LCL Consolidation", "Air Freight", "Cargo Insurance", "Real-time Tracking"]),
      sortOrder: 4,
    },
    {
      name: "Container Booking",
      slug: "container-booking",
      description: "Hassle-free container booking with competitive rates from all major shipping lines from Indian ports.",
      shortDesc: "Easy container booking at best rates",
      icon: "📋",
      features: JSON.stringify(["20ft/40ft Containers", "Reefer Containers", "Open Top", "Flat Rack"]),
      sortOrder: 5,
    },
    {
      name: "Customs Clearance",
      slug: "customs-clearance",
      description: "Expert customs clearance services for both export and import with proper documentation and compliance.",
      shortDesc: "Expert customs clearance services",
      icon: "🛃",
      features: JSON.stringify(["Export Clearance", "Import Clearance", "Drawback Processing", "Compliance Checks"]),
      sortOrder: 6,
    },
  ];

  for (const service of servicesData) {
    await prisma.service.create({ data: service });
  }

  console.log("✅ Services created");

  // ─── TESTIMONIALS ───
  await Promise.all([
    prisma.testimonial.create({
      data: {
        name: "Ahmed Al-Rashid",
        companyId: companies[4].id,
        designation: "Procurement Director",
        message: "Goel Agro Global has been our trusted partner for Indian rice and spices for over 3 years. Their quality consistency and timely delivery are exceptional.",
        rating: 5,
        approved: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "John Miller",
        designation: "CEO, Miller Grains Inc.",
        message: "The best Indian wheat we've imported. Excellent protein content and milling quality. We've increased our order volume by 200%.",
        rating: 5,
        approved: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Mohammed Al-Saud",
        companyId: companies[5].id,
        designation: "Supply Chain Manager",
        message: "Professional team with deep knowledge of agricultural exports. The AI-powered recommendation system helped us discover new products.",
        rating: 5,
        approved: true,
      },
    }),
  ]);

  console.log("✅ Testimonials created");

  // ─── FAQ ───
  await Promise.all([
    prisma.fAQ.create({ data: { question: "What documents are required for export?", answer: "APEDA Registration, Phytosanitary Certificate, Certificate of Origin, Bill of Lading, Packing List, Commercial Invoice, FSSAI License, and IEC Code.", category: "Export", sortOrder: 1 } }),
    prisma.fAQ.create({ data: { question: "What is the minimum order quantity?", answer: "MOQ varies by product: Grains (25-50 MT), Pulses (25 MT), Spices (5-10 MT), Oil Seeds (25 MT). Contact us for specific product MOQs.", category: "Orders", sortOrder: 2 } }),
    prisma.fAQ.create({ data: { question: "How long does shipping take?", answer: "Gulf/Middle East (7-10 days), Southeast Asia (10-15 days), Europe (20-25 days), Americas (25-35 days).", category: "Shipping", sortOrder: 3 } }),
    prisma.fAQ.create({ data: { question: "What payment terms are accepted?", answer: "LC at sight, TT (30% advance + 70% against documents), and open account terms for established buyers.", category: "Payment", sortOrder: 4 } }),
    prisma.fAQ.create({ data: { question: "Do you provide samples?", answer: "Yes, samples are provided for all products. Cost is refundable upon placing a confirmed order.", category: "Products", sortOrder: 5 } }),
    prisma.fAQ.create({ data: { question: "What certifications do your products have?", answer: "FSSAI, APEDA, ISO 22000:2018, HACCP, Organic (NPOP/NOP/USDA), Halal, GMP, ASTA.", category: "Quality", sortOrder: 6 } }),
    prisma.fAQ.create({ data: { question: "How do I become a registered buyer?", answer: "Register on our platform with business details. Our team verifies within 24-48 hours.", category: "Registration", sortOrder: 7 } }),
    prisma.fAQ.create({ data: { question: "Can I visit your facilities?", answer: "Absolutely! Visit our corporate office in New Delhi and partner processing facilities.", category: "General", sortOrder: 8 } }),
  ]);

  console.log("✅ FAQs created");

  // ─── BLOG POSTS ───
  await prisma.blogPost.create({
    data: {
      title: "Complete Guide to Indian Agricultural Exports: HS Codes & Documentation",
      slug: "guide-indian-agricultural-exports-hs-codes",
      excerpt: "A comprehensive guide to HS codes, export documentation, and regulations for exporting agricultural products from India.",
      content: "India is one of the world's largest producers of agricultural commodities. From rice and wheat to spices and pulses, Indian agricultural products are in high demand globally. This guide covers everything you need to know about exporting agricultural products from India...",
      author: "Goel Agro Global Team",
      tags: JSON.stringify(["Export Guide", "HS Code", "Documentation", "India Export"]),
      published: true,
      publishedAt: new Date(),
    },
  });

  await prisma.blogPost.create({
    data: {
      title: "Top 10 Indian Spices in Global Demand (2025-26)",
      slug: "top-indian-spices-global-demand-2025",
      excerpt: "Discover which Indian spices are seeing the highest global demand with market trends and pricing.",
      content: "Indian spices have been prized for millennia. As global demand continues to grow, here are the top 10 spices leading the export market...",
      author: "Goel Agro Global Team",
      tags: JSON.stringify(["Spices", "Market Trends", "Export", "Indian Spices"]),
      published: true,
      publishedAt: new Date(),
    },
  });

  console.log("✅ Blog posts created");

  // ─── SITE SETTINGS ───
  await Promise.all([
    prisma.siteSetting.create({ data: { key: "site_name", value: JSON.stringify("Goel Agro Global"), group: "general" } }),
    prisma.siteSetting.create({ data: { key: "site_tagline", value: JSON.stringify("Connecting Indian Farmers to Global Buyers"), group: "general" } }),
    prisma.siteSetting.create({ data: { key: "site_email", value: JSON.stringify("info@goelagroglobal.com"), group: "contact" } }),
    prisma.siteSetting.create({ data: { key: "site_phone", value: JSON.stringify("+91 98765 43210"), group: "contact" } }),
    prisma.siteSetting.create({ data: { key: "site_address", value: JSON.stringify("123, Agri Export House, New Delhi - 110001"), group: "contact" } }),
    prisma.siteSetting.create({ data: { key: "whatsapp_number", value: JSON.stringify("+919876543210"), group: "contact" } }),
    prisma.siteSetting.create({ data: { key: "homepage_hero_title", value: JSON.stringify("Export Premium Indian Agricultural Products Worldwide"), group: "content" } }),
    prisma.siteSetting.create({ data: { key: "meta_description", value: JSON.stringify("Goel Agro Global - Premium Indian Agricultural Exports. B2B platform connecting Indian farmers to global buyers."), group: "seo" } }),
  ]);

  console.log("✅ Site settings created");

  // ─── LEADS ───
  await prisma.lead.create({
    data: {
      source: "Website Contact Form",
      name: "Abdul Rahman",
      email: "abdul@example.com",
      phone: "+971551234567",
      companyName: "Rahman General Trading LLC",
      requirement: "Looking for 200 MT of premium Basmati rice for distribution in UAE.",
      productInterest: "Basmati Rice",
      quantity: "200 MT",
      status: "NEW",
      score: 85,
    },
  });

  await prisma.lead.create({
    data: {
      source: "WhatsApp Inquiry",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+447123456789",
      companyName: "London Spice Imports",
      requirement: "Interested in bulk turmeric and chili powder for UK market.",
      productInterest: "Turmeric, Red Chili",
      quantity: "25 MT",
      status: "CONTACTED",
      score: 72,
    },
  });

  console.log("✅ Leads created");

  // ─── RFQ ───
  const allProducts = await prisma.product.findMany({ take: 5 });

  if (allProducts.length > 1) {
    const rfq = await prisma.rFQ.create({
      data: {
        rfqNumber: "RFQ-2025-001",
        buyerId: buyers[0].id,
        productId: allProducts[0].id,
        quantity: 100,
        unit: "Metric Ton",
        targetPrice: 1100,
        currency: "USD",
        message: "Need premium Basmati rice for UAE market. Best FOB JNPT pricing please.",
        status: "PENDING",
        deliveryLocation: "Jebel Ali, Dubai",
        destinationCountry: "UAE",
        isUrgent: true,
      },
    });

    await prisma.quotation.create({
      data: {
        quoteNumber: "QTE-2025-001",
        rfqId: rfq.id,
        sellerId: sellers[0].id,
        price: 1125,
        currency: "USD",
        validity: 15,
        terms: "FOB JNPT. Payment: LC at sight or 30% advance + 70% against BL copy. Delivery: 21 days.",
        incoterm: "FOB",
        deliveryDays: 21,
        sampleAvailable: true,
        status: "SENT",
      },
    });
  }

  console.log("✅ RFQ & Quotation created");

  console.log("\n============================================");
  console.log("🎉 SEED COMPLETE! 🎉");
  console.log("============================================");
  console.log("\n📋 Login Credentials (all: Password@123):");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("👑 admin@goelagroglobal.com   (Super Admin)");
  console.log("👤 rajesh@punjabgrains.com     (Seller)");
  console.log("👤 sunil@keralaspice.com       (Seller)");
  console.log("👤 ahmed@dubaiimports.com      (Buyer)");
  console.log("👤 khalid@saudigrains.com      (Buyer)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
