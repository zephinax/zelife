import type { ReactNode } from "react";
import Silk from "../../../components/react-bits/Silk";
import TrueFocus from "../../../components/reactBits/trueFocus/TrueFocus";
import Paragraph from "../../../components/typography/Paragraph";

type TaskHeroProps = {
  title: string;
};

export function TaskHero({ title }: TaskHeroProps) {
  return (
    <div className="relative rounded-[45px] min-h-[90px] h-[90px] overflow-hidden flex justify-start gap-4 items-center">
      <Silk
        speed={8}
        scale={0.6}
        color="#d24670"
        noiseIntensity={1.5}
        rotation={0}
      />
      <div className="!text-white text-3xl absolute px-6 gap-4 top-[50%] translate-y-[-50%] w-full flex items-center justify-center">
        <TrueFocus
          blurAmount={2.5}
          manualMode={false}
          borderColor="var(--color-primary)"
          sentence={title}
        />
      </div>
    </div>
  );
}

type TaskToolbarProps = {
  tasksLabel: string;
  createLabel: string;
  pendingCount: number;
  onCreate: () => void;
  createIcon?: ReactNode;
};

export function TaskToolbar({
  tasksLabel,
  createLabel,
  pendingCount,
  onCreate,
  createIcon,
}: TaskToolbarProps) {
  return (
    <div className="w-full flex justify-between items-center">
      <Paragraph className="font-medium" size="lg">
        {tasksLabel} : {pendingCount}
      </Paragraph>
      <Paragraph
        onClick={onCreate}
        size="md"
        className="!text-primary flex items-center gap-1 cursor-pointer"
      >
        {createLabel} {createIcon}
      </Paragraph>
    </div>
  );
}
