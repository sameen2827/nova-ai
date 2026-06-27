import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { getDbUserForRequest } from "@/lib/auth";
import {
  badRequest,
  handleApiError,
  unauthorized,
} from "@/lib/api-errors";
import { extractTextFromFile } from "@/lib/file-processing";
import {
  ALLOWED_FILE_TYPES,
  isAllowedMimeType,
  MAX_FILE_SIZE,
  MAX_FILES_PER_MESSAGE,
} from "@/lib/files";
import { prisma } from "@/lib/prisma";
import { storeFile } from "@/lib/storage";
import { mapAttachment } from "@/lib/chat-utils";

export async function POST(request: Request) {
  try {
    const user = await getDbUserForRequest();
    if (!user) return unauthorized();

    const formData = await request.formData();
    const files = formData.getAll("files").filter((f) => f instanceof File) as File[];
    const conversationId = formData.get("conversationId")?.toString();

    if (files.length === 0) return badRequest("No files provided");
    if (files.length > MAX_FILES_PER_MESSAGE) {
      return badRequest(`Maximum ${MAX_FILES_PER_MESSAGE} files per upload`);
    }

    const attachments = [];

    for (const file of files) {
      if (!isAllowedMimeType(file.type)) {
        return badRequest(
          `File type not allowed: ${file.name}. Supported: PDF, Word, text, images.`,
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return badRequest(`File too large: ${file.name}. Max 10 MB.`);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = ALLOWED_FILE_TYPES[file.type].ext;
      const storageKey = `${user.id}/${randomUUID()}${ext}`;

      const stored = await storeFile(buffer, storageKey, file.type);
      const extractedText = await extractTextFromFile(buffer, file.type);

      const attachment = await prisma.attachment.create({
        data: {
          userId: user.id,
          conversationId: conversationId || null,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          url: stored.url,
          storageKey: stored.storageKey,
          status: extractedText ? "ready" : "pending",
          extractedText,
        },
      });

      attachments.push(mapAttachment(attachment));
    }

    return NextResponse.json({ attachments });
  } catch (error) {
    return handleApiError(error);
  }
}
