import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/bcrypt";
import { signAccessToken, signRefreshToken, setAuthCookies } from "@/lib/auth/jwt";
import { loginSchema } from "@/lib/validations/auth";
import { successResponse, errorResponse } from "@/lib/utils/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message);
    }

    const { email, phone, password } = validation.data;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (!user || !user.passwordHash) {
      return errorResponse("Invalid credentials", 401);
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return errorResponse("Invalid credentials", 401);
    }

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        details: { method: email ? "email" : "phone" },
        ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
      },
    });

    const accessToken = await signAccessToken({
      userId: user.id,
      role: user.role,
      email: user.email || undefined,
      phone: user.phone || undefined,
    });

    const refreshToken = await signRefreshToken({
      userId: user.id,
      role: user.role,
    });

    await setAuthCookies(accessToken, refreshToken);

    const { passwordHash: _, ...userWithoutPassword } = user;
    return successResponse({ user: userWithoutPassword, accessToken });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Internal server error", 500);
  }
}
