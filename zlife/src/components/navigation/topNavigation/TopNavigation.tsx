import { FaChartLine, FaCreditCard } from "react-icons/fa";
import { useFinanceStore } from "../../../store/store";
import { IoIosArrowDown } from "react-icons/io";

export default function TopNavigation({
  className = "",
}: {
  className?: string;
}) {
  const { selectedDate } = useFinanceStore();
  return (
    <div
      className={`flex p-4 w-full justify-between items-center ${className}`}
    >
      <img
        width={40}
        className="rounded-full bg-background-secondary"
        height={40}
        src="/logo.svg"
      ></img>

      <div className="flex items-center gap-2 text-white">
        <div className="h-[40px] bg-background-secondary/40 flex items-center justify-center pl-2 pr-3 gap-0.5 rounded-full">
          <IoIosArrowDown className="size-4" />
          <span className="font-medium">{selectedDate}</span>
        </div>
        <div className="bg-background-secondary/40 w-[40px] h-[40px] rounded-full flex items-center justify-center">
          <FaChartLine className="size-4" />
        </div>
        <div className="bg-background-secondary/40 w-[40px] h-[40px] rounded-full flex items-center justify-center">
          <FaCreditCard className="size-4" />
        </div>
      </div>
    </div>
  );
}
