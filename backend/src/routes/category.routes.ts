import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "@/config/prisma";
import { validate } from "@/middleware/validate"
import { queryParam } from "@/utils/helpers";;
import { authenticate, authorize } from "@/middleware/auth";
import { optionalAuth } from "@/middleware/auth";
import { sendSuccess, sendError } from "@/utils/response";
import { generateSlug } from "@/utils/helpers";

const router = Router();

/**
 * @openapi
 * /api/v1/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories with subcategories
 */
router.get("/", optionalAuth, async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: { _count: { select: { products: true } } },
        },
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    });

    sendSuccess(res, categories);
  } catch (error) {
    console.error("Get categories error:", error);
    sendError(res, "Failed to fetch categories", 500);
  }
});

/**
 * @openapi
 * /api/v1/categories/{slug}:
 *   get:
 *     tags: [Categories]
 *     summary: Get category by slug with products
 */
router.get("/:slug", optionalAuth, async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug || "");
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        children: {
          include: { _count: { select: { products: true } } },
        },
        parent: true,
        products: {
          where: { status: "ACTIVE" },
          take: 20,
          orderBy: { createdAt: "desc" },
          include: {
            seller: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!category) return sendError(res, "Category not found", 404);
    sendSuccess(res, category);
  } catch (error) {
    console.error("Get category error:", error);
    sendError(res, "Failed to fetch category", 500);
  }
});

const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
});

router.post("/", authenticate, authorize("SUPER_ADMIN", "ADMIN"), validate(createCategorySchema), async (req: Request, res: Response) => {
  try {
    const { name, description, icon, image, parentId } = req.body;
    let slug = generateSlug(name);

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const category = await prisma.category.create({
      data: { name, slug, description, icon, image, parentId },
    });

    sendSuccess(res, category, "Category created", 201);
  } catch (error) {
    console.error("Create category error:", error);
    sendError(res, "Failed to create category", 500);
  }
});

const updateCategorySchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().nullable().optional(),
});

router.put("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN"), validate(updateCategorySchema), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Category not found", 404);

    const data: Record<string, unknown> = { ...req.body };
    if (data.name && data.name !== existing.name) {
      let slug = generateSlug(data.name as string);
      const dup = await prisma.category.findFirst({ where: { slug, id: { not: id } } });
      if (dup) slug = `${slug}-${Date.now()}`;
      data.slug = slug;
    }

    const category = await prisma.category.update({ where: { id }, data });
    sendSuccess(res, category, "Category updated");
  } catch (error) {
    console.error("Update category error:", error);
    sendError(res, "Failed to update category", 500);
  }
});

router.delete("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN"), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Category not found", 404);

    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) return sendError(res, `Cannot delete category with ${productCount} products. Move or delete products first.`, 400);

    await prisma.category.delete({ where: { id } });
    sendSuccess(res, null, "Category deleted");
  } catch (error) {
    console.error("Delete category error:", error);
    sendError(res, "Failed to delete category", 500);
  }
});

export default router;
