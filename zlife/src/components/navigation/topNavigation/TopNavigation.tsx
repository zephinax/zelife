import { FaChartLine, FaCreditCard } from "react-icons/fa";
import { useFinanceStore } from "../../../store/store";
import { BiChevronDown } from "react-icons/bi";
import Modal from "../../modal/Modal";
import { WheelDatePicker } from "@buildix/wheel-datepicker";
import { useState } from "react";

export default function TopNavigation({
  className = "",
}: {
  className?: string;
}) {
  const { defaultDate, selectedDate, avatarUrl } = useFinanceStore();
  const [date, setDate] = useState("");
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const DATE = selectedDate ? selectedDate : defaultDate;
  return (
    <div
      className={`flex p-4 w-full justify-between items-center ${className}`}
    >
      <img
        width={40}
        className="rounded-full bg-background-secondary"
        height={40}
        src={avatarUrl ? avatarUrl : "/logo.svg"}
      ></img>

      <div className="flex items-center gap-2 !text-white">
        <div
          onClick={() => {
            setIsDateModalOpen(true);
          }}
          className="h-[40px] bg-background-secondary/40 backdrop-blur-sm flex items-center justify-center px-3 gap-0.5 rounded-full rtl:flex-row-reverse"
        >
          <span className="font-medium">{DATE}</span>
          <BiChevronDown className="size-5 transform" />
        </div>

        <div className="bg-background-secondary/40 w-[40px] backdrop-blur-sm h-[40px] rounded-full flex items-center justify-center">
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
      <Modal
        size="sm"
        isOpen={isDateModalOpen}
        onClose={() => {
          setIsDateModalOpen(false);
        }}
        title="sdkhdsfsdhjsdj"
      >
        <WheelDatePicker
          className="text-text"
          value={date}
          onChange={setDate}
        />
      </Modal>
    </div>
  );
}
