/**
 * File processing pipeline — extensible for future AI ingestion.
 * Currently extracts text from supported document types.
 */
export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string,
): Promise<string | null> {
  if (mimeType === "text/plain" || mimeType === "text/markdown" || mimeType === "text/csv") {
    return buffer.toString("utf-8").slice(0, 50_000);
  }

  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value.slice(0, 50_000) || null;
  }

  if (mimeType === "application/pdf") {
    try {
      const pdfParse = await import("pdf-parse");
      const parseFn =
        "default" in pdfParse && typeof pdfParse.default === "function"
          ? pdfParse.default
          : (pdfParse as unknown as (buf: Buffer) => Promise<{ text?: string }>);
      const data = await parseFn(buffer);
      return data.text?.slice(0, 50_000) || null;
    } catch {
      return null;
    }
  }

  return null;
}

export type ProcessingJob = {
  attachmentId: string;
  status: "queued" | "processing" | "ready" | "failed";
};

/** Future: enqueue attachment for embedding / RAG / vision analysis */
export async function enqueueForAiProcessing(
  _job: ProcessingJob,
): Promise<void> {
  // Placeholder for background workers (Inngest, BullMQ, etc.)
}
