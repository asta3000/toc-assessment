"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, posterror, TEXT } from "@/libs/constants";
import { questionnaireBaseSchema } from "@/libs/schemas";

export const GET = async () => {
  try {
    const questions = await prisma.question.findMany({
      orderBy: [
        { Assessment: { name: "asc" } },
        { Module: { name: "asc" } },
        { order: "asc" },
      ],
      include: {
        Assessment: { select: { id: true, name: true } },
        Module: { select: { id: true, name: true, goal: true } },
        QuestionType: { select: { id: true, name: true } },
        AnswerType: { select: { id: true, name: true, classification: true } },
      },
    });

    return NextResponse.json(questions, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: geterror },
      { status: 500, headers: cors }
    );
  }
};

export const POST = async (req) => {
  try {
    const { data, subQuestions, options } = await req.json();
    // console.log("ROUTE: ", data, subQuestions, options);

    const parsed = questionnaireBaseSchema?.safeParse(data);
    // console.log("P: ", parsed);

    if (!parsed?.success) {
      const firstError = parsed?.error?.issues[0];
      return NextResponse.json(
        { message: firstError?.message },
        { status: 302, headers: cors }
      );
    }

    await prisma.$transaction(async (tx) => {
      const question = await tx.question.create({
        data: {
          name: data.name,
          name_en: data.name_en,
          status: data.status,
          QuestionType: {
            connect: { id: data.questionTypeId },
          },
          AnswerType: {
            connect: { id: data.answerTypeId },
          },
          Assessment: {
            connect: { id: data.assessmentId },
          },
          Module: {
            connect: { id: data.moduleId },
          },
          condition: parseFloat(data.condition) ?? 0,
        },
      });

      if (question && question.answerTypeId !== TEXT) {
        for (const [, subQuestion] of subQuestions.entries()) {
          let subQuestionData = {
            ...subQuestion,
            questionId: question.id,
          };

          // console.log("SQ: ", subQuestionData);

          await tx.subQuestion.create({
            data: subQuestionData,
          });
        }

        if (options && options.length > 0) {
          for (const [, option] of options.entries()) {
            if (
              option.score === undefined ||
              option.score === null ||
              option.score === ""
            ) {
              throw new Error("Хариултын оноо оруулна уу.");
            }

            let optionData = {
              ...option,
              score: parseFloat(option.score),
              questionId: question.id,
              assessmentId: data.assessmentId,
            };

            // console.log("O: ", optionData);

            await tx.option.create({
              data: optionData,
            });
          }
        } else {
          throw new Error("Хариултын сонголт оруулна уу.");
        }
      }
    });

    return NextResponse.json(true, { status: 201, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: posterror },
      { status: 500, headers: cors }
    );
  }
};
