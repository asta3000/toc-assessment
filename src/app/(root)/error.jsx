"use client";

import Link from "next/link";
import React from "react";

import "@/styles/globals.css";
import { useTranslation } from "@/hooks/useTranslation";

const Error = () => {
  const t = useTranslation();
  return (
    <div className="w-screen h-screen overflow-hidden bg-[url('/ToCLogo4.png'),url('/ToCLogo5.png')] bg-container bg-no-repeat bg-[position:left_bottom,right_top]">
      <div className="w-full h-full flex flex-col justify-center items-center gap-10">
        <h1 className="text-3xl font-bold">{t("error.Error")}</h1>
        <Link href="/" className="px-2 py-1">
          {t("error.link")}
        </Link>
      </div>
    </div>
  );
};

export default Error;
