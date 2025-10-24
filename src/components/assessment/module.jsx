"use client";

import { STATUS_SENT, textblue } from "@/libs/constants";
import clsx from "clsx";
import React from "react";
import { SolidButton } from "../MyButton";
import { useTranslation } from "@/hooks/useTranslation";
import { useAssessmentStore } from "@/stores/storeAssessment";

const Module = (props) => {
  // console.log("Module props:", props);
  const t = useTranslation();
  const { assessment } = useAssessmentStore();
  const disabled = [STATUS_SENT].includes(assessment?.status);
  const answers =
    props.answerCount?.reduce((c, el) => c + (el.count ?? 0), 0) ?? 0;
  const questions =
    props.questions?.reduce((c, el) => c + (el.count ?? 0), 0) ?? 0;

  return (
    <div className="w-full flex flex-col gap-4 items-center justify-center">
      <div className="flex items-center justify-center gap-1 text-5xl font-semibold text-blue-900">
        <p>{answers}</p> / <p>{questions}</p>
      </div>
      <ul className="text-sm w-full">
        {props.modules
          ?.filter((m) => m.assessmentId === props.assessmentId)
          ?.map((module, index) => {
            const questionNum =
              props.questions?.find((q) => q.moduleId === module.id)?.count ??
              0;
            const answerNum =
              props.answerCount?.find((a) => a.moduleId === module.id)?.count ??
              0;
            return (
              <li
                key={index}
                className={clsx(
                  "p-2 border-[1px] border-gray-600/20 rounded-xl mb-1 hover:bg-blue-50 cursor-pointer flex justify-between items-center gap-3",
                  `hover:${textblue}`,
                  props.module?.id === module?.id &&
                    "bg-blue-100 font-semibold",
                  props.module?.id === module?.id && textblue
                )}
                onClick={() => {
                  props.handleChangeModule(module);
                }}
              >
                <p>{module.goal}</p>
                <p>
                  {answerNum} / {questionNum}
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
          <SolidButton
            color="green"
            size="small"
            action="save"
            label={
              answers === questions ? t("action.SaveSend") : t("action.Save")
            }
          />
        )}
      </form>
    </div>
  );
};

export default Module;
