"use client";

import clsx from "clsx";
import React from "react";

import { useTranslation } from "@/hooks/useTranslation";
import {
  CHECKBOX,
  RADIO,
  STATUS_DONE,
  STATUS_VERIFIED,
  textblue,
} from "@/libs/constants";
import { useSystemStore } from "@/stores/storeSystem";
import { SolidButton } from "../MyButton";
import { VerificationOptions } from "./options";
import { DataEditorBySlug } from "@/functions/Data";
import { MyStatus } from "../MyText";
import { useVerificationStore } from "@/stores/storeVerification";

const Questions = (props) => {
  const { system } = useSystemStore();
  const { verification } = useVerificationStore();
  const disabled = [STATUS_VERIFIED, STATUS_DONE].includes(
    verification?.statusId
  );
  const t = useTranslation();
  const questions =
    props.questions?.reduce((c, el) => c + (el.count ?? 0), 0) ?? 0;
  const verifications =
    props.verificationCount?.reduce((c, el) => c + (el.count ?? 0), 0) ?? 0;

  const handleChangeAnswer = async (event, questionId) => {
    // Өөр асуулт руу чиглэсэн бол баталгаажуулагчийн өмнөх утгуудыг өгөгдлийн сан руу хадгална.
    if (
      props.answer?.questionId !== questionId &&
      props.optionAnswer?.options?.length > 0
    ) {
      await DataEditorBySlug("/verify", {
        answer: props.answer,
        optionAnswer: props.optionAnswer,
      });

      props.setOptionAnswer({
        organizationId: verification?.organizationId,
        yearId: verification?.yearId,
        assessmentId: verification?.assessmentId,
        moduleId: props.module?.id,
        verifierId: props.user?.id,
        options: [],
      });

      props.setAnswer({
        organizationId: verification?.organizationId,
        yearId: verification?.yearId,
        assessmentId: verification?.assessmentId,
        moduleId: props.module?.id,
        verifierId: props.user?.id,
        comment: null,
      });

      props.getData();
    }

    // Comment өөрчлөх үед optionAnswer-ийн хувилбар хоосон бол түүнийг дүүргэнэ.
    // Энэ үйлдэл нь баталгаажуулагч комментоо өөрчлөх үед ажиллана.
    props.optionAnswer?.options?.length === 0 &&
      props.optionAnswer?.questionId !== questionId &&
      props.setOptionAnswer((prev) => {
        const options = props.savedOrganizationAnswers?.optionAnswers
          ?.filter((a) => a.questionId === questionId)
          .map((a) => ({
            id: a.id,
            score_verify: a.score_verify ?? 0,
          }));

        return {
          ...prev,
          options,
        };
      });

    // Баталгаажуулагчийн коммент өөрчлөх үед өөрчлөлтийг хадгална.
    props.setAnswer((prev) => {
      // Өгөгдлийн сангаас тухайн асуултын хариултуудыг авч байна.
      const saved = (props.savedOrganizationAnswers?.answers ?? [])
        .filter((a) => a.questionId === questionId)
        .map((a) => ({
          id: a.id,
        }));

      return {
        ...prev,
        id: saved[0]?.id,
        questionId,
        comment: event.target.value ?? null,
      };
    });
  };

  const handleChangeOptionAnswer = async (event, questionId, answerTypeId) => {
    // Өөр асуулт руу чиглэсэн бол баталгаажуулагчийн өмнөх утгуудыг өгөгдлийн сан руу хадгална.
    if (
      props.optionAnswer?.questionId !== questionId &&
      props.optionAnswer?.options?.length > 0
    ) {
      await DataEditorBySlug("/verify", {
        answer: props.answer,
        optionAnswer: props.optionAnswer,
      });

      props.setOptionAnswer({
        organizationId: verification?.organizationId,
        yearId: verification?.yearId,
        assessmentId: verification?.assessmentId,
        moduleId: props.module?.id,
        verifierId: props.user?.id,
        options: [],
      });

      props.setAnswer({
        organizationId: verification?.organizationId,
        yearId: verification?.yearId,
        assessmentId: verification?.assessmentId,
        moduleId: props.module?.id,
        verifierId: props.user?.id,
        comment: null,
      });

      props.getData();
    }

    // Баталгаажуулагч үнэлгээг өөрчлөх үед асуултын дугаарыг state-д хадгална.
    props.setAnswer((prev) => {
      return {
        ...prev,
        questionId,
      };
    });

    // Баталгаажуулагчийн үнэлгээг state-д хадгалах
    if (answerTypeId === RADIO) {
      props.setOptionAnswer((prev) => {
        // Өгөгдлийн сангаас тухайн асуултын хариултуудыг авч байна.
        const options = (props.savedOrganizationAnswers?.optionAnswers ?? [])
          .filter((a) => a.questionId === questionId)
          .map((a) => ({
            id: a.id,
            score_verify: event.target.value ?? 0,
          }));

        return {
          ...prev,
          questionId,
          options,
        };
      });
    } else if (answerTypeId === CHECKBOX) {
      props.setOptionAnswer((prev) => {
        const optionId = event.target.name;
        const changedScore = event.target.value;
        const isChecked = event.target.checked;

        // State дахь options-н утгыг авах
        const existing = Array.isArray(prev.options) ? prev.options : [];
        // Өгөгдлийн сан дахь options-н утгыг авах
        const savedList = (props.savedOrganizationAnswers?.optionAnswers ?? [])
          .filter((a) => a.questionId === questionId)
          .map((a) => ({
            id: a.id,
            optionId: a.optionId,
            score_verify: a.score_verify ?? 0,
          }));

        // State хоосон бол өгөгдлийн сан дахь хариултуудыг авна.
        let options = existing.length === 0 ? savedList : existing;

        // Өөрчлөлт орж буй хувилбар нь бааз дээр хадгалсан эсэхийг шалгахын тулд index авна.
        const index = options?.findIndex((a) => a.optionId === optionId);

        // Баазад хадгалаагүй, нэмж чек хийж байвал
        if (index === -1 && isChecked) {
          options = [
            ...options,
            {
              optionId,
              score_verify: Number(changedScore),
            },
          ];
        }
        // Баазад хадгалсан, чекийг арилгаж байвал
        else if (index !== -1 && !isChecked) {
          options = options.filter((_, i) => i !== index);
        }

        return {
          ...prev,
          questionId,
          options,
        };
      });
    }
  };

  return (
    <form
      method="POST"
      className="border-[1px] border-gray-400/20 rounded-2xl p-6 text-sm"
      onSubmit={(e) => e.preventDefault()}
    >
      {props.datas[3]
        ?.filter((qt) => qt.moduleId === props.module?.id)
        ?.map((qt, index) => {
          // Асуултын төрлийг хэвлэж байна
          return (
            <div key={index}>
              <p className="py-2 my-2 font-semibold text-center bg-blue-800 text-white rounded-xl">
                {qt.name}
              </p>
              {props.datas[1]
                ?.filter(
                  (d) =>
                    d.moduleId === props.module?.id &&
                    d.questionTypeId === qt.id
                )
                ?.map((data, index) => {
                  // Асуултуудыг хэвлэж байна
                  return (
                    <div key={index} className="mb-10">
                      <p className={clsx(textblue)}>
                        {t("assessment.Question")} {index + 1}.
                      </p>
                      <p className={clsx(textblue, "font-semibold")}>
                        {system.language === "mn" ? data.name : data.name_en}
                      </p>
                      <VerificationOptions
                        data={data} // Асуулт
                        options={props.datas[2]?.filter(
                          (o) => o.questionId === data.id
                        )} // Тухайн асуултад хамаарах хариултын хувилбаруудыг сонгох
                        subQuestions={props.datas[4]?.filter(
                          (sq) => sq.questionId === data.id
                        )} // Тухайн асуултад хамаарах дэд асуултуудыг сонгох
                        handleChangeAnswer={handleChangeAnswer}
                        handleChangeOptionAnswer={handleChangeOptionAnswer}
                        answer={props.answer}
                        optionAnswer={props.optionAnswer}
                        disabled={disabled}
                        savedOrganizationAnswers={
                          props.savedOrganizationAnswers
                        }
                      />
                    </div>
                  );
                })}
            </div>
          );
        })}
      <div className="flex justify-center items-center mb-5 mt-10">
        {disabled ? (
          <MyStatus
            label="Баталгаажуулсан эсвэл дууссан төлөвт байгаа тул асуулгыг өөрчлөх боломжгүй."
            color="blue"
          />
        ) : (
          <div className="flex justify-center items-center gap-2">
            {props.length > 0 && (
              <SolidButton
                color="green"
                size="small"
                label={t("action.Save")}
                onClick={props.handleSubmit}
                type="button"
                action="verification"
              />
            )}

            {verifications !== questions && props.length === 0 && (
              <SolidButton
                color="blue"
                size="small"
                label={t("action.SaveAllSend")}
                onClick={props.handleFinish}
                type="button"
                action="verification"
              />
            )}

            {verifications === questions && props.length === 0 && (
              <SolidButton
                color="red"
                size="small"
                label={t("action.Send")}
                onClick={props.handleFinish}
                type="button"
                action="verification"
              />
            )}
          </div>
        )}
      </div>
    </form>
  );
};

export default Questions;
