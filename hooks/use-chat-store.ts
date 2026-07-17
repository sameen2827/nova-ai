"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { conversationToThread } from "@/lib/chat-utils";
import { titleFromMessage } from "@/lib/chat-utils";
import type { ChatMessage, ChatThread, StreamEvent } from "@/types";

export function useChatStore() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [preferredModel, setPreferredModel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const assistantIdRef = useRef<string | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/conversations");
      if (!res.ok) throw new Error("Failed to load conversations");
      const data = (await res.json()) as {
        conversations: Parameters<typeof conversationToThread>[0][];
      };
      const loadedThreads = data.conversations.map(conversationToThread);
      setThreads(loadedThreads);
      setActiveThreadId((currentId) => {
        if (
          currentId &&
          loadedThreads.some((thread) => thread.id === currentId)
        ) {
          return currentId;
        }

        const requestedId =
          typeof window === "undefined"
            ? null
            : new URLSearchParams(window.location.search).get("conversation");

        return requestedId &&
          loadedThreads.some((thread) => thread.id === requestedId)
          ? requestedId
          : null;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadConversations();
    void fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user?.preferredModel) setPreferredModel(data.user.preferredModel);
      });
  }, [loadConversations]);

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? null;

  const filteredThreads = threads.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.preview.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsGenerating(false);
  }, []);

  const parseStream = useCallback(
    async (
      body: Record<string, unknown>,
      convId: string,
      tempUserId: string,
      tempAssistantId: string,
      pendingAttachments?: ChatMessage["attachments"],
    ) => {
      const controller = new AbortController();
      abortRef.current = controller;
      setIsGenerating(true);
      assistantIdRef.current = tempAssistantId;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            (err as { error?: string }).error ?? "Failed to send message",
          );
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let buffer = "";
        let currentConvId = convId;
        let currentAssistantId = tempAssistantId;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const event = JSON.parse(line.slice(6)) as StreamEvent;

            if (event.type === "start") {
              currentConvId = event.conversationId;
              currentAssistantId = event.assistantMessageId;
              assistantIdRef.current = currentAssistantId;

              setThreads((prev) =>
                prev.map((t) => {
                  if (t.id !== convId) return t;
                  return {
                    ...t,
                    id: event.conversationId,
                    messages: t.messages.map((m) => {
                      if (m.id === tempUserId && event.userMessageId) {
                        return {
                          ...m,
                          id: event.userMessageId,
                          attachments: pendingAttachments,
                        };
                      }
                      if (m.id === tempAssistantId) {
                        return { ...m, id: event.assistantMessageId };
                      }
                      return m;
                    }),
                  };
                }),
              );
              setActiveThreadId(event.conversationId);
            }

            if (event.type === "chunk") {
              const aid = currentAssistantId;
              const cid = currentConvId;
              setThreads((prev) =>
                prev.map((t) =>
                  t.id === cid
                    ? {
                        ...t,
                        messages: t.messages.map((m) =>
                          m.id === aid
                            ? { ...m, content: m.content + event.content }
                            : m,
                        ),
                      }
                    : t,
                ),
              );
            }

            if (event.type === "error") throw new Error(event.message);
          }
        }

        await loadConversations();
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setError(e instanceof Error ? e.message : "Something went wrong");
        }
      } finally {
        abortRef.current = null;
        setIsGenerating(false);
      }
    },
    [loadConversations],
  );

  const sendMessage = useCallback(
    async (content: string, attachmentIds: string[] = [], pendingAttachments?: ChatMessage["attachments"]) => {
      if ((!content.trim() && attachmentIds.length === 0) || isGenerating) return;

      const trimmed = content.trim();
      let convId = activeThreadId ?? `temp-conv-${Date.now()}`;
      const tempUserId = `temp-user-${Date.now()}`;
      const tempAssistantId = `temp-assistant-${Date.now()}`;

      const userMessage: ChatMessage = {
        id: tempUserId,
        role: "user",
        content: trimmed || "(attached files)",
        createdAt: new Date().toISOString(),
        attachments: pendingAttachments,
      };

      if (!activeThreadId) {
        setThreads((prev) => [
          {
            id: convId,
            title: titleFromMessage(trimmed || "File upload"),
            preview: trimmed,
            updatedAt: new Date().toISOString(),
            messages: [
              userMessage,
              {
                id: tempAssistantId,
                role: "assistant",
                content: "",
                createdAt: new Date().toISOString(),
              },
            ],
          },
          ...prev,
        ]);
        setActiveThreadId(convId);
      } else {
        setThreads((prev) =>
          prev.map((t) =>
            t.id === convId
              ? {
                  ...t,
                  messages: [
                    ...t.messages,
                    userMessage,
                    {
                      id: tempAssistantId,
                      role: "assistant" as const,
                      content: "",
                      createdAt: new Date().toISOString(),
                    },
                  ],
                  preview: trimmed,
                  updatedAt: new Date().toISOString(),
                }
              : t,
          ),
        );
      }

      const isNew = convId.startsWith("temp-conv-");

      await parseStream(
        {
          conversationId: isNew ? undefined : convId,
          message: trimmed || undefined,
          attachmentIds: attachmentIds.length ? attachmentIds : undefined,
          model: preferredModel ?? undefined,
        },
        convId,
        tempUserId,
        tempAssistantId,
        pendingAttachments,
      );
    },
    [activeThreadId, isGenerating, parseStream, preferredModel],
  );

  const regenerateLast = useCallback(async () => {
    if (!activeThread || isGenerating) return;
    const tempAssistantId = `temp-assistant-${Date.now()}`;

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              messages: [
                ...t.messages.filter(
                  (m, i, arr) =>
                    !(m.role === "assistant" && i === arr.length - 1),
                ),
                {
                  id: tempAssistantId,
                  role: "assistant" as const,
                  content: "",
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : t,
      ),
    );

    await parseStream(
      {
        conversationId: activeThread.id,
        regenerate: true,
        model: preferredModel ?? undefined,
      },
      activeThread.id,
      "",
      tempAssistantId,
    );
  }, [activeThread, isGenerating, parseStream, preferredModel]);

  const newChat = useCallback(() => {
    setActiveThreadId(null);
    setSearchQuery("");
    setInputValue("");
  }, []);

  const selectThread = useCallback((id: string) => setActiveThreadId(id), []);

  const deleteThread = useCallback(
    async (id: string) => {
      if (id.startsWith("temp-")) {
        setThreads((prev) => prev.filter((t) => t.id !== id));
        if (activeThreadId === id) setActiveThreadId(null);
        return;
      }
      const res = await fetch(`/api/conversations/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      setThreads((prev) => {
        const next = prev.filter((t) => t.id !== id);
        if (activeThreadId === id) setActiveThreadId(next[0]?.id ?? null);
        return next;
      });
    },
    [activeThreadId],
  );

  return {
    threads: filteredThreads,
    activeThread,
    activeThreadId,
    isGenerating,
    loading,
    error,
    searchQuery,
    inputValue,
    setInputValue,
    setSearchQuery,
    sendMessage,
    regenerateLast,
    stopGeneration,
    newChat,
    selectThread,
    deleteThread,
    reload: loadConversations,
    clearError: () => setError(null),
  };
}
