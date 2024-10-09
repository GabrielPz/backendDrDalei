import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { rentedMovieController } from "../controllers/RentedMovieControllers";
import { rentedMovieSchema } from "../schemas/RentedMovieSchemas";
import { authController } from "../controllers/AuthControllers";
import { z } from "zod";
import { movieSchema } from "../schemas/QuestionSchemas";

export async function rentedMovieRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/rented-movies",
    {
      preHandler: [authController.autenticarToken],
      schema: {
        summary: "Add Rented Movie",
        tags: ["RentedMovies"],
        body: rentedMovieSchema,
        response: {
          201: rentedMovieSchema.extend({ id: z.string().uuid() }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    rentedMovieController.addRentedMovie
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    "/rented-movies/:userId",
    {
      preHandler: [authController.autenticarToken],
      schema: {
        summary: "Get User's Rented Movies",
        tags: ["RentedMovies"],
        params: z.object({
          userId: z.string().uuid(),
        }),
        response: {
          200: z.array(
            rentedMovieSchema.extend({
              id: z.string().uuid(),
              movie: movieSchema,
            })
          ),
          400: z.object({ message: z.string() }),
        },
      },
    },
    rentedMovieController.getUserRentedMovies
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    "/rented-movies",
    {
      preHandler: [
        authController.autenticarToken,
        authController.checkRole(["ADMIN"]),
      ],
      schema: {
        summary: "Get All Rented Movies",
        tags: ["RentedMovies"],
        response: {
          200: z.array(
            rentedMovieSchema.extend({
              id: z.string().uuid(),
              movie: movieSchema,
            })
          ),
          400: z.object({ message: z.string() }),
        },
      },
    },
    rentedMovieController.getAllRentedMovies
  );

  app.withTypeProvider<ZodTypeProvider>().delete(
    "/rented-movies/:id",
    {
      preHandler: [
        authController.autenticarToken,
        authController.checkRole(["ADMIN"]),
      ],
      schema: {
        summary: "Delete Rented Movie by ID",
        tags: ["RentedMovies"],
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          204: z.null(),
          400: z.object({ message: z.string() }),
        },
      },
    },
    rentedMovieController.deleteRentedMovie
  );
}
