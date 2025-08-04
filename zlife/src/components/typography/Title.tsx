import React from "react";
import type { Title_Props_Type } from "./types";

const Title: React.FC<Title_Props_Type> = ({ children, className }) => {
  return (
    <h1
      className={`text-2xl font-bold w-fit block text-text ${className || ""}`}
    >
      {children}
    </h1>
  );
};

export default Title;
