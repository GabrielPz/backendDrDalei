import { z } from "zod";
import { MovieDTO } from "./QuestionSchemas";

export const rentedMovieSchema = z.object({
  userId: z.string().uuid(),
  movieId: z.string().uuid(),
  dueDate: z.any(),
});

export type RentedMovieDTO = z.infer<typeof rentedMovieSchema>;

export type GetRentedMovieDTO = {
  movie: MovieDTO;
} & z.infer<typeof rentedMovieSchema>;
