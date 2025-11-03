"use server";

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, posterror } from "@/libs/constants";

export const GET = async () => {
  try {
    const users = await prisma.user.findMany({
      orderBy: [{ Organization: { name: "asc" } }, { email: "asc" }],
      include: {
        Organization: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(users, { status: 200, headers: cors });
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
    const {
      firstname,
      lastname,
      email,
      position,
      gender,
      mobile,
      password,
      role,
      status,
      organizationId,
    } = await req.json();

    // Хэрэглэгч бүртгэлтэй эсэхийг шалгах
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "Хэрэглэгч бүртгэлтэй байна.",
        },
        { status: 302, headers: cors }
      );
    }

    // Бүртгэлтэй хэрэглэгчийг тоолох
    const countUser = await prisma.user.findMany({
      where: { organizationId },
    });

    if (countUser.length >= 3) {
      return NextResponse.json(
        {
          message: "Бүртгэлтэй хэрэглэгчийн тоо хангалттай байна.",
        },
        { status: 400, headers: cors }
      );
    }

    // Нууц үгийг энкриптлэх
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    } else {
      hashedPassword = undefined;
    }

    data = {
      firstname,
      lastname,
      email,
      position,
      gender,
      mobile,
      password: hashedPassword,
      role,
      status,
      organizationId,
    };

    const user = await prisma.user.create({
      data,
    });

    return NextResponse.json(user, { status: 201, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: posterror },
      { status: 500, headers: cors }
    );
  }
};
