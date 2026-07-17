import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getConnectionString(): string {
  const raw = process.env.DATABASE_URL?.trim();

  if (!raw) {
    throw new Error(
      "DATABASE_URL is not configured. Add it in Vercel → Settings → Environment Variables.",
    );
  }

  // Strip accidental wrapping quotes from copy-paste in Vercel dashboard
  const connectionString = raw.replace(/^["']|["']$/g, "");

  try {
    new URL(connectionString);
  } catch {
    throw new Error(
      "DATABASE_URL is invalid. Use your full Neon PostgreSQL connection string (postgresql://...).",
    );
  }

  return connectionString;
}

function createPrismaClient(): PrismaClient {
  const connectionString = getConnectionString();
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
