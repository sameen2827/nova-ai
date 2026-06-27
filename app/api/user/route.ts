import { NextResponse } from "next/server";

import { getDbUserForRequest, requireDbUser } from "@/lib/auth";
import {
  badRequest,
  handleApiError,
  unauthorized,
} from "@/lib/api-errors";
import { isValidGroqModel } from "@/lib/groq-models";
import { prisma } from "@/lib/prisma";
import { clearSessionCookie } from "@/lib/session";
import { sanitizeUser } from "@/lib/user";

export async function GET() {
  try {
    const user = await getDbUserForRequest();
    if (!user) return unauthorized();
    return NextResponse.json({ user: sanitizeUser(user) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireDbUser();

    const body = (await request.json()) as {
      name?: string;
      preferredModel?: string;
    };

    const data: { name?: string; preferredModel?: string } = {};

    if (body.name !== undefined) {
      const name = body.name.trim();
      if (!name) return badRequest("Name cannot be empty");
      data.name = name;
    }

    if (body.preferredModel !== undefined) {
      if (!isValidGroqModel(body.preferredModel)) {
        return badRequest("Invalid model selection");
      }
      data.preferredModel = body.preferredModel;
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
    });

    return NextResponse.json({ user: sanitizeUser(updated) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE() {
  try {
    const user = await requireDbUser();

    await prisma.user.delete({ where: { id: user.id } });
    await clearSessionCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
