"use client";

import allMetadatas from "@/jsons/metadatas.json";
import { SolidButton } from "@/components/MyButton";
import { MySearch } from "@/components/MyInput";
import { useTranslation } from "@/hooks/useTranslation";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import useSWR from "swr";
import lodash from "lodash";
import { fetcher } from "@/libs/client";
import { FullSpinner } from "@/components/Spinner";
import { FullModal } from "@/components/Modal";
import { MyError } from "@/components/MyText";
import { QuestionnaireTable } from "@/components/MyTable";

const QuestionsAnswers = () => {
  const [options, setOptions] = useState([]);
  const [subQuestions, setSubQuestions] = useState([]);
  const uris = useMemo(() => {
    return [
      "/questions",
      "/questiontypes/active",
      "/modules/active",
      "/answertypes/active",
      "/assessments/active",
      "/subquestions",
      "/options",
    ];
  }, []);

  const {
    data: allDatas = [],
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(uris, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    condition: "",
  });
  const [search, setSearch] = useState("");
  const t = useTranslation();
  const [modal, setModal] = useState({
    open: false,
    action: "",
  });
  const metadatas = allMetadatas?.filter((m) => m.title === "questions")[0]
    ?.metadatas;

  useEffect(() => {
    if (!lodash.isEmpty(data?.id)) {
      setSubQuestions(allDatas[5].filter((o) => o.questionId === data?.id));
      setOptions(allDatas[6].filter((o) => o.questionId === data?.id));
    } else {
      setSubQuestions([]);
      setOptions([]);
    }
  }, [data?.id]);

  if (isLoading) {
    return <FullSpinner />;
  }

  if (error) {
    console.error(error);
  }

  const handleChangeValue = (event, index, action) => {
    event.preventDefault();

    if (action === "subquestion") {
      setSubQuestions([
        ...subQuestions.slice(0, index),
        { ...subQuestions[index], [event.target.name]: event.target.value },
        ...subQuestions.slice(index + 1),
      ]);
    } else if (action === "option") {
      setOptions([
        ...options.slice(0, index),
        { ...options[index], [event.target.name]: event.target.value },
        ...options.slice(index + 1),
      ]);
    }
  };

  return (
    <div className="mx-20 flex flex-col justify-center items-start">
      <Toaster />
      <p className="my-3 font-bold text-blue-900 text-xl">
        {t("businesses.questionsanswers.title")}
      </p>
      {modal.open ? (
        <FullModal
          action={modal.action}
          metadatas={metadatas}
          modal="questionnaire"
          data={data}
          setModal={setModal}
          setData={setData}
          setLoading={setLoading}
          loading={loading}
          url={uris}
          mutate={mutate}
          selection={{
            questionTypes: allDatas[1],
            modules: allDatas[2],
            answerTypes: allDatas[3],
            assessments: allDatas[4],
          }}
          options={options}
          setOptions={setOptions}
          subQuestions={subQuestions}
          setSubQuestions={setSubQuestions}
          handleChangeValue={handleChangeValue}
        />
      ) : (
        <Fragment>
          <div className="mb-5 w-full flex justify-start items-center gap-5">
            <SolidButton
              label={t("action.Add")}
              color="green"
              size="small"
              setModal={setModal}
              setData={setData}
              action={modal.action}
            />
            <MySearch setSearch={setSearch} />
          </div>
          {lodash.isEmpty(allDatas[0]) ? (
            <MyError />
          ) : (
            <QuestionnaireTable
              metadatas={metadatas}
              datas={allDatas[0]}
              search={search}
              setModal={setModal}
              setData={setData}
            />
          )}
        </Fragment>
      )}
    </div>
  );
};

export default QuestionsAnswers;
