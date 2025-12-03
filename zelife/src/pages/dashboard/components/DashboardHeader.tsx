import Silk from "../../../components/react-bits/Silk";
import TopNavigation from "../../../components/navigation/topNavigation/TopNavigation";
import Paragraph from "../../../components/typography/Paragraph";
import { numberWithCommas } from "../../../utils/helper";
import { BiDollar } from "react-icons/bi";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineSync, MdSyncProblem } from "react-icons/md";

type Remaining = {
  balance: number;
  income: number;
  expense: number;
};

type DashboardHeaderProps = {
  remaining: Remaining;
  onAddTransaction: () => void;
  token: string;
  isLoading: boolean;
  error: string | null;
  onSync: () => void;
  addLabel: string;
};

export function DashboardHeader({
  remaining,
  onAddTransaction,
  token,
  isLoading,
  error,
  onSync,
  addLabel,
}: DashboardHeaderProps) {
  return (
    <div className="sticky top-1 max-w-5xl mx-auto z-[9999] bg-background rounded-b-[40px]">
      <div className="mx-2 rounded-4xl overflow-hidden h-[38vh] min-h-[38vh]">
        <Silk speed={8} scale={1} color="#d24670" noiseIntensity={1.5} rotation={0} />
        <div
          dir="ltr"
          className="absolute z-[9999] top-[50%] flex-col justify-center gap-2 items-center flex left-[50%] translate-x-[-50%] translate-y-[-50%]"
        >
          <div className="flex items-center gap-1">
            <Paragraph className="font-semibold !text-white !text-5xl left-0">
              {numberWithCommas(remaining.balance)}
            </Paragraph>
            <BiDollar className="!text-white size-6 mt-0.5" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 !text-white bg-green-500/30 px-2 rounded-4xl justify-center">
              <span className="text-[14px]">{numberWithCommas(remaining.income)}</span>
              <FaArrowDown className="size-2.5" />
            </div>
            <div className="flex items-center gap-1 !text-white bg-red-500/30 px-2 rounded-4xl justify-center">
              <span className="text-[14px]">{numberWithCommas(remaining.expense)}</span>
              <FaArrowUp className="size-2.5" />
            </div>
          </div>
        </div>
        <div className="absolute z-[9999] bottom-0 left-0 w-full py-4 px-6 flex justify-between items-center !text-white">
          <div
            onClick={onAddTransaction}
            className="bg-background-secondary/40 pr-[var(--padding-end)] !text-white pl-[var(--padding-start)] backdrop-blur-sm h-[40px] rounded-full flex items-center justify-center"
            style={{
              paddingInlineStart: "0.5rem",
              paddingInlineEnd: "0.75rem",
            }}
          >
            <IoIosAdd className="size-6" />
            <Paragraph className="!text-white">{addLabel}</Paragraph>
          </div>
          {token && (
            <div className="bg-background-secondary/40 backdrop-blur-sm h-[40px] w-[40px] flex items-center justify-center rounded-full">
              <div onClick={onSync}>
                {error ? (
                  <MdSyncProblem className="text-white size-5" />
                ) : (
                  <MdOutlineSync className={`text-white size-5 ${isLoading ? "animate-spin" : ""}`} />
                )}
              </div>
            </div>
          )}
        </div>
        <TopNavigation className="absolute top-0 left-0" />
      </div>
    </div>
  );
}
