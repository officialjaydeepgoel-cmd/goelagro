import { Router, Response } from "express";
import prisma from "@/config/prisma";
import { authenticate, authorize } from "@/middleware/auth";
import { sendSuccess, sendError, sendPaginated } from "@/utils/response";
import { paginateOptions } from "@/utils/helpers";
import { AuthRequest } from "@/types";

const router = Router();

// All admin routes require ADMIN or SUPER_ADMIN role
router.use(authenticate);
router.use(authorize("ADMIN", "SUPER_ADMIN"));

/**
 * @openapi
 * /api/v1/admin/dashboard:
 *   get:
 *     tags: [Admin]
 *     summary: Get admin dashboard KPIs
 */
router.get("/dashboard", async (_req: AuthRequest, res: Response) => {
  try {
    const [
      totalUsers, totalSellers, totalBuyers, totalProducts,
      activeProducts, pendingProducts, totalRfqs, totalOrders,
      revenue, pendingKyc,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "SELLER" } }),
      prisma.user.count({ where: { role: "BUYER" } }),
      prisma.product.count(),
      prisma.product.count({ where: { status: "ACTIVE" } }),
      prisma.product.count({ where: { status: "PENDING" } }),
      prisma.rFQ.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: "PAID" } }),
      prisma.user.count({ where: { kycStatus: "PENDING" } }),
    ]);

    sendSuccess(res, {
      totalUsers,
      totalSellers,
      totalBuyers,
      totalProducts,
      activeProducts,
      pendingProducts,
      totalRfqs,
      totalOrders,
      totalRevenue: revenue._sum.totalAmount || 0,
      pendingKyc,
      usersByRole: { sellers: totalSellers, buyers: totalBuyers },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    sendError(res, "Failed to fetch dashboard data", 500);
  }
});

/**
 * @openapi
 * /api/v1/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List all users with filters
 */
router.get("/users", async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(String(req.query.page || "0")) || 1;
    const limit = parseInt(String(req.query.limit || "0")) || 20;
    const role = String(req.query.role || "");
    const status = String(req.query.status || "");
    const search = String(req.query.search || "");

    const where: Record<string, unknown> = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
    ];

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: where as any,
        ...paginateOptions(page, limit),
        orderBy: { createdAt: "desc" },
        include: {
          company: { select: { id: true, name: true, verifiedBadge: true } },
        },
      }),
      prisma.user.count({ where: where as any }),
    ]);

    sendPaginated(res, users, total, page, limit);
  } catch (error) {
    console.error("Get users error:", error);
    sendError(res, "Failed to fetch users", 500);
  }
});

/**
 * @openapi
 * /api/v1/admin/users/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update user status (verify, suspend, etc.)
 */
router.put("/users/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id || "");
    const { status, kycStatus, isVerified } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(kycStatus && { kycStatus }),
        ...(isVerified !== undefined && { isVerified }),
      },
      select: {
        id: true, name: true, email: true, role: true,
        status: true, kycStatus: true, isVerified: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: "UPDATE_USER",
        entity: "User",
        entityId: id,
        details: { changes: req.body },
      },
    });

    sendSuccess(res, user, "User updated");
  } catch (error) {
    console.error("Update user error:", error);
    sendError(res, "Failed to update user", 500);
  }
});

/**
 * @openapi
 * /api/v1/admin/products/pending:
 *   get:
 *     tags: [Admin]
 *     summary: Get products pending approval
 */
router.get("/products/pending", async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(String(req.query.page || "0")) || 1;
    const limit = parseInt(String(req.query.limit || "0")) || 20;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { status: "PENDING" },
        ...paginateOptions(page, limit),
        orderBy: { createdAt: "desc" },
        include: {
          seller: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, name: true } },
        },
      }),
      prisma.product.count({ where: { status: "PENDING" } }),
    ]);

    sendPaginated(res, products, total, page, limit);
  } catch (error) {
    console.error("Pending products error:", error);
    sendError(res, "Failed to fetch pending products", 500);
  }
});

/**
 * @openapi
 * /api/v1/admin/products/{id}/approve:
 *   put:
 *     tags: [Admin]
 *     summary: Approve or reject a product
 */
router.put("/products/:id/approve", async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id || "");
    const { status, rejectionReason } = req.body;

    if (!["ACTIVE", "REJECTED"].includes(status)) {
      return sendError(res, "Invalid status. Use ACTIVE or REJECTED", 400);
    }

    const product = await prisma.product.update({
      where: { id },
      data: { status, ...(rejectionReason && { description: rejectionReason }) },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: status === "ACTIVE" ? "APPROVE_PRODUCT" : "REJECT_PRODUCT",
        entity: "Product",
        entityId: id,
        details: { ...(rejectionReason && { reason: rejectionReason }) },
      },
    });

    sendSuccess(res, product, `Product ${status === "ACTIVE" ? "approved" : "rejected"}`);
  } catch (error) {
    console.error("Approve product error:", error);
    sendError(res, "Failed to update product status", 500);
  }
});

/**
 * @openapi
 * /api/v1/admin/leads:
 *   get:
 *     tags: [Admin]
 *     summary: Get all leads with filters
 */
router.get("/leads", async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(String(req.query.page || "0")) || 1;
    const limit = parseInt(String(req.query.limit || "0")) || 20;
    const status = String(req.query.status || "");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where: where as any,
        ...paginateOptions(page, limit),
        orderBy: [{ score: "desc" }, { createdAt: "desc" }],
        include: {
          assignedUser: { select: { id: true, name: true } },
          _count: { select: { assignments: true } },
        },
      }),
      prisma.lead.count({ where: where as any }),
    ]);

    sendPaginated(res, leads, total, page, limit);
  } catch (error) {
    console.error("Get leads error:", error);
    sendError(res, "Failed to fetch leads", 500);
  }
});

/**
 * @openapi
 * /api/v1/admin/settings:
 *   get:
 *     tags: [Admin]
 *     summary: Get all site settings
 */
router.get("/settings", async (_req: AuthRequest, res: Response) => {
  try {
    const settings = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, unknown> = {};
    settings.forEach((s) => { settingsMap[s.key] = s.value; });
    sendSuccess(res, settingsMap);
  } catch (error) {
    console.error("Get settings error:", error);
    sendError(res, "Failed to fetch settings", 500);
  }
});

router.put("/settings", async (req: AuthRequest, res: Response) => {
  try {
    const updates = req.body;
    const results = [];

    for (const [key, value] of Object.entries(updates)) {
      const updated = await prisma.siteSetting.upsert({
        where: { key },
        update: { value: value as any },
        create: { key, value: value as any },
      });
      results.push(updated);
    }

    sendSuccess(res, results, "Settings updated");
  } catch (error) {
    console.error("Update settings error:", error);
    sendError(res, "Failed to update settings", 500);
  }
});

/**
 * @openapi
 * /api/v1/admin/audit-logs:
 *   get:
 *     tags: [Admin]
 *     summary: Get audit log entries
 */
router.get("/audit-logs", async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(String(req.query.page || "0")) || 1;
    const limit = parseInt(String(req.query.limit || "0")) || 50;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        ...paginateOptions(page, limit),
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      prisma.auditLog.count(),
    ]);

    sendPaginated(res, logs, total, page, limit);
  } catch (error) {
    console.error("Audit logs error:", error);
    sendError(res, "Failed to fetch audit logs", 500);
  }
});

export default router;
