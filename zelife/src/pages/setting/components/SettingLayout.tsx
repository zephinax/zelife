import type { ReactNode } from "react";
import ToggleSwitch from "../../../components/inputs/ToggleSwitch";
import Silk from "../../../components/react-bits/Silk";
import Paragraph from "../../../components/typography/Paragraph";

type SettingHeaderProps = {
  avatarUrl?: string | null;
  userName: string;
  title: string;
  versionLabel: string;
};

export function SettingHeader({
  avatarUrl,
  userName,
  title,
  versionLabel,
}: SettingHeaderProps) {
  return (
    <>
      <div className="relative rounded-[45px] min-h-[90px] h-[90px] overflow-hidden flex justify-start gap-4 items-center">
        <Silk
          speed={8}
          scale={0.6}
          color="#d24670"
          noiseIntensity={1.5}
          rotation={0}
        />
        <div className="absolute px-2 gap-4 top-[50%] translate-y-[-50%] w-full flex items-center justify-start">
          <img
            width={74}
            height={74}
            alt=""
            className="rounded-full bg-background"
            src={avatarUrl || "/logo.svg"}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/logo.svg";
            }}
          />
          <Paragraph size="lg" className="!text-white">
            {userName}
          </Paragraph>
        </div>
      </div>
      <div className="mx-2 flex items-center justify-between">
        <Paragraph className="font-medium" size="lg">
          {title}
        </Paragraph>
        <Paragraph className="!text-primary">{versionLabel}</Paragraph>
      </div>
    </>
  );
}

export function SettingCard({ children }: { children: ReactNode }) {
  return <div className="bg-background-secondary mx-2 rounded-3xl">{children}</div>;
}

export function SettingDivider() {
  return <div className="w-full h-[1px] bg-background mx-2"></div>;
}

type SettingRowProps = {
  children: ReactNode;
  onClick?: () => void;
  isLast?: boolean;
  interactive?: boolean;
  className?: string;
};

export function SettingRow({
  children,
  onClick,
  isLast = false,
  interactive,
  className = "",
}: SettingRowProps) {
  const isInteractive = interactive ?? Boolean(onClick);
  return (
    <>
      <div
        onClick={onClick}
        className={`p-4 flex justify-between items-center hover:bg-background/30 transition-colors ${className} ${
          isInteractive ? "cursor-pointer" : ""
        }`}
      >
        {children}
      </div>
      {!isLast && <SettingDivider />}
    </>
  );
}

type LabeledToggleProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  leftLabel: string;
  rightLabel: string;
  reverse?: boolean;
};

export function LabeledToggle({
  checked,
  onChange,
  leftLabel,
  rightLabel,
  reverse = false,
}: LabeledToggleProps) {
  return (
    <div className="flex items-center relative justify-center gap-4">
      <ToggleSwitch checked={checked} onChange={onChange} />
      <div
        className={`absolute flex bottom-[-12px] w-[40px] justify-between left-1 ${
          reverse ? "flex-row-reverse" : ""
        }`}
      >
        <Paragraph className="text-[8px]">{leftLabel}</Paragraph>
        <Paragraph className="text-[8px]">{rightLabel}</Paragraph>
      </div>
    </div>
  );
}
