"use server";

import { NextResponse } from "next/server";

export const config = {
  matcher: [
    "/bases/:path*",
    "/businesses/:path*",
    "/files/:path*",
    "/organizations/:path*",
    "/assessments/:path*",
    "/changepassword/:path*",
    "/dashboard/:path*",
    "/organization/:path*",
    "/profile/:path*",
    "/supports/:path*",
    "/verification/:path*",
    "/registration/:path*",
    "/api/:path*",
  ],
};

export const middleware = (req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }
};
