"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror } from "@/libs/constants";

// Байгууллагын dashboard-д зориулагдсан.
// Байгууллага нь тухайн жил бүх үнэлгээнүүдэд хэрхэн оролцсонг харах зорилготой.
export const GET = async (req, { params }) => {
  const { slug } = await params;
  try {
    const results = await prisma.$transaction(async (tx) => {
      const assessments = await tx.assessment.findMany({
        where: { status: "1" },
      });

      const performances = await tx.performance.findMany({
        where: { organizationId: slug },
        include: {
          Status: true,
          Assessment: true,
          Year: true,
        },
      });

      const years = await tx.year.findMany();

      let questions;
      for (const assessment of assessments) {
        questions = await tx.question.aggregateRaw({
          pipeline: [
            {
              $match: {
                assessmentId: { $oid: assessment.id },
                status: "1",
              },
            },
            {
              $group: {
                _id: null, // ← бүх document-ийг нэг group болгоно
                count: { $sum: 1 }, // ← нийт хэдэн document байна гэдгийг тоолно
              },
            },
            {
              $project: {
                _id: 0,
                count: 1,
                assessmentId: { $literal: assessment.id },
              },
            },
          ],
        });
      }

      let answers;
      for (const assessment of assessments) {
        for (const year of years) {
          // Тухайн үнэлгээ, тухайн байгууллага, тухайн он
          // questionId-аар давхцсан асуултуудыг нэгтгэнэ.
          answers = await tx.answer.aggregateRaw({
            pipeline: [
              {
                $match: {
                  assessmentId: { $oid: assessment.id },
                  organizationId: { $oid: slug },
                  yearId: { $oid: year.id },
                },
              },
              {
                $group: {
                  _id: "$questionId",
                },
              },
              {
                $group: {
                  _id: null, // ← бүх document-ийг нэг group болгоно
                  count: { $sum: 1 }, // ← нийт хэдэн document байна гэдгийг тоолно
                },
              },
              {
                $project: {
                  _id: 0,
                  count: 1,
                  assessmentId: { $literal: assessment.id },
                  yearId: { $literal: year.id },
                },
              },
            ],
          });

          // Дээрх үйлдлээс хариу олдоогүй бол 0 гэсэн хариуг буцаана.
          if (answers.length === 0) {
            answers = [
              ...answers,
              {
                count: 0,
                assessmentId: assessment.id,
                yearId: year.id,
              },
            ];
          }
        }
      }

      return { assessments, performances, questions, answers };
    });

    return NextResponse.json(results, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: geterror },
      { status: 500, headers: cors }
    );
  }
};
