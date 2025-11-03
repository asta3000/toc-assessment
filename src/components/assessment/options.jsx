"use client";

import clsx from "clsx";
import React, { Fragment, useMemo } from "react";
import { FaArrowDown, FaArrowUp, FaRegTrashAlt } from "react-icons/fa";
import lodash from "lodash";

import { useTranslation } from "@/hooks/useTranslation";
import {
  CHECKBOX,
  RADIO,
  STATUS_FILLING,
  STATUS_NEW,
  TEXT,
  textblue,
} from "@/libs/constants";
import { CustomInput } from "../MyInput";
import { CustomSelect } from "../MySelect";
import { MyError } from "../MyText";
import { useSystemStore } from "@/stores/storeSystem";
import { useAssessmentStore } from "@/stores/storeAssessment";

export const QuestionsOptions = (props) => {
  const t = useTranslation();
  return (
    <div>
      <div className="text-sm flex justify-start items-center gap-3 mt-10 mb-5">
        <p>{t("businesses.questionsanswers.numberOption")}: </p>
        <p className={clsx("font-semibold", textblue)}>
          {props.options.length}
        </p>
        <FaArrowUp
          size={14}
          className={clsx(
            "rounded-sm hover:scale-140 border-blue-900 cursor-pointer",
            textblue
          )}
          onClick={() =>
            props.setOptions([
              ...props.options,
              {
                score: 0,
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
            props.options.length > 0 &&
              props.setOptions(props.options.slice(0, -1));
          }}
        />
      </div>
      {props.options?.map((option, index) => {
        return (
          <div
            key={index}
            className="grid grid-cols-2 gap-5 border-[1px] border-gray-300 p-6 rounded-lg mb-5"
          >
            <div className={clsx(textblue)}>
              <CustomInput
                name="name"
                type="text"
                label={t("businesses.questionsanswers.optionMN")}
                value={option.name}
                handleChangeValue={props.handleChangeValue}
                index={index}
                action="option"
              />
            </div>
            <div className={clsx(textblue)}>
              <CustomInput
                name="name_en"
                type="text"
                label={t("businesses.questionsanswers.optionEN")}
                value={option.name_en}
                handleChangeValue={props.handleChangeValue}
                index={index}
                action="option"
              />
            </div>
            {props.data?.answerTypeId === CHECKBOX && (
              <Fragment>
                <div className={clsx(textblue)}>
                  <CustomInput
                    name="question"
                    type="text"
                    label={t("businesses.questionsanswers.questionMN")}
                    value={option.question}
                    handleChangeValue={props.handleChangeValue}
                    index={index}
                    action="option"
                  />
                </div>
                <div className={clsx(textblue)}>
                  <CustomInput
                    name="question_en"
                    type="text"
                    label={t("businesses.questionsanswers.questionEN")}
                    value={option.question_en}
                    handleChangeValue={props.handleChangeValue}
                    index={index}
                    action="option"
                  />
                </div>
                <div>
                  <CustomSelect
                    name="answerType"
                    label={t("businesses.questionsanswers.answerType")}
                    value={option.answerType}
                    index={index}
                    selection={[
                      { value: "TEXT", description: "Текст" },
                      { value: "NUMBER", description: "Тоо" },
                    ]}
                    handleChangeValue={props.handleChangeValue}
                    setOptions={props.setOptions}
                    options={props.options}
                    action="option"
                  />
                </div>
              </Fragment>
            )}
            <div className="flex justify-between items-center gap-10">
              <div className="flex-1/3">
                <CustomInput
                  name="score"
                  type="number"
                  label={t("businesses.questionsanswers.score")}
                  value={option.score}
                  handleChangeValue={props.handleChangeValue}
                  index={index}
                  action="option"
                />
              </div>
              <div className="flex-1/3">
                <CustomSelect
                  name="status"
                  label={t("businesses.questionsanswers.status")}
                  value={option.status}
                  index={index}
                  selection={[
                    { value: "1", description: "Идэвхтэй" },
                    { value: "0", description: "Идэвхгүй" },
                  ]}
                  handleChangeValue={props.handleChangeValue}
                  setOptions={props.setOptions}
                  options={props.options}
                  action="option"
                />
              </div>
              {props.options.length > 1 && (
                <div>
                  <FaRegTrashAlt
                    size={16}
                    className="text-gray-500 hover:text-red-500 hover:scale-120 transition-all ease-in-out duration-300 cursor-pointer"
                    onClick={() => {
                      props.setOptions([
                        ...props.options.filter((_, o) => o !== index),
                      ]);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const ViewOptions = (props) => {
  const t = useTranslation();

  return (
    <div>
      <p className={clsx(textblue, "mt-4 mb-5")}>
        {t("businesses.questionsanswers.option")}
      </p>
      {lodash.isEmpty(props.options) ? (
        <MyError />
      ) : (
        <div
          className={clsx(
            "text-sm grid gap-4",
            props.data?.answerTypeId === CHECKBOX
              ? "grid-cols-[2fr_2fr_2fr_2fr_0.5fr_0.5fr_0.8fr]"
              : "grid-cols-[3fr_3fr_1fr_1fr]"
          )}
        >
          <p className={clsx("text-center font-semibold", textblue)}>
            {t("businesses.questionsanswers.optionMN")}
          </p>
          <p className={clsx("text-center font-semibold", textblue)}>
            {t("businesses.questionsanswers.optionEN")}
          </p>
          {props.data?.answerTypeId === CHECKBOX && (
            <Fragment>
              <p className={clsx("text-center font-semibold", textblue)}>
                {t("businesses.questionsanswers.questionMN")}
              </p>
              <p className={clsx("text-center font-semibold", textblue)}>
                {t("businesses.questionsanswers.questionEN")}
              </p>
              <p className={clsx("text-center font-semibold", textblue)}>
                {t("businesses.questionsanswers.answerType")}
              </p>
            </Fragment>
          )}
          <p className={clsx("text-center font-semibold", textblue)}>
            {t("businesses.questionsanswers.score")}
          </p>
          <p className={clsx("text-center font-semibold", textblue)}>
            {t("businesses.questionsanswers.status")}
          </p>
          {props.options?.map((option, index) => {
            return (
              <Fragment key={index}>
                <p className="text-center">{option.name}</p>
                <p className="text-center">{option.name_en}</p>
                {props.data?.answerTypeId === CHECKBOX && (
                  <Fragment>
                    <p className="text-center">{option.question}</p>
                    <p className="text-center">{option.question_en}</p>
                    <p className="text-center">
                      {
                        [
                          { value: "TEXT", description: "Текст" },
                          { value: "NUMBER", description: "Тоо" },
                        ]?.filter((s) => s.value === option.answerType)[0]
                          ?.description
                      }
                    </p>
                  </Fragment>
                )}
                <p className="text-center">{option.score}</p>
                <p className="text-center">
                  {
                    [
                      { value: "1", description: "Идэвхтэй" },
                      { value: "0", description: "Идэвхгүй" },
                    ]?.filter((s) => s.value === option.status)[0]?.description
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

export const QuestionnaireOptions = (props) => {
  const { system } = useSystemStore();
  const { assessment } = useAssessmentStore();
  const t = useTranslation();
  // Үнэлгээний төлвийг хараад шинэ, эсвэл бөглөж буйгаас бусад төлөвт байвал унших горимд шилжинэ.
  const disabled = ![STATUS_NEW, STATUS_FILLING].includes(assessment?.statusId);

  const radio = (
    options,
    subQuestions,
    handleChangeAnswer,
    answerTypeId,
    handleChangeOptionAnswer,
    questionId
  ) => {
    // Тухайн асуултын хариулт нь state дэх хариулттай таарч байвал түүний options доторх ID утгыг авна.
    const selectedState =
      props.optionAnswer?.questionId === questionId
        ? props.optionAnswer?.options?.[0]?.optionId
        : undefined;

    // Тухайн асуултын хариулт нь баазаас авсан хариултууд дунд байвал түүний ID утгыг авна.
    const selectedSaved = props.savedAnswers?.optionAnswers?.find(
      (a) => a.questionId === questionId
    )?.optionId;

    const selected = selectedState ?? selectedSaved ?? null;

    // Тухайн асуултын хариулт нь state дотор байвал түүний options доторх оноог авна.
    const selectedScoreState =
      props.optionAnswer?.questionId === questionId
        ? props.optionAnswer?.options?.[0]?.score_user
        : undefined;

    // Тухайн асуултын хариулт нь баазаас авсан хариултууд дунд байвал түүний оноог авна.
    const selectedScoreSaved = props.savedAnswers?.optionAnswers?.find(
      (a) => a.questionId === questionId
    )?.score_user;

    // Сонгосон оноо нь асуултын нөхцлөөс их эсэхийг шалгах
    const isCondition =
      (selectedScoreState ?? selectedScoreSaved ?? 0) >= props.data.condition;

    return (
      <Fragment>
        {options?.map((option) => (
          <div className="my-2" key={option.id}>
            <input
              type="radio"
              name={props.data?.id} // Асуултын дугаар
              value={option.id} // Хувилбарын дугаар
              checked={option.id === selected} // Хувилбарын дугаар нь сонгосонтой таарч байвал true байна.
              className="mr-2"
              disabled={disabled} // Үнэлгээний төлөвөөс хамаарч унших горимд шилжих
              onChange={(event) =>
                handleChangeOptionAnswer(
                  event,
                  null,
                  null,
                  answerTypeId,
                  props.data.id,
                  props.data,
                  option
                )
              }
            />
            {system.language === "mn"
              ? option.name
              : (option.name_en ?? option.name)}
          </div>
        ))}

        {/* Асуултын нэмэлт асуултууд (хэрэглэгчийн хариулт шаардлагыг хангавал харагдана) */}
        {isCondition && (
          <div className="mt-5">
            {subQuestions?.map((question) => {
              // Тухайн асуултын нэмэлт асуултын хариулт нь state-д байгаа эсэхийг шалгаад, байвал тэр хариултыг авна.
              const stateDesc = props.answer?.descriptions?.find(
                (d) =>
                  d.subQuestionId === question.id &&
                  d.subQuestionId === question.id
              )?.description;

              // Тухайн асуултын нэмэлт асуултын хариулт нь DB-д байгаа эсэхийг шалгаад, байвал тэр хариултыг авна.
              const savedDesc = props.savedAnswers?.answers?.find(
                (a) =>
                  a.questionId === props.data.id &&
                  a.subQuestionId === question.id
              )?.description;

              return (
                <div className="my-2" key={question.id}>
                  <CustomInput
                    type="text"
                    label={
                      system.language === "mn"
                        ? question.name
                        : (question.name_en ?? question.name)
                    }
                    name={question.id}
                    value={stateDesc ?? savedDesc ?? ""}
                    className="mr-2"
                    handleChangeValue={handleChangeAnswer}
                    answerTypeId={answerTypeId}
                    questionId={props.data.id}
                    readOnly={disabled} // Үнэлгээний төлөвөөс хамаарч унших горимд шилжих
                  />
                </div>
              );
            })}
          </div>
        )}
      </Fragment>
    );
  };

  const checkbox = (
    options,
    subQuestions,
    handleChangeAnswer,
    answerTypeId,
    handleChangeOptionAnswer,
    questionId
  ) => {
    // Тухайн асуултын хариулт нь state-д байвал state дэх options-ийн id утгуудаар Set үүсгэж байна.
    const stateSet = useMemo(() => {
      return new Set(
        (props.optionAnswer?.questionId === questionId
          ? (props.optionAnswer?.options ?? [])
          : []
        ).map((o) => o.optionId)
      );
    }, [
      props.optionAnswer?.questionId,
      props.optionAnswer?.options,
      questionId,
    ]);

    // Тухайн асуултын хариулт нь өгөгдлийн санд байвал түүний options-ийн optionId утгуудаар Set үүсгэж байна.
    const savedSet = useMemo(() => {
      return new Set(
        (props.savedAnswers?.optionAnswers ?? [])
          .filter((a) => a.questionId === questionId)
          .map((a) => a.optionId)
      );
    }, [props.savedAnswers?.optionAnswers, questionId]);

    // Хэрэглэгч тухайн хариултын state-тай харьцсан эсэхийг шалгах
    const touched = props.optionAnswer?.questionId === questionId;
    // console.log("CHECKBOX: ", stateSet, savedSet, touched);

    // Хэрэглэгч state-тэй харьцсан бол stateSet-д тухайн id байгаа эсэх, харьцаагүй бол savedSet-д тухайн id байгаа эсэхийг шалгаж байна.
    const isChecked = (id) => (touched ? stateSet.has(id) : savedSet.has(id));

    // Тухайн хувилбарын Id-аар асуултын хариултыг хайх
    const descriptionValue = (optionId) => {
      // Тухайн хувилбар нь state-д байвал түүнээс асуултын хариултыг авах
      const stateDesc = props.optionAnswer?.options?.find(
        (a) => a.optionId === optionId
      )?.description;

      // Тухайн хувилбар нь өгөгдлийн санд байвал түүнээс асуултын хариултыг авах
      // Өгөгдлийн сангаас хариулт ирсэн эсэхийг шалгана
      // Өгөгдлийн сангаас ирсэн хариултын асуулт нь таарч буй эсэх
      // Хувилбарын Id нь таарч буй эсэх
      const savedDesc = (props.savedAnswers?.optionAnswers ?? []).find(
        (a) => a.questionId === questionId && a.optionId === optionId
      )?.description;

      // console.log("DESC: ", stateDesc, savedDesc);
      return stateDesc ?? savedDesc ?? "";
    };

    return (
      <Fragment>
        {options?.map((option) => {
          // Тухайн хариултын хувилбар чек хийгдсэн эсэхийг шалгаж байна
          const checked = isChecked(option.id);

          // console.log("TEXT: ", disabled, !checked);
          return (
            <div className={clsx("my-2")} key={option.id}>
              <div className="flex justify-between items-center">
                <div
                  className={clsx(
                    lodash.isEmpty(option.question) ? "flex-1" : "flex-1/2"
                  )}
                >
                  <input
                    type="checkbox"
                    name={option.id}
                    value={option.score}
                    checked={checked} // Шалгалтын үр дүн
                    className="mr-2"
                    disabled={disabled} // Үнэлгээний төлөвөөс хамаарч унших горимд шилжих
                    onChange={(event) =>
                      handleChangeOptionAnswer(
                        event,
                        null,
                        "check",
                        answerTypeId,
                        props.data.id,
                        props.data,
                        option
                      )
                    }
                  />
                  {system.language === "mn"
                    ? option.name
                    : (option.name_en ?? option.name)}
                </div>

                {!lodash.isEmpty(option.question) && (
                  <div className="mt-3 flex-1/2">
                    <CustomInput
                      type="text"
                      label={
                        system.language === "mn"
                          ? option.question
                          : (option.question_en ?? option.question)
                      }
                      name={option.id}
                      value={descriptionValue(option.id)}
                      className="mr-2"
                      handleChangeValue={handleChangeOptionAnswer}
                      answerTypeId={answerTypeId}
                      questionId={props.data.id}
                      action="description"
                      question={props.data}
                      option={option}
                      readOnly={disabled === true ? disabled : !checked} // Үнэлгээний төлөвөөс хамаарч унших горимд шилжих
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Нэмэлт дэд асуултууд (checkbox-д шууд харуулна) */}
        <div className="mt-5">
          {subQuestions?.map((question) => {
            // Тухайн дэд асуултын хариулт нь State-д байвал хариултыг авна
            const stateDesc = props.answer?.descriptions?.find(
              (d) => d.id === question.id && d.subQuestionId === question.id
            )?.description;

            // Тухайн дэд асуултын хариулт нь Өгөгдлийн санд байвал хариултыг авна
            const savedDesc = props.savedAnswers?.answers?.find(
              (a) =>
                a.questionId === props.data.id &&
                a.subQuestionId === question.id
            )?.description;

            return (
              <div className="my-2" key={question.id}>
                <CustomInput
                  type="text"
                  label={
                    system.language === "mn"
                      ? question.name
                      : (question.name_en ?? question.name)
                  }
                  name={question.id}
                  value={stateDesc ?? savedDesc ?? ""}
                  className="mr-2"
                  readOnly={disabled} // Үнэлгээний төлөвөөс хамаарч унших горимд шилжих
                  handleChangeValue={handleChangeAnswer}
                  answerTypeId={answerTypeId}
                  questionId={props.data.id}
                />
              </div>
            );
          })}
        </div>
      </Fragment>
    );
  };

  const text = (handleChangeAnswer, answerTypeId) => {
    return (
      <div className="my-2">
        <CustomInput
          type="text"
          label={null} // Асуулт нь өөрөө label болох тул хоосон оруулав.
          name={null}
          value={
            props.answer?.descriptions[0]?.description ??
            props.savedAnswers?.answers?.find(
              (a) => a.questionId === props.data.id
            )?.description ??
            ""
          }
          className="mr-2"
          handleChangeValue={handleChangeAnswer}
          index={undefined} // Энэ утга хоосон дамжих ёстой.
          answerTypeId={answerTypeId}
          questionId={props.data.id}
          readOnly={disabled} // Үнэлгээний төлөвөөс хамаарч унших горимд шилжих
        />
      </div>
    );
  };

  return (
    <div className="ml-3 mt-3">
      {props.data?.answerTypeId === TEXT &&
        text(props.handleChangeAnswer, props.data?.answerTypeId)}
      {props.data?.answerTypeId === RADIO &&
        radio(
          props.options,
          props.subQuestions,
          props.handleChangeAnswer,
          props.data?.answerTypeId,
          props.handleChangeOptionAnswer,
          props.data?.id
        )}
      {props.data?.answerTypeId === CHECKBOX &&
        checkbox(
          props.options,
          props.subQuestions,
          props.handleChangeAnswer,
          props.data?.answerTypeId,
          props.handleChangeOptionAnswer,
          props.data?.id
        )}
      {props.attachment?.value !== "0" && (
        <CustomInput
          name={props.data.id}
          type="file"
          label={t("assessment.Attachment")}
          multiple={true}
        />
      )}
    </div>
  );
};
