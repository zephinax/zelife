import PageLayout from "../../components/layouts/pageLayout/PageLayout";
import Silk from "../../components/react-bits/Silk";
import Title from "../../components/typography/Title";

export default function Tasks() {
  return (
    <PageLayout>
      <div className="relative rounded-full h-[75px] overflow-hidden flex justify-start gap-4 items-center">
        <Silk
          speed={8}
          scale={0.6}
          color="#d24670"
          noiseIntensity={1.5}
          rotation={0}
        />
        <div className="absolute px-6 gap-4 top-[50%] translate-y-[-50%] w-full flex items-center justify-center">
          <Title className="!text-white">Task Manager</Title>
        </div>
      </div>
    </PageLayout>
  );
}
