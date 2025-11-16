"use client";

import lodash from "lodash";
import toast from "react-hot-toast";

import { DataEditorBySlug, DataRegister } from "./Data";
import { toastperiod } from "@/libs/constants";

export const handleClickAdd = (setModal, setData) => {
  setModal({
    open: true,
    action: "add",
  });
  setData({});
};

export const handleClickCancel = (setModal, setData, savedScrollY) => {
  setData({});
  setModal({
    open: false,
    action: "",
  });
  window.scrollTo({ top: 0 });
};

export const handleChangeValue = (
  event,
  setData,
  data,
  activeSchema,
  setErrors
) => {
  event.preventDefault();

  setData({
    ...data,
    [event.target.name]: event.target.value,
  });

  const fieldSchema = activeSchema?.shape[event.target.name];
  const parsed = fieldSchema?.safeParse(event.target.value);

  parsed &&
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (parsed?.success) {
        delete newErrors[event.target.name];
      } else {
        newErrors[event.target.name] = parsed?.error?.issues[0]?.message;
      }
      return newErrors;
    });
};

export const handleClickSave = async (
  event,
  url,
  data,
  action,
  setLoading,
  setModal,
  setData,
  mutate,
  options = undefined,
  setOptions = undefined,
  subQuestions = undefined,
  setSubQuestions = undefined,
  activeSchema,
  setErrors
) => {
  event.preventDefault();

  const parsed = activeSchema?.safeParse(data);
  // console.log("P: ", parsed);

  if (!parsed?.success) {
    const fieldErrors = {};
    parsed?.error?.issues?.forEach((err) => {
      const field = err?.path[0];
      fieldErrors[field] = err?.message;
    });
    setErrors(fieldErrors);
    toast.error("Өгөгдөл дутуу байна.", {
      duration: toastperiod,
      position: "top-right",
      className: "bg-red-400 text-white",
      style: {
        border: "2px solid rgb(192, 38, 19)",
      },
    });
    return;
  }

  try {
    setLoading(true);

    if (url[0] !== "/users") {
      delete data.password;
    }

    // console.log("D: ", data, subQuestions, options);

    action === "add"
      ? url[0] !== "/questions"
        ? await DataRegister(url[0], data)
        : await DataRegister(url[0], { data, subQuestions, options }) //Questions and Answers
      : action === "edit"
        ? url[0] !== "/questions"
          ? await DataEditorBySlug(url[0], data)
          : await DataEditorBySlug(url[0], { data, subQuestions, options }) //Questions and Answers
        : action === "password"
          ? await DataEditorBySlug(url[0], data)
          : null;

    if (lodash.isFunction(setSubQuestions)) {
      setSubQuestions([]);
    }

    if (lodash.isFunction(setOptions)) {
      setOptions([]);
    }

    mutate();

    setModal({
      open: false,
      action: "",
    });

    setData({});
  } catch (error) {
    console.log("E: ", error);
  } finally {
    setLoading(false);
    window.scrollTo({ top: 0 });
  }
};

export const handleSearchValue = (event, setSearch) => {
  event.preventDefault();

  setSearch(event.target.value);
};

export const handleClickDetail = (data, setData, setModal) => {
  setData(data);
  setModal({
    open: true,
    action: "detail",
  });
};

export const handleClickEdit = (data, setData, setModal) => {
  setData(data);
  setModal({
    open: true,
    action: "edit",
  });
};

export const handleClickKey = (data, setData, setModal) => {
  setData({ id: data.id, email: data.email });
  setModal({
    open: true,
    action: "password",
  });
};
