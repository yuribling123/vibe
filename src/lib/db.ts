import { PrismaClient } from "@/generated/prisma";


 // global because of hot reloading in development

 const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
 // unknown because globalThis has no prisma property

 const prisma = globalForPrisma.prisma || new PrismaClient();

 if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
 // prodution will not be hot reloaded because it is a single instance

 export default prisma;
 // export because it is used in other files