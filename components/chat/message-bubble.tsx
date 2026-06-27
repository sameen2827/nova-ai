"use client";

import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";

import { MarkdownContent } from "@/components/chat/markdown-content";
import { MessageAttachments } from "@/components/chat/file-attachments";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

type MessageBubbleProps = {
  message: ChatMessage;
  isStreaming?: boolean;
  onRegenerate?: () => void;
  showRegenerate?: boolean;
};

export function MessageBubble({
  message,
  isStreaming,
  onRegenerate,
  showRegenerate,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article
      className={cn(
        "group flex gap-3 px-4 py-5 sm:px-6",
        isUser ? "bg-transparent" : "bg-muted/30",
      )}
      aria-label={`${isUser ? "Your" : "Nova AI"} message`}
    >
      <Avatar className="size-8 shrink-0">
        <AvatarFallback
          className={cn(
            "text-xs font-semibold",
            isUser
              ? "bg-violet-500/20 text-violet-600 dark:text-violet-300"
              : "bg-linear-to-br from-violet-600 to-cyan-500 text-white",
          )}
        >
          {isUser ? "You" : "AI"}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <header className="mb-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {isUser ? "You" : "Nova AI"}
          </span>
          {isStreaming && (
            <span className="text-xs text-muted-foreground" aria-live="polite">
              typing…
            </span>
          )}
        </header>

        {message.attachments && message.attachments.length > 0 && (
          <MessageAttachments files={message.attachments} />
        )}

        {isUser ? (
          message.content && message.content !== "(attached files)" ? (
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
              {message.content}
            </p>
          ) : null
        ) : message.content ? (
          <MarkdownContent content={message.content} />
        ) : (
          <TypingDots />
        )}

        {!isUser && message.content && !isStreaming && (
          <div className="mt-3 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <Button
              variant="ghost"
              size="xs"
              onClick={handleCopy}
              className="h-7 gap-1.5 text-muted-foreground"
            >
              {copied ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <Copy className="size-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
            {showRegenerate && onRegenerate && (
              <Button
                variant="ghost"
                size="xs"
                onClick={onRegenerate}
                className="h-7 gap-1.5 text-muted-foreground"
              >
                <RefreshCw className="size-3.5" />
                Regenerate
              </Button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-2" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-2 animate-bounce rounded-full bg-muted-foreground/50"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}
