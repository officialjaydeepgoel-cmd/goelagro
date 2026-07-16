import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/bcrypt";
import { signAccessToken, signRefreshToken, setAuthCookies } from "@/lib/auth/jwt";
import { registerSchema } from "@/lib/validations/auth";
import { successResponse, errorResponse } from "@/lib/utils/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message);
    }

    const { name, email, phone, password, role } = validation.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (existingUser) {
      return errorResponse("User with this email or phone already exists");
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        passwordHash,
        role: role as "CUSTOMER" | "PARTNER",
        ...(role === "PARTNER"
          ? {
              partner: {
                create: {
                  skills: [],
                  languages: [],
                },
              },
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatarUrl: true,
        isVerified: true,
      },
    });

    await prisma.wallet.create({
      data: { userId: user.id },
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

    return successResponse({ user, accessToken }, 201);
  } catch (error) {
    console.error("Registration error:", error);
    return errorResponse("Internal server error", 500);
  }
}
