"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import clsx from "clsx";

export const MyView = (props) => {
  // console.log(props);
  return (
    <div className="text-sm">
      <p className="text-gray-500 mb-1 font-semibold">{props.label}</p>
      <p className="text-black ml-2">{props.value || "-"}</p>
    </div>
  );
};

export const MyError = () => {
  const t = useTranslation();
  return (
    <p className="mt-14 text-sm text-red-400 text-center w-full">
      {t("error.NoDataFound")}
    </p>
  );
};

export const MyStatus = (props) => {
  return (
    <p
      className={clsx(
        "text-sm rounded-md py-1 font-bold uppercase",
        props.color === "red" && "text-red-500",
        props.color === "blue" && "text-blue-500",
        props.color === "black" && "text-gray-500"
      )}
    >
      {props.label}
    </p>
  );
};
