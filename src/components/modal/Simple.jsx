"use client";

import React from "react";

import { WhiteInput } from "@/components/MyInput";
import { WhiteSelect } from "@/components/MySelect";
import { MyView } from "@/components/MyText";
import { useSystemStore } from "@/stores/storeSystem";

// Харах үйлдэл хийх үед хэрэглэгчийн нууц үгийг харуулахгүй.
// Бүртгэх үйлдэл хийх үед хэрэглэгчийн нууц үгийг авна.
// Өөрчлөх үйлдэл хийх үед хэрэглэгчийн нууц үгийг өөрчлөхгүй.

export const SimpleOne = (props) => {
  // console.log("SEL: ", props.validationErrors);
  const system = useSystemStore.getState().system;
  return (
    <div
      className={`flex flex-col ${
        props.action === "detail" ? "gap-5" : "gap-7"
      }`}
    >
      {props.metadatas?.map((metadata, index) => {
        // Харах үйлдэл
        return props.action === "detail" ? (
          metadata.type === "select" ? (
            <MyView
              // Бүтээгдэхүүнтэй холбоотой өгөгдөл бол бүтээгдэхүүний нэрийг харуулна. Үгүй бол тухайн өгөгдлийг харуулна.
              value={
                metadata.field === "sectorId"
                  ? props.data?.Sector?.name
                  : metadata.field === "operationId"
                    ? props.data?.Operation?.name
                    : metadata.field === "memberId"
                      ? props.data?.Member?.name
                      : metadata.field === "organizationId"
                        ? props.data?.Organization?.name
                        : metadata.field === "assessmentId"
                          ? props.data?.Assessment?.name
                          : metadata.field === "status" ||
                              metadata.field === "gender" ||
                              metadata.field === "role" ||
                              metadata.field === "guideType" ||
                              metadata.field === "classification"
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
          ) : metadata.type !== "password" ? (
            <MyView
              value={props.data[metadata.field]}
              key={index}
              label={
                system.language === "mn" ? metadata.name : metadata.name_en
              }
            />
          ) : null
        ) : // Бүртгэх үйлдэл
        props.action === "add" ? (
          metadata.type === "select" ? (
            <div key={index}>
              <WhiteSelect
                name={metadata.field}
                label={
                  system.language === "mn" ? metadata.name : metadata.name_en
                }
                value={props.data[metadata.field]}
                disabled={false}
                selection={
                  metadata.selection ? metadata.selection : props.selection
                }
                setData={props.setData}
                data={props.data}
                metadata={metadata}
                validationError={props.validationErrors[metadata.field]}
                activeSchema={props.activeSchema}
                setErrors={props.setErrors}
              />
              {props.validationErrors[metadata.field] && (
                <p className="text-xs text-red-500 mt-1 italic">
                  {props.validationErrors[metadata.field]}
                </p>
              )}
            </div>
          ) : (
            <div key={index}>
              <WhiteInput
                name={metadata.field}
                type={metadata.type}
                label={
                  system.language === "mn" ? metadata.name : metadata.name_en
                }
                value={props.data[metadata.field]}
                disabled={false}
                setData={props.setData}
                data={props.data}
                validationError={props.validationErrors[metadata.field]}
                activeSchema={props.activeSchema}
                setErrors={props.setErrors}
              />
              {props.validationErrors[metadata.field] && (
                <p className="text-xs text-red-500 mt-1 italic">
                  {props.validationErrors[metadata.field]}
                </p>
              )}
            </div>
          )
        ) : // Өөрчлөх үйлдэл
        props.action === "edit" ? (
          metadata.type === "select" ? (
            <div key={index}>
              <WhiteSelect
                name={metadata.field}
                label={
                  system.language === "mn" ? metadata.name : metadata.name_en
                }
                value={props.data[metadata.field]}
                disabled={false}
                selection={
                  metadata.selection ? metadata.selection : props.selection
                }
                setData={props.setData}
                data={props.data}
                metadata={metadata}
                validationError={props.validationErrors[metadata.field]}
                activeSchema={props.activeSchema}
                setErrors={props.setErrors}
              />
            </div>
          ) : metadata.type !== "password" ? (
            <div key={index}>
              <WhiteInput
                name={metadata.field}
                type={metadata.type}
                label={
                  system.language === "mn" ? metadata.name : metadata.name_en
                }
                value={props.data[metadata.field]}
                disabled={false}
                setData={props.setData}
                data={props.data}
                validationError={props.validationErrors[metadata.field]}
                activeSchema={props.activeSchema}
                setErrors={props.setErrors}
              />
              {props.validationErrors[metadata.field] && (
                <p className="text-xs text-red-500 mt-1 italic">
                  {props.validationErrors[metadata.field]}
                </p>
              )}
            </div>
          ) : null
        ) : null;
      })}
    </div>
  );
};

export const SimpleDouble = (props) => {
  return (
    <div
      className={`grid grid-cols-2 ${
        props.action === "detail" ? "gap-5" : "gap-7"
      }`}
    ></div>
  );
};
