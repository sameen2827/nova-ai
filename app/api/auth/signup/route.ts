import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { badRequest, handleApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!name) return badRequest("Name is required");
    if (!email || !email.includes("@")) return badRequest("Valid email is required");
    if (!password || password.length < 8) {
      return badRequest("Password must be at least 8 characters");
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return badRequest("An account with this email already exists");

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });

    await setSessionCookie({ userId: user.id, email: user.email });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        preferredModel: user.preferredModel,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
