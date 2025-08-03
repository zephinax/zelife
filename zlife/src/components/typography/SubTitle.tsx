import React from "react";
import type { Title_Props_Type } from "./types";

const SubTitle: React.FC<Title_Props_Type> = ({ children, className }) => {
  return (
    <h2
      className={`text-md font-semibold w-fit block text-secondary-900 mb-2 ${
        className || ""
      }`}
    >
      {children}
    </h2>
  );
};

export default SubTitle;
