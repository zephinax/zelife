import React, { useEffect, useState, type ReactNode } from "react";
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
    <div className="fixed inset-0 z-[999] backdrop-blur-[1px] flex items-center justify-center">
      <div
        className={`absolute inset-0 z-[999] bg-[#0000006c] transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      ></div>
      <div
        className={`relative bg-background-secondary z-[9999] rounded-xl border-secondary-200 mx-auto transition-all duration-300 transform ease-in-out ${
          visible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-8"
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
        } ${className || ""}`}
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
            <button onClick={handleClose} className="ml-0 block cursor-pointer">
              <FaXmark className="text-primary size-4" />
            </button>
          </div>
        </div>
        <div className={`max-h-[90svh] px-4 pb-2 ${overflowY}`}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
