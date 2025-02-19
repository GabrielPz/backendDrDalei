import { FastifyReply, FastifyRequest } from "fastify";
import { userService } from "../services/UserServices";
import { userSchema } from "../schemas/UserSchemas";
import { requestTokenSchema, resetPasswordSchema } from "../schemas/ForgotPasswordSchema";
import { forgotPasswordService } from "../services/ForgotPasswordServices";
import { mailService } from "../services/NodeMailer";

export const forgotPasswordController = {
  async requestResetToken(request: FastifyRequest, reply: FastifyReply) {
    const { email } = requestTokenSchema.parse(request.body);
   
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return reply.status(404).send({ message: "Usuário não encontrado" });
    }

    const requestToken = await forgotPasswordService.createResetToken(user.id);
    if(!requestToken){
      return reply.status(404).send({ message: "Erro ao criar token" });
    }

    const sendToken = await mailService.sendEmail(email, requestToken.token);
    if(sendToken.error){
      return reply.status(404).send({ message: "Erro ao enviar token" });
    }

    return reply.status(200).send({ message: "Token enviado com sucesso!"});
  },


  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    const { email, token, newPassword, confirmPassword } = resetPasswordSchema.parse(request.body);

    if (newPassword !== confirmPassword) {
      return reply.status(400).send({ message: "As senhas não são iguais!" });
    }

    const user = await userService.getUserByEmail(email);
    if (!user) {
      return reply.status(404).send({ message: "Usuário não encontrado" });
    }


    const isValid = await forgotPasswordService.verifyResetToken(user.id, token);
    if (!isValid) {
      return reply.status(400).send({ message: "Token inválido ou expirado" });
    }

    const updatePassword = await userService.updatePassword(user.id, newPassword);
    if (!updatePassword) {
      return reply.status(404).send({ message: "Erro ao atualizar senha" });
    }
    return reply.status(200).send({ message: "Senha atualizada  com sucesso" });
  }
};