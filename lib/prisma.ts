import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// The database is remote, so opening a connection (TCP + auth) costs seconds.
// pg's default drops idle connections after 10s, which made the first page
// view after a quiet spell pay that cost again. Keep connections open (with
// TCP keep-alive so firewalls don't silently kill them) and warm one at startup.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  idleTimeoutMillis: 10 * 60 * 1000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10_000,
  connectionTimeoutMillis: 15_000,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

void prisma.$connect().catch(() => {});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
