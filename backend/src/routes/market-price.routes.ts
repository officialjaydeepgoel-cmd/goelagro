import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "@/config/prisma";
import { validate } from "@/middleware/validate";
import { authenticate, authorize } from "@/middleware/auth";
import { sendSuccess, sendError, sendPaginated } from "@/utils/response";
import { paginateOptions } from "@/utils/helpers";

const router = Router();

const createPriceSchema = z.object({
  commodityName: z.string(),
  variety: z.string().optional(),
  market: z.string(),
  state: z.string().optional(),
  district: z.string().optional(),
  minPrice: z.number().positive(),
  maxPrice: z.number().positive(),
  modalPrice: z.number().positive(),
  unit: z.string().default("Per Quintal"),
  currency: z.string().default("INR"),
  source: z.string().optional(),
});

/**
 * @openapi
 * /api/v1/market-prices:
 *   get:
 *     tags: [Market Prices]
 *     summary: Get live market prices with filters
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const commodityName = req.query.commodity as string;
    const market = req.query.market as string;
    const state = req.query.state as string;

    const where: Record<string, unknown> = {};
    if (commodityName) where.commodityName = { contains: commodityName, mode: "insensitive" };
    if (market) where.market = { contains: market, mode: "insensitive" };
    if (state) where.state = state;

    // Get latest date for each commodity
    const latestDate = await prisma.marketPrice.findFirst({
      orderBy: { date: "desc" },
      select: { date: true },
    });

    if (latestDate) {
      (where as any).date = latestDate.date;
    }

    const [prices, total] = await Promise.all([
      prisma.marketPrice.findMany({
        where: where as any,
        ...paginateOptions(page, limit),
        orderBy: { commodityName: "asc" },
      }),
      prisma.marketPrice.count({ where: where as any }),
    ]);

    sendPaginated(res, prices, total, page, limit);
  } catch (error) {
    console.error("Get market prices error:", error);
    sendError(res, "Failed to fetch market prices", 500);
  }
});

/**
 * @openapi
 * /api/v1/market-prices/commodities:
 *   get:
 *     tags: [Market Prices]
 *     summary: Get list of tracked commodities with latest prices
 */
router.get("/commodities", async (_req: Request, res: Response) => {
  try {
    // Get latest price for each commodity using raw query
    const commodities = await prisma.marketPrice.groupBy({
      by: ["commodityName"],
      _max: { date: true },
    });

    const latestPrices = await Promise.all(
      commodities.map(async (c) => {
        const latest = await prisma.marketPrice.findFirst({
          where: { commodityName: c.commodityName, date: c._max.date! },
          orderBy: { modalPrice: "desc" },
          take: 1,
        });
        return latest;
      })
    );

    sendSuccess(res, latestPrices.filter(Boolean));
  } catch (error) {
    console.error("Get commodities error:", error);
    sendError(res, "Failed to fetch commodities", 500);
  }
});

/**
 * @openapi
 * /api/v1/market-prices:
 *   post:
 *     tags: [Market Prices]
 *     summary: Add market price entry (Admin)
 */
router.post("/", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(createPriceSchema), async (req: Request, res: Response) => {
  try {
    const price = await prisma.marketPrice.create({
      data: {
        ...req.body,
        minPrice: req.body.minPrice,
        maxPrice: req.body.maxPrice,
        modalPrice: req.body.modalPrice,
        date: new Date(),
      },
    });

    sendSuccess(res, price, "Market price added", 201);
  } catch (error) {
    console.error("Create market price error:", error);
    sendError(res, "Failed to add market price", 500);
  }
});

export default router;
