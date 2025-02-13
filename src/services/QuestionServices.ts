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

  async getAllQuestions(
    quantity?: number,
    categoryId?: string
  ): Promise<Questions[]> {
    const whereClause = categoryId ? { categoryId } : {};

    if (!quantity) {
      const questions = await prisma.questions.findMany({
        where: whereClause,
        orderBy: {
          createdAt: "desc",
        },
      });
      return questions;
    }


    const questions = await prisma.questions.findManyRandom(quantity, {
      where: whereClause,
      select: {
        id: true,
        choices: true,
        type: true,
        correctAwser: true,
        categoryId: true,
        question: true,
        createdAt: true,
        updatedAt: true,
      },
    });


    return questions;
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
