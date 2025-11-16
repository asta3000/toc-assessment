"use client";

import React from "react";

import { WhiteInput } from "@/components/MyInput";
import { MyView } from "@/components/MyText";
import { useSystemStore } from "@/stores/storeSystem";

export const ChangePassword = (props) => {
  const system = useSystemStore.getState().system;
  return (
    <div className={`flex flex-col gap-7`}>
      {props.metadatas.map((metadata, index) => {
        return metadata.type === "password" ? (
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
        ) : metadata.field === "email" ? (
          <MyView
            value={props.data[metadata.field]}
            key={index}
            label={system.language === "mn" ? metadata.name : metadata.name_en}
          />
        ) : null;
      })}
    </div>
  );
};
