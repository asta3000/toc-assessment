"use client";

import lodash from "lodash";

import { useTranslation } from "@/hooks/useTranslation";
import { textblue, blue } from "@/libs/constants";
import { handleChangeValue, handleSearchValue } from "@/functions/page";

export const MySearch = (props) => {
  const t = useTranslation();
  return (
    <input
      type="search"
      className="min-w-[50%] py-1.5 px-5 text-sm text-black border border-gray-400 bg-white rounded-xl"
      value={props.value}
      placeholder={t("action.Search")}
      onChange={(event) => handleSearchValue(event, props.setSearch)}
    />
  );
};

export const WhiteInput = (props) => {
  // console.log(props.data);
  return (
    <div className="flex flex-col w-full text-sm">
      <label className={`${textblue}`}>{props.label}</label>
      <input
        type={props.type}
        name={props.name}
        className={`w-full p-2 border-b-[1px] border-b-[${blue}] bg-white text-black focus:outline-none caret-black`}
        value={props.value}
        onChange={(event) =>
          handleChangeValue(event, props.setData, props.data)
        }
        disabled={props.disabled}
      />
    </div>
  );
};

export const FileInput = (props) => {
  return (
    <div className="flex flex-col w-full text-sm">
      <input
        type={props.type}
        name={props.name}
        className={`w-full p-2 border-b-[1px] border-b-[${blue}] bg-transparent text-black focus:outline-none caret-black`}
        value={props.value}
        onChange={(event) => props.handleChangeValue(event)}
        disabled={props.disabled}
      />
    </div>
  );
};

export const CustomInput = (props) => {
  // console.log("INDEX: ", props.index);
  return (
    <div className="flex flex-col w-full text-sm">
      <label className={`${textblue}`}>
        {props.label} {!lodash.isEmpty(props.index) && props.index + 1}
      </label>
      <input
        type={props.type}
        name={props.name}
        className={`w-full p-2 border-b-[1px] border-b-[${blue}] bg-white text-black focus:outline-none caret-black`}
        value={props.value}
        onChange={(event) =>
          props.handleChangeValue(
            event,
            props.index,
            props.action,
            props.answerTypeId,
            props.questionId,
            props.question,
            props.option
          )
        }
        disabled={props.disabled}
        multiple={props.multiple}
        readOnly={props.readOnly}
      />
    </div>
  );
};
