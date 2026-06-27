"use client";

import { useEffect, useRef } from "react";
import { Menu, RefreshCw, Sparkles } from "lucide-react";

import { ChatInput } from "@/components/chat/chat-input";
import { MessageBubble } from "@/components/chat/message-bubble";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatThread, FileAttachment } from "@/types";

type ChatMessagesProps = {
  thread: ChatThread | null;
  isGenerating: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  onRegenerate: () => void;
  onOpenSidebar: () => void;
  onSuggestionClick: (text: string) => void;
  attachments: FileAttachment[];
  uploading: boolean;
  uploadError: string | null;
  onUpload: (files: FileList) => void;
  onRemoveAttachment: (id: string) => void;
  accept: string;
};

export function ChatMessages({
  thread,
  isGenerating,
  inputValue,
  onInputChange,
  onSend,
  onStop,
  onRegenerate,
  onOpenSidebar,
  onSuggestionClick,
  attachments,
  uploading,
  uploadError,
  onUpload,
  onRemoveAttachment,
  accept,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages, isGenerating]);

  const lastMessage = thread?.messages.at(-1);
  const isStreaming =
    isGenerating && lastMessage?.role === "assistant" && !lastMessage.content;

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onOpenSidebar}
            className="lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="size-5" />
          </Button>
          <h1 className="truncate text-sm font-semibold text-foreground">
            {thread?.title ?? "New Chat"}
          </h1>
        </div>
        {thread && thread.messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRegenerate}
            disabled={isGenerating}
            className="gap-1.5 text-muted-foreground"
          >
            <RefreshCw className="size-3.5" />
            <span className="hidden sm:inline">Regenerate</span>
          </Button>
        )}
      </header>

      <ScrollArea className="min-h-0 flex-1">
        {!thread || thread.messages.length === 0 ? (
          <EmptyState onSuggestionClick={onSuggestionClick} />
        ) : (
          <div className="mx-auto max-w-3xl">
            {thread.messages.map((message, i) => {
              const isLast = i === thread.messages.length - 1;
              const streaming =
                isLast &&
                message.role === "assistant" &&
                isGenerating &&
                message.content.length > 0;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isStreaming={streaming || (isLast && isStreaming)}
                  showRegenerate={
                    isLast && message.role === "assistant" && !isGenerating
                  }
                  onRegenerate={onRegenerate}
                />
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      <ChatInput
        value={inputValue}
        onChange={onInputChange}
        onSend={onSend}
        onStop={onStop}
        isGenerating={isGenerating}
        attachments={attachments}
        uploading={uploading}
        uploadError={uploadError}
        onUpload={onUpload}
        onRemoveAttachment={onRemoveAttachment}
        accept={accept}
      />
    </div>
  );
}

const SUGGESTIONS = [
  "Explain React Server Components",
  "Write a Python sorting algorithm",
  "Compare SQL vs NoSQL databases",
];

function EmptyState({
  onSuggestionClick,
}: {
  onSuggestionClick: (text: string) => void;
}) {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center px-4">
      <div
        className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/25"
        aria-hidden="true"
      >
        <Sparkles className="size-7" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">
        How can I help you today?
      </h2>
      <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
        Ask anything, attach PDFs, Word docs, text files, or images.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2" role="list">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            role="listitem"
            onClick={() => onSuggestionClick(s)}
            className="rounded-full border border-border/60 bg-muted/30 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
