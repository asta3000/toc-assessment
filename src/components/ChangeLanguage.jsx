"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { bgblue, borderblue } from "@/libs/constants";
import { useSystemStore } from "@/stores/storeSystem";
import clsx from "clsx";

import Image from "next/image";
import React from "react";

const ChangeLanguage = () => {
  const { system, storeLanguage } = useSystemStore();
  const t = useTranslation();

  return (
    <div
      className={clsx(
        "z-10 fixed bottom-8 right-10 rounded-full min-w-[60px] min-h-[60px] flex justify-center items-center hover:bg-transparent border-2",
        bgblue,
        borderblue
      )}
      onClick={() => {
        storeLanguage({ language: system.language === "mn" ? "en" : "mn" });
      }}
    >
      <Image
        src={system.language === "mn" ? "/en.svg" : "/mn.svg"}
        className="border-2 border-white cursor-pointer h-auto aspect-auto"
        alt=""
        priority
        width={35}
        height={35}
        title={
          system.language === "mn"
            ? t("language.ChangeEnglish")
            : t("language.ChangeMongolian")
        }
      />
    </div>
  );
};

export default ChangeLanguage;
