"use server";

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, puterror } from "@/libs/constants";

export const POST = async (req) => {
  try {
    const { email, password } = await req.json();

    // Хэрэглэгч бүртгэлтэй эсэхийг шалгах
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser) {
      return NextResponse.json(
        {
          message: geterror,
        },
        { status: 302, headers: cors }
      );
    }

    console.log(email, password, existingUser);

    // Нууц үгийг энкриптлэх
    const hashedPassword = await bcrypt.hash(password, 10);

    // Нууц үгийг өөрчлөх
    const data = {
      password: hashedPassword,
      status: "1",
      attempt: 0,
    };

    const user = await prisma.user.update({
      where: { id: existingUser.id },
      data,
    });

    return NextResponse.json(true, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: puterror },
      { status: 500, headers: cors }
    );
  }
};
