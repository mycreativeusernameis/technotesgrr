import { fastify, type FastifyReply, type FastifyRequest } from "fastify";
import { getAllQuizzes, getQuizById } from "./service";

export async function getQuizzes(
  request: FastifyRequest<{
    Params: { quizId: string };
  }>,
  reply: FastifyReply,
) {
  const quizzes = await getAllQuizzes();

  return reply.send(
    quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      questionCount: quiz._count.questions,
    })),
  );
}

export async function getQuiz(
  request: FastifyRequest<{
    Params: { quizId: string };
  }>,
  reply: FastifyReply,
) {
  const quiz = await getQuizById(request.params.quizId);

  if (!quiz) {
    return reply.code(404).send({
      message: "Quiz not found",
    });
  }

  return reply.send(quiz);
}
