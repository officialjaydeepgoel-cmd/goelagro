import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { createBookingSchema } from "@/lib/validations/booking";
import { successResponse, errorResponse } from "@/lib/utils/api-response";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse("Unauthorized", 401);
    if (user.role !== "CUSTOMER") return errorResponse("Only customers can create bookings", 403);

    const body = await request.json();
    const validation = createBookingSchema.safeParse(body);
    if (!validation.success) return errorResponse(validation.error.errors[0].message);

    const { partnerId, serviceType, bookingDate, startTime, duration, address, city, notes, couponCode } =
      validation.data;

    const partner = await prisma.partner.findUnique({
      where: { id: partnerId },
      include: { user: true },
    });

    if (!partner) return errorResponse("Partner not found", 404);
    if (partner.status !== "VERIFIED") return errorResponse("Partner is not verified", 400);

    const endTime = calculateEndTime(startTime, duration);
    const totalAmount = partner.hourlyPrice * duration;
    let discountAmount = 0;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.isActive && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
        if (totalAmount >= coupon.minAmount) {
          discountAmount =
            coupon.discountType === "PERCENTAGE"
              ? Math.min(totalAmount * (coupon.discountValue / 100), coupon.maxDiscount || Infinity)
              : coupon.discountValue;
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }
    }

    const finalAmount = totalAmount - discountAmount;

    const booking = await prisma.booking.create({
      data: {
        customerId: user.id,
        partnerId,
        serviceType,
        bookingDate: new Date(bookingDate),
        startTime,
        endTime,
        duration,
        totalAmount,
        discountAmount,
        couponCode: couponCode || null,
        finalAmount,
        address: address || null,
        city: city || null,
        notes: notes || null,
      },
      include: {
        partner: {
          include: { user: { select: { name: true, avatarUrl: true, phone: true } } },
        },
      },
    });

    await prisma.notification.create({
      data: {
        userId: partner.userId,
        type: "NEW_BOOKING",
        title: "New Booking Request",
        body: `${user.name} wants to book you for ${serviceType}`,
        data: { bookingId: booking.id },
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "CREATE_BOOKING",
        details: { bookingId: booking.id },
      },
    });

    return successResponse({ booking }, 201);
  } catch (error) {
    console.error("Booking creation error:", error);
    return errorResponse("Failed to create booking", 500);
  }
}

function calculateEndTime(startTime: string, durationHours: number): string {
  const [hours, minutes] = startTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + durationHours * 60;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`;
}
