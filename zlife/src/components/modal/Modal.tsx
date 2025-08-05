import React, { useEffect, useState, type ReactNode } from "react";
import ReactDOM from "react-dom";
import { FaXmark } from "react-icons/fa6";
import Paragraph from "../typography/Paragraph";

export interface ModalProps {
  title: string | ReactNode;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
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
  size = "fit",
  overflowY = "overflow-y-auto",
}) => {
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isOpen) {
      setShow(true);
      timeoutId = setTimeout(() => {
        setVisible(true);
      }, 20);
    } else {
      setVisible(false);
      timeoutId = setTimeout(() => {
        setShow(false);
      }, 300);
    }

    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  if (!show) return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 z-[99999] backdrop-blur-[1px] bg-transparent flex items-end justify-center md:items-center md:justify-center
    `}
      onClick={handleClose}
    >
      <div
        className={`absolute inset-0 z-[99999] bg-[#0000006c] transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      ></div>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
         relative bg-background-secondary px-4 z-[999999] border-secondary-200 mx-auto transition-all duration-300 ease-in-out
         ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"}
         max-w-[90%]
         ${
           size === "sm"
             ? "w-full"
             : size === "md"
             ? "w-full"
             : size === "lg"
             ? "w-[1100px]"
             : size === "xl"
             ? "!w-[80%]"
             : size === "full"
             ? "w-[90%]"
             : ""
         }
         rounded-t-4xl rounded-b-none
         md:min-w-[400px]
         fixed bottom-0 left-0 right-0 max-w-full
         md:relative md:rounded-4xl md:max-w-[90%] md:w-auto md:bottom-auto md:left-auto md:right-auto md:fixed-none
       `}
      >
        <div className="pt-4 pb-3 px-2 flex justify-between items-center">
          {typeof title === "string" ? (
            <Paragraph size="lg" className="!mb-0">
              {title}
            </Paragraph>
          ) : (
            title
          )}
          <button onClick={handleClose} className="ml-0 block cursor-pointer">
            <FaXmark className="text-primary size-4" />
          </button>
        </div>
        <div className={`max-h-[90svh] pb-2 ${overflowY}`}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
