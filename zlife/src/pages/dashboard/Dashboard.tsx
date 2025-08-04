import TopNavigation from "../../components/navigation/topNavigation/TopNavigation";
import Silk from "../../components/react-bits/Silk";
import Paragraph from "../../components/typography/Paragraph";

export default function Dashboard() {
  return (
    <div className="w-screen min-h-screen">
      <div className="relative h-[40vh] rounded-b-3xl overflow-hidden">
        <Silk
          speed={5}
          scale={1}
          color="#d24670"
          noiseIntensity={1.5}
          rotation={0}
        />
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <Paragraph className=" font-semibold !text-white !text-5xl left-0">
            00 $
          </Paragraph>
        </div>
        <TopNavigation className="absolute top-0" />
      </div>
      <div className="px-4 pt-4">
        <div className="bg-background-secondary p-2 w-full rounded-xl">
          <div>sdsd</div>
          <div>sdsds</div>
          <div>sdfsdfd</div>
        </div>
      </div>
    </div>
  );
}
