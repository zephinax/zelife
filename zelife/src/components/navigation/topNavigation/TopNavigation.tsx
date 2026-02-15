import { FaChartLine, FaCreditCard } from "react-icons/fa";
import { useFinanceStore } from "../../../store/store";
import { BiChevronDown } from "react-icons/bi";
import Modal from "../../modal/Modal";
import { useState } from "react";
import { parseShamsiDate, formatShamsiDate } from "../../../utils/helper";
import { useTranslation } from "../../../hooks/useTranslation";
import Paragraph from "../../typography/Paragraph";
import Input from "../../inputs/Input";
export default function TopNavigation({
  className = "",
}: {
  className?: string;
}) {
  const { defaultDate, selectedDate, avatarUrl, setSelectedDate, language } =
    useFinanceStore();
  const { t } = useTranslation();
  const DATE = selectedDate ? selectedDate : defaultDate;
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [dateInput, setDateInput] = useState(DATE);
  const [dateError, setDateError] = useState("");

  const handleSaveDate = () => {
    try {
      const { year, month, day } = parseShamsiDate(dateInput);
      const formatted = formatShamsiDate(year, month, day);
      setSelectedDate(formatted);
      setIsDateModalOpen(false);
      setDateError("");
    } catch (_err) {
      setDateError(t("setting.dateInvalid") || "Invalid date (YYYY/MM/DD)");
    }
  };
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
        <div className="pb-4 space-y-3">
          <Input
            label={t("setting.selectDate")}
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            placeholder="YYYY/MM/DD"
            dir={language === "fa" ? "rtl" : "ltr"}
          />
          {dateError && (
            <Paragraph className="text-red-400 text-sm">{dateError}</Paragraph>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => setIsDateModalOpen(false)}
              className="flex-1 button"
            >
              {t("setting.cancel")}
            </button>
            <button onClick={handleSaveDate} className="flex-1 button">
              {t("setting.selectDate")}
            </button>
          </div>
          <Paragraph className="mt-2">{t("setting.dateExplain")}</Paragraph>
        </div>
      </Modal>
    </div>
  );
}
