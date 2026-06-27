import { NextResponse } from "next/server";

import { getDbUserForRequest } from "@/lib/auth";
import { handleApiError, unauthorized } from "@/lib/api-errors";
import { getInitials, truncateText } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getDbUserForRequest();
    if (!user) return unauthorized();

    const [conversationCount, messageCount, recentConversations] =
      await Promise.all([
        prisma.conversation.count({ where: { userId: user.id } }),
        prisma.message.count({
          where: { conversation: { userId: user.id } },
        }),
        prisma.conversation.findMany({
          where: { userId: user.id },
          orderBy: { updatedAt: "desc" },
          take: 5,
          include: {
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        }),
      ]);

    const estimatedTokens = messageCount * 120;

    return NextResponse.json({
      stats: {
        totalChats: conversationCount,
        totalMessages: messageCount,
        tokensUsed: estimatedTokens,
        tokensLimit: 2_000_000,
        avgResponseTime: 87,
        activeModels: 5,
      },
      recentConversations: recentConversations.map((c) => ({
        id: c.id,
        title: c.title,
        preview: truncateText(c.messages[0]?.content ?? "", 80),
        updatedAt: c.updatedAt.toISOString(),
      })),
      user: {
        name: user.name,
        email: user.email,
        plan: "Pro",
        avatar: getInitials(user.name ?? "User"),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
