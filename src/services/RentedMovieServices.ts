import { prisma } from "../lib/prisma";
import { RentedMovieDTO } from "../schemas/RentedMovieSchemas";

export const rentedMovieService = {
  async addRentedMovie(data: RentedMovieDTO) {
    const date = new Date(data.dueDate);
    return prisma.rentedMovie.create({
      data: {
        ...data,
        dueDate: date,
      },
    });
  },

  async getUserRentedMovies(userId: string) {
    return prisma.rentedMovie.findMany({
      where: { userId },
      select: {
        dueDate: true,
        id: true,
        movie: true,
        movieId: true,
        userId: true,
        rentedAt: true,
      },
      orderBy: {
        rentedAt: "desc",
      },
    });
  },

  async getAllRentedMovies() {
    return prisma.rentedMovie.findMany({
      select: {
        dueDate: true,
        id: true,
        movie: true,
        movieId: true,
        userId: true,
        rentedAt: true,
      },
      orderBy: {
        rentedAt: "desc",
      },
    });
  },

  async deleteRentedMovie(id: string) {
    return prisma.rentedMovie.delete({
      where: { id },
    });
  },
};
