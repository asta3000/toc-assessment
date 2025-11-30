"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { puterror, TEXT, RADIO } from "@/libs/constants";
import { questionnaireBaseSchema } from "@/libs/schemas";

export const PUT = async (req, { params }) => {
  const { slug } = await params;
  try {
    const { data, subQuestions, options } = await req.json();
    // console.log("ROUTE: ", data, subQuestions, options);

    const parsed = questionnaireBaseSchema?.safeParse(data);

    if (!parsed?.success) {
      const firstError = parsed?.error?.issues[0];
      return NextResponse.json(
        { message: firstError?.message },
        { status: 302, headers: cors }
      );
    }

    await prisma.$transaction(async (tx) => {
      // Үндсэн асуултын утгыг өөрчлөх
      const question = await tx.question.update({
        where: { id: slug },
        data: {
          name: data.name,
          name_en: data.name_en,
          status: data.status,
          questionTypeId: data.questionTypeId,
          answerTypeId: data.answerTypeId,
          assessmentId: data.assessmentId,
          moduleId: data.moduleId,
          condition:
            data.answerTypeId === RADIO ? parseFloat(data.condition) : null,
        },
      });

      // console.log("Q: ", question);
      // Өөрчлөлт амжилтгүй нөхцөл
      if (!question) {
        throw new Error("Question not found or update failed.");
      }

      // Хариултын хэлбэр нь TEXT бол бүх хувилбар, дэд асуултыг устгана.
      if (question.answerTypeId === TEXT) {
        await tx.option.deleteMany({
          where: { questionId: slug ?? question.id },
        });

        await tx.subQuestion.deleteMany({
          where: { questionId: slug ?? question.id },
        });

        return;
      }

      // Эхлэл: Шаардлагагүй дэд асуулт, хариултын хувилбарыг устгах
      // Өгөгдлийн санд байгаа дэд асуултуудын Id-г авах
      const existingSubQuestionIds = (
        await tx.subQuestion.findMany({
          where: { questionId: slug ?? question.id },
          select: { id: true },
        })
      ).map((s) => s.id);

      // Өгөгдлийн санд байгаа хариултын хувилбарын Id-г авах
      const existingOptionIds = (
        await tx.option.findMany({
          where: { questionId: slug ?? question.id },
          select: { id: true },
        })
      ).map((o) => o.id);

      // Request Body-д байгаа Id-г авах
      // Boolean хийдэг нь шинэ, нэмэлт элементийг хасахад ашиглана. Заавал байх ёстой.
      const incomingSubIds = subQuestions.map((s) => s.id).filter(Boolean);
      const incomingOptionIds = options.map((o) => o.id).filter(Boolean);

      // Зөрүүтэй буюу устгах шаардлагатай Id-г ялгах
      const toDeleteSubQuestions = existingSubQuestionIds.filter(
        (id) => !incomingSubIds.includes(id)
      );
      const toDeleteOptions = existingOptionIds.filter(
        (id) => !incomingOptionIds.includes(id)
      );

      // Устгах шаардлагатай Id байвал устгах
      if (toDeleteSubQuestions.length)
        await tx.subQuestion.deleteMany({
          where: { id: { in: toDeleteSubQuestions } },
        });
      if (toDeleteOptions.length)
        await tx.option.deleteMany({ where: { id: { in: toDeleteOptions } } });
      // Төгсгөл: Шаардлагагүй дэд асуулт, хариултын хувилбарыг устгах

      // Нэмэлт асуултуудын утгыг өөрчлөх
      await Promise.all(
        subQuestions.map(async (subQuestion) => {
          const { id, name, name_en, status, questionId } = subQuestion;
          // console.log("SQ: ", subQuestion);

          if (id) {
            await tx.subQuestion.upsert({
              where: { id },
              update: {
                name,
                name_en,
                status,
                questionId: slug ?? questionId ?? question.id,
              },
              create: {
                id,
                name,
                name_en,
                status,
                questionId: slug ?? questionId ?? question.id,
              },
            });
          } else {
            await tx.subQuestion.create({
              data: {
                name,
                name_en,
                status,
                questionId: slug ?? questionId ?? question.id,
              },
            });
          }
        })
      );

      // Хариултын сонголтуудыг өөрчлөх
      await Promise.all(
        options.map(async (option) => {
          // console.log("O: ", option);
          const {
            id,
            name,
            name_en,
            status,
            score,
            assessmentId,
            questionId,
            question,
            question_en,
            answerType,
          } = option;
          if (score === undefined || score === null || score === "") {
            throw new Error("Хариултын оноо оруулна уу.");
          }

          if (id) {
            await tx.option.upsert({
              where: { id },
              update: {
                name,
                name_en,
                score: parseFloat(score),
                status,
                question,
                question_en,
                answerType,
                Assessment: {
                  connect: {
                    id:
                      data.assessmentId ??
                      assessmentId ??
                      question.assessmentId,
                  },
                },
                Question: {
                  connect: { id: slug ?? questionId ?? question.id },
                },
              },
              create: {
                id,
                name,
                name_en,
                score: parseFloat(score),
                status,
                question,
                question_en,
                answerType,
                Assessment: {
                  connect: {
                    id:
                      data.assessmentId ??
                      assessmentId ??
                      question.assessmentId,
                  },
                },
                Question: {
                  connect: { id: slug ?? questionId ?? question.id },
                },
              },
            });
          } else {
            await tx.option.create({
              data: {
                name,
                name_en,
                score,
                status,
                question,
                question_en,
                answerType,
                score: parseFloat(score),
                Assessment: {
                  connect: {
                    id:
                      data.assessmentId ??
                      assessmentId ??
                      question.assessmentId,
                  },
                },
                Question: {
                  connect: { id: slug ?? questionId ?? question.id },
                },
              },
            });
          }
        })
      );
    });

    return NextResponse.json(true, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: puterror },
      { status: 500, headers: cors }
    );
  }
};
