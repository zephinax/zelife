import React, {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type JSX,
} from "react";

export interface SwipeAction<T = any> {
  type: string;
  icon: React.ComponentType<any> | React.ReactNode;
  function: (item: T) => void;
  color: string;
  textColor?: string;
  hoverColor?: string;
  label?: string;
}

interface SwipeActionsProps<T = any> {
  children: ReactNode;
  item: T;
  actions: SwipeAction<T>[];
  actionWidth?: number;
  swipeThreshold?: number;
}

const SwipeActions = <T,>({
  children,
  item,
  actions,
  actionWidth = 70,
  swipeThreshold = 50,
}: SwipeActionsProps<T>): JSX.Element => {
  const [translateX, setTranslateX] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const TOTAL_ACTIONS_WIDTH = actions.length * actionWidth;

  const handleStart = (clientX: number): void => {
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleMove = (clientX: number): void => {
    if (!isDragging) return;

    const deltaX = startX - clientX;
    const newTranslateX = Math.max(0, Math.min(TOTAL_ACTIONS_WIDTH, deltaX));
    setTranslateX(newTranslateX);
  };

  const handleEnd = (): void => {
    setIsDragging(false);

    if (translateX > swipeThreshold) {
      setTranslateX(TOTAL_ACTIONS_WIDTH);
      setShowActionButtons(true);
    } else {
      setTranslateX(0);
      setShowActionButtons(false);
    }
  };

  const handleActionClick =
    (action: SwipeAction<T>) =>
    (e: React.MouseEvent<HTMLButtonElement>): void => {
      e.preventDefault();
      e.stopPropagation();
      action.function(item);
      // Optionally hide actions after click
      setTranslateX(0);
      setShowActionButtons(false);
    };

  const handleClickOutside = (e: MouseEvent): void => {
    if (
      showActionButtons &&
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)
    ) {
      setTranslateX(0);
      setShowActionButtons(false);
    }
  };

  useEffect(() => {
    if (showActionButtons) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [showActionButtons]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    setStartX(e.touches[0].clientX);
    setIsDragging(false); // not dragging yet
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    const deltaX = startX - e.touches[0].clientX;

    // Only treat as swipe if moved enough horizontally
    if (Math.abs(deltaX) > 5) {
      e.preventDefault(); // block scroll only during horizontal swipe
      setIsDragging(true);
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (): void => {
    if (isDragging) {
      handleEnd(); // complete swipe
    }
    setIsDragging(false);
  };

  // Mouse event handlers
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

  const getHoverColor = (color: string): string => {
    // Simple color darkening - you can enhance this
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const darkenAmount = 20;
    const newR = Math.max(0, r - darkenAmount)
      .toString(16)
      .padStart(2, "0");
    const newG = Math.max(0, g - darkenAmount)
      .toString(16)
      .padStart(2, "0");
    const newB = Math.max(0, b - darkenAmount)
      .toString(16)
      .padStart(2, "0");

    return `#${newR}${newG}${newB}`;
  };

  const renderIcon = (icon: React.ComponentType<any> | React.ReactNode) => {
    if (React.isValidElement(icon)) {
      return icon;
    }

    if (typeof icon === "function") {
      const IconComponent = icon as React.ComponentType<any>;
      return <IconComponent size={20} className="w-5 h-5" />;
    }

    return icon;
  };

  // Don't render if no actions
  if (!actions || actions.length === 0) {
    return <div>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg"
      style={{ touchAction: "pan-y" }}
    >
      {/* Action buttons container */}
      <div
        className="absolute top-0 right-0 h-full flex items-center transition-all duration-200 z-10"
        style={{
          width: `${TOTAL_ACTIONS_WIDTH}px`,
          transform: `translateX(${
            showActionButtons ? 0 : TOTAL_ACTIONS_WIDTH
          }px)`,
        }}
      >
        {actions.map((action, index) => {
          const isLast = index === actions.length - 1;
          const hoverColor = action.hoverColor || getHoverColor(action.color);

          return (
            <button
              key={`${action.type}-${index}`}
              onClick={handleActionClick(action)}
              className={`h-full text-white flex items-center justify-center transition-colors ${
                isLast ? "rounded-r-lg" : ""
              }`}
              style={{
                width: `${actionWidth}px`,
                minHeight: "60px",
                backgroundColor: action.color,
                color: action.textColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = action.color;
              }}
              title={action.label || action.type}
            >
              {renderIcon(action.icon)}
            </button>
          );
        })}
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

export default SwipeActions;
