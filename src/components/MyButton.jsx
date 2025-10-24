"use client";

import React from "react";
import { clsx } from "clsx";
import lodash from "lodash";

import { bgblue, bggreen } from "@/libs/constants";
import { handleClickAdd, handleClickCancel } from "@/functions/page";
import { useTranslation } from "@/hooks/useTranslation";
import { useSystemStore } from "@/stores/storeSystem";

export const FullSolidButton = (props) => {
  return (
    <div className="w-full">
      <button
        className={clsx(
          "w-full py-2 rounded-lg text-white cursor-pointer",
          props.color === "blue" ? bgblue : bggreen
        )}
      >
        {props.label}
      </button>
    </div>
  );
};

export const SolidButton = (props) => {
  console.log("SOLID_BUTTON: ", props);
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded-lg text-white cursor-pointer",
        props.color === "blue"
          ? bgblue
          : props.color === "red"
            ? "bg-red-500"
            : bggreen,
        props.size === "small" ? "text-sm" : "text-md"
      )}
      onClick={(event) => {
        // console.log(props.action);
        lodash.isEmpty(props.action)
          ? handleClickAdd(props.setModal, props.setData)
          : props.action === "cancel"
            ? handleClickCancel(props.setModal, props.setData)
            : props.action === "decline"
              ? props.setData()
              : null;

        props.onClick && props.onClick(event);
      }}
    >
      {props.label}
    </button>
  );
};

export const FileButton = (props) => {
  const t = useTranslation();
  return (
    <button
      disabled={props.disabled}
      className={clsx(
        "px-4 py-2 rounded-lg text-white cursor-pointer",
        props.color === "blue"
          ? bgblue
          : props.color === "red"
            ? "bg-red-500"
            : bggreen,
        props.size === "small" ? "text-sm" : "text-md",
        (props.title !== t("files.Copy") ||
          props.title !== t("files.Download")) &&
          "w-full",
        props.disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
    >
      {props.label}
    </button>
  );
};

export const FileMenuButton = (props) => {
  const { system } = useSystemStore();
  return (
    <button
      onClick={() => props.onClick(props.menu.action)}
      className={`${
        props.action === "file"
          ? " text-blue-700 hover:bg-blue-800 hover:text-white"
          : null
      } py-1.5 px-3 rounded-md duration-300 text-sm cursor-pointer`}
    >
      {system.language === "mn" ? props.menu.name : props.menu.name_en}
    </button>
  );
};
