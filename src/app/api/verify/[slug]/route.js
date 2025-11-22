"use server";

import { NextResponse } from "next/server";
import lodash from "lodash";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { CHECKBOX, posterror, STATUS_VERIFYING } from "@/libs/constants";

export const PUT = async (req) => {
  try {
    const { answer, optionAnswer } = await req.json();
    // console.log("ROUTE: ", answer, optionAnswer);

    await prisma.$transaction(async (tx) => {
      // Коммент байвал түүнийг хадгална.
      if (!lodash.isEmpty(answer?.comment)) {
        const data = {
          comment: answer.comment ?? null,
          verifierId: answer.verifierId,
          isVerified: true,
        };
        await tx.answer.update({
          where: { id: answer.id },
          data,
        });
      }

      // Баталгаажуулагчийн оноог бүгдийг 0 болгосны дараа шинээр ирсэн оноог хадгална.
      // Зорилго нь бөглөх үед үүссэн хариулт өөрчлөгдөж болох тул баталгаажуулах үед баталгаажуулагчийн оноог шинээр тавих зорилготой.
      await tx.optionAnswer.updateMany({
        where: {
          assessmentId: optionAnswer?.assessmentId,
          yearId: optionAnswer.yearId,
          organizationId: optionAnswer.organizationId,
          questionId: optionAnswer.questionId,
        },
        data: {
          score_verify: 0,
        },
      });

      // Хариултын хувилбарт баталгаажуулагчийн оноотой хэсгийг авна.
      // FrontEnd-ээс бөглөх үеийн оноо болон өөрчлөлтийн оноо зэрэг ирнэ.
      const options = optionAnswer.options?.filter((a) => a.score_verify);

      for (const a of options) {
        // console.log("O: ", a);
        if (a.id) {
          const data = {
            verifierId: answer.verifierId,
            score_verify: Number(a.score_verify) ?? 0,
          };

          await tx.optionAnswer.update({
            where: { id: a.id },
            data,
          });
        } else {
          const data = {
            organizationId: optionAnswer.organizationId,
            yearId: optionAnswer.yearId,
            assessmentId: optionAnswer.assessmentId,
            moduleId: optionAnswer.moduleId,
            questionId: optionAnswer.questionId,
            answerTypeId: CHECKBOX,
            optionId: a.optionId,
            score_user: 0,
            score_verify: Number(a.score_verify),
            description: null,
            verifierId: optionAnswer.verifierId,
          };

          // console.log("D: ", data);

          await tx.optionAnswer.create({
            data,
          });
        }
      }

      // Гүйцэтгэлийн төлвийг өөрчлөх
      const performance = await tx.performance.findMany({
        where: {
          organizationId: answer.organizationId,
          yearId: answer.yearId,
          assessmentId: answer.assessmentId,
        },
      });

      if (performance.length === 1) {
        await tx.performance.update({
          where: { id: performance[0]?.id },
          data: {
            statusId: STATUS_VERIFYING,
          },
        });
      }
    });

    return NextResponse.json(true, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: posterror },
      { status: 500, headers: cors }
    );
  }
};
