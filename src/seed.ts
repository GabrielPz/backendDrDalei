import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "./lib/prisma";

async function main() {
  const adminEmail = "admin@drdalei.com";
  const adminPassword = "Admin123";

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
