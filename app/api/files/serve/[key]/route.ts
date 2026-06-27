import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

import { getDbUserForRequest } from "@/lib/auth";
import { handleApiError, notFound, unauthorized } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ key: string }> };

const UPLOAD_DIR = path.join(process.cwd(), "storage", "uploads");

export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await getDbUserForRequest();
    if (!user) return unauthorized();

    const { key } = await context.params;
    const storageKey = decodeURIComponent(key);

    const attachment = await prisma.attachment.findFirst({
      where: { storageKey, userId: user.id },
    });

    if (!attachment) return notFound("File not found");

    const filePath = path.join(UPLOAD_DIR, storageKey);
    const buffer = await readFile(filePath);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": attachment.mimeType,
        "Content-Disposition": `inline; filename="${attachment.originalName}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
