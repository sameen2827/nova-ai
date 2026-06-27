"use client";

import { useCallback, useState } from "react";

import type { FileAttachment } from "@/types";
import { ACCEPTED_FILE_INPUT, MAX_FILES_PER_MESSAGE } from "@/lib/files";

type UploadState = {
  files: FileAttachment[];
  uploading: boolean;
  error: string | null;
};

export function useFileUpload(conversationId?: string | null) {
  const [state, setState] = useState<UploadState>({
    files: [],
    uploading: false,
    error: null,
  });

  const uploadFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      if (files.length === 0) return;

      if (state.files.length + files.length > MAX_FILES_PER_MESSAGE) {
        setState((s) => ({
          ...s,
          error: `Maximum ${MAX_FILES_PER_MESSAGE} files per message`,
        }));
        return;
      }

      setState((s) => ({ ...s, uploading: true, error: null }));

      try {
        const formData = new FormData();
        files.forEach((f) => formData.append("files", f));
        if (conversationId && !conversationId.startsWith("temp-")) {
          formData.append("conversationId", conversationId);
        }

        const res = await fetch("/api/files/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Upload failed");
        }

        setState((s) => ({
          ...s,
          files: [...s.files, ...(data.attachments as FileAttachment[])],
          uploading: false,
        }));
      } catch (e) {
        setState((s) => ({
          ...s,
          uploading: false,
          error: e instanceof Error ? e.message : "Upload failed",
        }));
      }
    },
    [conversationId, state.files.length],
  );

  const removeFile = useCallback(async (id: string) => {
    setState((s) => ({
      ...s,
      files: s.files.filter((f) => f.id !== id),
    }));
    await fetch(`/api/files/${id}`, { method: "DELETE" }).catch(() => {});
  }, []);

  const clearFiles = useCallback(() => {
    setState({ files: [], uploading: false, error: null });
  }, []);

  return {
    ...state,
    uploadFiles,
    removeFile,
    clearFiles,
    accept: ACCEPTED_FILE_INPUT,
  };
}
