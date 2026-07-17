import { Router, Response } from "express";
import { z } from "zod";
import prisma from "@/config/prisma";
import { config } from "@/config";
import { validate } from "@/middleware/validate";
import { authenticate, optionalAuth } from "@/middleware/auth";
import { sendSuccess, sendError } from "@/utils/response";
import { AuthRequest } from "@/types";

const router = Router();

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationHistory: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).optional(),
});

const recommendationSchema = z.object({
  preferences: z.string().optional(),
  categoryId: z.string().optional(),
  limit: z.number().int().min(1).max(20).default(6),
});

const quotationSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
  unit: z.string().default("Metric Ton"),
  destinationCountry: z.string(),
  incoterm: z.string().default("FOB"),
  packaging: z.string().optional(),
  certifications: z.array(z.string()).optional(),
});

/**
 * @openapi
 * /api/v1/ai/chat:
 *   post:
 *     tags: [AI]
 *     summary: AI Chat Support
 */
router.post("/chat", optionalAuth, validate(chatSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!config.openai.apiKey || config.openai.apiKey === "") {
      // Mock AI response when no API key configured
      const mockResponse = generateMockChatResponse(message);
      return sendSuccess(res, {
        reply: mockResponse,
        isAI: true,
        suggestedProducts: [],
      });
    }

    const messages = [
      {
        role: "system",
        content: "You are BuddyVerse AI Assistant, an expert in Indian agricultural exports. Help users with: product information, HS codes, export documentation, pricing, shipping, certifications, and market trends. Be concise, professional, and helpful. Always mention you're an AI assistant.",
      },
      ...(conversationHistory || []),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.openai.apiKey}`,
      },
      body: JSON.stringify({
        model: config.openai.model,
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json() as { choices?: { message?: { content?: string } }[] };
    const reply = data.choices?.[0]?.message?.content || "I apologize, but I'm unable to process your request right now.";

    sendSuccess(res, { reply, isAI: true });
  } catch (error) {
    console.error("AI chat error:", error);
    sendError(res, "Failed to process AI request", 500);
  }
});

/**
 * @openapi
 * /api/v1/ai/recommendations:
 *   post:
 *     tags: [AI]
 *     summary: AI Product Recommendations
 */
router.post("/recommendations", optionalAuth, validate(recommendationSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { preferences, categoryId, limit } = req.body;

    // Get recent products as base recommendations
    const where: Record<string, unknown> = { status: "ACTIVE" };
    if (categoryId) where.categoryId = categoryId;

    const products = await prisma.product.findMany({
      where: where as any,
      take: limit,
      orderBy: [{ viewCount: "desc" }, { rfqCount: "desc" }, { createdAt: "desc" }],
      include: {
        category: { select: { id: true, name: true, slug: true } },
        seller: { select: { id: true, name: true } },
      },
    });

    if (!config.openai.apiKey || config.openai.apiKey === "") {
      return sendSuccess(res, {
        recommendations: products,
        explanation: "Based on popularity and recent activity",
        isAI: false,
      });
    }

    const prompt = `Given a user interested in "${preferences || "agricultural products"}", rank these products by relevance:
${products.map((p, i) => `${i + 1}. ${p.name} - ${p.shortDescription || p.description.substring(0, 100)}`).join("\n")}

Return only the numbers of top ${Math.min(limit, products.length)} products in order of relevance, comma-separated.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.openai.apiKey}`,
      },
      body: JSON.stringify({
        model: config.openai.model,
        messages: [
          { role: "system", content: "You recommend agricultural products. Return only comma-separated numbers." },
          { role: "user", content: prompt },
        ],
        max_tokens: 100,
        temperature: 0.3,
      }),
    });

    const data = await response.json() as { choices?: { message?: { content?: string } }[] };
    const indices = data.choices?.[0]?.message?.content
      ?.split(",")
      .map((s: string) => parseInt(s.trim()) - 1)
      .filter((i: number) => i >= 0 && i < products.length) || [];

    const recommended = indices.length > 0
      ? indices.map((i: number) => products[i]).filter(Boolean)
      : products;

    sendSuccess(res, {
      recommendations: recommended,
      explanation: "AI-powered recommendation based on your preferences",
      isAI: true,
    });
  } catch (error) {
    console.error("AI recommendations error:", error);
    sendError(res, "Failed to generate recommendations", 500);
  }
});

/**
 * @openapi
 * /api/v1/ai/generate-quotation:
 *   post:
 *     tags: [AI]
 *     summary: Auto-generate quotation
 */
router.post("/generate-quotation", authenticate, validate(quotationSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity, unit, destinationCountry, incoterm, packaging, certifications } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { seller: { select: { name: true, company: { select: { name: true, gstNumber: true, iecCode: true } } } } },
    });

    if (!product) return sendError(res, "Product not found", 404);

    const pricePerUnit = product.pricePerUnit ? Number(product.pricePerUnit) : 0;
    const estimatedTotal = pricePerUnit * quantity;
    const estimatedShipping = estimatedTotal * 0.08; // 8% shipping estimate

    if (!config.openai.apiKey || config.openai.apiKey === "") {
      return sendSuccess(res, {
        quotation: {
          sellerName: product.seller.name,
          companyName: product.seller.company?.name,
          productName: product.name,
          hsCode: product.hsCode,
          quantity: `${quantity} ${unit}`,
          unitPrice: `${product.currency} ${pricePerUnit.toFixed(2)}`,
          totalAmount: `${product.currency} ${estimatedTotal.toFixed(2)}`,
          estimatedShipping: `${product.currency} ${estimatedShipping.toFixed(2)}`,
          incoterm,
          packaging: packaging || product.packagingTypes.join(", "),
          validity: "15 days",
          deliveryTime: "21-30 days after confirmation",
          paymentTerms: "LC / TT (50% advance + 50% against documents)",
        },
        isAI: false,
      });
    }

    const prompt = `Generate a professional export quotation in JSON format for:
