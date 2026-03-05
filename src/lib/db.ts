import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// In Next.js dev mode, HMR re-evaluates modules on every hot reload, which
// would create a new PrismaClient (and pg connection pool) each time. After
// enough cycles the database connection limit is exhausted and new connection
// attempts hang until they time out (~30 seconds by default). Caching the
// client on the global object ensures only one instance exists per process.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

if (!globalForPrisma.prisma) {
  const adapter = new PrismaPg({ connectionString });
  globalForPrisma.prisma = new PrismaClient({ adapter });
}

const prisma = globalForPrisma.prisma;

export { prisma };
