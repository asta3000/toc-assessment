"use server";

import { NextResponse } from "next/server";
import lodash from "lodash";
import bcrypt from "bcrypt";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, puterror } from "@/libs/constants";
import { resetPasswordSchema, userBaseSchema } from "@/libs/schemas";

export const GET = async (req, { params }) => {
  const { slug } = await params;
  try {
    const user = await prisma.user.findMany({
      where: { id: slug },
      include: { Organization: true },
    });

    return NextResponse.json(user, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: geterror },
      { status: 500, headers: cors }
    );
  }
};

export const PUT = async (req, { params }) => {
  let data;
  let hashedPassword;
  let parsed;
  const { slug } = await params;
  try {
    const {
      firstname,
      lastname,
      email,
      position,
      gender,
      mobile,
      password,
      confirmPassword,
      role,
      status,
      organizationId,
    } = await req.json();

    if (lodash.isEmpty(password) && lodash.isEmpty(confirmPassword)) {
      parsed = userBaseSchema?.safeParse({
        firstname,
        lastname,
        email,
        position,
        gender,
        mobile,
        role,
        status,
        organizationId,
      });
    } else {
      parsed = resetPasswordSchema?.safeParse({
        email,
        password,
        confirmPassword,
      });
    }

    if (!parsed?.success) {
      const firstError = parsed?.error?.issues[0];
      return NextResponse.json(
        { message: firstError?.message },
        { status: 302, headers: cors }
      );
    }

    // Нууц үгийг энкриптлэх
    if (lodash.isEmpty(password)) {
      data = {
        firstname,
        lastname,
        email,
        position,
        gender,
        mobile,
        role,
        status,
        organizationId,
      };
    } else {
      hashedPassword = await bcrypt.hash(password, 10);
      data = {
        password: hashedPassword,
      };
    }

    const user = await prisma.user.update({
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
