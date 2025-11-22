"use client";

import clsx from "clsx";
import React, { Fragment, useMemo } from "react";
import lodash from "lodash";

import { useTranslation } from "@/hooks/useTranslation";
import {
  CHECKBOX,
  RADIO,
  STATUS_FILLING,
  STATUS_NEW,
  TEXT,
  VERIFIER,
} from "@/libs/constants";
import { CustomInput } from "../MyInput";
import { useSystemStore } from "@/stores/storeSystem";
import { useAssessmentStore } from "@/stores/storeAssessment";
import { useUserStore } from "@/stores/storeUser";

export const VerificationOptions = (props) => {
  const { system } = useSystemStore();
  const { assessment } = useAssessmentStore();
  const { user } = useUserStore();
  const t = useTranslation();
  const questionId = props.data?.id;
  const answerTypeId = props.data?.answerTypeId;
  // Үнэлгээний төлвийг хараад шинэ, эсвэл бөглөж буйгаас бусад төлөвт байвал унших горимд шилжинэ.
  const disabled = ![STATUS_NEW, STATUS_FILLING].includes(assessment?.status);
  // console.log(
  //   "O: ",
  //   props.savedOrganizationAnswers?.optionAnswers.filter(
  //     (o) => o.questionId === "690431e2b985c575e33967d6"
  //   )
  // );

  // Тухайн асуултын хариулт нь өгөгдлийн санд байвал түүний options-ийн optionId утгуудаар Set үүсгэж байна.
  // Checkbox функцэд ашиглагдана.
  const savedSet = useMemo(() => {
    return new Set(
      (props.savedOrganizationAnswers?.optionAnswers ?? [])
        .filter((a) => a.questionId === questionId && Number(a.score_user) > 0)
        .map((a) => a.optionId)
    );
  }, [props.savedOrganizationAnswers?.optionAnswers, questionId]);

  // Тухайн асуултад баталгаажуулагчийн state дэх оноог авах
  // Checkbox функцэд ашиглагдана.
  const verifyStateSet = useMemo(() => {
    return new Set(
      (props.optionAnswer?.questionId === questionId
        ? (props.optionAnswer?.options ?? [])
        : []
      )
        ?.filter((o) => o.score_verify > 0)
        ?.map((o) => o.optionId)
    );
  }, [props.optionAnswer?.questionId, props.optionAnswer?.options, questionId]);

  // Тухайн асуултын хариулт нь баазаас авсан хариултууд дунд байвал түүний оноог авна.
  // Checkbox функцэд ашиглагдана.
  const verifySavedSet = useMemo(() => {
    return new Set(
      (props.savedOrganizationAnswers?.optionAnswers ?? [])
        .filter(
          (a) => a.questionId === questionId && Number(a.score_verify) > 0
        )
        .map((a) => a.optionId)
    );
  }, [props.savedOrganizationAnswers?.optionAnswers, questionId]);

  const radio = () => {
    // ------------------
    // Байгууллагын хэсэг
    // ------------------

    // Тухайн асуултын хариулт нь баазаас авсан хариултууд дунд байвал түүний ID утгыг авна.
    // Байгууллагын хариуг харуулахад ашиглана.
    const selectedSaved = props.savedOrganizationAnswers?.optionAnswers?.find(
      (a) => a.questionId === questionId
    )?.optionId;
    const selected = selectedSaved ?? null;

    // Тухайн асуултын хариулт нь баазаас авсан хариултууд дунд байвал түүний оноог авна.
    // Нэмэлт асуултыг харуулахад ашиглана.
    const selectedScoreSaved =
      props.savedOrganizationAnswers?.optionAnswers?.find(
        (a) => a.questionId === questionId
      )?.score_user;

    // Сонгосон оноо нь асуултын нөхцлөөс их эсэхийг шалгах
    const isCondition = (selectedScoreSaved ?? 0) >= props.data.condition;

    // ------------------------
    // Баталгаажуулагчийн хэсэг
    // ------------------------

    // Тухайн асуултад баталгаажуулагчийн state дэх оноог авах
    const verifyStateScore =
      props.optionAnswer?.questionId === questionId
        ? Number(props.optionAnswer?.options[0]?.score_verify)
        : undefined;

    // Тухайн асуултын хариулт нь баазаас авсан хариултууд дунд байвал түүний оноог авна.
    const verifySavedScore =
      props.savedOrganizationAnswers?.optionAnswers?.find(
        (a) => a.questionId === questionId
      )?.score_verify;

    const selectedScore = verifyStateScore ?? verifySavedScore ?? 0;

    // Тухайн асуултын state дэх баталгаажуулагчийн мэдэгдэл
    const stateComment =
      props.answer?.questionId === questionId
        ? props.answer?.comment
        : undefined;

    // Тухайн асуултын өгөгдлийн сан дахь баталгаажуулагчийн мэдэгдэл
    const savedComment = props.savedOrganizationAnswers?.answers?.find(
      (a) => a.questionId === questionId
    )?.comment;

    const comment = stateComment ?? savedComment ?? null;

    return (
      <Fragment>
        <table cellPadding={5} cellSpacing={0} className="w-full">
          <thead>
            <tr className="font-semibold text-gray-500 h-10">
              <td align="center">{t("verification.verifierScore")}</td>
              <td align="center">{t("verification.organizationScore")}</td>
              <td align="center">{t("verification.answerOption")}</td>
            </tr>
          </thead>
          <tbody>
            {props.options?.map((option) => (
              <tr key={option.id} className="h-7">
                <td align="center" className="w-2/12">
                  {/* Баталгаажуулагчийн хариулт */}
                  <input
                    type="radio"
                    name={questionId} // Асуултын дугаар
                    value={option.score} // Хувилбарын оноо
                    checked={option.score === selectedScore} // Хувилбарын оноо нь сонгосонтой таарч байвал true байна.
                    disabled={props.disabled} // Үнэлгээний төлөвөөс хамаарч унших горимд шилжих
                    onChange={(event) => {
                      props.handleChangeOptionAnswer(
                        event,
                        questionId,
                        answerTypeId
                      );
                    }} // React-ийн алдааг арилгах зорилгоор хийсэн өөрчлөлт
                  />
                  <span className="ml-3">
                    {user?.role === VERIFIER && option.score}
                  </span>
                </td>
                <td align="center" className="w-2/12">
                  {/* Байгууллагын хариулт */}
                  <input
                    type="radio"
                    checked={option.id === selected} // Хувилбарын дугаар нь сонгосонтой таарч байвал true байна.
                    disabled={disabled} // Үнэлгээний төлөвөөс хамаарч унших горимд шилжих
                  />
                </td>
                <td align="justify">
                  {system.language === "mn"
                    ? option.name
                    : (option.name_en ?? option.name)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Асуултын нэмэлт асуултууд (хэрэглэгчийн хариулт шаардлагыг хангавал харагдана) */}
        {isCondition && (
          <div className="mt-5">
            {props.subQuestions?.map((question) => {
              // Тухайн асуултын нэмэлт асуултын хариулт нь DB-д байгаа эсэхийг шалгаад, байвал тэр хариултыг авна.
              const savedDesc = props.savedOrganizationAnswers?.answers?.find(
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
                    value={savedDesc ?? ""}
                    readOnly={disabled} // Үнэлгээний төлөвөөс хамаарч унших горимд шилжих
                  />
                </div>
              );
            })}
          </div>
        )}

        {selectedScore !== selectedScoreSaved && (
          <CustomInput
            type="text"
            label={t("verification.comment")}
            name="comment"
            value={comment}
            handleChangeValue={(event) => {
              props.handleChangeAnswer(event, questionId);
            }}
            readOnly={props.disabled} // Үнэлгээний төлөвөөс хамаарч унших горимд шилжих
          />
        )}
      </Fragment>
    );
  };

  const checkbox = () => {
    // ------------------
    // Байгууллагын хэсэг
    // ------------------

    // savedSet функцийг үндсэн хэсгээс энд ашиглана.

    // Хэрэглэгч state-тэй харьцсан бол stateSet-д тухайн id байгаа эсэх, харьцаагүй бол savedSet-д тухайн id байгаа эсэхийг шалгаж байна.
    const isChecked = (id) => savedSet.has(id);

    // Тухайн хувилбарын Id-аар асуултын хариултыг хайх
    const descriptionValue = (optionId) => {
      // Тухайн хувилбар нь өгөгдлийн санд байвал түүнээс асуултын хариултыг авах
      // Өгөгдлийн сангаас хариулт ирсэн эсэхийг шалгана
      // Өгөгдлийн сангаас ирсэн хариултын асуулт нь таарч буй эсэх
      // Хувилбарын Id нь таарч буй эсэх
      const savedDesc = (
        props.savedOrganizationAnswers?.optionAnswers ?? []
      ).find(
        (a) => a.questionId === questionId && a.optionId === optionId
      )?.description;

      // console.log("DESC: ", stateDesc, savedDesc);
      return savedDesc ?? "";
    };

    // ------------------------
    // Баталгаажуулагчийн хэсэг
    // ------------------------

    // verifyStateSet функцийг үндсэн хэсгээс энд ашиглана.
    // verifySavedSet функцийг үндсэн хэсгээс энд ашиглана.

    // Баталгаажуулагч тухайн асуултад хүрсэн эсэх
    const touched = props.optionAnswer?.questionId === questionId;
    const verifiedQuestion = !!props.savedOrganizationAnswers?.answers?.find(
      (a) => a.questionId === questionId
    )?.verifierId;
    const showComment = touched || verifiedQuestion;

    const isVerified = (id) =>
      touched ? verifyStateSet.has(id) : verifySavedSet.has(id);

    // Тухайн асуултын state дэх баталгаажуулагчийн мэдэгдэл
    const stateComment =
      props.answer?.questionId === questionId
        ? props.answer?.comment
        : undefined;

    // Тухайн асуултын өгөгдлийн сан дахь баталгаажуулагчийн мэдэгдэл
    const savedComment = props.savedOrganizationAnswers?.answers?.find(
      (a) => a.questionId === questionId
    )?.comment;

    const comment = stateComment ?? savedComment ?? null;

    return (
      <Fragment>
        <table cellPadding={5} cellSpacing={0} className="w-full">
          <thead>
            <tr className="font-semibold text-gray-500 h-10">
              <td align="center">{t("verification.verifierScore")}</td>
              <td align="center">{t("verification.organizationScore")}</td>
              <td align="center">{t("verification.answerOption")}</td>
            </tr>
          </thead>
          <tbody>
            <tr className="h-7">
              <td align="justify"></td>
            </tr>
            {props.options?.map((option) => {
              // Тухайн байгууллагын хариултын хувилбар чек хийгдсэн эсэхийг шалгаж байна
              const checked = isChecked(option.id);
              // Тухайн баталгаажуулагчийн хариултын хувилбар чек хийгдсэн эсэхийг шалгаж байна.
              const verified = isVerified(option.id);

              // console.log("TEXT: ", disabled, !checked);
              return (
                <tr className={clsx("my-2 h-10")} key={option.id}>
                  {/* Баталгаажуулагчийн онооны багана */}
                  <td align="center" className="w-2/12">
                    <input
                      type="checkbox"
                      name={option.id}
                      value={option.score}
                      checked={verified} // Шалгалтын үр дүн
                      disabled={props.disabled} // Үнэлгээний төлөвөөс хамаарч унших горимд шилжих
                      onChange={(event) => {
                        props.handleChangeOptionAnswer(
                          event,
                          questionId,
                          answerTypeId
                        );
                      }}
                    />
                    <span className="ml-3">
                      {user?.role === VERIFIER && option.score}
                    </span>
                  </td>
                  {/* Байгууллагын бөглөсөн онооны багана */}
                  <td align="center" className="w-2/12">
                    <input
                      type="checkbox"
                      checked={checked} // Шалгалтын үр дүн
                      disabled={disabled} // Үнэлгээний төлөвөөс хамаарч унших горимд шилжих
                    />
                  </td>
                  <td className="flex justify-between items-center">
                    <div
                      className={clsx(
                        lodash.isEmpty(option.question) ? "flex-1" : "flex-1/2"
                      )}
                    >
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
                          value={descriptionValue(option.id)}
                          readOnly={disabled === true ? disabled : !checked} // Үнэлгээний төлөвөөс хамаарч унших горимд шилжих
                        />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Нэмэлт дэд асуултууд (checkbox-д шууд харуулна) */}
        <div className="mt-5">
          {props.subQuestions?.map((question) => {
            // Тухайн дэд асуултын хариулт нь Өгөгдлийн санд байвал хариултыг авна
            const savedDesc = props.savedOrganizationAnswers?.answers?.find(
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
                  value={savedDesc ?? ""}
                  readOnly={disabled} // Үнэлгээний төлөвөөс хамаарч унших горимд шилжих
                />
              </div>
            );
          })}
        </div>

        {/* Баталгаажуулагчийн өгсөн тэмдэглэл */}
        {showComment && (
          <CustomInput
            type="text"
            label={t("verification.comment")}
            name="comment"
            value={comment}
            handleChangeValue={(event) => {
              props.handleChangeAnswer(event, questionId);
            }}
            readOnly={props.disabled} // Үнэлгээний төлөвөөс хамаарч унших горимд шилжих
          />
        )}
      </Fragment>
    );
  };

  const text = () => {
    return (
      <div className="my-2">
        <CustomInput
          type="text"
          value={
            props.savedOrganizationAnswers?.answers?.find(
              (a) => a.questionId === props.data.id
            )?.description ?? ""
          }
          readOnly={disabled} // Үнэлгээний төлөвөөс хамаарч унших горимд шилжих
        />
      </div>
    );
  };

  return (
    <div className="ml-3 mt-3">
      {answerTypeId === TEXT && text()}
      {answerTypeId === RADIO && radio()}
      {answerTypeId === CHECKBOX && checkbox()}
    </div>
  );
};