Product: ${product.name} (HS Code: ${product.hsCode})
Quantity: ${quantity} ${unit}
Destination: ${destinationCountry}
Incoterm: ${incoterm}
Unit Price: ${product.currency} ${pricePerUnit}
Packaging: ${packaging || product.packagingTypes.join(", ")}

Include: seller info, pricing, payment terms, delivery timeline, validity.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.openai.apiKey}`,
      },
      body: JSON.stringify({
        model: config.openai.model,
        messages: [
          { role: "system", content: "You generate professional export quotations in JSON format. Include all standard trade terms." },
          { role: "user", content: prompt },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    const data = await response.json() as { choices?: { message?: { content?: string } }[] };
    let quotationData;
    try {
      quotationData = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    } catch {
      quotationData = {
        productName: product.name,
        quantity: `${quantity} ${unit}`,
        unitPrice: `${product.currency} ${pricePerUnit.toFixed(2)}`,
        totalAmount: `${product.currency} ${estimatedTotal.toFixed(2)}`,
        incoterm,
        validity: "15 days",
      };
    }

    sendSuccess(res, { quotation: quotationData, isAI: true });
  } catch (error) {
    console.error("Generate quotation error:", error);
    sendError(res, "Failed to generate quotation", 500);
  }
});

function generateMockChatResponse(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes("hs code") || msg.includes("hscode")) {
    return "For HS Code information, Indian agricultural products typically fall under Chapters 1-24. Common codes: Wheat (1001), Rice (1006), Pulses (0713), Spices (0904-0910). Please specify the product for a precise code.";
  }
  if (msg.includes("price") || msg.includes("cost") || msg.includes("rate")) {
    return "Our pricing varies based on product grade, quantity, destination, and current market rates. Could you please specify which product and quantity you're interested in? I can then connect you with our sales team for a detailed quotation.";
  }
  if (msg.includes("document") || msg.includes("paper") || msg.includes("export")) {
    return "For exporting agricultural products from India, you'll need: APEDA Registration, Phytosanitary Certificate, Certificate of Origin, Bill of Lading, Packing List, Commercial Invoice, and FSSAI License. Would you like details on any specific document?";
  }
  if (msg.includes("shipping") || msg.includes("logistic") || msg.includes("container")) {
    return "We offer FCL (Full Container Load) and LCL (Less Container Load) shipping options. Standard delivery: 21-30 days for sea freight. We handle all documentation and customs clearance. Which destination are you shipping to?";
  }
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    return "Hello! Welcome to BuddyVerse. I'm your AI export assistant. How can I help you today? You can ask me about products, prices, HS codes, documentation, shipping, or any other export-related questions.";
  }
  if (msg.includes("certification") || msg.includes("certificate") || msg.includes("organic")) {
    return "Our products come with various certifications including FSSAI, ISO 22000, APEDA, HACCP, Organic (NPOP/NOP), Halal, and GMP. Each product page lists its specific certifications. Would you like to know about a specific product?";
  }
  return "Thank you for your inquiry. Our team of export specialists would be happy to assist you with detailed information. Could you please provide more details about your requirements so I can give you the most accurate information?";
}

/**
 * @openapi
 * /api/v1/ai/lead-score:
 *   post:
 *     tags: [AI]
 *     summary: AI-powered lead scoring
 */
router.post("/lead-score", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { companyName, email, phone, requirement, quantity, productInterest } = req.body;

    let score = 0;
    if (companyName) score += 20;
    if (phone) score += 15;
    if (email) score += 10;
    if (requirement && requirement.length > 50) score += 15;
    if (requirement && requirement.length > 200) score += 10;
    if (quantity) {
      const qty = parseInt(quantity);
      if (qty > 100) score += 20;
      else if (qty > 50) score += 10;
      else score += 5;
    }
    if (productInterest) score += 10;

    score = Math.min(score, 100);

    let category: string;
    if (score >= 70) category = "Hot";
    else if (score >= 40) category = "Warm";
    else category = "Cold";

    sendSuccess(res, {
      score,
      category,
      breakdown: {
        companyInfo: companyName ? 20 : 0,
        contactInfo: (phone ? 15 : 0) + (email ? 10 : 0),
        requirementDetail: requirement ? Math.min(requirement.length > 200 ? 25 : requirement.length > 50 ? 15 : 5, 25) : 0,
        quantityInfo: quantity ? Math.min(parseInt(quantity) > 100 ? 20 : parseInt(quantity) > 50 ? 10 : 5, 20) : 0,
        productInterest: productInterest ? 10 : 0,
      },
    });
  } catch (error) {
    console.error("Lead score error:", error);
    sendError(res, "Failed to score lead", 500);
  }
});

export default router;
