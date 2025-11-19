"use client";

import clsx from "clsx";
import React from "react";
import lodash from "lodash";

import { useTranslation } from "@/hooks/useTranslation";
import { CHECKBOX, RADIO, STATUS_SENT, TEXT, textblue } from "@/libs/constants";
import { useSystemStore } from "@/stores/storeSystem";
import { SolidButton } from "../MyButton";
import { useUserStore } from "@/stores/storeUser";
import { useAssessmentStore } from "@/stores/storeAssessment";
import { QuestionnaireOptions } from "./options";
import { DataEditorBySlug, DataRegister } from "@/functions/Data";
import { MyStatus } from "../MyText";
import { CustomInput } from "../MyInput";

const Questions = (props) => {
  const { system } = useSystemStore();
  const { user } = useUserStore();
  const { assessment } = useAssessmentStore();
  const disabled = [STATUS_SENT].includes(assessment?.statusId);
  const t = useTranslation();
  // console.log(disabled);

  // Нийт хариултын тоог гаргах
  const answers =
    props.answerCount?.reduce((c, el) => c + (el.count ?? 0), 0) ?? 0;

  // Нийт асуултын тоог гаргах
  const questions =
    props.questions?.reduce((c, el) => c + (el.count ?? 0), 0) ?? 0;

  const handleChangeAnswer = async (
    event,
    index = undefined, // Ямар утга өөрчилж байгааг тодорхойлно. Questionsanswers
    action = undefined, // Юуны утга өөрчилж байгааг тодорхойлно. Questionsanswers
    answerTypeId,
    questionId
  ) => {
    // Асуулт нь өөр бол шууд бааз руу хадгалалт хийгээд state-ийг суллах
    if (
      !lodash.isEmpty(props.answer.questionId) &&
      props.answer.questionId !== questionId
    ) {
      // Асуулт нь өөр бол шууд бааз руу хадгалалт хийгээд state-ийг суллах
      const savedAnswers1 = props.savedAnswers?.answers
        ?.filter((a) => a.questionId === props.answer?.questionId)
        ?.map((a) => a.id);

      // Өмнө хариулагдсан хувилбар байгаа эсэхийг шалгаж байна.
      const savedOptionAnswers = props.savedAnswers?.optionAnswers
        ?.filter((a) => a.questionId === props.optionAnswer?.questionId)
        ?.map((a) => a.id);

      // Хариулагдаж байсан бол хариултыг өөрчилнө, хариулагдаж байгаагүй бол хариултыг бүртгэнэ.
      savedOptionAnswers.length > 0 || savedAnswers1.length > 0
        ? await DataEditorBySlug("/answers", {
            answer: props.answer,
            optionAnswer: props.optionAnswer,
          })
        : await DataRegister("/answers", {
            answer: props.answer,
            optionAnswer: props.optionAnswer,
          });

      // Хариултын хувилбарыг цэвэрлэнэ.
      props.setOptionAnswer({
        organizationId: user?.organizationId,
        yearId: system?.yearId,
        assessmentId: assessment?.assessmentId,
        moduleId: props.module?.id,
        userId: user?.id,
        questionId: null,
        answerTypeId: null,
        verifyId: null,
        options: [],
      });

      // Хариултыг цэвэрлэнэ.
      props.setAnswer({
        organizationId: user?.organizationId,
        yearId: system?.yearId,
        assessmentId: assessment?.assessmentId,
        moduleId: props.module?.id,
        userId: user?.id,
        questionId: null,
        answerTypeId: null,
        descriptions: [],
      });

      // Хариултуудыг өгөгдлийн сангаас дахин авах
      props.getData();
    }

    props.setAnswer((prev) => {
      // prev.descriptions нь массив мөн эсэхийг шалгана.
      const stateDesc = Array.isArray(prev.descriptions)
        ? prev.descriptions
        : [];

      // Өгөгдлийн сангаас тухайн асуултын хариултуудыг авч байна.
      const savedDesc = (props.savedAnswers?.answers ?? [])
        .filter((a) => a.questionId === questionId)
        .map((a) => ({
          id: a.id,
          subQuestionId: a.subQuestionId ?? null,
          description: a.description ?? null,
        }));

      // Баазаас хариулт ирсэн эсэхийг шалгана.
      const base = stateDesc.length === 0 ? savedDesc : stateDesc;
      // console.log("BASE: ", base, stateDesc, savedDesc);

      let updatedDescriptions;

      if (answerTypeId === TEXT) {
        updatedDescriptions = [
          {
            id: savedDesc[0]?.id,
            description: event.target.value,
          },
        ];
      } else if (answerTypeId === RADIO) {
        const index = base.findIndex(
          (e) => e.subQuestionId === event.target.name
        );
        // console.log("INDEX: ", index);

        if (index !== -1) {
          // index олдсон бол өөрчилнө.
          updatedDescriptions = [...base];
          // console.log("UPDATED_DESC1: ", updatedDescriptions);
          updatedDescriptions[index] = {
            ...updatedDescriptions[index],
            description: event.target.value,
          };
        } else {
          // index олдоогүй бол шинээр нэмнэ.
          // console.log("BASE: ", base);
          updatedDescriptions = [
            ...base,
            {
              subQuestionId: event.target.name,
              description: event.target.value,
            },
          ];
        }
      } else if (answerTypeId === CHECKBOX) {
        const index = base.findIndex(
          (e) => e.subQuestionId === event.target.name
        );
        // console.log("INDEX: ", index);

        if (index !== -1) {
          // index олдсон бол өөрчилнө.
          updatedDescriptions = [...base];
          // console.log("UPDATED_DESC1: ", updatedDescriptions);
          updatedDescriptions[index] = {
            ...updatedDescriptions[index],
            description: event.target.value,
          };
        } else {
          // index олдоогүй бол шинээр нэмнэ.
          updatedDescriptions = [
            ...base,
            {
              subQuestionId: event.target.name,
              description: event.target.value,
            },
          ];
        }
      }

      // console.log("UPDATED_DESC2: ", updatedDescriptions);
      return {
        ...prev,
        questionId,
        answerTypeId,
        descriptions: updatedDescriptions,
      };
    });

    props.setOptionAnswer((prev) => {
      // let options;

      if (prev.options?.length === 0) {
        const options = props.savedAnswers?.optionAnswers?.filter(
          (a) => a.questionId === questionId
        );

        return {
          ...prev,
          answerTypeId,
          questionId,
          options,
        };
      } else {
        return {
          ...prev,
          answerTypeId,
          questionId,
        };
      }
    });
  };

  const handleChangeOptionAnswer = async (
    event,
    index = undefined, // Ямар утга өөрчилж байгааг тодорхойлно. Questionsanswers
    action = undefined, // Юуны утга өөрчилж байгааг тодорхойлно. Questionsanswers
    answerTypeId,
    questionId,
    question,
    option
  ) => {
    // Асуулт нь өөр бол шууд бааз руу хадгалалт хийгээд state-ийг суллах
    if (
      !lodash.isEmpty(props.optionAnswer.questionId) &&
      props.optionAnswer.questionId !== questionId
    ) {
      // Өмнө нь хариулагдсан эсэхийг шалгаж байна.
      const savedAnswers1 = props.savedAnswers?.answers
        ?.filter((a) => a.questionId === props.answer?.questionId)
        ?.map((a) => a.id);

      // Өмнө хариулагдсан хувилбар байгаа эсэхийг шалгаж байна.
      const savedOptionAnswers = props.savedAnswers?.optionAnswers
        ?.filter((a) => a.questionId === props.optionAnswer?.questionId)
        ?.map((a) => a.id);

      // Хариулагдаж байсан бол хариултыг өөрчилнө, хариулагдаж байгаагүй бол хариултыг бүртгэнэ.
      savedOptionAnswers.length > 0 || savedAnswers1.length > 0
        ? await DataEditorBySlug("/answers", {
            answer: props.answer,
            optionAnswer: props.optionAnswer,
          })
        : await DataRegister("/answers", {
            answer: props.answer,
            optionAnswer: props.optionAnswer,
          });

      // Хариултын хувилбарыг цэвэрлэнэ.
      props.setOptionAnswer({
        organizationId: user?.organizationId,
        yearId: system?.yearId,
        assessmentId: assessment?.assessmentId,
        moduleId: props.module?.id,
        userId: user?.id,
        questionId: null,
        answerTypeId: null,
        verifyId: null,
        options: [],
      });

      // Хариултыг цэвэрлэнэ.
      props.setAnswer({
        organizationId: user?.organizationId,
        yearId: system?.yearId,
        assessmentId: assessment?.assessmentId,
        moduleId: props.module?.id,
        userId: user?.id,
        questionId: null,
        answerTypeId: null,
        descriptions: [],
      });

      // Хариултуудыг өгөгдлийн сангаас дахин авна.
      props.getData();
    }

    // Radio асуултын нөхцөл нь сонгосон хувилбарын онооноос их бол хариултын тайлбарыг цэвэрлэнэ.
    if (answerTypeId === RADIO && option.score < question.condition) {
      props.setAnswer((prev) => {
        const updatedDescriptions = props.savedAnswers?.answers
          ?.filter((a) => a.questionId === questionId)
          ?.map((a) => ({
            id: a.id,
            subQuestionId: a.subQuestionId,
            description: null,
          }));
        // console.log("UPDATED_DESC1: ", updatedDescriptions);

        return {
          ...prev,
          descriptions: updatedDescriptions,
        };
      });
    }

    // Үндсэн хариулт бөглөх
    props.setAnswer((prev) => ({
      ...prev,
      answerTypeId,
      questionId,
    }));

    // Сонголтот хариулт бөглөх
    props.setOptionAnswer((prev) => {
      // prev.options нь массив эсэхийг шалгана. Тийм бол тухайн хариуг хадгалж авна.
      const existing = Array.isArray(prev.options) ? prev.options : [];

      // radio дээр option.id ирж байгаа бол checkbox дээр option.score_user ирж байгаа. Иймд option.id-г давуу сонголт болгов.
      const optionId = option?.id ?? event.target.value;

      // Checkbox-ийн хувьд тухайн хувилбар хариулагдсан эсэхийг тодорхойлж байна.
      const checked = !!event.target.checked;

      // Өгөгдлийн сангаас тухайн асуултын хариултуудыг авч байна.
      const savedList = (props.savedAnswers?.optionAnswers ?? [])
        .filter((a) => a.questionId === questionId)
        .map((a) => ({
          id: a.id,
          optionId: a.optionId,
          score_user: a.score_user ?? 0,
          description: a.description ?? null,
        }));

      // State хоосон бол өгөгдлийн сан дахь хариултуудыг авна.
      const base = existing.length === 0 ? savedList : existing;

      // Сонгосон хувилбарын индексийг хариултуудаас олж авна.
      let index = base.findIndex((e) => e.optionId === optionId);
      // console.log("INDEX: ", index);

      let updatedOptions = base;
      // console.log("UPDATED_OPTIONS1: ", updatedOptions);

      if (answerTypeId === RADIO) {
        const score = Number(option?.score);
        updatedOptions = [
          {
            id: updatedOptions[0]?.id,
            optionId: optionId,
            score_user: Number.isFinite(score) ? score : 0,
            description: undefined,
          },
        ];
      }

      if (answerTypeId === CHECKBOX) {
        if (action === "check") {
          if (checked) {
            // Check хийх үед Index олдоогүй буюу -1, хувилбар base хариултууд дунд сонгосон хувилбар байхгүй бол
            if (index === -1) {
              const score = Number(option?.score);
              updatedOptions = [
                ...base,
                {
                  optionId: optionId,
                  score_user: Number.isFinite(score) ? score : 0,
                  description: undefined,
                },
              ];
            }
          } else {
            // Uncheck хийх үед Index -1 буюу олдсон бол хариултын хувилбаруудаас index-тэй таарахгүй хувилбаруудыг эсвэл бүтэн хувилбаруудыг буцаана.
            updatedOptions =
              index !== -1 ? base.filter((_, i) => i !== index) : base;
          }
        } else if (action === "description") {
          // Сонголтыг урьдчилж хийсэн тул index-ийг дахиж хайна.
          index = base.findIndex((e) => e.optionId === optionId);

          // console.log("546: ", base, index, optionId, event.target.value);
          // Хувилбарын асуултад хариу ирэх үед тухайн хувилбарын индекс олдсон бол
          if (index !== -1) {
            // Хариултын хувилбаруудын reference-ийг хуулбарлах
            updatedOptions = base.slice();

            // Тухайн index дэх хариултын хувилбарын description-г өөрчлөх
            updatedOptions[index] = {
              ...updatedOptions[index],
              description: event.target.value,
            };
          }
        }
      }

      // console.log("UPDATED_OPTIONS2: ", updatedOptions);
      return {
        ...prev,
        answerTypeId,
        questionId,
        options: updatedOptions,
      };
    });
  };

  // console.log("Questions props: ", assessment);

  return (
    <form
      method="POST"
      className="border-[1px] border-gray-400/20 rounded-2xl p-6 text-sm"
      onSubmit={(event) => props.handleSubmit(event)}
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
                  const comment = props.savedAnswers?.answers?.find(
                    (a) => a.questionId === data.id
                  )?.comment;
                  // Асуултуудыг хэвлэж байна
                  return (
                    <div key={index} className="mb-10">
                      {/* Асуултууд */}
                      <p className={clsx(textblue)}>
                        {t("assessment.Question")} {index + 1}.
                      </p>
                      <p className={clsx(textblue, "font-semibold")}>
                        {system.language === "mn" ? data.name : data.name_en}
                      </p>
                      {/* Хариултын хувилбаруудыг хэвлэнэ. */}
                      <QuestionnaireOptions
                        data={data}
                        options={props.datas[2]?.filter(
                          (o) => o.questionId === data.id
                        )} // Тухайн асуултад хамаарах хариултын хувилбаруудыг сонгох
                        subQuestions={props.datas[4]?.filter(
                          (sq) => sq.questionId === data.id
                        )} // Тухайн асуултад хамаарах дэд асуултуудыг сонгох
                        handleChangeAnswer={handleChangeAnswer}
                        handleChangeOptionAnswer={handleChangeOptionAnswer}
                        answer={props.answer} // Бүх хариултууд
                        optionAnswer={props.optionAnswer} // Бүх хариултын хувилбарууд
                        savedAnswers={props.savedAnswers} // Сонгоод, хадгалсан хариунууд
                        attachment={props.datas[5][0]} // Файл хавсаргах эсэхийг тодорхойлох
                      />
                      {comment && (
                        <CustomInput
                          type="text"
                          label={t("verification.comment")}
                          value={comment}
                          readOnly={true}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          );
        })}
      <div className="flex justify-center items-center mb-5 mt-10">
        {disabled ? (
          <MyStatus
            label="Илгээсэн төлөвт байгаа тул асуулгыг өөрчлөх боломжгүй."
            color="blue"
          />
        ) : (
          <SolidButton
            color="green"
            size="small"
            action="save"
            label={
              answers === questions ? t("action.SaveSend") : t("action.Save")
            }
          />
        )}
      </div>
    </form>
  );
};

export default Questions;
