import { FastifyReply, FastifyRequest } from "fastify";
import { questionService } from "../services/QuestionServices";
import { questionSchema } from "../schemas/QuestionSchemas";

export const questionController = {
  async createQuestion(request: FastifyRequest, reply: FastifyReply) {
    const movieData = questionSchema.parse(request.body);
    try {
      const movie = await questionService.createQuestion(movieData);
      return reply.status(201).send(movie);
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  },

  async getQuestionById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const movie = await questionService.getQuestionById(id);
    if (!movie) {
      return reply.status(404).send({ message: "Filme não encontrado" });
    }
    return reply.status(200).send(movie);
  },

  async getAllQuestions(request: FastifyRequest, reply: FastifyReply) {
    const movies = await questionService.getAllQuestions();
    return reply.status(200).send(movies);
  },

  async updateQuestion(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const movieData = questionSchema.partial().parse(request.body);
    try {
      const movie = await questionService.updateQuestion(id, movieData);
      return reply.status(200).send(movie);
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  },

  async deleteQuestion(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    try {
      await questionService.deleteQuestion(id);
      return reply.status(204).send();
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  },
};
