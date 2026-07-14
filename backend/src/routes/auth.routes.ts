import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import prisma from "@/config/prisma";
import { config } from "@/config";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth";
import { sendSuccess, sendError } from "@/utils/response";
import { generateOtp } from "@/utils/helpers";
import { AuthRequest, JwtPayload } from "@/types";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  password: z.string().min(8).max(100),
  role: z.enum(["BUYER", "SELLER"]).default("BUYER"),
  companyName: z.string().min(2).max(200).optional(),
  companyType: z.enum(["EXPORTER", "IMPORTER", "BOTH"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 */
router.post("/register", validate(registerSchema), async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role, companyName, companyType } = req.body;

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) return sendError(res, "Email already registered", 409);

    const existingPhone = await prisma.user.findUnique({ where: { phone } });
    if (existingPhone) return sendError(res, "Phone already registered", 409);

    const passwordHash = await bcrypt.hash(password, 12);

    let companyId: string | undefined;
    if (companyName) {
      const company = await prisma.company.create({
        data: {
          name: companyName,
          companyType: companyType || "EXPORTER",
        },
      });
      companyId = company.id;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role,
        companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        companyId: true,
        createdAt: true,
      },
    });

    if (role === "BUYER" && companyId) {
      await prisma.buyerProfile.create({
        data: { companyId, businessType: companyType },
      });
    }

    if (role === "SELLER" && companyId) {
      await prisma.sellerProfile.create({
        data: { companyId, businessType: companyType },
      });
    }

    const otp = generateOtp();
    console.log(`[DEV] OTP for ${email}: ${otp}`);
    // TODO: Send OTP via email/SMS

    sendSuccess(res, { userId: user.id, email }, "Registration successful. Please verify your email.", 201);
  } catch (error) {
    console.error("Register error:", error);
    sendError(res, "Registration failed", 500);
  }
});

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and get tokens
 */
router.post("/login", validate(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return sendError(res, "Invalid credentials", 401);

    if (user.status === "SUSPENDED" || user.status === "BLOCKED") {
      return sendError(res, "Account is suspended. Contact support.", 403);
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return sendError(res, "Invalid credentials", 401);

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiresIn,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    } as jwt.SignOptions);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        kycStatus: user.kycStatus,
        companyId: user.companyId,
      },
    }, "Login successful");
  } catch (error) {
    console.error("Login error:", error);
    sendError(res, "Login failed", 500);
  }
});

/**
 * @openapi
 * /api/v1/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 */
router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!refreshToken) return sendError(res, "Refresh token required", 401);

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as JwtPayload;
    } catch {
      return sendError(res, "Invalid or expired refresh token", 401);
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.refreshToken !== refreshToken) {
      return sendError(res, "Invalid refresh token", 401);
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiresIn,
    } as jwt.SignOptions);

    sendSuccess(res, { accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh error:", error);
    sendError(res, "Token refresh failed", 500);
  }
});

/**
 * @openapi
 * /api/v1/auth/verify-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Verify email with OTP
 */
router.post("/verify-otp", validate(otpSchema), async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.update({
      where: { email },
      data: { isVerified: true, status: "ACTIVE" },
      select: { id: true, email: true, isVerified: true },
    });

    sendSuccess(res, user, "Email verified successfully");
  } catch (error) {
    console.error("OTP verify error:", error);
    sendError(res, "Verification failed", 500);
  }
});

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 */
router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        isVerified: true,
        kycStatus: true,
        companyId: true,
        company: {
          select: {
            id: true,
            name: true,
            gstNumber: true,
            iecCode: true,
            logo: true,
            verifiedBadge: true,
            companyType: true,
            country: true,
          },
        },
        createdAt: true,
      },
    });

    if (!user) return sendError(res, "User not found", 404);
    sendSuccess(res, user);
  } catch (error) {
    console.error("Get profile error:", error);
    sendError(res, "Failed to fetch profile", 500);
  }
});

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 */
router.post("/logout", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { refreshToken: null },
    });

    res.clearCookie("refreshToken");
    sendSuccess(res, null, "Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    sendError(res, "Logout failed", 500);
  }
});

export default router;
