import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "./lib/prisma";
import { randomUUID } from "crypto";

async function main() {
  const categories = [
    {
      id: randomUUID(),
      name: "DIREITO ADMINISTRATIVO",
    },
    {
      id: randomUUID(),
      name: "DIREITO CONSTITUCIONAL",
    },
    {
      id: randomUUID(),
      name: "DIREITO CIVIL/PROCESSO CIVIL",
    },
    {
      id: randomUUID(),
      name: "DIREITO PENAL/PROCESSO PENAL",
    },
    {
      id: randomUUID(),
      name: "DIREITO DO TRABALHO/PROCESSO DO TRABALHO",
    },
    {
      id: randomUUID(),
      name: "DIREITO TRIBUTÁRIO",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

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
