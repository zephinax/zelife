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
    if (showDeleteButton) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [showDeleteButton]);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    e.preventDefault(); // Prevent scrolling
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    if (isDragging) {
      e.preventDefault(); // Prevent scrolling while swiping
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>): void => {
    e.preventDefault();
    handleEnd();
  };

  // Mouse event handlers (for testing on desktop)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (isDragging) {
      e.preventDefault();
      handleMove(e.clientX);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
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
      {/* Delete button */}
      <div
        className="absolute top-0 right-0 h-full flex items-center justify-center bg-red-500 text-white transition-all duration-200 z-10"
        style={{
          width: `${DELETE_BUTTON_WIDTH}px`,
          transform: `translateX(${
            showDeleteButton ? 0 : DELETE_BUTTON_WIDTH
          }px)`,
        }}
      >
        <button
          onClick={handleDelete}
          className="h-full w-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors rounded-r-lg"
          style={{ minHeight: "60px" }} // Ensure minimum touch target
        >
          <svg
            width="20"
            height="20"
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
        </button>
      </div>

      {/* Main content */}
      <div
        className="relative transition-transform duration-200 ease-out select-none"
        style={{
          transform: `translateX(-${translateX}px)`,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleMouseMove : undefined}
        onMouseUp={isDragging ? handleMouseUp : undefined}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeableDelete;
