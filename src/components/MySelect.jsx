"use client";

import lodash from "lodash";

import { handleChangeValue } from "@/functions/page";
import { textblue, blue } from "@/libs/constants";
import clsx from "clsx";

export const WhiteSelect = (props) => {
  // console.log("SELECT: ", props.data);
  return (
    <div className="flex flex-col w-full text-sm">
      <label className={`${textblue}`}>{props.label}</label>
      <select
        className={clsx(
          "w-full p-2 border-b-[1px] bg-white text-black focus:outline-none caret-black",
          lodash.isEmpty(props.validationError)
            ? `border-b-[${blue}]`
            : "border-b-red-300"
        )}
        name={props.name}
        disabled={props.disabled}
        value={props.value}
        onChange={(event) =>
          handleChangeValue(
            event,
            props.setData,
            props.data,
            props.activeSchema,
            props.setErrors
          )
        }
      >
        <option value="">Сонгоно уу</option>
        {props.metadata.field === "memberId" &&
        !lodash.isEmpty(props.selection?.members)
          ? props.selection?.members.map((s, index) => {
              return (
                <option value={s.id} key={index}>
                  {s.name}
                </option>
              );
            })
          : props.metadata.field === "sectorId" &&
              !lodash.isEmpty(props.selection?.sectors)
            ? props.selection?.sectors.map((s, index) => {
                return (
                  <option value={s.id} key={index}>
                    {s.name}
                  </option>
                );
              })
            : props.metadata.field === "operationId" &&
                !lodash.isEmpty(props.selection?.operations)
              ? props.selection?.operations.map((s, index) => {
                  return (
                    <option value={s.id} key={index}>
                      {s.name}
                    </option>
                  );
                })
              : props.metadata.field === "organizationId" &&
                  !lodash.isEmpty(props.selection?.organizations)
                ? props.selection?.organizations.map((s, index) => {
                    return (
                      <option value={s.id} key={index}>
                        {s.name}
                      </option>
                    );
                  })
                : props.metadata.field === "questionTypeId" &&
                    !lodash.isEmpty(props.selection?.questionTypes)
                  ? props.selection?.questionTypes
                      .filter(
                        (s) =>
                          s.assessmentId === props?.data?.assessmentId &&
                          s.moduleId === props?.data?.moduleId
                      )
                      .map((s, index) => {
                        return (
                          <option value={s.id} key={index}>
                            {s.name}
                          </option>
                        );
                      })
                  : props.metadata.field === "answerTypeId" &&
                      !lodash.isEmpty(props.selection?.answerTypes)
                    ? props.selection?.answerTypes.map((s, index) => {
                        return (
                          <option value={s.id} key={index}>
                            {s.name}
                          </option>
                        );
                      })
                    : props.metadata.field === "assessmentId" &&
                        !lodash.isEmpty(props.selection?.assessments)
                      ? props.selection?.assessments.map((s, index) => {
                          return (
                            <option value={s.id} key={index}>
                              {s.name}
                            </option>
                          );
                        })
                      : props.metadata.field === "moduleId" &&
                          !lodash.isEmpty(props.selection?.modules)
                        ? props.selection?.modules
                            .filter(
                              (s) =>
                                s.assessmentId === props?.data?.assessmentId
                            )
                            .map((s, index) => {
                              return (
                                <option value={s.id} key={index}>
                                  {s.name}. {s.goal}
                                </option>
                              );
                            })
                        : (props.metadata.field === "status" ||
                            props.metadata.field === "gender" ||
                            props.metadata.field === "role" ||
                            props.metadata.field === "classification" ||
                            props.metadata.field === "guideType") &&
                          props.selection?.map((s, index) => {
                            return (
                              <option value={s.value} key={index}>
                                {s.description}
                              </option>
                            );
                          })}
      </select>
    </div>
  );
};

export const CustomSelect = (props) => {
  // console.log("SELECT: ", props);
  return (
    <div className="flex flex-col w-full text-sm">
      <label className={`${textblue}`}>{props.label}</label>
      <select
        className={`w-full p-2 border-b-[1px] border-b-[${blue}] bg-white text-black focus:outline-none caret-black`}
        name={props.name}
        disabled={props.disabled}
        value={props.value}
        onChange={(event) =>
          props.handleChangeValue(event, props.index, props.action)
        }
      >
        <option value="">Сонгоно уу</option>
        {props.selection?.map((s, index) => {
          return (
            <option value={s.value} key={index}>
              {s.description}
            </option>
          );
        })}
      </select>
    </div>
  );
};
