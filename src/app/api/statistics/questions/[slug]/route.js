"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror } from "@/libs/constants";

// Тухайн үнэлгээний асуултын тоог модулиар нь тоолж гаргана.
// Модуль тус бүрийн бөглөлтийг хянахад ашиглана.
export const GET = async (req, { params }) => {
  const { slug } = await params;
  let questions;
  try {
    await prisma.$transaction(async (tx) => {
      questions = await tx.question.aggregateRaw({
        pipeline: [
          {
            $match: {
              // organizationId: new ObjectId(organizationId),
              // yearId: new ObjectId(yearId),
              assessmentId: { $oid: slug },
              status: "1",
            },
          },
          { $group: { _id: "$moduleId", count: { $sum: 1 } } },
          { $project: { _id: 0, moduleId: { $toString: "$_id" }, count: 1 } },
          //   { $sort: { count: -1 } },
        ],
      });
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
