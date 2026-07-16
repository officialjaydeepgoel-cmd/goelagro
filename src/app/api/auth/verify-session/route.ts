import { getCurrentUser } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Not authenticated", 401);
    }
    return successResponse({ user });
  } catch {
    return errorResponse("Not authenticated", 401);
  }
}
