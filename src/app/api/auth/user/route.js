"use server";

import { NextResponse } from "next/server";
import lodash from "lodash";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, statuserror } from "@/libs/constants";

export const POST = async (req) => {
  const { email } = await req.json();

  if (lodash.isEmpty(email?.trim())) {
    return NextResponse.json(
      { message: geterror },
      { status: 422, headers: cors }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        email: true,
        role: true,
        firstname: true,
        lastname: true,
        organizationId: true,
        id: true,
        mobile: true,
        position: true,
        gender: true,
        status: true,
      },
    });

    if (user && user.status === "1") {
      return NextResponse.json(user, { status: 200, headers: cors });
    } else {
      return NextResponse.json(
        { message: statuserror },
        { status: 404, headers: cors }
      );
    }
  } catch (error) {
    console.log("CATCH: ", error);
    return NextResponse.json(
      { message: geterror },
      { status: 500, headers: cors }
    );
  }
};
