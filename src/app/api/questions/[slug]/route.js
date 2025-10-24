"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { puterror, TEXT } from "@/libs/constants";

export const PUT = async (req, { params }) => {
  const { slug } = await params;
  try {
    const { data, subQuestions, options } = await req.json();
    // console.log("ROUTE: ", data, subQuestions, options);

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
          condition: parseFloat(data.condition),
        },
      });

      if (question) {
        if (question.answerTypeId === TEXT) {
          await tx.option.deleteMany({
            where: { questionId: question.id },
          });

          await tx.subQuestion.deleteMany({
            where: { questionId: question.id },
          });

          return NextResponse.json(true, { status: 200, headers: cors });
        }
      } else {
        return NextResponse.json(
          { message: puterror },
          { status: 500, headers: cors }
        );
      }

      // Нэмэлт асуултуудын утгыг өөрчлөх
      for (const [, subQuestion] of subQuestions.entries()) {
        const { id, name, name_en, status, questionId } = subQuestion;

        if (id) {
          await tx.subQuestion.upsert({
            where: { id },
            update: { name, name_en, status, questionId },
            create: { id, name, name_en, status, questionId },
          });
        } else {
          await tx.subQuestion.create({
            data: { name, name_en, status, questionId: question.id },
          });
        }
      }

      // Хариултын сонголтуудыг өөрчлөх
      for (const [, option] of options.entries()) {
        const { id, name, name_en, status, score, assessmentId, questionId } =
          option;
        if (score === undefined || score === null || score === "") {
          throw new Error("Хариултын оноо оруулна уу.");
        }

        if (id) {
          await tx.option.upsert({
            where: { id },
            update: {
              name,
              name_en,
              status,
              score: parseFloat(score),
              assessmentId,
              questionId,
            },
            create: {
              id,
              name,
              name_en,
              status,
              score: parseFloat(score),
              assessmentId: question.assessmentId,
              questionId: question.id,
            },
          });
        } else {
          await tx.option.create({
            data: {
              name,
              name_en,
              status,
              score: parseFloat(score),
              assessmentId: question.assessmentId,
              questionId: question.id,
            },
          });
        }
      }
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
