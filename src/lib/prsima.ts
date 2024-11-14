import { PrismaClient } from "@prisma/client";

// Now, TypeScript knows about 'global.prisma' because of the custom type definition.
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
