"use server";

import { NextResponse } from "next/server";
import lodash from "lodash";
import bcrypt from "bcrypt";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, puterror } from "@/libs/constants";

export const PUT = async (req, { params }) => {
  let data;
  let user;
  let hashedPassword;
  const { slug } = await params;
  try {
    // Хэрэглэгчийг шалгах
    user = await prisma.user.findUnique({
      where: { id: slug },
    });

    if (lodash.isEmpty(user)) {
      return NextResponse.json(
        { message: geterror },
        { status: 500, headers: cors }
      );
    }

    if (user?.status === "0") {
      return NextResponse.json(
        { message: geterror },
        { status: 500, headers: cors }
      );
    }

    // Одоогийн нууц үгийг шалгах
    const { currentPassword, password } = await req.json();

    const matchedPassword = await bcrypt.compare(
      currentPassword,
      user?.password
    );

    if (!matchedPassword) {
      return NextResponse.json(
        { message: puterror },
        { status: 500, headers: cors }
      );
    }

    // Нууц үгийг энкриптлээд, хадгалах
    hashedPassword = await bcrypt.hash(password, 10);
    data = {
      password: hashedPassword,
    };

    user = await prisma.user.update({
      where: { id: slug },
      data,
    });

    return NextResponse.json(user, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: puterror },
      { status: 500, headers: cors }
    );
  }
};
