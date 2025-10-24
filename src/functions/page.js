"use client";

import lodash from "lodash";
import toast from "react-hot-toast";

import { DataEditorBySlug, DataRegister } from "./Data";

export const handleClickAdd = (setModal, setData) => {
  setModal({
    open: true,
    action: "add",
  });
  setData({});
};

export const handleClickCancel = (setModal, setData) => {
  setData({});
  setModal({
    open: false,
    action: "",
  });
};

export const handleChangeValue = (event, setData, data) => {
  event.preventDefault();

  setData({
    ...data,
    [event.target.name]: event.target.value,
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
  setSubQuestions = undefined
) => {
  event.preventDefault();

  if (!lodash.isEmpty(data)) {
    setLoading(true);

    if (url[0] !== "/users") {
      delete data.password;
    }

    action === "add"
      ? url[0] === "/users"
        ? data.password === data.confirmPassword
          ? await DataRegister(url[0], data)
          : toast.error("Нууц үг хоорондоо тохирохгүй байна.", {
              duration: 2000,
              position: "top-right",
              className: "bg-red-400 text-white",
              style: {
                border: "2px solid rgb(192, 38, 19)",
              },
            })
        : url[0] !== "/questions"
          ? await DataRegister(url[0], data)
          : await DataRegister(url[0], { data, subQuestions, options }) //Questions and Answers
      : action === "edit"
        ? url[0] !== "/questions"
          ? await DataEditorBySlug(url[0], data)
          : await DataEditorBySlug(url[0], { data, subQuestions, options }) //Questions and Answers
        : action === "password"
          ? data.password === data.confirmPassword
            ? await DataEditorBySlug(url[0], data)
            : toast.error("Нууц үг хоорондоо тохирохгүй байна.", {
                duration: 2000,
                position: "top-right",
                className: "bg-red-400 text-white",
                style: {
                  border: "2px solid rgb(192, 38, 19)",
                },
              })
          : null;
  } else {
    toast.error("Өгөгдөл дутуу байна.", {
      duration: 2000,
      position: "top-right",
      className: "bg-red-400 text-white",
      style: {
        border: "2px solid rgb(192, 38, 19)",
      },
    });
  }

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

  setLoading(false);
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
