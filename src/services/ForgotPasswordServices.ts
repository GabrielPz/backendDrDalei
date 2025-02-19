import { prisma } from "../lib/prisma";
import { forgotPassword } from "@prisma/client";
import crypto from "crypto";

export const forgotPasswordService = {
  async createResetToken(userId: string): Promise<forgotPassword> {
    // Gerar um token de 6 dígitos
    const token = (Math.floor(100000 + Math.random() * 900000)).toString();
    
    // Definir o tempo de expiração do token (por exemplo, 15 minutos)
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);

    // Salvar ou atualizar o token no banco de dados
    return prisma.forgotPassword.upsert({
      where: { userId },
      update: { token, expires },
      create: { userId, token, expires },
    });
  },

  async verifyResetToken(userId: string, token: string): Promise<boolean> {
    const record = await prisma.forgotPassword.findUnique({
      where: { userId },
    });

    if (!record || record.token !== token || record.expires < new Date()) {
      return false;
    }
    return true;
  },
 

  async deleteResetToken(userId: string): Promise<void> {
    await prisma.forgotPassword.deleteMany({ where: { userId } });
  }
};