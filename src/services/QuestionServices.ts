import { prisma } from "../lib/prisma";
import { Category, Questions } from "@prisma/client";
import { QuestionDTO } from "../schemas/QuestionSchemas";

export const questionService = {
  async createQuestion(
    data: QuestionDTO,
    category: Category
  ): Promise<Questions> {
    return prisma.questions.create({
      data: {
        ...data,
        categoryId: category.id,
      },
    });
  },

  async getQuestionById(id: string): Promise<Questions | null> {
    return prisma.questions.findUnique({
      where: { id },
    });
  },

  async getAllQuestions(): Promise<Questions[]> {
    return prisma.questions.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async updateQuestion(
    id: string,
    data: Partial<QuestionDTO>
  ): Promise<Questions> {
    return prisma.questions.update({
      where: { id },
      data,
    });
  },

  async deleteQuestion(id: string): Promise<Questions> {
    return prisma.questions.delete({
      where: { id },
    });
  },
};
