import { Router, Response } from "express";
import { z } from "zod";
import prisma from "@/config/prisma";
import { validate } from "@/middleware/validate"
import { queryParam } from "@/utils/helpers";;
import { authenticate, authorize } from "@/middleware/auth";
import { sendSuccess, sendError, sendPaginated } from "@/utils/response";
import { generateRfqNumber, paginateOptions } from "@/utils/helpers";
import { AuthRequest } from "@/types";

const router = Router();

const createRfqSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
  unit: z.string().default("Metric Ton"),
  targetPrice: z.number().positive().optional(),
  currency: z.string().default("USD"),
  message: z.string().max(2000).optional(),
  deliveryLocation: z.string().optional(),
  destinationCountry: z.string().optional(),
  preferredPackaging: z.string().optional(),
  requiredCertifications: z.array(z.string()).default([]),
  deadline: z.string().datetime().optional(),
  isUrgent: z.boolean().default(false),
});

const quoteSchema = z.object({
  price: z.number().positive(),
  currency: z.string().default("USD"),
  validity: z.number().int().positive().default(15),
  terms: z.string().optional(),
  incoterm: z.string().optional(),
  deliveryDays: z.number().int().positive().optional(),
  sampleAvailable: z.boolean().default(false),
  notes: z.string().optional(),
});

/**
 * @openapi
 * /api/v1/rfqs:
 *   post:
 *     tags: [RFQ]
 *     summary: Create a new RFQ (Buyer)
 */
router.post("/", authenticate, authorize("BUYER", "ADMIN", "SUPER_ADMIN"), validate(createRfqSchema), async (req: AuthRequest, res: Response) => {
  try {
    const rfq = await prisma.rFQ.create({
      data: {
        ...req.body,
        rfqNumber: generateRfqNumber(),
        buyerId: req.user!.userId,
      },
      include: {
        product: { select: { id: true, name: true, slug: true } },
      },
    });

    await prisma.product.update({
      where: { id: req.body.productId },
      data: { rfqCount: { increment: 1 } },
    });

    sendSuccess(res, rfq, "RFQ submitted successfully", 201);
  } catch (error) {
    console.error("Create RFQ error:", error);
    sendError(res, "Failed to create RFQ", 500);
  }
});

/**
 * @openapi
 * /api/v1/rfqs:
 *   get:
 *     tags: [RFQ]
 *     summary: Get RFQs for current user
 */
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(String(req.query.page || "0")) || 1;
    const limit = parseInt(String(req.query.limit || "0")) || 20;
    const role = req.user!.role;
    const status = String(req.query.status || "");

    const where: Record<string, unknown> = {};
    if (role === "BUYER") where.buyerId = req.user!.userId;
    else if (role === "SELLER") {
      const sellerProducts = await prisma.product.findMany({
        where: { sellerId: req.user!.userId },
        select: { id: true },
      });
      where.productId = { in: sellerProducts.map((p) => p.id) };
    }
    if (status) where.status = status;

    const [rfqs, total] = await Promise.all([
      prisma.rFQ.findMany({
        where: where as any,
        ...paginateOptions(page, limit),
        orderBy: { createdAt: "desc" },
        include: {
          buyer: { select: { id: true, name: true, company: { select: { name: true } } } },
          product: { select: { id: true, name: true, slug: true, images: true } },
          quotations: {
            select: { id: true, price: true, currency: true, status: true, sellerId: true },
            where: role === "SELLER" ? { sellerId: req.user!.userId } : undefined,
          },
          _count: { select: { quotations: true } },
        },
      }),
      prisma.rFQ.count({ where: where as any }),
    ]);

    sendPaginated(res, rfqs, total, page, limit);
  } catch (error) {
    console.error("Get RFQs error:", error);
    sendError(res, "Failed to fetch RFQs", 500);
  }
});

/**
 * @openapi
 * /api/v1/rfqs/{id}:
 *   get:
 *     tags: [RFQ]
 *     summary: Get RFQ details
 */
router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const rfq = await prisma.rFQ.findUnique({
      where: { id: String(req.params.id || "") },
      include: {
        buyer: { select: { id: true, name: true, company: { select: { name: true, logo: true, verifiedBadge: true } } } },
        product: {
          select: {
            id: true, name: true, slug: true, images: true, hsCode: true,
            specifications: true, packagingTypes: true, certifications: true,
          },
        },
        quotations: {
          include: {
            seller: { select: { id: true, name: true, company: { select: { name: true, logo: true } } } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!rfq) return sendError(res, "RFQ not found", 404);
    sendSuccess(res, rfq);
  } catch (error) {
    console.error("Get RFQ error:", error);
    sendError(res, "Failed to fetch RFQ", 500);
  }
});

/**
 * @openapi
 * /api/v1/rfqs/{id}/quote:
 *   post:
 *     tags: [RFQ]
 *     summary: Submit a quotation for an RFQ (Seller)
 */
router.post("/:id/quote", authenticate, authorize("SELLER", "ADMIN", "SUPER_ADMIN"), validate(quoteSchema), async (req: AuthRequest, res: Response) => {
  try {
    const rfq = await prisma.rFQ.findUnique({ where: { id: String(req.params.id || "") } });
    if (!rfq) return sendError(res, "RFQ not found", 404);
    if (rfq.status !== "PENDING") return sendError(res, "RFQ is no longer accepting quotations", 400);

    const quotation = await prisma.quotation.create({
      data: {
        ...req.body,
        quoteNumber: `QTE-${Date.now().toString(36).toUpperCase()}`,
        rfqId: rfq.id,
        sellerId: req.user!.userId,
        status: "SENT",
      },
    });

    await prisma.rFQ.update({
      where: { id: rfq.id },
      data: { status: "QUOTED" },
    });

    sendSuccess(res, quotation, "Quotation submitted", 201);
  } catch (error) {
    console.error("Create quote error:", error);
    sendError(res, "Failed to submit quotation", 500);
  }
});

export default router;
