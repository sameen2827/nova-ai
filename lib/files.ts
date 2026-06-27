export const ALLOWED_FILE_TYPES = {
  "application/pdf": { ext: ".pdf", label: "PDF", category: "document" as const },
  "application/msword": { ext: ".doc", label: "Word", category: "document" as const },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    ext: ".docx",
    label: "Word",
    category: "document" as const,
  },
  "text/plain": { ext: ".txt", label: "Text", category: "document" as const },
  "text/markdown": { ext: ".md", label: "Markdown", category: "document" as const },
  "text/csv": { ext: ".csv", label: "CSV", category: "document" as const },
  "image/jpeg": { ext: ".jpg", label: "Image", category: "image" as const },
  "image/png": { ext: ".png", label: "Image", category: "image" as const },
  "image/gif": { ext: ".gif", label: "Image", category: "image" as const },
  "image/webp": { ext: ".webp", label: "Image", category: "image" as const },
} as const;

export type AllowedMimeType = keyof typeof ALLOWED_FILE_TYPES;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_FILES_PER_MESSAGE = 5;

export const ACCEPTED_FILE_INPUT = Object.keys(ALLOWED_FILE_TYPES).join(",");

export function isAllowedMimeType(mime: string): mime is AllowedMimeType {
  return mime in ALLOWED_FILE_TYPES;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileCategory(mimeType: string): "image" | "document" {
  if (mimeType.startsWith("image/")) return "image";
  return "document";
}
