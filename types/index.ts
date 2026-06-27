export type MessageRole = "user" | "assistant";

export type FileAttachment = {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  status: string;
};

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  attachments?: FileAttachment[];
};

export type ChatThread = {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
  preview: string;
};

export type StreamEvent =
  | {
      type: "start";
      conversationId: string;
      assistantMessageId: string;
      userMessageId?: string;
    }
  | { type: "chunk"; content: string }
  | { type: "done"; assistantMessageId: string; content: string }
  | { type: "error"; message: string };

export type AuthUser = {
  id: string;
  name: string | null;
  email: string;
  preferredModel: string;
  imageUrl: string | null;
};

export type DashboardStats = {
  totalChats: number;
  totalMessages: number;
  tokensUsed: number;
  tokensLimit: number;
  avgResponseTime: number;
  activeModels: number;
};
