import { FaChartLine, FaCreditCard } from "react-icons/fa";
import { useFinanceStore } from "../../../store/store";
// import { IoIosArrowDown } from "react-icons/io";

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

      <div className="flex items-center gap-2 !text-white">
        <div
          onClick={() => {
            alert("This Future Will add");
          }}
          className="h-[40px] bg-background-secondary/40 backdrop-blur-sm flex items-center justify-center px-3 gap-0.5 rounded-full"
        >
          <span className="font-medium">{selectedDate}</span>
        </div>
        <div
          onClick={() => {
            alert("This Future Will add");
          }}
          className="bg-background-secondary/40 w-[40px] backdrop-blur-sm h-[40px] rounded-full flex items-center justify-center"
        >
          <FaChartLine className="size-4" />
        </div>
        <div
          onClick={() => {
            alert("This Future Will add");
          }}
          className="bg-background-secondary/40 w-[40px] backdrop-blur-sm h-[40px] rounded-full flex items-center justify-center"
        >
          <FaCreditCard className="size-4" />
        </div>
      </div>
    </div>
  );
}
