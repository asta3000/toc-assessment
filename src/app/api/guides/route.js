"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, posterror } from "@/libs/constants";

export const GET = async () => {
  try {
    const guides = await prisma.guide.findMany({
      orderBy: [{ name: "asc" }],
    });

    return NextResponse.json(guides, { status: 200, headers: cors });
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
    const { name, status, description, guideType, value } = await req.json();
    data = {
      name,
      status,
      description,
      guideType,
      value,
    };

    const guide = await prisma.guide.create({
      data,
    });

    return NextResponse.json(guide, { status: 201, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: posterror },
      { status: 500, headers: cors }
    );
  }
};
