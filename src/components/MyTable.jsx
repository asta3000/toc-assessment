"use client";

import React, { Fragment } from "react";
import lodash from "lodash";
import { IoEyeOutline } from "react-icons/io5";
import { PiPencilLineFill } from "react-icons/pi";
import { BsKey } from "react-icons/bs";
import { TiTick } from "react-icons/ti";
import { MdOutlineCancel } from "react-icons/md";

import { useTranslation } from "@/hooks/useTranslation";
import { useSystemStore } from "@/stores/storeSystem";
import {
  handleClickDetail,
  handleClickEdit,
  handleClickKey,
} from "@/functions/page";
import { MyStatus } from "./MyText";
import { FaArrowRight } from "react-icons/fa";
import {
  ORGANIZATION,
  organizationToC,
  STATUS_DONE,
  STATUS_FILLING,
  STATUS_NEW,
  STATUS_SENT,
  STATUS_VERIFIED,
  STATUS_VERIFYING,
} from "@/libs/constants";
import clsx from "clsx";
import { useAssessmentStore } from "@/stores/storeAssessment";
import { useVerificationStore } from "@/stores/storeVerification";

export const UserTable = (props) => {
  const { system } = useSystemStore();
  const t = useTranslation();
  // console.log("SEL: ", props.selection);
  return (
    <table
      className="w-full border-[1px] border-black text-sm"
      cellSpacing={0}
      cellPadding={5}
    >
      <thead className="font-semibold ">
        <tr className="bg-blue-200 h-10">
          {props.metadatas?.map((metadata, index) => {
            return (
              metadata.type !== "password" && (
                <td
                  key={index}
                  align={metadata.align}
                  className="border-[1px] border-black text-gray-900"
                >
                  {system.language === "mn" ? metadata.name : metadata.name_en}
                </td>
              )
            );
          })}
          <td
            align="center"
            className="border-[1px] border-black text-gray-900"
          >
            Үйлдэл
          </td>
        </tr>
      </thead>
      <tbody>
        {props.datas
          ?.filter((element) => {
            if (props.search !== null) {
              return Object.values(element)
                .slice(1)
                .join(" ")
                .toLowerCase()
                .includes(props.search.toLowerCase());
            } else {
              return element;
            }
          })
          ?.map((data, index) => {
            delete data.password;
            return (
              <tr key={index} className="hover:bg-blue-50">
                {props.metadatas?.map((metadata, index) => {
                  return (
                    metadata.type !== "password" && (
                      <td
                        key={index}
                        align={metadata.align}
                        width={metadata.width}
                        className="border-[1px] border-black text-gray-600 hover:text-gray-800 cursor-default p-1"
                      >
                        {metadata.type === "select"
                          ? lodash.isEmpty(metadata.selection)
                            ? metadata.field === "organizationId"
                              ? data?.Organization?.name
                              : null
                            : metadata.selection.filter(
                                (s) => s.value === data[metadata.field]
                              )[0]?.description
                          : data[metadata.field]}
                      </td>
                    )
                  );
                })}
                <td
                  align="center"
                  width="10%"
                  className="border-[1px] border-black text-gray-600 hover:text-gray-800 cursor-default p-1"
                >
                  <div className="flex justify-center items-center gap-4">
                    <IoEyeOutline
                      size={20}
                      className="cursor-pointer"
                      title={t("action.Detail")}
                      onClick={() =>
                        handleClickDetail(data, props.setData, props.setModal)
                      }
                    />
                    <PiPencilLineFill
                      size={20}
                      className="cursor-pointer"
                      title={t("action.Edit")}
                      onClick={() =>
                        handleClickEdit(data, props.setData, props.setModal)
                      }
                    />
                    <BsKey
                      size={20}
                      className="cursor-pointer"
                      title={t("action.ChangePassword")}
                      onClick={() =>
                        handleClickKey(data, props.setData, props.setModal)
                      }
                    />
                  </div>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export const ListTable = (props) => {
  const { system } = useSystemStore();
  const t = useTranslation();
  // console.log(props);
  return (
    <table
      className="w-full border-[1px] border-black text-sm"
      cellSpacing={0}
      cellPadding={5}
    >
      <thead className="font-semibold ">
        <tr className="bg-blue-200 h-10">
          {props?.metadatas?.map((metadata, index) => {
            return (
              <td
                key={index}
                align={metadata.align}
                className="border-[1px] border-black text-gray-900"
              >
                {system.language === "mn" ? metadata.name : metadata.name_en}
              </td>
            );
          })}
          <td
            align="center"
            className="border-[1px] border-black text-gray-900"
          >
            {t("action.title")}
          </td>
        </tr>
      </thead>
      <tbody>
        {props?.datas
          ?.filter((element) => {
            if (props.search !== null) {
              return Object.values(element)
                .slice(1)
                .join(" ")
                .toLowerCase()
                .includes(props.search.toLowerCase());
            } else {
              return element;
            }
          })
          ?.map((data, index) => {
            return (
              <tr key={index} className="hover:bg-blue-50 h-8">
                {props.metadatas?.map((metadata, index) => {
                  return (
                    <td
                      key={index}
                      align={metadata.align}
                      width={metadata.width}
                      className="border-[1px] border-black text-gray-600 hover:text-gray-800 cursor-default p-1"
                    >
                      {metadata.type === "select"
                        ? lodash.isEmpty(metadata.selection)
                          ? metadata.field === "memberId"
                            ? data?.Member?.name
                            : metadata.field === "operationId"
                              ? data?.Operation?.name
                              : metadata.field === "sectorId"
                                ? data?.Sector?.name
                                : metadata.field === "assessmentId"
                                  ? data?.Assessment?.name
                                  : metadata.field === "moduleId"
                                    ? data?.Module?.name
                                    : null
                          : metadata.selection.filter(
                              (s) => s.value === data[metadata.field]
                            )[0]?.description
                        : data[metadata.field]}
                    </td>
                  );
                })}
                <td
                  align="center"
                  width="10%"
                  className="border-[1px] border-black text-gray-600 hover:text-gray-800 cursor-default p-1"
                >
                  <div className="flex justify-center items-center gap-4">
                    <IoEyeOutline
                      size={20}
                      className="cursor-pointer"
                      title={t("action.Detail")}
                      onClick={() =>
                        handleClickDetail(data, props.setData, props.setModal)
                      }
                    />
                    {data?.id !== organizationToC && (
                      <PiPencilLineFill
                        size={20}
                        className="cursor-pointer"
                        title={t("action.Edit")}
                        onClick={() =>
                          handleClickEdit(data, props.setData, props.setModal)
                        }
                      />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export const QuestionnaireTable = (props) => {
  const { system } = useSystemStore();
  const t = useTranslation();
  return (
    <table
      className="w-full border-[1px] border-black text-sm"
      cellSpacing={0}
      cellPadding={5}
    >
      <thead className="font-semibold ">
        <tr className="bg-blue-200 h-10">
          {props?.metadatas?.map((metadata, index) => {
            return (
              <td
                key={index}
                align={metadata.align}
                className="border-[1px] border-black text-gray-900"
              >
                {system.language === "mn" ? metadata.name : metadata.name_en}
              </td>
            );
          })}
          <td
            align="center"
            className="border-[1px] border-black text-gray-900"
          >
            {t("action.title")}
          </td>
        </tr>
      </thead>
      <tbody>
        {props?.datas
          ?.filter((element) => {
            if (props?.search !== null) {
              return Object.values(element)
                .slice(1)
                .join(" ")
                .toLowerCase()
                .includes(props?.search?.toLowerCase());
            } else {
              return true;
            }
          })
          ?.map((data, index) => {
            return (
              <tr key={index} className="hover:bg-blue-50 h-8">
                {props.metadatas?.map((metadata, index) => {
                  return (
                    <td
                      key={index}
                      align={metadata.align}
                      width={metadata.width}
                      className="border-[1px] border-black text-gray-600 hover:text-gray-800 cursor-default p-1"
                    >
                      {metadata.type === "select"
                        ? lodash.isEmpty(metadata.selection)
                          ? metadata.field === "assessmentId"
                            ? data?.Assessment?.name
                            : metadata.field === "moduleId"
                              ? data?.Module?.name + ". " + data?.Module?.goal
                              : metadata.field === "questionTypeId"
                                ? data?.QuestionType?.name
                                : metadata.field === "answerTypeId"
                                  ? data?.AnswerType?.name
                                  : null
                          : metadata.selection.filter(
                              (s) => s.value === data[metadata.field]
                            )[0]?.description
                        : data[metadata.field]}
                    </td>
                  );
                })}
                <td
                  align="center"
                  width="10%"
                  className="border-[1px] border-black text-gray-600 hover:text-gray-800 cursor-default p-1"
                >
                  <div className="flex justify-center items-center gap-4">
                    <IoEyeOutline
                      size={20}
                      className="cursor-pointer"
                      title={t("action.Detail")}
                      onClick={() =>
                        handleClickDetail(data, props.setData, props.setModal)
                      }
                    />
                    <PiPencilLineFill
                      size={20}
                      className="cursor-pointer"
                      title={t("action.Edit")}
                      onClick={() =>
                        handleClickEdit(data, props.setData, props.setModal)
                      }
                    />
                  </div>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export const AssessmentTable = (props) => {
  const { system } = useSystemStore();
  const { storeAssessment } = useAssessmentStore();
  const { storeVerification } = useVerificationStore();
  const t = useTranslation();
  return (
    <table
      className="w-full border-[1px] border-black text-sm"
      cellSpacing={0}
      cellPadding={5}
    >
      <thead className="font-semibold ">
        <tr className="bg-blue-200 h-10">
          {props?.metadatas?.map((metadata, index) => {
            return (
              <td
                key={index}
                align={metadata.align}
                className="border-[1px] border-black text-gray-900"
              >
                {system.language === "mn" ? metadata.name : metadata.name_en}
              </td>
            );
          })}
          <td
            align="center"
            className="border-[1px] border-black text-gray-900"
          >
            {t("action.title")}
          </td>
        </tr>
      </thead>
      <tbody>
        {props?.allDatas[0]
          ?.filter((d) => d.yearId === props.year.id)
          ?.map((data, index) => {
            return (
              <tr key={index} className="hover:bg-blue-50 h-8">
                {props.metadatas?.map((metadata, index) => {
                  return (
                    <td
                      key={index}
                      align={metadata.align}
                      width={metadata.width}
                      className="border-[1px] border-black text-gray-600 hover:text-gray-800 cursor-default p-1"
                    >
                      {metadata.field === "status" ? (
                        <MyStatus
                          label={data?.Status?.name}
                          color={
                            data?.Status?.id === STATUS_NEW ? "red" : "blue"
                          }
                        />
                      ) : metadata.field === "name" ? (
                        data?.Assessment?.name
                      ) : metadata.field === "goal" ? (
                        data?.Assessment?.goal
                      ) : metadata.field === "abstract" ? (
                        data?.Assessment?.abstract
                      ) : metadata.field === "content" ? (
                        data?.Assessment?.content
                      ) : (
                        data[metadata.field]
                      )}
                    </td>
                  );
                })}
                <td
                  align="center"
                  width="10%"
                  className="border-[1px] border-black text-gray-600 hover:text-gray-800 cursor-default p-1"
                >
                  <div className="flex justify-center items-center gap-4">
                    {props.year.id === system.yearId && (
                      <FaArrowRight
                        size={18}
                        className={clsx(
                          "cursor-pointer hover:scale-125 transition-all duration-300 ease-in-out"
                        )}
                        title={t("assessment.organization")}
                        onClick={() => {
                          storeAssessment({
                            id: data.id,
                            name: data.Assessment?.name,
                            abstract: data.Assessment?.abstract,
                            goal: data.Assessment?.goal,
                            content: data.Assessment?.content,
                            statusId: data?.Status?.id,
                            year: props.year.name,
                            assessmentId: data.assessmentId,
                          });

                          storeVerification({
                            id: data.id,
                            organizationId: data.organizationId,
                            organization: data?.Organization?.name,
                            yearId: data.yearId,
                            year: data?.Year?.name,
                            assessmentId: data.assessmentId,
                            assessment: data?.Assessment?.name,
                            cycle: data.cycle,
                            isVerified: data.isVerified,
                            statusId: data?.statusId,
                          });

                          props.dispatch({ type: props.state });
                        }}
                      />
                    )}
                    {(data?.Status?.id === STATUS_SENT ||
                      data?.Status?.id === STATUS_DONE) && (
                      <IoEyeOutline
                        size={22}
                        className={clsx(
                          "cursor-pointer hover:scale-125 transition-all duration-300 ease-in-out"
                        )}
                        title={t("assessment.summary")}
                      />
                    )}
                    {props.year.id === system.yearId &&
                      data?.Status?.id === STATUS_VERIFIED && (
                        <Fragment>
                          <TiTick
                            size={24}
                            className={clsx(
                              "cursor-pointer hover:scale-125 transition-all duration-300 ease-in-out"
                            )}
                            title={t("assessment.accept")}
                            onClick={() => {
                              props.handleAction(
                                {
                                  id: data.id,
                                  statusId: STATUS_DONE,
                                },
                                {
                                  organizationId: data.organizationId,
                                  yearId: data.yearId,
                                  assessmentId: data.assessmentId,
                                }
                              );
                            }}
                          />
                          <MdOutlineCancel
                            size={24}
                            className={clsx(
                              "cursor-pointer hover:scale-125 transition-all duration-300 ease-in-out"
                            )}
                            title={t("assessment.decline")}
                            onClick={() => {
                              props.handleAction(
                                {
                                  id: data.id,
                                  statusId: STATUS_FILLING,
                                  cycle: Number(data.cycle),
                                },
                                {
                                  organizationId: data.organizationId,
                                  yearId: data.yearId,
                                  assessmentId: data.assessmentId,
                                }
                              );
                            }}
                          />
                        </Fragment>
                      )}
                  </div>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export const VerificationTable = (props) => {
  const { system } = useSystemStore();
  const { storeVerification } = useVerificationStore();
  const t = useTranslation();

  return (
    <table
      className="w-full border-[1px] border-black text-sm"
      cellSpacing={0}
      cellPadding={5}
    >
      <thead className="font-semibold ">
        <tr className="bg-blue-200 h-10">
          {props?.metadatas?.map((metadata, index) => {
            return (
              <td
                key={index}
                align={metadata.align}
                className="border-[1px] border-black text-gray-900"
              >
                {system.language === "mn" ? metadata.name : metadata.name_en}
              </td>
            );
          })}
          <td
            align="center"
            className="border-[1px] border-black text-gray-900"
          >
            {t("action.title")}
          </td>
        </tr>
      </thead>
      <tbody>
        {props?.allDatas[0]
          ?.filter((d) => d.yearId === props.year.id)
          ?.map((data, index) => {
            return (
              <tr key={index} className="hover:bg-blue-50 h-8">
                {props.metadatas?.map((metadata, index) => {
                  return (
                    <td
                      key={index}
                      align={metadata.align}
                      width={metadata.width}
                      className="border-[1px] border-black text-gray-600 hover:text-gray-800 cursor-default p-1"
                    >
                      {metadata.field === "status" ? (
                        <MyStatus
                          label={data?.Status?.name}
                          color={
                            data?.Status?.id === STATUS_SENT ? "red" : "blue"
                          }
                        />
                      ) : metadata.field === "organization" ? (
                        data?.Organization?.name
                      ) : metadata.field === "assessment" ? (
                        data?.Assessment?.name
                      ) : (
                        data[metadata.field]
                      )}
                    </td>
                  );
                })}
                <td
                  align="center"
                  width="10%"
                  className="border-[1px] border-black text-gray-600 hover:text-gray-800 cursor-default p-1"
                >
                  <div className="flex justify-center items-center gap-4">
                    {props.year.id === system.yearId &&
                      (data?.Status?.id === STATUS_SENT ||
                        data?.Status?.id === STATUS_VERIFYING ||
                        data?.Status?.id === STATUS_VERIFIED) && (
                        <FaArrowRight
                          size={18}
                          className={clsx(
                            "cursor-pointer hover:scale-125 transition-all duration-300 ease-in-out"
                          )}
                          title={t("assessment.verifier")}
                          onClick={() => {
                            storeVerification({
                              id: data.id,
                              organizationId: data.organizationId,
                              organization: data?.Organization?.name,
                              yearId: data.yearId,
                              year: data?.Year?.name,
                              assessmentId: data.assessmentId,
                              assessment: data?.Assessment?.name,
                              cycle: data.cycle,
                              isVerified: data.isVerified,
                              statusId: data?.statusId,
                            });

                            props.dispatch({ type: props.state });
                          }}
                        />
                      )}
                    {(data?.Status?.id === STATUS_DONE ||
                      data?.Status?.id === STATUS_VERIFIED) && (
                      <IoEyeOutline
                        size={22}
                        className={clsx(
                          "cursor-pointer hover:scale-125 transition-all duration-300 ease-in-out"
                        )}
                        title={t("assessment.summary")}
                      />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};
