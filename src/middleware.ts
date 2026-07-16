import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret"
);

const publicPaths = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/verify-otp",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/otp/send",
  "/api/auth/otp/verify",
  "/api/auth/google",
  "/api/auth/forgot-password",
  "/api/payments/webhook",
  "/search",
  "/partners",
  "/pricing",
  "/how-it-works",
  "/faq",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
];

const customerPaths = ["/dashboard/customer"];
const partnerPaths = ["/dashboard/partner"];
const adminPaths = ["/dashboard/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (isPublic) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(
      accessToken,
      JWT_SECRET
    );
    const role = payload.role as string;

    if (
      (customerPaths.some((p) => pathname.startsWith(p)) && role !== "CUSTOMER" && role !== "ADMIN") ||
      (partnerPaths.some((p) => pathname.startsWith(p)) && role !== "PARTNER" && role !== "ADMIN") ||
      (adminPaths.some((p) => pathname.startsWith(p)) && role !== "ADMIN")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|images|icons|fonts).*)",
  ],
};
