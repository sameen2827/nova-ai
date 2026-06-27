import { NextResponse } from "next/server";

import { getDbUserForRequest } from "@/lib/auth";
import { handleApiError, unauthorized } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const user = await getDbUserForRequest();
    if (!user) return unauthorized();

    await prisma.conversation.deleteMany({ where: { userId: user.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
