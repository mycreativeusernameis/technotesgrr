import { prisma } from "../../lib/database/prismaClient";

export async function getAllQuizzes() {
  return prisma.quiz.findMany({
    select: {
      id: true,
      title: true,
      _count: {
        select: {
          questions: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getQuizById(quizId: string) {
  return prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    select: {
      id: true,
      title: true,
      questions: {
        orderBy: {
          order: "asc",
        },
        select: {
          id: true,
          question: true,
          order: true,
          answers: {
            orderBy: {
              order: "asc",
            },
            select: {
              id: true,
              text: true,
              order: true,
            },
          },
        },
      },
    },
  });
}
