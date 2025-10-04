import React from "react";

export default function NoData({ message = "No data available", color  }) {
  return (
    <div className="flex items-center justify-center h-[300px]">
      <p className={`${color} text-2xl font-extrabold  text-center`}>
        {message}
      </p>
    </div>
  );
}
