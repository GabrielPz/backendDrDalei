import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  // Caminhos para os arquivos JSON de backup
  const categoriesPath = path.join(__dirname, "categories.json");
  const penalPath = path.join(__dirname, "PENAL.json");
  const civilPath = path.join(__dirname, "CIVIL.json");
  const constPath = path.join(__dirname, "CONSTITUCIONAL.json");

  // Leitura dos arquivos JSON
  const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, "utf-8"));
  const penalData = JSON.parse(fs.readFileSync(penalPath, "utf-8"));
  const civildata = JSON.parse(fs.readFileSync(civilPath, "utf-8"));
  const constdata = JSON.parse(fs.readFileSync(constPath, "utf-8"));

  // Inserção das categorias
  for (const category of categoriesData) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }

  // Inserção das questões
  for (const question of penalData) {
    await prisma.questions.upsert({
      where: { id: question.id },
      update: {},
      create: {
        correctAwser: question.correctAwser,
        question: question.question,
        categoryId: question.categoryId,
        choices: question.choices,
        type: question.type,
      },
    });
  }
  for (const question of civildata) {
    await prisma.questions.upsert({
      where: { id: question.id },
      update: {},
      create: {
        correctAwser: question.correctAwser,
        question: question.question,
        categoryId: question.categoryId,
        choices: question.choices,
        type: question.type,
      },
    });
  }
  for (const question of constdata) {
    await prisma.questions.upsert({
      where: { id: question.id },
      update: {},
      create: {
        correctAwser: question.correctAwser,
        question: question.question,
        categoryId: question.categoryId,
        choices: question.choices,
        type: question.type,
      },
    });
  }

  // Criação do usuário admin
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
