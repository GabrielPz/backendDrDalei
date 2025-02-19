import fs from 'fs';
import path from 'path';
import { transporter } from "../lib/nodeMailer";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 🔹 Definir __dirname para funcionar em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const mailService = {
  async sendEmail(clientEmail: string, token: string): Promise<{ message: string; messageId: string; error: boolean }> {
    try {

      const htmlFilePath = path.join(__dirname, '../mails/forgot-password.html');
      let htmlTemplate = fs.readFileSync(htmlFilePath, 'utf8');

      htmlTemplate = htmlTemplate
        .replace('{{TOKEN}}', token)

      const mail = await transporter.sendMail({
        from: process.env.EMAIL_ACCOUNT,
        to: clientEmail,
        subject: `Solicitação de recuperação de senha`,
        html: htmlTemplate
      });

      return {
        message: "Email Enviado",
        messageId: mail.messageId,
        error: false
      };

    } catch (err) {
      console.error("Erro ao enviar email:", err);
      return {
        message: "Erro ao enviar email",
        messageId: "",
        error: true
      };
    }
  },
  
};
