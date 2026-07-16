import { prisma } from "@/lib/db/prisma";
import { verifyAccessToken, getAccessToken } from "./jwt";

export async function getCurrentUser() {
  try {
    const token = await getAccessToken();
    if (!token) return null;

    const payload = await verifyAccessToken(token);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        avatarUrl: true,
        role: true,
        isVerified: true,
        isPhoneVerified: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    return user;
  } catch {
    return null;
  }
}

export async function requireAuth(allowedRoles?: string[]) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }
  return user;
}
