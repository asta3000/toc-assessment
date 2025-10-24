"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import {
  CHECKBOX,
  posterror,
  RADIO,
  STATUS_FILLING,
  STATUS_NEW,
  TEXT,
} from "@/libs/constants";

export const POST = async (req) => {
  try {
    const { answer, optionAnswer } = await req.json();
    // console.log("ROUTE: ", answer, optionAnswer);

    await prisma.$transaction(async (tx) => {
      if (answer.answerTypeId === RADIO) {
        if (answer?.descriptions?.length > 0) {
          const rows = answer.descriptions
            .filter((d) => d && d.subQuestionId)
            .map((d) => ({
              organizationId: answer.organizationId,
              yearId: answer.yearId,
              assessmentId: answer.assessmentId,
              moduleId: answer.moduleId,
              userId: answer.userId,
              questionId: answer.questionId,
              answerTypeId: answer.answerTypeId,
              subQuestionId: d.subQuestionId,
              description: d.description ?? null,
              comment: null,
            }));

          // console.log("ANSWER: ", rows);
          await tx.answer.createMany({ data: rows });
        } else {
          const data = {
            organizationId: answer.organizationId,
            yearId: answer.yearId,
            assessmentId: answer.assessmentId,
            moduleId: answer.moduleId,
            userId: answer.userId,
            questionId: answer.questionId,
            answerTypeId: answer.answerTypeId,
            comment: null,
          };

          await tx.answer.create({
            data,
          });
        }

        if (Array.isArray(optionAnswer.options)) {
          const rows = optionAnswer.options
            ?.filter((o) => o && o.optionId)
            ?.map((o) => ({
              organizationId: optionAnswer.organizationId,
              yearId: optionAnswer.yearId,
              assessmentId: optionAnswer.assessmentId,
              moduleId: optionAnswer.moduleId,
              userId: optionAnswer.userId,
              questionId: optionAnswer.questionId,
              answerTypeId: optionAnswer.answerTypeId,
              optionId: o.optionId,
              score_user: parseFloat(o.score_user),
              score_verify: parseFloat(o.score_user),
              description: o.description ?? null,
            }));
          // console.log("ANSWER_OPTION: ", rows);
          await tx.optionAnswer.createMany({ data: rows });
        }
      } else if (answer.answerTypeId === CHECKBOX) {
        if (answer?.descriptions?.length > 0) {
          const rows = answer.descriptions
            .filter((d) => d && d.subQuestionId)
            .map((d) => ({
              organizationId: answer.organizationId,
              yearId: answer.yearId,
              assessmentId: answer.assessmentId,
              moduleId: answer.moduleId,
              userId: answer.userId,
              questionId: answer.questionId,
              answerTypeId: answer.answerTypeId,
              subQuestionId: d.subQuestionId,
              description: d.description ?? null,
              comment: null,
            }));

          // console.log("ANSWER: ", rows);
          await tx.answer.createMany({ data: rows });
        } else {
          const data = {
            organizationId: answer.organizationId,
            yearId: answer.yearId,
            assessmentId: answer.assessmentId,
            moduleId: answer.moduleId,
            userId: answer.userId,
            questionId: answer.questionId,
            answerTypeId: answer.answerTypeId,
            comment: null,
          };

          await tx.answer.create({
            data,
          });
        }

        if (Array.isArray(optionAnswer.options)) {
          const rows = optionAnswer.options
            ?.filter((o) => o && o.optionId)
            ?.map((o) => ({
              organizationId: optionAnswer.organizationId,
              yearId: optionAnswer.yearId,
              assessmentId: optionAnswer.assessmentId,
              moduleId: optionAnswer.moduleId,
              userId: optionAnswer.userId,
              questionId: optionAnswer.questionId,
              answerTypeId: optionAnswer.answerTypeId,
              optionId: o.optionId,
              score_user: parseFloat(o.score_user),
              score_verify: parseFloat(o.score_user),
              description: o.description ?? null,
            }));
          // console.log("ANSWER_OPTION: ", rows);
          await tx.optionAnswer.createMany({ data: rows });
        }
      } else if (answer.answerTypeId === TEXT) {
        const data = {
          organizationId: answer.organizationId,
          yearId: answer.yearId,
          assessmentId: answer.assessmentId,
          moduleId: answer.moduleId,
          userId: answer.userId,
          questionId: answer.questionId,
          answerTypeId: answer.answerTypeId,
          description: answer.descriptions[0]?.description,
          comment: null,
        };

        // console.log("DATA_TEXT: ", data);

        await tx.answer.create({
          data,
        });
      }

      const performance = await tx.performance.findMany({
        where: {
          organizationId: answer.organizationId,
          yearId: answer.yearId,
          assessmentId: answer.assessmentId,
        },
        select: { id: true, statusId: true },
      });

      // console.log("PERFORMANCE: ", performance);

      if (performance.length === 1 && performance[0].statusId === STATUS_NEW) {
        await tx.performance.update({
          where: { id: performance[0].id },
          data: {
            statusId: STATUS_FILLING,
          },
        });
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
