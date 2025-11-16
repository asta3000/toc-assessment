"use server";

import { NextResponse } from "next/server";
import lodash from "lodash";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, posterror, STATUS_NEW } from "@/libs/constants";
import { organizationSchema } from "@/libs/schemas";

export const GET = async () => {
  try {
    const organizations = await prisma.organization.findMany({
      orderBy: [{ Member: { name: "asc" } }, { name: "asc" }],
      include: {
        Member: { select: { id: true, name: true } },
        Operation: { select: { id: true, name: true } },
        Sector: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(organizations, { status: 200, headers: cors });
  } catch (error) {
    console.error("E: ", error);
    return NextResponse.json(
      { message: geterror },
      { status: 500, headers: cors }
    );
  }
};

export const POST = async (req) => {
  let data;
  let organization;
  try {
    const {
      name,
      memberId,
      operationId,
      sectorId,
      status = "1",
    } = await req.json();

    const parsed = organizationSchema?.safeParse({
      name,
      memberId,
      operationId,
      sectorId,
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
      memberId,
      operationId,
      sectorId,
      status,
    };

    await prisma.$transaction(async (tx) => {
      organization = await tx.organization.create({
        data,
      });

      if (organization) {
        const year = new Date().getFullYear();
        const assessments = await tx.assessment.findMany();
        const years = await tx.year.findMany({
          where: { name: { gte: String(year) } },
        });
        const rows = [];

        if (assessments.length > 0 && years.length > 0) {
          for (const a of assessments) {
            for (const y of years) {
              rows.push({
                assessmentId: a.id,
                yearId: y.id,
                organizationId: organization.id,
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

    return NextResponse.json(organization, { status: 201, headers: cors });
  } catch (error) {
    console.error("E: ", error);
    return NextResponse.json(
      { message: posterror },
      { status: 500, headers: cors }
    );
  }
};
