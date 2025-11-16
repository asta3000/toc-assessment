"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, posterror } from "@/libs/constants";
import { memberSchema } from "@/libs/schemas";

export const GET = async () => {
  try {
    const members = await prisma.member.findMany({
      orderBy: [{ name: "asc" }],
    });

    return NextResponse.json(members, { status: 200, headers: cors });
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
    const { name, status = "1", description } = await req.json();

    const parsed = memberSchema?.safeParse({
      name,
      description,
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
      description,
    };

    const member = await prisma.member.create({
      data,
    });

    return NextResponse.json(member, { status: 201, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: posterror },
      { status: 500, headers: cors }
    );
  }
};
