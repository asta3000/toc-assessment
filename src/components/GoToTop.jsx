"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { bgblue, borderblue, blue } from "@/libs/constants";
import { useSystemStore } from "@/stores/storeSystem";
import clsx from "clsx";
import { FaChevronUp } from "react-icons/fa";

import Image from "next/image";
import React from "react";

const GoToTop = () => {
  const { system } = useSystemStore();
  const t = useTranslation();

  return (
    <div
      className={clsx(
        "z-10 fixed bottom-26 right-10 rounded-full min-w-[60px] min-h-[60px] flex justify-center items-center hover:bg-transparent border-2 cursor-pointer",
        bgblue,
        borderblue
      )}
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <FaChevronUp size={26} className={clsx("text-white")} />
    </div>
  );
};

export default GoToTop;
