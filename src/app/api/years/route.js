"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, posterror, STATUS_NEW } from "@/libs/constants";

export const GET = async () => {
  try {
    const years = await prisma.year.findMany({
      orderBy: [{ name: "desc" }],
    });

    return NextResponse.json(years, { status: 200, headers: cors });
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
  try {
    const { name, status } = await req.json();
    data = {
      name,
      status,
    };
    let year;

    await prisma.$transaction(async (tx) => {
      if (status === "1") {
        await tx.year.updateMany({
          where: { status: "1" },
          data: {
            status: "0",
          },
        });
      }

      year = await tx.year.create({
        data,
      });

      // Жилийн бүртгэл амжилттай үүссэн бол байгууллага бүрт бүх үнэлгээнүүдийг Шинэ төлөвтэйгөөр үүсгэх
      if (year) {
        const assessments = await tx.assessment.findMany({
          orderBy: [{ name: "asc" }],
        });

        const organizations = await tx.organization.findMany({
          where: {
            NOT: [{ memberId: null }],
          },
        });

        // console.log(assessments, organizations);
        const rows = [];
        if (assessments.length > 0 && organizations.length > 0) {
          for (const a of assessments) {
            for (const o of organizations) {
              rows.push({
                assessmentId: a.id,
                yearId: year.id,
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

    return NextResponse.json(year, { status: 201, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: posterror },
      { status: 500, headers: cors }
    );
  }
};
