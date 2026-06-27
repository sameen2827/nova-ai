import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

import { getDbUserForRequest } from "@/lib/auth";
import { handleApiError, notFound, unauthorized } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await getDbUserForRequest();
    if (!user) return unauthorized();

    const { id } = await context.params;

    const attachment = await prisma.attachment.findFirst({
      where: { id, userId: user.id },
    });

    if (!attachment) return notFound("File not found");

    await prisma.attachment.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
