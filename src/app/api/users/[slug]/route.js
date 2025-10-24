"use server";

import { NextResponse } from "next/server";
import lodash from "lodash";
import bcrypt from "bcrypt";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, puterror } from "@/libs/constants";

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
      role,
      status,
      organizationId,
    } = await req.json();

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
