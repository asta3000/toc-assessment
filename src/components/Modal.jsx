"use client";

import React, { Fragment } from "react";
import clsx from "clsx";
import { GrClose } from "react-icons/gr";

import { SolidButton } from "@/components/MyButton";
import { SimpleOne } from "@/components/modal/Simple";
import { Questionnaire } from "@/components/modal/Questionnaire";
import { ChangePassword } from "@/components/modal/Password";
import { Spinner } from "@/components/Spinner";
import { useTranslation } from "@/hooks/useTranslation";
import { textblue } from "@/libs/constants";
import { handleClickCancel, handleClickSave } from "@/functions/page";

export const FullModal = (props) => {
  const t = useTranslation();
  // console.log("PROPS_MODAL: ", props);
  return (
    <form
      method="POST"
      onSubmit={(event) =>
        handleClickSave(
          event,
          props.url,
          props.data,
          props.action,
          props.setLoading,
          props.setModal,
          props.setData,
          props.mutate,
          props.options,
          props.setOptions,
          props.subQuestions,
          props.setSubQuestions
        )
      }
      className="w-full p-2 overflow-x-hidden overflow-y-auto flex flex-col justify-center items-center border-[1px] border-blue-200 rounded-xl"
    >
      {/* Гарчиг */}
      <div className="w-full flex items-start justify-between py-5 px-6">
        <h3 className={clsx("text-md font-semiboldmy-1", textblue)}>
          {props.action === "add"
            ? t("action.Add")
            : props.action === "edit"
              ? t("action.Edit")
              : props.action === "detail"
                ? t("action.Detail")
                : props.action === "password"
                  ? t("action.ChangePassword")
                  : null}
        </h3>
        <GrClose
          onClick={() => handleClickCancel(props.setModal, props.setData)}
          className={clsx(
            "cursor-pointer rotate-0 hover:rotate-180 transition-all ease-in-out duration-700",
            textblue
          )}
        />
      </div>
      {/* Их бие */}
      <div className="py-3 px-6 w-full h-full space-y-6">
        {props.action === "password" ? (
          <ChangePassword
            metadatas={props.metadatas}
            data={props.data}
            setData={props.setData}
          />
        ) : props?.modal === "simpleone" ? (
          <SimpleOne
            metadatas={props.metadatas}
            data={props.data}
            action={props.action}
            setData={props.setData}
            selection={props.selection}
          />
        ) : props?.modal === "questionnaire" ? (
          <Questionnaire
            metadatas={props.metadatas}
            data={props.data}
            action={props.action}
            setData={props.setData}
            selection={props.selection}
            options={props.options}
            setOptions={props.setOptions}
            subQuestions={props.subQuestions}
            setSubQuestions={props.setSubQuestions}
            handleChangeValue={props.handleChangeValue}
          />
        ) : null}
      </div>
      {/* Товчнууд */}
      <div className="flex items-center py-5 px-6 space-x-2">
        {props.loading ? (
          <Spinner />
        ) : (
          <Fragment>
            {props.action !== "detail" && (
              <SolidButton
                color="green"
                size="small"
                action="save"
                label={
                  props.action === "add" ? t("action.Add") : t("action.Edit")
                }
              />
            )}
            <SolidButton
              setData={props.setData}
              setModal={props.setModal}
              size="small"
              color="red"
              label={t("action.Cancel")}
              action="cancel"
            />
          </Fragment>
        )}
      </div>
    </form>
  );
};
