import { FaChartLine, FaCreditCard } from "react-icons/fa";
import { useFinanceStore } from "../../../store/store";
import { BiChevronDown } from "react-icons/bi";
import Modal from "../../modal/Modal";
import { WheelDatePicker } from "@buildix/wheel-datepicker";
import { useState } from "react";
import "@buildix/wheel-datepicker/dist/index.css";
import { useTranslation } from "../../../hooks/useTranslation";
import Paragraph from "../../typography/Paragraph";
export default function TopNavigation({
  className = "",
}: {
  className?: string;
}) {
  const { defaultDate, selectedDate, avatarUrl, setSelectedDate, language } =
    useFinanceStore();
  const { t } = useTranslation();
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const DATE = selectedDate ? selectedDate : defaultDate;

  return (
    <div
      className={`flex py-4 px-6 w-full justify-between items-center ${className}`}
    >
      <img
        width={40}
        height={40}
        alt=""
        className="rounded-full bg-background-secondary z-[9999]"
        src={avatarUrl || "/logo.svg"}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/logo.svg";
        }}
      />

      <div className="flex items-center gap-2 !text-white z-[9999]">
        <div
          onClick={() => {
            setIsDateModalOpen(true);
          }}
          className="h-[40px] bg-background-secondary/40 backdrop-blur-sm flex items-center justify-center px-3 gap-0.5 rounded-full flex-row-reverse"
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
        draggable={false}
        overflowY="overflow-y-visible"
        size="sm"
        isOpen={isDateModalOpen}
        onClose={() => {
          setIsDateModalOpen(false);
        }}
        title={`${t("setting.selectDate")}`}
      >
        <div className="pb-4">
          <WheelDatePicker
            button={{
              size: "medium",
              text: `${t("setting.selectDate")}`,
              className: "button w-full",
            }}
            input={{
              placeholder: "select date",
              label: "",
            }}
            indicatorClassName={"rounded-xl bg-primary opacity-20"}
            className={`text-text ${
              language === "fa" ? "!font-[Vazirmatn]" : "!font-[Ubuntu]"
            }`}
            value={DATE}
            onChange={(date) => {
              setSelectedDate(date);
              setIsDateModalOpen(false);
            }}
          />
          <Paragraph className="mt-2">{t("setting.dateExplain")}</Paragraph>
        </div>
      </Modal>
    </div>
  );
}
