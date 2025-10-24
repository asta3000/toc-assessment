"use client";

import lodash from "lodash";
import clsx from "clsx";
import React, { Fragment } from "react";
import { FaArrowDown, FaArrowUp, FaRegTrashAlt } from "react-icons/fa";
import { CustomInput } from "../MyInput";
import { CustomSelect } from "../MySelect";
import { textblue } from "@/libs/constants";
import { useTranslation } from "@/hooks/useTranslation";
import { MyError } from "../MyText";

export const SubQuestions = (props) => {
  const t = useTranslation();
  const action = "subquestion";

  return (
    <Fragment>
      <div className="text-sm flex justify-start items-center gap-3 mt-10">
        <p>{t("businesses.questionsanswers.numberSubQuestion")}: </p>
        <p className={clsx("font-semibold", textblue)}>
          {props.subQuestions?.length}
        </p>
        <FaArrowUp
          size={14}
          className={clsx(
            "rounded-sm hover:scale-140 border-blue-900 cursor-pointer",
            textblue
          )}
          onClick={() =>
            props.setSubQuestions([
              ...props.subQuestions,
              {
                name: "",
                status: "1",
                name_en: "",
                questionId: props.data.id || "",
              },
            ])
          }
        />
        <FaArrowDown
          size={14}
          className={clsx(
            "rounded-sm hover:scale-140 border-blue-900 cursor-pointer",
            textblue
          )}
          onClick={() => {
            props.subQuestions.length > 0 &&
              props.setSubQuestions(props.subQuestions.slice(0, -1));
          }}
        />
      </div>
      {props.subQuestions?.map((subQuestion, index) => {
        return (
          <div key={index} className="flex justify-center items-center gap-5">
            <div className={clsx("flex-4/12", textblue)}>
              <CustomInput
                name="name"
                type="text"
                label={t("businesses.questionsanswers.subQuestionMN")}
                value={subQuestion.name}
                handleChangeValue={props.handleChangeValue}
                index={index}
                action={action}
              />
            </div>
            <div className={clsx("flex-4/12", textblue)}>
              <CustomInput
                name="name_en"
                type="text"
                label={t("businesses.questionsanswers.subQuestionEN")}
                value={subQuestion.name_en}
                handleChangeValue={props.handleChangeValue}
                index={index}
                action={action}
              />
            </div>
            <div className="flex-2/12">
              <CustomSelect
                name="status"
                label={t("businesses.questionsanswers.status")}
                value={subQuestion.status}
                index={index}
                selection={[
                  { value: "1", description: "Идэвхтэй" },
                  { value: "0", description: "Идэвхгүй" },
                ]}
                handleChangeValue={props.handleChangeValue}
                setSubQuestions={props.setSubQuestions}
                subQuestions={props.subQuestions}
                action={action}
              />
            </div>
            {props.subQuestions.length > 1 && (
              <div>
                <FaRegTrashAlt
                  size={16}
                  className="text-gray-500 hover:text-red-500 hover:scale-110 cursor-pointer"
                  onClick={() => {
                    props.setSubQuestions([
                      ...props.subQuestions.filter((_, o) => o !== index),
                    ]);
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </Fragment>
  );
};

export const ViewSubQuestions = (props) => {
  const t = useTranslation();

  return (
    <div>
      <p className={clsx(textblue, "mt-4 mb-5")}>
        {t("businesses.questionsanswers.SubQuestions")}
      </p>
      {lodash.isEmpty(props.subQuestions) ? (
        <MyError />
      ) : (
        <div className={clsx("grid grid-cols-[3fr_3fr_1fr] gap-4 text-sm")}>
          <p className={clsx("text-center font-semibold", textblue)}>
            {t("businesses.questionsanswers.subQuestionMN")}
          </p>
          <p className={clsx("text-center font-semibold", textblue)}>
            {t("businesses.questionsanswers.subQuestionEN")}
          </p>
          <p className={clsx("text-center font-semibold", textblue)}>
            {t("businesses.questionsanswers.status")}
          </p>
          {props.subQuestions?.map((subQuestion, index) => {
            return (
              <Fragment key={index}>
                <p className="text-center">{subQuestion.name}</p>
                <p className="text-center">{subQuestion.name_en}</p>
                <p className="text-center">
                  {
                    [
                      { value: "1", description: "Идэвхтэй" },
                      { value: "0", description: "Идэвхгүй" },
                    ]?.filter((s) => s.value === subQuestion.status)[0]
                      ?.description
                  }
                </p>
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};
