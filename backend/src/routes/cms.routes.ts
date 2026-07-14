import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "@/config/prisma";
import { authenticate, authorize } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { sendSuccess, sendError } from "@/utils/response";
import { AuthRequest } from "@/types";

const router = Router();

// ─── Photos ───────────────────────────────────────────────────────

const createPhotoSchema = z.object({
  name: z.string().min(1).max(255),
  url: z.string().min(1),
  thumbnail: z.string().optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  tags: z.string().optional(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
  folder: z.string().optional(),
  sortOrder: z.number().optional(),
});

router.get("/photos", async (_req: Request, res: Response) => {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: { sortOrder: "asc" },
      include: { uploadedBy: { select: { id: true, name: true } } },
    });
    sendSuccess(res, photos);
  } catch (error) {
    console.error("Get photos error:", error);
    sendError(res, "Failed to fetch photos", 500);
  }
});

router.post("/photos", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(createPhotoSchema), async (req: AuthRequest, res: Response) => {
  try {
    const data = { ...req.body, uploadedById: req.user!.userId };
    const photo = await prisma.photo.create({ data });
    sendSuccess(res, photo, "Photo uploaded successfully", 201);
  } catch (error) {
    console.error("Create photo error:", error);
    sendError(res, "Failed to upload photo", 500);
  }
});

router.put("/photos/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.photo.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Photo not found", 404);

    const photo = await prisma.photo.update({
      where: { id },
      data: req.body,
    });
    sendSuccess(res, photo, "Photo updated");
  } catch (error) {
    console.error("Update photo error:", error);
    sendError(res, "Failed to update photo", 500);
  }
});

router.delete("/photos/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.photo.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Photo not found", 404);

    await prisma.photo.delete({ where: { id } });
    sendSuccess(res, null, "Photo deleted");
  } catch (error) {
    console.error("Delete photo error:", error);
    sendError(res, "Failed to delete photo", 500);
  }
});

// ─── Media ────────────────────────────────────────────────────────

const createMediaSchema = z.object({
  title: z.string().min(1).max(255),
  url: z.string().min(1),
  type: z.string().default("video"),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  embedCode: z.string().optional(),
  duration: z.string().optional(),
});

router.get("/media", async (_req: Request, res: Response) => {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      include: { uploadedBy: { select: { id: true, name: true } } },
    });
    sendSuccess(res, media);
  } catch (error) {
    console.error("Get media error:", error);
    sendError(res, "Failed to fetch media", 500);
  }
});

router.post("/media", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(createMediaSchema), async (req: AuthRequest, res: Response) => {
  try {
    const data = { ...req.body, uploadedById: req.user!.userId };
    const media = await prisma.media.create({ data });
    sendSuccess(res, media, "Media added successfully", 201);
  } catch (error) {
    console.error("Create media error:", error);
    sendError(res, "Failed to add media", 500);
  }
});

router.put("/media/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.media.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Media not found", 404);

    const media = await prisma.media.update({ where: { id }, data: req.body });
    sendSuccess(res, media, "Media updated");
  } catch (error) {
    console.error("Update media error:", error);
    sendError(res, "Failed to update media", 500);
  }
});

router.delete("/media/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.media.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Media not found", 404);

    await prisma.media.delete({ where: { id } });
    sendSuccess(res, null, "Media deleted");
  } catch (error) {
    console.error("Delete media error:", error);
    sendError(res, "Failed to delete media", 500);
  }
});

// ─── Blogs ────────────────────────────────────────────────────────

const createBlogSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  tags: z.string().optional(),
  published: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/--+/g, "-").trim();
}

router.get("/blogs", async (_req: Request, res: Response) => {
  try {
    const blogs = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    sendSuccess(res, blogs);
  } catch (error) {
    console.error("Get blogs error:", error);
    sendError(res, "Failed to fetch blogs", 500);
  }
});

router.get("/blogs/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await prisma.blogPost.findUnique({ where: { id } });
    if (!blog) return sendError(res, "Blog not found", 404);
    sendSuccess(res, blog);
  } catch (error) {
    console.error("Get blog error:", error);
    sendError(res, "Failed to fetch blog", 500);
  }
});

