"use client";

import { ArrowUp, Paperclip, Square } from "lucide-react";
import { useRef } from "react";

import {
  FileAttachmentList,
} from "@/components/chat/file-attachments";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/shared/error-message";
import type { FileAttachment } from "@/types";
import { cn } from "@/lib/utils";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  isGenerating: boolean;
  disabled?: boolean;
  attachments: FileAttachment[];
  uploading: boolean;
  uploadError: string | null;
  onUpload: (files: FileList) => void;
  onRemoveAttachment: (id: string) => void;
  accept: string;
};

export function ChatInput({
  value,
  onChange,
  onSend,
  onStop,
  isGenerating,
  disabled,
  attachments,
  uploading,
  uploadError,
  onUpload,
  onRemoveAttachment,
  accept,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSend =
    (value.trim().length > 0 || attachments.length > 0) &&
    !isGenerating &&
    !disabled &&
    !uploading;

  const handleSubmit = () => {
    if (!canSend) return;
    onSend();
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  return (
    <div className="border-t border-border/50 bg-background/80 p-4 backdrop-blur-xl">
      <div className="mx-auto max-w-3xl space-y-2">
        {uploadError && <ErrorMessage message={uploadError} />}

        {(attachments.length > 0 || uploading) && (
          <FileAttachmentList
            files={attachments}
            onRemove={uploading ? undefined : onRemoveAttachment}
          />
        )}

        <div
          className={cn(
            "relative flex items-end gap-2 rounded-2xl border border-border/60 bg-muted/30 p-2 shadow-sm",
            "focus-within:border-violet-500/40 focus-within:ring-2 focus-within:ring-violet-500/20",
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple
            className="sr-only"
            aria-label="Upload files"
            onChange={(e) => {
              if (e.target.files?.length) onUpload(e.target.files);
              e.target.value = "";
            }}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled || uploading || isGenerating}
            onClick={() => fileInputRef.current?.click()}
            className="size-9 shrink-0 rounded-xl"
            aria-label="Attach files"
          >
            <Paperclip className="size-4" />
          </Button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Message Nova AI…"
            rows={1}
            disabled={disabled}
            aria-label="Message input"
            className={cn(
              "max-h-[200px] min-h-[40px] flex-1 resize-none bg-transparent px-1 py-2 text-sm leading-relaxed outline-none placeholder:text-muted-foreground",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          />

          {isGenerating ? (
            <Button
              size="icon"
              variant="destructive"
              onClick={onStop}
              className="size-9 shrink-0 rounded-xl"
              aria-label="Stop generation"
            >
              <Square className="size-3.5 fill-current" />
            </Button>
          ) : (
            <Button
              size="icon"
              onClick={handleSubmit}
              disabled={!canSend}
              className="size-9 shrink-0 rounded-xl bg-linear-to-r from-violet-600 to-cyan-500 text-white hover:from-violet-500 hover:to-cyan-400 disabled:opacity-40"
              aria-label="Send message"
            >
              <ArrowUp className="size-4" />
            </Button>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          PDF, Word, text, and images up to 10 MB · Nova AI can make mistakes
        </p>
      </div>
    </div>
  );
}
