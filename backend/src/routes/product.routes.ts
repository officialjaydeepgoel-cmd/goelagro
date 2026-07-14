import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "@/config/prisma";
import { validate } from "@/middleware/validate"
import { queryParam } from "@/utils/helpers";;
import { authenticate, authorize, optionalAuth } from "@/middleware/auth";
import { sendSuccess, sendError, sendPaginated } from "@/utils/response";
import { generateSlug, paginateOptions } from "@/utils/helpers";
import { AuthRequest } from "@/types";

const router = Router();

const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  categoryId: z.string(),
  description: z.string().min(10),
  shortDescription: z.string().optional(),
  originCountry: z.string().default("India"),
  originState: z.string().optional(),
  moisturePercent: z.string().optional(),
  packagingTypes: z.array(z.string()).default([]),
  packagingDetails: z.string().optional(),
  moq: z.string(),
  unit: z.string().default("Metric Ton"),
  pricePerUnit: z.number().positive().optional(),
  currency: z.string().default("USD"),
  hsCode: z.string(),
  specifications: z.array(z.object({ key: z.string(), value: z.string() })).default([]),
  certifications: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  isOrganic: z.boolean().default(false),
  cropYear: z.string().optional(),
  stockQuantity: z.number().int().positive().optional(),
});

/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     tags: [Products]
 *     summary: Get all active products with filters
 */
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(String(req.query.page || "0")) || 1;
    const limit = parseInt(String(req.query.limit || "0")) || 20;
    const categoryId = String(req.query.categoryId || "");
    const search = String(req.query.search || "");
    const origin = String(req.query.origin || "");
    const isOrganic = String(req.query.isOrganic || "");
    const minPrice = String(req.query.minPrice || "");
    const maxPrice = String(req.query.maxPrice || "");
    const sortBy = (String(req.query.sortBy || "")) || "createdAt";
    const sortOrder = (String(req.query.sortOrder || "")) === "asc" ? "asc" : "desc";

    const where: Record<string, unknown> = { status: "ACTIVE" };
    if (categoryId) where.categoryId = categoryId;
    if (origin) where.originCountry = origin;
    if (isOrganic === "true") where.isOrganic = true;
    if (search) where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { tags: { has: search } },
    ];
    if (minPrice || maxPrice) {
      where.pricePerUnit = {};
      if (minPrice) (where.pricePerUnit as Record<string, unknown>).gte = parseFloat(minPrice);
      if (maxPrice) (where.pricePerUnit as Record<string, unknown>).lte = parseFloat(maxPrice);
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: where as any,
        ...paginateOptions(page, limit),
        orderBy: { [sortBy]: sortOrder },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          seller: { select: { id: true, name: true, company: { select: { name: true, logo: true } } } },
        },
      }),
      prisma.product.count({ where: where as any }),
    ]);

    sendPaginated(res, products, total, page, limit);
  } catch (error) {
    console.error("Get products error:", error);
    sendError(res, "Failed to fetch products", 500);
  }
});

/**
 * @openapi
 * /api/v1/products/{slug}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by slug
 */
router.get("/:slug", optionalAuth, async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: String(req.params.slug || "") },
      include: {
        category: { select: { id: true, name: true, slug: true, parent: { select: { name: true, slug: true } } } },
        seller: {
          select: {
            id: true, name: true, email: true,
            company: { select: { id: true, name: true, logo: true, verifiedBadge: true, companyType: true, country: true, establishedYear: true } },
          },
        },
        certificationsRel: true,
        reviews: {
          where: { isApproved: true },
          include: { buyer: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: { select: { reviews: true, wishlistedBy: true } },
      },
    });

    if (!product) return sendError(res, "Product not found", 404);

    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    const relatedProducts = await prisma.product.findMany({
      where: { categoryId: product.categoryId, id: { not: product.id }, status: "ACTIVE" },
      take: 6,
      orderBy: { createdAt: "desc" },
    });

    sendSuccess(res, { product, relatedProducts });
  } catch (error) {
    console.error("Get product error:", error);
    sendError(res, "Failed to fetch product", 500);
  }
});

/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product (Seller)
 */
router.post("/", authenticate, authorize("SELLER", "ADMIN", "SUPER_ADMIN"), validate(createProductSchema), async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    let slug = generateSlug(data.name);

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { companyId: true },
    });

    const product = await prisma.product.create({
      data: {
        ...data,
        slug,
        sellerId: req.user!.userId,
        companyId: user?.companyId,
        specifications: data.specifications,
        status: "PENDING",
      },
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    sendSuccess(res, product, "Product created successfully. Awaiting approval.", 201);
  } catch (error) {
    console.error("Create product error:", error);
    sendError(res, "Failed to create product", 500);
  }
});

router.put("/:id", authenticate, authorize("SELLER", "ADMIN", "SUPER_ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id || "");
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Product not found", 404);

    if (req.user!.role === "SELLER" && existing.sellerId !== req.user!.userId) {
      return sendError(res, "Unauthorized to edit this product", 403);
    }

    const product = await prisma.product.update({
      where: { id },
      data: { ...req.body, status: req.user!.role === "SELLER" ? "PENDING" : req.body.status },
    });

    sendSuccess(res, product, "Product updated");
  } catch (error) {
    console.error("Update product error:", error);
    sendError(res, "Failed to update product", 500);
  }
});

router.delete("/:id", authenticate, authorize("SELLER", "ADMIN", "SUPER_ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id || "");
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Product not found", 404);

    if (req.user!.role === "SELLER" && existing.sellerId !== req.user!.userId) {
      return sendError(res, "Unauthorized to delete this product", 403);
    }

    await prisma.product.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    sendSuccess(res, null, "Product archived");
  } catch (error) {
    console.error("Delete product error:", error);
    sendError(res, "Failed to delete product", 500);
  }
});

export default router;
