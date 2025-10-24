"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror } from "@/libs/constants";

export const POST = async (req) => {
  const { assessmentId, organizationId, yearId } = await req.json();
  let answers;
  try {
    await prisma.$transaction(async (tx) => {
      answers = await tx.answer.aggregateRaw({
        pipeline: [
          {
            $match: {
              organizationId: { $oid: organizationId },
              yearId: { $oid: yearId },
              assessmentId: { $oid: assessmentId },
            },
          },
          {
            // _id утга дээр moduleId-ийн утгаар бүлэглэнэ. $moduleId нь энэ хувьсагч дээрх утгыг илэрхийлнэ. moduleId нь хувьсагчийг хэлж байгаа.
            // addToSet нь $questionId-ийн давхардылг арилгаад qset гэдэг командаар давхардалгүй массив үүсгэнэ.
            $group: {
              _id: "$moduleId",
              qset: { $addToSet: "$questionId" },
            },
          },
          {
            // _id-г харуулахгүй болгоод, moduleId дээр group дотор тодорхойлсон _id-н утгыг string болгон хувиргаад хадгална.
            // group дотор _id дээр moduleId-ийн утга хадгалагдсан.
            // count гэсэн хувьсагчид group доторх qset массивын хэмжээ буюу size-г хадгална.
            $project: {
              _id: 0,
              moduleId: { $toString: "$_id" },
              count: { $size: "$qset" }, // давхардуулсангүй тоо
            },
          },
        ],
      });
    });

    return NextResponse.json(answers, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: geterror },
      { status: 500, headers: cors }
    );
  }
};
