"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror } from "@/libs/constants";

export const GET = async () => {
  try {
    const organizations = await prisma.organization.findMany({
      where: { status: "1" },
      orderBy: [{ Member: { name: "asc" } }, { name: "asc" }],
    });

    return NextResponse.json(organizations, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: geterror },
      { status: 500, headers: cors }
    );
  }
};
