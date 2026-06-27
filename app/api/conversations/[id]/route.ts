import { NextResponse } from "next/server";

import { getDbUserForRequest } from "@/lib/auth";
import { handleApiError, notFound, unauthorized } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await getDbUserForRequest();
    if (!user) return unauthorized();

    const { id } = await context.params;

    const conversation = await prisma.conversation.findFirst({
      where: { id, userId: user.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: { attachments: true },
        },
      },
    });

    if (!conversation) return notFound("Conversation not found");

    return NextResponse.json({ conversation });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await getDbUserForRequest();
    if (!user) return unauthorized();

    const { id } = await context.params;

    const conversation = await prisma.conversation.findFirst({
      where: { id, userId: user.id },
    });

    if (!conversation) return notFound("Conversation not found");

    await prisma.conversation.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
