import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { userController } from "../controllers/UserControllers";
import { z } from "zod";
import { userSchema } from "../schemas/UserSchemas";
import { authController } from "../controllers/AuthControllers";
import { forgotPasswordController } from "../controllers/ForgotPasswordControllers";
import { requestTokenSchema, resetPasswordSchema } from "../schemas/ForgotPasswordSchema";
const { autenticarToken, checkRole } = authController;

export async function forgotPasswordRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/forgot-password",
    {
      schema: {
        summary: "Request Token",
        tags: ["Forgot Password"],
        body: requestTokenSchema,
        response: {
          200: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    forgotPasswordController.requestResetToken
  );

  app.withTypeProvider<ZodTypeProvider>().post(
    "/reset-password",

    {
      schema: {
        summary: "Reset Password",
        tags: ["Forgot Password"],
        body: resetPasswordSchema,
        response: {
          200: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    forgotPasswordController.resetPassword
  );

}
