// import React, { forwardRef } from "react";
// import Textarea from "./Textarea"; // Ensure the import path is correct
// import Label from "../typography/Label";
// import { LabeledTextareaProps } from "./types";

// const LabeledTextarea = forwardRef<HTMLTextAreaElement, LabeledTextareaProps>(
//   ({ label, htmlFor, labelClassName, className, errorText, ...rest }, ref) => {
//     return (
//       <div className={`relative flex flex-col ${className || ""}`}>
//         <Label
//           text={label}
//           htmlFor={htmlFor}
//           className={`absolute z-10 -top-2 mr-1 bg-white px-1 ${labelClassName}`}
//         />
//         <Textarea
//           id={htmlFor}
//           ref={ref}
//           errorText={errorText}
//           className="w-full"
//           {...rest}
//         />
//       </div>
//     );
//   },
// );

// LabeledTextarea.displayName = "LabeledTextarea";

// export default LabeledTextarea;

const LabeledTextarea = () => {
  return <div>LabeledTextarea</div>;
};

export default LabeledTextarea;
