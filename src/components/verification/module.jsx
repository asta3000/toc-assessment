"use client";

import { STATUS_DONE, STATUS_VERIFIED, textblue } from "@/libs/constants";
import clsx from "clsx";
import React from "react";
import { SolidButton } from "../MyButton";
import { useTranslation } from "@/hooks/useTranslation";
import { useVerificationStore } from "@/stores/storeVerification";
import PieDefault from "@/components/charts/Pie";

const Module = (props) => {
  const t = useTranslation();
  const { verification } = useVerificationStore();
  const disabled = [STATUS_VERIFIED, STATUS_DONE].includes(
    verification?.statusId
  );
  const questions =
    props.questions?.reduce((c, el) => c + (el.count ?? 0), 0) ?? 0;
  const verifications =
    props.verificationCount?.reduce((c, el) => c + (el.count ?? 0), 0) ?? 0;

  return (
    <div className="w-full flex flex-col gap-4 items-center justify-center">
      <PieDefault total={questions} performance={verifications} />
      <ul className="text-sm w-full">
        {props.modules?.map((module, index) => {
          const verificationNum =
            props.verificationCount?.find((q) => q.moduleId === module.id)
              ?.count ?? 0;
          const questionNum =
            props.questions?.find((q) => q.moduleId === module.id)?.count ?? 0;
          return (
            <li
              key={index}
              className={clsx(
                "p-2 border-[1px] border-gray-600/20 rounded-xl mb-1 hover:bg-blue-50 cursor-pointer flex justify-between items-center gap-3",
                `hover:${textblue}`,
                props.module?.id === module?.id && "bg-blue-100 font-semibold",
                props.module?.id === module?.id && textblue
              )}
              onClick={() => {
                props.handleChangeModule(module);
              }}
            >
              <p>{module.goal}</p>
              <p>
                {verificationNum} / {questionNum}
              </p>
            </li>
          );
        })}
      </ul>
      <form
        method="POST"
        className="p-6 text-sm"
        onSubmit={(event) => props.handleSubmit(event)}
      >
        {!disabled && (
          <div className="flex justify-center items-center gap-2 flex-wrap">
            {props.length > 0 && (
              <SolidButton
                color="green"
                size="small"
                label={t("action.Save")}
              />
            )}

            {verifications !== questions && (
              <SolidButton
                color="blue"
                size="small"
                label={t("action.SaveAllSend")}
                onClick={props.handleFinish}
              />
            )}

            {verifications === questions && (
              <SolidButton
                color="red"
                size="small"
                label={t("action.Send")}
                onClick={props.handleFinish}
              />
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default Module;
