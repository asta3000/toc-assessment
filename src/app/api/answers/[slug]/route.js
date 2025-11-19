"use server";

import { NextResponse } from "next/server";
import lodash from "lodash";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { CHECKBOX, puterror, RADIO, TEXT } from "@/libs/constants";

export const PUT = async (req) => {
  try {
    const { answer, optionAnswer } = await req.json();
    // console.log("PUT: ", answer, optionAnswer);

    await prisma.$transaction(async (tx) => {
      if (answer.answerTypeId === RADIO) {
        const descriptions = answer?.descriptions?.filter(
          (d) => d && d.subQuestionId && !lodash.isEmpty(d.description)
        );

        const options = optionAnswer?.options?.filter(
          (a) => a && a.id && a.optionId
        );

        for (const d of descriptions) {
          if (d.id) {
            await tx.answer.update({
              where: { id: d.id },
              data: {
                description: d.description ?? null,
                subQuestionId: d.subQuestionId,
                isVerified: false,
                comment: null,
              },
            });
          } else {
            await tx.answer.create({
              data: {
                organizationId: answer.organizationId,
                yearId: answer.yearId,
                assessmentId: answer.assessmentId,
                moduleId: answer.moduleId,
                userId: answer.userId,
                questionId: answer.questionId,
                answerTypeId: answer.answerTypeId,
                description: d.description ?? null,
                subQuestionId: d.subQuestionId,
                isVerified: false,
                comment: null,
              },
            });
          }
        }

        for (const a of options) {
          await tx.optionAnswer.update({
            where: { id: a.id },
            data: {
              description: a.description,
              optionId: a.optionId,
              score_user: a.score_user,
              score_verify: a.score_user,
            },
          });
        }
      } else if (answer.answerTypeId === CHECKBOX) {
        const descriptions = answer?.descriptions?.filter(
          (a) => a && a.subQuestionId && !lodash.isEmpty(a.description)
        );

        for (const a of descriptions) {
          if (a.id) {
            await tx.answer.update({
              where: { id: a.id },
              data: {
                description: a.description,
                subQuestionId: a.subQuestionId,
                isVerified: false,
                comment: null,
              },
            });
          } else {
            await tx.answer.create({
              data: {
                organizationId: answer.organizationId,
                yearId: answer.yearId,
                assessmentId: answer.assessmentId,
                moduleId: answer.moduleId,
                userId: answer.userId,
                questionId: answer.questionId,
                answerTypeId: answer.answerTypeId,
                description: a.description,
                subQuestionId: a.subQuestionId,
                isVerified: false,
                comment: null,
              },
            });
          }
        }

        // Баазад байгаа бүх хариултыг устгана. Учир нь энэ optionAnswer дээр uncheck хийсэн мэдээлэл ирэхгүй байгаа. Тиймээс давхардал үүсэхээс сэргийлж устгана.
        await tx.optionAnswer.deleteMany({
          where: {
            organizationId: optionAnswer.organizationId,
            yearId: optionAnswer.yearId,
            assessmentId: optionAnswer.assessmentId,
            moduleId: optionAnswer.moduleId,
            questionId: optionAnswer.questionId,
            answerTypeId: optionAnswer.answerTypeId,
          },
        });

        // Бааз дээрх хариултуудыг устгасны дараа options-оор ирсэн мэдээллийг бааз руу дахиж бичнэ.
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
        const description = answer?.descriptions?.find((a) => a && a.id);

        await tx.answer.update({
          where: { id: description.id },
          data: {
            description: description.description,
            isVerified: false,
            comment: null,
          },
        });
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
