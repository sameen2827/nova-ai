import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function getDbUserForRequest() {
  const session = await getSession();
  if (!session) return null;

  return prisma.user.findUnique({ where: { id: session.userId } });
}

export async function requireDbUser() {
  const user = await getDbUserForRequest();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
