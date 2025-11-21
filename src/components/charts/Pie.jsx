"use client";

import { blue, chartFontSize, green, textblue } from "@/libs/constants";
import clsx from "clsx";
import React from "react";
import { PieChart, Pie, Cell, LabelList, Legend, Tooltip } from "recharts";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > ncx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={chartFontSize}
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

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

export const PieCustom = ({ data, colors }) => {
  return (
    <div className="max-w-[400px] max-h-[400px] aspect-square">
      <PieChart responsive margin={0} height={400} width={400}>
        <Pie
          data={data}
          dataKey="value"
          innerRadius="45%" // Нийт талбайн эзлэх дотор талын хувь
          outerRadius="80%" // Нийт талбайн эзлэх гадна талын хувь
          isAnimationActive={true}
          label={renderCustomizedLabel}
          labelLine={false}
        >
          <LabelList dataKey="value" position="inside" angle={0} />
          <Legend
            verticalAlign="bottom"
            iconSize={8}
            iconType="circle"
            wrapperStyle={{ fontSize: chartFontSize }}
          />
          <Tooltip />
          {colors?.map((color, index) => {
            return <Cell key={index} fill={color} />;
          })}
        </Pie>
      </PieChart>
    </div>
  );
};
