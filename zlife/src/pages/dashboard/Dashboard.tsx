import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import TopNavigation from "../../components/navigation/topNavigation/TopNavigation";
import Silk from "../../components/react-bits/Silk";
import Paragraph from "../../components/typography/Paragraph";
import { useFinanceStore } from "../../store/store";
import { numberWithCommas, parseShamsiDate } from "../../utils/helper";
import { BiDollar } from "react-icons/bi";
import { IoIosAdd } from "react-icons/io";
import Modal from "../../components/modal/Modal";

export default function Dashboard() {
  const { getSummaryByMonth, selectedDate } = useFinanceStore();
  const { year, month } = parseShamsiDate(selectedDate);
  const remaining = getSummaryByMonth(String(year), String(month));

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
        <div className="absolute top-[50%] flex-col justify-center gap-2 items-center flex left-[50%] translate-x-[-50%] translate-y-[-50%] ">
          <div className="flex items-center gap-1">
            <Paragraph className=" font-semibold !text-white !text-5xl left-0">
              {numberWithCommas(remaining.balance)}
            </Paragraph>
            <BiDollar className="!text-white size-6" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 !text-white bg-green-500/30 px-2 rounded-4xl justify-center">
              <span className="text-[14px]">
                {numberWithCommas(remaining.income)}
              </span>
              <FaArrowDown className="size-2.5" />
            </div>
            <div className="flex items-center gap-1 !text-white bg-red-500/30 px-2 rounded-4xl justify-center">
              <span className="text-[14px]">
                {numberWithCommas(remaining.expense)}
              </span>
              <FaArrowUp className="size-2.5" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-full p-4 flex justify-between items-center !text-white">
          <div className="bg-background-secondary/40 backdrop-blur-sm w-[40px] h-[40px] rounded-full flex items-center justify-center">
            <IoIosAdd className="size-6" />
          </div>
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
      <Modal size="sm" title={"sdsd"} isOpen onClose={() => {}}>
        sdsd
      </Modal>
    </div>
  );
}
