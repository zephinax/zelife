import React from "react";

type SizeOption = "sm" | "md" | "lg";

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (state: boolean) => void;
  size?: SizeOption | number;
  accentColor?: string; // single hex color string like "#10b981"
};

const sizeClasses = {
  sm: {
    container: "w-12 h-6",
    knob: "after:h-4 after:w-4",
    translate: "peer-checked:after:translate-x-6",
  },
  md: {
    container: "w-16 h-8",
    knob: "after:h-6 after:w-6",
    translate: "peer-checked:after:translate-x-8",
  },
  lg: {
    container: "w-24 h-12",
    knob: "after:h-10 after:w-10",
    translate: "peer-checked:after:translate-x-12",
  },
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  size = "sm",
  accentColor = "#d24670",
}) => {
  const checkedBgStyle = {
    backgroundImage: checked
      ? `linear-gradient(to right, ${accentColor}, ${shadeColor(
          accentColor,
          -40
        )})`
      : undefined,
  };

  // Helper to shade a hex color by a percentage (negative for darker)
  function shadeColor(color: string, percent: number) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = Math.min(255, Math.max(0, R + (R * percent) / 100));
    G = Math.min(255, Math.max(0, G + (G * percent) / 100));
    B = Math.min(255, Math.max(0, B + (B * percent) / 100));

    const rStr = Math.round(R).toString(16).padStart(2, "0");
    const gStr = Math.round(G).toString(16).padStart(2, "0");
    const bStr = Math.round(B).toString(16).padStart(2, "0");
    return `#${rStr}${gStr}${bStr}`;
  }

  if (typeof size === "number") {
    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          style={{
            ...checkedBgStyle,
            width: size * 2,
            height: size,
            transition: "background-image 0.3s ease",
            boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.1.5)",
          }}
          className={`
            group peer ring-0 bg-[var(--color-background)]
            rounded-full outline-none duration-1000 shadow-md
            peer-focus:outline-none
            after:content-[''] after:rounded-full after:absolute
            after:top-1 after:left-1 after:outline-none after:duration-300
            peer-checked:after:rotate-180 peer-hover:after:scale-95
     
            after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)]
          `}
        >
          <style>
            {`
              div::after {
                width: ${size * 0.8}px;
                height: ${size * 0.8}px;
              }
              .peer-checked:after {
                transform: translateX(${size}px) rotate(180deg);
              }
            `}
          </style>
        </div>
      </label>
    );
  }

  const currentSize = sizeClasses[size] ?? sizeClasses.sm;

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div
        style={{
          ...checkedBgStyle,
          transition: "background-image 0.3s ease",
          boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.1.5)",
        }}
        className={`
          group peer ring-0 bg-[var(--color-background)]
          rounded-full outline-none duration-1000 shadow-md
          peer-focus:outline-none
          ${currentSize.container}
          ${currentSize.knob}
          peer-checked:after:rotate-180
          ${currentSize.translate}
          peer-hover:after:scale-95
          after:content-['']
          after:rounded-full after:absolute after:top-1 after:left-1
          after:outline-none
          after:duration-300
          after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)]
        `}
      />
    </label>
  );
};

export default ToggleSwitch;
