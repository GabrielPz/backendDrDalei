import { FastifyReply, FastifyRequest } from "fastify";
import { rentedMovieService } from "../services/RentedMovieServices";
import { rentedMovieSchema } from "../schemas/RentedMovieSchemas";

export const rentedMovieController = {
  async addRentedMovie(request: FastifyRequest, reply: FastifyReply) {
    const rentedMovieData = rentedMovieSchema.parse(request.body);
    const rentedMovie = await rentedMovieService.addRentedMovie(
      rentedMovieData
    );
    return reply.status(201).send(rentedMovie);
  },

  async getUserRentedMovies(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as { userId: string };
    const rentedMovies = await rentedMovieService.getUserRentedMovies(userId);
    return reply.status(200).send(rentedMovies);
  },

  async getAllRentedMovies(request: FastifyRequest, reply: FastifyReply) {
    const rentedMovies = await rentedMovieService.getAllRentedMovies();
    return reply.status(200).send(rentedMovies);
  },

  async deleteRentedMovie(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await rentedMovieService.deleteRentedMovie(id);
    return reply.status(204).send();
  },
};
