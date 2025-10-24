"use client";

import React from "react";

import { WhiteInput } from "@/components/MyInput";
import { WhiteSelect } from "@/components/MySelect";
import { MyView } from "@/components/MyText";
import { useSystemStore } from "@/stores/storeSystem";
import { RADIO, CHECKBOX } from "@/libs/constants";
import { useTranslation } from "@/hooks/useTranslation";

import condition from "@/jsons/condition.json";
import { SubQuestions, ViewSubQuestions } from "../assessment/subQuestions";
import { QuestionsOptions, ViewOptions } from "../assessment/options";

// Харах үйлдэл хийх үед хэрэглэгчийн нууц үгийг харуулахгүй.
// Бүртгэх үйлдэл хийх үед хэрэглэгчийн нууц үгийг авна.
// Өөрчлөх үйлдэл хийх үед хэрэглэгчийн нууц үгийг өөрчлөхгүй.

export const Questionnaire = (props) => {
  const system = useSystemStore.getState().system;
  const t = useTranslation();

  return (
    <div
      className={`flex flex-col ${
        props.action === "detail" ? "gap-5" : "gap-7"
      }`}
    >
      {/* Үндсэн асуултын хэсэг */}
      {props.metadatas?.map((metadata, index) => {
        // Харах үйлдэл
        return props.action === "detail" ? (
          metadata.type === "select" ? (
            <MyView
              // Бүтээгдэхүүнтэй холбоотой өгөгдөл бол бүтээгдэхүүний нэрийг харуулна. Үгүй бол тухайн өгөгдлийг харуулна.
              value={
                metadata.field === "assessmentId"
                  ? props.data?.Assessment?.name
                  : metadata.field === "questionTypeId"
                    ? props.data?.QuestionType?.name
                    : metadata.field === "answerTypeId"
                      ? props.data?.AnswerType?.name
                      : metadata.field === "moduleId"
                        ? props.data?.Module?.name +
                          ". " +
                          props.data?.Module?.goal
                        : metadata.field === "status"
                          ? metadata.selection?.filter(
                              (s) => s.value === props.data[metadata.field]
                            )[0]?.description
                          : null
              }
              key={index}
              label={
                system.language === "mn" ? metadata.name : metadata.name_en
              }
              metadata={metadata}
            />
          ) : (
            <MyView
              value={props.data[metadata.field]}
              key={index}
              label={
                system.language === "mn" ? metadata.name : metadata.name_en
              }
            />
          )
        ) : // Бүртгэх үйлдэл
        props.action === "add" ? (
          metadata.type === "select" ? (
            <WhiteSelect
              name={metadata.field}
              label={
                system.language === "mn" ? metadata.name : metadata.name_en
              }
              value={props.data[metadata.field]}
              key={index}
              disabled={false}
              selection={
                metadata.selection ? metadata.selection : props.selection
              }
              setData={props.setData}
              data={props.data}
              metadata={metadata}
            />
          ) : (
            <WhiteInput
              name={metadata.field}
              type={metadata.type}
              label={
                system.language === "mn" ? metadata.name : metadata.name_en
              }
              value={props.data[metadata.field]}
              key={index}
              disabled={false}
              setData={props.setData}
              data={props.data}
            />
          )
        ) : // Өөрчлөх үйлдэл
        props.action === "edit" ? (
          metadata.type === "select" ? (
            <WhiteSelect
              name={metadata.field}
              label={
                system.language === "mn" ? metadata.name : metadata.name_en
              }
              value={props.data[metadata.field]}
              key={index}
              disabled={false}
              selection={
                metadata.selection ? metadata.selection : props.selection
              }
              setData={props.setData}
              data={props.data}
              metadata={metadata}
            />
          ) : (
            <WhiteInput
              name={metadata.field}
              type={metadata.type}
              label={
                system.language === "mn" ? metadata.name : metadata.name_en
              }
              value={props.data[metadata.field]}
              key={index}
              disabled={false}
              setData={props.setData}
              data={props.data}
            />
          )
        ) : null;
      })}

      {/* Radio асуултын төрлийн үед Condition нөхцлийг гаргаж байна. */}
      {props.data?.answerTypeId === RADIO &&
        (props.action === "detail" ? (
          <MyView
            value={props.data[condition.field]}
            label={
              system.language === "mn" ? condition.name : condition.name_en
            }
          />
        ) : (
          <WhiteInput
            name={condition.field}
            type={condition.type}
            label={
              system.language === "mn" ? condition.name : condition.name_en
            }
            value={props.data[condition.field]}
            disabled={false}
            setData={props.setData}
            data={props.data}
          />
        ))}

      {/* Radio эсвэл Checkbox асуултын төрлийн үед нэмэлт асуулт гаргаж байна. */}
      {(props.data?.answerTypeId === CHECKBOX ||
        props.data?.answerTypeId === RADIO) &&
        (props.action === "detail" ? (
          <ViewSubQuestions subQuestions={props.subQuestions} />
        ) : (
          <SubQuestions
            subQuestions={props.subQuestions}
            setSubQuestions={props.setSubQuestions}
            handleChangeValue={props.handleChangeValue}
            data={props.data}
          />
        ))}

      {/* Radio эсвэл Checkbox асуултын төрлийн үед хариултын хувилбаруудыг гаргаж байна */}
      {(props.data?.answerTypeId === CHECKBOX ||
        props.data?.answerTypeId === RADIO) &&
        (props.action === "detail" ? (
          <ViewOptions options={props.options} data={props.data} />
        ) : (
          <QuestionsOptions
            options={props.options}
            setOptions={props.setOptions}
            handleChangeValue={props.handleChangeValue}
            data={props.data}
          />
        ))}
    </div>
  );
};
