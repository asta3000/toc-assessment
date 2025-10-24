"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { puterror } from "@/libs/constants";

export const PUT = async (req, { params }) => {
  let data;
  const { slug } = await params;
  try {
    const { name, status, abstract, content, goal } = await req.json();
    data = {
      name,
      status,
      abstract,
      content,
      goal,
    };

    const assessment = await prisma.assessment.update({
      where: { id: slug },
      data,
    });

    return NextResponse.json(assessment, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: puterror },
      { status: 500, headers: cors }
    );
  }
};
