import { PrismaClient } from "../generated/prisma/client";
import chapter1 from "../src/data/quizzes/chap1.json";
import chapter2 from "../src/data/quizzes/chap2.json";
import chapter3 from "../src/data/quizzes/chap3.json";
import chapter6 from "../src/data/quizzes/chap6.json";

const chapters = [chapter1, chapter2, chapter3, chapter6];
import { prisma } from "../src/lib/database/prismaClient";

async function main() {
  await prisma.quizAnswer.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();

  for (const [index, chapter] of chapters.entries()) {
    const quiz = await prisma.quiz.create({
      data: {
        title: `Κεφάλαιο ${index + 1}`,
      },
    });

    for (const [questionIndex, questionData] of chapter.entries()) {
      const question = await prisma.quizQuestion.create({
        data: {
          question: questionData.question,
          order: questionIndex + 1,
          quizId: quiz.id,
        },
      });

      for (const [answerIndex, answerData] of questionData.answers.entries()) {
        const answer = await prisma.quizAnswer.create({
          data: {
            text: answerData.text,
            order: answerIndex + 1,
            quizQuestionId: question.id,
          },
        });

        if (answerData.correct) {
          await prisma.quizQuestion.update({
            where: {
              id: question.id,
            },
            data: {
              correctAnswerId: answer.id,
            },
          });
        }
      }
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