router.post("/blogs", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(createBlogSchema), async (req: AuthRequest, res: Response) => {
  try {
    let slug = slugify(req.body.title);
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) slug = slug + "-" + Date.now();

    const data = {
      ...req.body,
      slug,
      author: req.user!.userId,
      publishedAt: req.body.published ? new Date() : null,
    };
    const blog = await prisma.blogPost.create({ data });
    sendSuccess(res, blog, "Blog created successfully", 201);
  } catch (error) {
    console.error("Create blog error:", error);
    sendError(res, "Failed to create blog", 500);
  }
});

router.put("/blogs/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Blog not found", 404);

    const data: Record<string, unknown> = { ...req.body };
    if (data.title && data.title !== existing.title) {
      let slug = slugify(data.title as string);
      const dup = await prisma.blogPost.findFirst({ where: { slug, id: { not: id } } });
      if (dup) slug = slug + "-" + Date.now();
      data.slug = slug;
    }
    if (data.published && !existing.publishedAt) data.publishedAt = new Date();

    const blog = await prisma.blogPost.update({ where: { id }, data });
    sendSuccess(res, blog, "Blog updated");
  } catch (error) {
    console.error("Update blog error:", error);
    sendError(res, "Failed to update blog", 500);
  }
});

router.delete("/blogs/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Blog not found", 404);

    await prisma.blogPost.delete({ where: { id } });
    sendSuccess(res, null, "Blog deleted");
  } catch (error) {
    console.error("Delete blog error:", error);
    sendError(res, "Failed to delete blog", 500);
  }
});

// ─── Menu ─────────────────────────────────────────────────────────

const menuSchema = z.object({
  name: z.string().min(1).max(100),
  location: z.string().default("header"),
  items: z.string().optional(),
  isActive: z.boolean().optional(),
});

router.get("/menus", async (_req: Request, res: Response) => {
  try {
    const menus = await prisma.menu.findMany({ orderBy: { createdAt: "desc" } });
    sendSuccess(res, menus);
  } catch (error) {
    console.error("Get menus error:", error);
    sendError(res, "Failed to fetch menus", 500);
  }
});

router.post("/menus", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(menuSchema), async (req: AuthRequest, res: Response) => {
  try {
    const menu = await prisma.menu.create({ data: req.body });
    sendSuccess(res, menu, "Menu created", 201);
  } catch (error) {
    console.error("Create menu error:", error);
    sendError(res, "Failed to create menu", 500);
  }
});

router.put("/menus/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.menu.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Menu not found", 404);

    const menu = await prisma.menu.update({ where: { id }, data: req.body });
    sendSuccess(res, menu, "Menu updated");
  } catch (error) {
    console.error("Update menu error:", error);
    sendError(res, "Failed to update menu", 500);
  }
});

router.delete("/menus/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.menu.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Menu not found", 404);

    await prisma.menu.delete({ where: { id } });
    sendSuccess(res, null, "Menu deleted");
  } catch (error) {
    console.error("Delete menu error:", error);
    sendError(res, "Failed to delete menu", 500);
  }
});

// ─── Services ─────────────────────────────────────────────────────

const serviceSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(1),
  shortDesc: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  features: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

router.get("/services", async (_req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
    sendSuccess(res, services);
  } catch (error) {
    console.error("Get services error:", error);
    sendError(res, "Failed to fetch services", 500);
  }
});

router.post("/services", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(serviceSchema), async (req: AuthRequest, res: Response) => {
  try {
    let slug = req.body.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").trim();
    const existing = await prisma.service.findUnique({ where: { slug } });
    if (existing) slug = slug + "-" + Date.now();
    const service = await prisma.service.create({ data: { ...req.body, slug } });
    sendSuccess(res, service, "Service created", 201);
  } catch (error) {
    console.error("Create service error:", error);
    sendError(res, "Failed to create service", 500);
  }
});

router.put("/services/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Service not found", 404);
    const service = await prisma.service.update({ where: { id }, data: req.body });
    sendSuccess(res, service, "Service updated");
  } catch (error) {
    console.error("Update service error:", error);
    sendError(res, "Failed to update service", 500);
  }
});

router.delete("/services/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Service not found", 404);
    await prisma.service.delete({ where: { id } });
    sendSuccess(res, null, "Service deleted");
  } catch (error) {
    console.error("Delete service error:", error);
    sendError(res, "Failed to delete service", 500);
  }
});

