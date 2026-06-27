import { NextResponse } from "next/server";

import { getDbUserForRequest } from "@/lib/auth";
import { handleApiError, unauthorized } from "@/lib/api-errors";

export async function GET() {
  try {
    const user = await getDbUserForRequest();
    if (!user) return unauthorized();

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        preferredModel: user.preferredModel,
        imageUrl: user.imageUrl,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
