import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { put } from "@vercel/blob";

const UPLOAD_DIR = path.join(process.cwd(), "storage", "uploads");

export type StoredFile = {
  url: string;
  storageKey: string;
};

export async function storeFile(
  buffer: Buffer,
  storageKey: string,
  mimeType: string,
): Promise<StoredFile> {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (blobToken) {
    const blob = await put(storageKey, buffer, {
      access: "public",
      contentType: mimeType,
      token: blobToken,
    });
    return { url: blob.url, storageKey: blob.pathname };
  }

  const filePath = path.join(UPLOAD_DIR, storageKey);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, buffer);

  return {
    url: `/api/files/serve/${encodeURIComponent(storageKey)}`,
    storageKey,
  };
}