// ─── Testimonials ─────────────────────────────────────────────────

const testimonialSchema = z.object({
  name: z.string().min(2).max(100),
  message: z.string().min(1),
  designation: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  photo: z.string().optional(),
  approved: z.boolean().optional(),
});

router.get("/testimonials", async (_req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
    sendSuccess(res, testimonials);
  } catch (error) {
    console.error("Get testimonials error:", error);
    sendError(res, "Failed to fetch testimonials", 500);
  }
});

router.post("/testimonials", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(testimonialSchema), async (req: AuthRequest, res: Response) => {
  try {
    const testimonial = await prisma.testimonial.create({ data: req.body });
    sendSuccess(res, testimonial, "Testimonial created", 201);
  } catch (error) {
    console.error("Create testimonial error:", error);
    sendError(res, "Failed to create testimonial", 500);
  }
});

router.put("/testimonials/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Testimonial not found", 404);
    const testimonial = await prisma.testimonial.update({ where: { id }, data: req.body });
    sendSuccess(res, testimonial, "Testimonial updated");
  } catch (error) {
    console.error("Update testimonial error:", error);
    sendError(res, "Failed to update testimonial", 500);
  }
});

router.delete("/testimonials/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Testimonial not found", 404);
    await prisma.testimonial.delete({ where: { id } });
    sendSuccess(res, null, "Testimonial deleted");
  } catch (error) {
    console.error("Delete testimonial error:", error);
    sendError(res, "Failed to delete testimonial", 500);
  }
});

// ─── Banners ──────────────────────────────────────────────────────

const bannerSchema = z.object({
  title: z.string().min(1).max(255),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  image: z.string().min(1),
  link: z.string().optional(),
  linkText: z.string().optional(),
  position: z.string().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

router.get("/banners", async (_req: Request, res: Response) => {
  try {
    const banners = await prisma.banner.findMany({ orderBy: { sortOrder: "asc" } });
    sendSuccess(res, banners);
  } catch (error) {
    console.error("Get banners error:", error);
    sendError(res, "Failed to fetch banners", 500);
  }
});

router.post("/banners", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(bannerSchema), async (req: AuthRequest, res: Response) => {
  try {
    const banner = await prisma.banner.create({ data: req.body });
    sendSuccess(res, banner, "Banner created", 201);
  } catch (error) {
    console.error("Create banner error:", error);
    sendError(res, "Failed to create banner", 500);
  }
});

router.put("/banners/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.banner.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Banner not found", 404);
    const banner = await prisma.banner.update({ where: { id }, data: req.body });
    sendSuccess(res, banner, "Banner updated");
  } catch (error) {
    console.error("Update banner error:", error);
    sendError(res, "Failed to update banner", 500);
  }
});

router.delete("/banners/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.banner.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Banner not found", 404);
    await prisma.banner.delete({ where: { id } });
    sendSuccess(res, null, "Banner deleted");
  } catch (error) {
    console.error("Delete banner error:", error);
    sendError(res, "Failed to delete banner", 500);
  }
});

// ─── Bookings ─────────────────────────────────────────────────────

const bookingSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  service: z.string().min(1),
  message: z.string().optional(),
  status: z.string().optional(),
  date: z.string().optional(),
});

router.get("/bookings", async (_req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({ orderBy: { createdAt: "desc" } });
    sendSuccess(res, bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    sendError(res, "Failed to fetch bookings", 500);
  }
});

router.post("/bookings", async (req: Request, res: Response) => {
  try {
    const booking = await prisma.booking.create({ data: req.body });
    sendSuccess(res, booking, "Booking created", 201);
  } catch (error) {
    console.error("Create booking error:", error);
    sendError(res, "Failed to create booking", 500);
  }
});

router.put("/bookings/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Booking not found", 404);
    const booking = await prisma.booking.update({ where: { id }, data: req.body });
    sendSuccess(res, booking, "Booking updated");
  } catch (error) {
    console.error("Update booking error:", error);
    sendError(res, "Failed to update booking", 500);
  }
});

router.delete("/bookings/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Booking not found", 404);
    await prisma.booking.delete({ where: { id } });
    sendSuccess(res, null, "Booking deleted");
  } catch (error) {
    console.error("Delete booking error:", error);
    sendError(res, "Failed to delete booking", 500);
  }
});

export default router;
