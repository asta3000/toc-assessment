"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, posterror } from "@/libs/constants";

export const GET = async () => {
  try {
    const modules = await prisma.module.findMany({
      orderBy: [{ Assessment: { name: "asc" } }, { name: "asc" }],
      include: {
        Assessment: {
          select: {
            id: true,
            name: true,
            abstract: true,
            content: true,
            goal: true,
          },
        },
      },
    });

    return NextResponse.json(modules, { status: 200, headers: cors });
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
    const { name, status, description, assessmentId, goal } = await req.json();
    data = {
      name,
      status,
      description,
      assessmentId,
      goal,
    };

    const modules = await prisma.module.create({
      data,
    });

    return NextResponse.json(modules, { status: 201, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: posterror },
      { status: 500, headers: cors }
    );
  }
};
