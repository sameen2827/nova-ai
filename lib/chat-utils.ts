import type { FileAttachment } from "@/types";
import { truncateText } from "@/lib/format";

export function titleFromMessage(content: string) {
  return truncateText(content, 48) || "New Chat";
}

export function conversationToThread(conversation: {
  id: string;
  title: string;
  updatedAt: Date | string;
  messages: {
    id: string;
    role: string;
    content: string;
    createdAt: Date | string;
    attachments?: {
      id: string;
      originalName: string;
      mimeType: string;
      size: number;
      url: string;
      status: string;
    }[];
  }[];
}) {
  const messages = conversation.messages.map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant",
    content: m.content,
    createdAt:
      typeof m.createdAt === "string"
        ? m.createdAt
        : m.createdAt.toISOString(),
    attachments: m.attachments?.map(mapAttachment),
  }));

  const lastMessage = messages.at(-1);
  const preview =
    lastMessage?.content ||
    lastMessage?.attachments?.[0]?.originalName ||
    "";

  return {
    id: conversation.id,
    title: conversation.title,
    messages,
    updatedAt:
      typeof conversation.updatedAt === "string"
        ? conversation.updatedAt
        : conversation.updatedAt.toISOString(),
    preview: truncateText(preview, 80),
  };
}

export function mapAttachment(a: {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  status: string;
}): FileAttachment {
  return {
    id: a.id,
    originalName: a.originalName,
    mimeType: a.mimeType,
    size: a.size,
    url: a.url,
    status: a.status,
  };
}
