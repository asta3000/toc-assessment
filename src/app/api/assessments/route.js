"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, posterror, STATUS_NEW } from "@/libs/constants";
import { assessmentSchema } from "@/libs/schemas";

export const GET = async () => {
  try {
    const assessments = await prisma.assessment.findMany({
      orderBy: [{ name: "asc" }],
    });

    return NextResponse.json(assessments, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: geterror },
      { status: 500, headers: cors }
    );
  }
};

export const POST = async (req) => {
  let data;
  let assessment;
  try {
    const { name, status = "1", abstract, content, goal } = await req.json();

    const parsed = assessmentSchema?.safeParse({
      name,
      abstract,
      content,
      goal,
    });

    if (!parsed?.success) {
      const firstError = parsed?.error?.issues[0];
      return NextResponse.json(
        { message: firstError?.message },
        { status: 302, headers: cors }
      );
    }

    data = {
      name,
      status,
      abstract,
      content,
      goal,
    };

    await prisma.$transaction(async (tx) => {
      assessment = await prisma.assessment.create({
        data,
      });

      if (assessment) {
        const year = new Date().getFullYear();
        const years = await tx.year.findMany({
          where: { name: { gte: String(year) } },
        });
        const organizations = await tx.organization.findMany({
          where: {
            NOT: [{ memberId: null }],
          },
        });

        const rows = [];
        if (years.length > 0 && organizations.length > 0) {
          for (const y of years) {
            for (const o of organizations) {
              rows.push({
                assessmentId: assessment.id,
                yearId: y.id,
                organizationId: o.id,
                statusId: STATUS_NEW,
              });
            }
          }
        }

        await tx.performance.createMany({
          data: rows,
        });
      }
    });

    return NextResponse.json(assessment, { status: 201, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: posterror },
      { status: 500, headers: cors }
    );
  }
};
