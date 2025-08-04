import React, { type ReactNode } from "react";
import Title from "../typography/Title";

import ReactDOM from "react-dom";
import { FaXmark } from "react-icons/fa6";
import Paragraph from "../typography/Paragraph";

export interface ModalProps {
  title: string | ReactNode;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  overflowY?:
    | "overflow-y-auto"
    | "overflow-y-hidden"
    | "overflow-y-visible"
    | "overflow-y-scroll"
    | "overflow-y-clip";
  size?: "sm" | "md" | "lg" | "xl" | "full" | "fit";
}

const Modal: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  className,
  size = "fit",
  overflowY = "overflow-y-auto",
}) => {
  const handleClose = () => {
    onClose();
  };

  return (
    isOpen &&
    ReactDOM.createPortal(
      <div
        className={`fixed inset-0 z-[999] backdrop-blur-[1px] flex items-center justify-center ${
          isOpen ? "translate-y-0" : "translate-y-[100%] delay-500"
        }`}
      >
        <div
          className={`absolute inset-0 z-[999] bg-[#0000006c] transition-opacity duration-500 delay-100 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          // onClick={handleClose}
        ></div>
        <div
          className={`relative bg-background-secondary z-[9999] rounded-xl border-secondary-200 mx-auto  transition-all duration-300 delay-200 ${
            isOpen ? "opacity-100" : "opacity-0"
          } max-w-[90%] ${
            size === "sm"
              ? "w-[370px]"
              : size === "md"
              ? "w-[750px]"
              : size === "lg"
              ? "w-[1100px]"
              : size === "xl"
              ? "!w-[80%]"
              : size === "full"
              ? "w-[90%]"
              : ""
          }   ${className || ""}`}
        >
          <div className="px-4">
            <div className="flex pt-3 pb-2 justify-between items-center">
              {typeof title === "string" ? (
                <Paragraph size="lg" className="!mb-0">
                  {title}
                </Paragraph>
              ) : (
                title
              )}
              <button
                onClick={handleClose}
                className="ml-0 block cursor-pointer"
              >
                <FaXmark className="text-primary size-4" />
              </button>
            </div>
          </div>
          <div className={`max-h-[90svh] px-4 pb-2 ${overflowY}`}>
            {children}
          </div>
        </div>
      </div>,
      document.body
    )
  );
};

export default Modal;
