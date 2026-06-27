import { NextResponse } from "next/server";

import { getDbUserForRequest } from "@/lib/auth";
import { titleFromMessage } from "@/lib/chat-utils";
import {
  badRequest,
  handleApiError,
  notFound,
  unauthorized,
} from "@/lib/api-errors";
import { isValidGroqModel } from "@/lib/groq-models";
import { parseGroqStream, streamGroqChat } from "@/lib/groq";
import { prisma } from "@/lib/prisma";

type ChatRequest = {
  conversationId?: string;
  message?: string;
  model?: string;
  regenerate?: boolean;
  attachmentIds?: string[];
};

function sseEvent(data: Record<string, unknown>) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: Request) {
  try {
    const user = await getDbUserForRequest();
    if (!user) return unauthorized();

    const body = (await request.json()) as ChatRequest;
    const regenerate = body.regenerate === true;
    const model =
      body.model && isValidGroqModel(body.model)
        ? body.model
        : isValidGroqModel(user.preferredModel)
          ? user.preferredModel
          : "llama-3.3-70b-versatile";

    let conversationId = body.conversationId;
    let userContent = body.message?.trim() ?? "";

    if (regenerate) {
      if (!conversationId) return badRequest("conversationId is required");

      const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, userId: user.id },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });

      if (!conversation) return notFound("Conversation not found");

      const lastAssistant = [...conversation.messages]
        .reverse()
        .find((m) => m.role === "assistant");
      if (!lastAssistant) return badRequest("No assistant message to regenerate");

      await prisma.message.delete({ where: { id: lastAssistant.id } });

      const history = conversation.messages
        .filter((m) => m.id !== lastAssistant.id)
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

      return streamAssistantResponse({
        conversationId: conversation.id,
        history,
        model,
      });
    }

    if (!userContent && (!body.attachmentIds || body.attachmentIds.length === 0)) {
      return badRequest("Message or attachments are required");
    }

    if (!conversationId) {
      const conversation = await prisma.conversation.create({
        data: {
          title: titleFromMessage(userContent),
          userId: user.id,
        },
      });
      conversationId = conversation.id;
    } else {
      const exists = await prisma.conversation.findFirst({
        where: { id: conversationId, userId: user.id },
      });
      if (!exists) return notFound("Conversation not found");
    }

    const userMessage = await prisma.message.create({
      data: {
        conversationId,
        role: "user",
        content: userContent || "(attached files)",
      },
    });

    if (body.attachmentIds?.length) {
      await prisma.attachment.updateMany({
        where: {
          id: { in: body.attachmentIds },
          userId: user.id,
        },
        data: {
          messageId: userMessage.id,
          conversationId,
        },
      });

      const attachments = await prisma.attachment.findMany({
        where: { id: { in: body.attachmentIds } },
      });

      const fileContext = attachments
        .filter((a) => a.extractedText)
        .map((a) => `[File: ${a.originalName}]\n${a.extractedText}`)
        .join("\n\n");

      if (fileContext) {
        userContent = userContent
          ? `${userContent}\n\n---\nAttached files:\n${fileContext}`
          : `Attached files:\n${fileContext}`;
      }
    }

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    const priorMessages = await prisma.message.findMany({
      where: {
        conversationId,
        id: { not: userMessage.id },
      },
      orderBy: { createdAt: "asc" },
    });

    const history = [
      ...priorMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: userContent },
    ];

    return streamAssistantResponse({
      conversationId,
      history,
      model,
      userMessageId: userMessage.id,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

async function streamAssistantResponse({
  conversationId,
  history,
  model,
  userMessageId,
}: {
  conversationId: string;
  history: { role: "user" | "assistant"; content: string }[];
  model: string;
  userMessageId?: string;
}) {
  const assistantMessage = await prisma.message.create({
    data: {
      conversationId,
      role: "assistant",
      content: "",
    },
  });

  const encoder = new TextEncoder();
  let fullContent = "";

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(sseEvent(data)));
      };

      send({
        type: "start",
        conversationId,
        userMessageId,
        assistantMessageId: assistantMessage.id,
      });

      try {
        const groqBody = await streamGroqChat({
          model: model as "llama-3.3-70b-versatile",
          messages: history,
        });

        for await (const chunk of parseGroqStream(groqBody)) {
          fullContent += chunk;
          send({ type: "chunk", content: chunk });
        }

        await prisma.message.update({
          where: { id: assistantMessage.id },
          data: { content: fullContent },
        });

        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        });

        send({
          type: "done",
          assistantMessageId: assistantMessage.id,
          content: fullContent,
        });
      } catch (error) {
        await prisma.message.delete({ where: { id: assistantMessage.id } }).catch(() => {});

        send({
          type: "error",
          message:
            error instanceof Error ? error.message : "Failed to generate response",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
