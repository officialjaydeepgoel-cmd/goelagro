import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { successResponse, errorResponse, paginatedResponse } from "@/lib/utils/api-response";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    const where: any = {};
    if (user.role === "CUSTOMER") where.customerId = user.id;
    else if (user.role === "PARTNER") {
      const partner = await prisma.partner.findUnique({ where: { userId: user.id } });
      if (partner) where.partnerId = partner.id;
      else return errorResponse("Partner profile not found", 404);
    }
    if (status) where.status = status;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          customer: { select: { id: true, name: true, avatarUrl: true, phone: true } },
          partner: {
            include: { user: { select: { name: true, avatarUrl: true } } },
          },
          payment: true,
          review: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return paginatedResponse(bookings, total, page, limit);
  } catch (error) {
    console.error("Bookings fetch error:", error);
    return errorResponse("Failed to fetch bookings", 500);
  }
}
