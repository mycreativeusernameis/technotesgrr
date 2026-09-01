import type { FastifyInstance } from "fastify";
import { getQuiz, getQuizzes } from "./controller";

export async function quizRoutes(fastify: FastifyInstance) {
  fastify.get("/", getQuizzes);
  fastify.get("/:quizId", getQuiz);
}
