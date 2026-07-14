import { Router, Response } from "express";
import prisma from "@/config/prisma";
import { authenticate, authorize } from "@/middleware/auth";
import { sendSuccess, sendError, sendPaginated } from "@/utils/response";
import { generateOrderNumber, paginateOptions } from "@/utils/helpers";
import { AuthRequest } from "@/types";

const router = Router();

/**
 * @openapi
 * /api/v1/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get orders for current user
 */
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(String(req.query.page || "0")) || 1;
    const limit = parseInt(String(req.query.limit || "0")) || 20;
    const status = String(req.query.status || "");

    const where: Record<string, unknown> = {};
    if (req.user!.role === "BUYER") where.buyerId = req.user!.userId;
    else if (req.user!.role === "SELLER") where.sellerId = req.user!.userId;
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: where as any,
        ...paginateOptions(page, limit),
        orderBy: { createdAt: "desc" },
        include: {
          buyer: { select: { id: true, name: true, company: { select: { name: true } } } },
          seller: { select: { id: true, name: true, company: { select: { name: true } } } },
          items: {
            include: { product: { select: { id: true, name: true, slug: true, images: true } } },
          },
        },
      }),
      prisma.order.count({ where: where as any }),
    ]);

    sendPaginated(res, orders, total, page, limit);
  } catch (error) {
    console.error("Get orders error:", error);
    sendError(res, "Failed to fetch orders", 500);
  }
});

/**
 * @openapi
 * /api/v1/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order details
 */
router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: String(req.params.id || "") },
      include: {
        buyer: { select: { id: true, name: true, email: true, phone: true, company: { select: { name: true, logo: true } } } },
        seller: { select: { id: true, name: true, email: true, phone: true, company: { select: { name: true, logo: true } } } },
        items: {
          include: { product: { select: { id: true, name: true, slug: true, images: true, hsCode: true } } },
        },
      },
    });

    if (!order) return sendError(res, "Order not found", 404);

    // Check permission
    const userId = req.user!.userId;
    if (order.buyerId !== userId && order.sellerId !== userId && !["ADMIN", "SUPER_ADMIN"].includes(req.user!.role)) {
      return sendError(res, "Unauthorized", 403);
    }

    sendSuccess(res, order);
  } catch (error) {
    console.error("Get order error:", error);
    sendError(res, "Failed to fetch order", 500);
  }
});

/**
 * @openapi
 * /api/v1/orders/{id}/status:
 *   put:
 *     tags: [Orders]
 *     summary: Update order status
 */
router.put("/:id/status", authenticate, authorize("SELLER", "ADMIN", "SUPER_ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id || "");
    const { status, trackingNumber, shippingLine, portOfLoading, portOfDischarge } = req.body;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return sendError(res, "Order not found", 404);

    if (req.user!.role === "SELLER" && order.sellerId !== req.user!.userId) {
      return sendError(res, "Unauthorized", 403);
    }

    const updateData: Record<string, unknown> = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (shippingLine) updateData.shippingLine = shippingLine;
    if (portOfLoading) updateData.portOfLoading = portOfLoading;
    if (portOfDischarge) updateData.portOfDischarge = portOfDischarge;
    if (status === "DELIVERED") updateData.deliveredAt = new Date();

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    sendSuccess(res, updated, "Order status updated");
  } catch (error) {
    console.error("Update order status error:", error);
    sendError(res, "Failed to update order status", 500);
  }
});

export default router;
