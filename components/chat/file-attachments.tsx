"use client";

import {
  FileText,
  Image as ImageIcon,
  Paperclip,
  X,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import type { FileAttachment } from "@/types";
import { formatFileSize, getFileCategory } from "@/lib/files";
import { cn } from "@/lib/utils";

type FileAttachmentChipProps = {
  file: FileAttachment;
  onRemove?: (id: string) => void;
  compact?: boolean;
};

export function FileAttachmentChip({
  file,
  onRemove,
  compact,
}: FileAttachmentChipProps) {
  const isImage = getFileCategory(file.mimeType) === "image";

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 p-2",
        compact ? "text-xs" : "text-sm",
      )}
    >
      {isImage ? (
        <div className="relative size-10 shrink-0 overflow-hidden rounded-md">
          <Image
            src={file.url}
            alt={file.originalName}
            fill
            className="object-cover"
            sizes="40px"
            unoptimized
          />
        </div>
      ) : (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-violet-500/10 text-violet-500">
          {file.mimeType === "application/pdf" ? (
            <FileText className="size-4" />
          ) : (
            <Paperclip className="size-4" />
          )}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">
          {file.originalName}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)}
          {file.status === "pending" && " · processing"}
        </p>
      </div>
      {onRemove && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onRemove(file.id)}
          className="shrink-0 opacity-60 hover:opacity-100"
          aria-label={`Remove ${file.originalName}`}
        >
          <X className="size-3" />
        </Button>
      )}
    </div>
  );
}

type FileAttachmentListProps = {
  files: FileAttachment[];
  onRemove?: (id: string) => void;
  className?: string;
};

export function FileAttachmentList({
  files,
  onRemove,
  className,
}: FileAttachmentListProps) {
  if (files.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="list">
      {files.map((file) => (
        <div key={file.id} role="listitem">
          <FileAttachmentChip file={file} onRemove={onRemove} compact />
        </div>
      ))}
    </div>
  );
}

type MessageAttachmentsProps = {
  files: FileAttachment[];
};

export function MessageAttachments({ files }: MessageAttachmentsProps) {
  if (!files.length) return null;

  const images = files.filter((f) => getFileCategory(f.mimeType) === "image");
  const docs = files.filter((f) => getFileCategory(f.mimeType) === "document");

  return (
    <div className="mt-2 space-y-2">
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((file) => (
            <a
              key={file.id}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block size-32 overflow-hidden rounded-lg border border-border/50 transition-opacity hover:opacity-90"
            >
              <Image
                src={file.url}
                alt={file.originalName}
                fill
                className="object-cover"
                sizes="128px"
                unoptimized
              />
            </a>
          ))}
        </div>
      )}
      {docs.length > 0 && (
        <div className="space-y-1">
          {docs.map((file) => (
            <a
              key={file.id}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-sm transition-colors hover:bg-muted/50"
            >
              <FileText className="size-4 shrink-0 text-violet-500" />
              <span className="truncate">{file.originalName}</span>
              <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
