"use client";

import React from "react";
import { Toaster } from "react-hot-toast";

import { useSystemStore } from "@/stores/storeSystem";

const Dashboard = () => {
  const { system } = useSystemStore();
  return (
    <div>
      <div className="mx-20 flex flex-col justify-center items-start">
        <Toaster />
        <p className="mt-10 mb-5 font-bold text-blue-900 text-xl">
          {system?.year}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
