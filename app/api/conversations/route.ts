import { NextResponse } from "next/server";

import { getDbUserForRequest } from "@/lib/auth";
import { handleApiError, unauthorized } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getDbUserForRequest();
    if (!user) return unauthorized();

    const conversations = await prisma.conversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: { attachments: true },
        },
      },
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getDbUserForRequest();
    if (!user) return unauthorized();

    const body = (await request.json()) as { title?: string };
    const title = body.title?.trim() || "New Chat";

    const conversation = await prisma.conversation.create({
      data: {
        title,
        userId: user.id,
      },
      include: { messages: true },
    });

    return NextResponse.json({ conversation });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE() {
  try {
    const user = await getDbUserForRequest();
    if (!user) return unauthorized();

    await prisma.conversation.deleteMany({ where: { userId: user.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
