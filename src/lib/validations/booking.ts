import { z } from "zod";

export const createBookingSchema = z.object({
  partnerId: z.string().cuid(),
  serviceType: z.string().min(1, "Service type is required"),
  bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  duration: z.number().int().min(1, "Duration must be at least 1 hour"),
  address: z.string().optional(),
  city: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  notes: z.string().max(500).optional(),
  couponCode: z.string().optional(),
});

export const cancelBookingSchema = z.object({
  bookingId: z.string().cuid(),
  reason: z.string().min(1, "Cancellation reason is required"),
});

export const completeBookingSchema = z.object({
  bookingId: z.string().cuid(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
