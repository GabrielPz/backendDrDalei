import { prisma } from "../lib/prisma";
import { Payments, User } from "@prisma/client";
import { UserDTO } from "../schemas/UserSchemas";
import bcrypt from "bcrypt";
import { Payment as MercadoPagoPayment, MercadoPagoConfig } from "mercadopago";
import { PaymentDTO } from "../schemas/PaymentSchema";
import { userService } from "./UserServices";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_API_KEY || "",
});
const payments = new MercadoPagoPayment(client);

export const paymentService = {
  async createPayment(data: PaymentDTO): Promise<any> {
    const user = await userService.getUserByEmail(data.payer?.email || "");
    if (!user) {
      throw new Error(
        `Usuário não encontrado com o email: ${data.payer?.email}`
      );
    }
    const external_reference = user.id;
    const paymentInfo = {
      body: {
        ...data,
        external_reference: external_reference,
        notification_url: process.env.WEBHOOK_NOTIFICATION_URL || "",
      },
      requestOptions: { idempotencyKey: external_reference },
    };
    try {
      const response = await payments.create(paymentInfo);
      return response;
    } catch (error: any) {
      throw new Error("Erro ao criar pagamento:" + error.message);
    }
  },
  async getAllPayments(): Promise<Payments[]> {
    return prisma.payments.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};
