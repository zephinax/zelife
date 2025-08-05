import React, { useEffect, useState, type ReactNode, useRef } from "react";
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

  const startYRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  // تشخیص سایز صفحه
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsSmallScreen(window.innerWidth < 768); // md breakpoint تقریبی
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

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

        dragYRef.current = 0;
        if (modalRef.current) {
          modalRef.current.style.transform = "translateY(0)";
          modalRef.current.style.transition = "";
        }
      }, 300);
    }

    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    dragYRef.current = 0;
    if (modalRef.current) {
      modalRef.current.style.transform = "translateY(0)";
      modalRef.current.style.transition = "";
    }
  };

  const onDragStart = (clientY: number) => {
    if (!isSmallScreen) return;
    draggingRef.current = true;
    startYRef.current = clientY;
  };

  const dragYRef = useRef(0);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const onDragMove = (clientY: number) => {
    if (!draggingRef.current || startYRef.current === null) return;
    const diff = clientY - startYRef.current;
    if (diff > 0) {
      dragYRef.current = diff;
      if (modalRef.current) {
        modalRef.current.style.transform = `translateY(${diff}px)`;
      }
    }
  };

  const onDragEnd = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (dragYRef.current > 100) {
      handleClose();
    } else {
      // بازگردانی آرام به جایگاه اصلی با انیمیشن
      if (modalRef.current) {
        modalRef.current.style.transition = "transform 0.3s ease";
        modalRef.current.style.transform = "translateY(0)";
        // پس از پایان انیمیشن، transition را پاک کن
        const cleanup = () => {
          if (modalRef.current) {
            modalRef.current.style.transition = "";
          }
          modalRef.current?.removeEventListener("transitionend", cleanup);
        };
        modalRef.current.addEventListener("transitionend", cleanup);
      }
    }
    dragYRef.current = 0;
    startYRef.current = null;
  };

  if (!show) return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 z-[99999] backdrop-blur-[1px] bg-transparent flex items-end justify-center md:items-center md:justify-center`}
      onClick={handleClose}
    >
      <div
        className={`absolute inset-0 z-[99999] bg-[#0000006c] transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      ></div>
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => onDragStart(e.clientY)}
        onMouseMove={(e) => onDragMove(e.clientY)}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={(e) => onDragStart(e.touches[0].clientY)}
        onTouchMove={(e) => onDragMove(e.touches[0].clientY)}
        onTouchEnd={onDragEnd}
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
        style={{
          transform: visible ? "translateY(0)" : "translateY(100%)",
          touchAction: "none",
          cursor: isSmallScreen
            ? draggingRef.current
              ? "grabbing"
              : "grab"
            : "default",
        }}
      >
        <div className="pt-6 md:pt-4 pb-3 px-2 flex justify-center relative md:justify-between items-center cursor-grab">
          <div className="h-[8px] w-[40px] bg-background rounded-[5px] md:hidden absolute top-3"></div>
          {typeof title === "string" ? (
            <Paragraph size="lg" className="!mb-0">
              {title}
            </Paragraph>
          ) : (
            title
          )}
          <button onClick={handleClose} className="ml-0 block cursor-pointer">
            <FaXmark className="text-primary size-4 hidden md:inline-block" />
          </button>
        </div>
        <div className={`max-h-[90svh] pb-2 ${overflowY}`}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
