import { NextResponse } from "next/server";

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(message = "Internal server error") {
  return NextResponse.json({ error: message }, { status: 500 });
}

export function handleApiError(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return unauthorized();
  }
  console.error(error);
  const message =
    error instanceof Error ? error.message : "Internal server error";
  // Don't leak raw Prisma/stack traces to clients in production
  const safeMessage =
    process.env.NODE_ENV === "production" &&
    (message.includes("prisma") ||
      message.includes("DATABASE_URL") ||
      message.includes("Invalid URL"))
      ? "Server configuration error. Please check database environment variables."
      : message;
  return serverError(safeMessage);
}
