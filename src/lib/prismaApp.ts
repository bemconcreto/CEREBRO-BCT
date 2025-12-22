import { PrismaClient } from "@prisma/client";

declare global {
  // evita múltiplas instâncias em dev
  // eslint-disable-next-line no-var
  var prismaApp: PrismaClient | undefined;
}

export const prismaApp =
  global.prismaApp ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL_APP_BCT,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  global.prismaApp = prismaApp;
}