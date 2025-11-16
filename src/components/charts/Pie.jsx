"use client";

import { blue, green, textblue } from "@/libs/constants";
import clsx from "clsx";
import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const PieDefault = ({ total, performance }) => {
  const data = [
    { name: "Хариулаагүй", value: total - performance },
    { name: "Хариулсан", value: performance },
  ];
  const COLORS = [blue, green];

  return (
    <div className="relative w-full max-w-[300px] max-h-[300px] aspect-square">
      <PieChart responsive margin={0} height={300} width={300}>
        <Pie
          data={data}
          dataKey="value"
          innerRadius="50%" // Нийт талбайн эзлэх дотор талын хувь
          outerRadius="90%" // Нийт талбайн эзлэх гадна талын хувь
          isAnimationActive={true}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
      <div className="absolute inset-0 flex items-center justify-center">
        <p className={clsx("text-3xl font-bold", textblue)}>
          {performance} / {total}
        </p>
      </div>
    </div>
  );
};

export default PieDefault;
