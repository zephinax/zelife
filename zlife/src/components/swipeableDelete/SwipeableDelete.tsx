import React, { useState, useRef, useEffect, type ReactNode } from "react";

interface SwipeableDeleteProps {
  children: ReactNode;
  onDelete: (notificationId: string | number) => void;
  itemId: string | number;
}

const SwipeableDelete: React.FC<SwipeableDeleteProps> = ({
  children,
  onDelete,
  itemId,
}) => {
  const [translateX, setTranslateX] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 50;
  const DELETE_BUTTON_WIDTH = 70;

  const handleStart = (clientX: number): void => {
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleMove = (clientX: number): void => {
    if (!isDragging) return;

    const deltaX = startX - clientX;
    const newTranslateX = Math.max(0, Math.min(DELETE_BUTTON_WIDTH, deltaX));
    setTranslateX(newTranslateX);
  };

  const handleEnd = (): void => {
    setIsDragging(false);

    if (translateX > SWIPE_THRESHOLD) {
      setTranslateX(DELETE_BUTTON_WIDTH);
      setShowDeleteButton(true);
    } else {
      setTranslateX(0);
      setShowDeleteButton(false);
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(itemId);
  };

  const handleClickOutside = (e: MouseEvent): void => {
    if (
      showDeleteButton &&
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)
    ) {
      setTranslateX(0);
      setShowDeleteButton(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDeleteButton]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = (): void => {
    handleEnd();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    handleMove(e.clientX);
  };

  const handleMouseUp = (): void => {
    handleEnd();
  };

  const handleMouseLeave = (): void => {
    if (isDragging) {
      handleEnd();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg"
      style={{ touchAction: "pan-y" }}
    >
      <div
        className="absolute top-0 right-0 h-full flex items-center justify-center bg-red-500 text-white transition-all duration-200"
        style={{
          width: `${DELETE_BUTTON_WIDTH}px`,
          transform: `translateX(${
            showDeleteButton ? 0 : DELETE_BUTTON_WIDTH
          }px)`,
        }}
      >
        <button
          onClick={handleDelete}
          className="h-[calc(100%-6px)] translate-y-[-2px] relative w-full bg-danger-500 max-w-[100px] rounded-r-xl flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {showDeleteButton && (
            <div className="w-10 h-[85.2px] absolute top-0 right-[90%] bg-danger-500"></div>
          )}
        </button>
      </div>

      <div
        className="relative pb-1 transition-transform duration-200 ease-out"
        style={{
          transform: `translateX(-${translateX}px)`,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleMouseMove : undefined}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeableDelete;
