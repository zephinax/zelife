import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import TopNavigation from "../../components/navigation/topNavigation/TopNavigation";
import Silk from "../../components/react-bits/Silk";
import Paragraph from "../../components/typography/Paragraph";
import { useFinanceStore } from "../../store/store";
import { numberWithCommas, parseShamsiDate } from "../../utils/helper";
import { BiDollar } from "react-icons/bi";
import { IoIosAdd } from "react-icons/io";
import Modal from "../../components/modal/Modal";
import { useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";

import TransactionForm from "./TransactionForm";
import type { Transaction } from "../../store/types";
import { FaCircleArrowDown, FaCircleArrowUp } from "react-icons/fa6";
import BottomNavigation from "../../components/navigation/topNavigation/BottomNavigation";
import SwipeActions, {
  type SwipeAction,
} from "../../components/swipeActions/SwipeActions";
import { FiTrash2 } from "react-icons/fi";
import { GrEdit } from "react-icons/gr";

export default function Dashboard() {
  const {
    getSummaryByMonth,
    selectedDate,
    defaultDate,
    getTransactionsByMonth,
  } = useFinanceStore();
  const { t } = useTranslation();
  const DATE = selectedDate ? selectedDate : defaultDate;
  const PARSE_DATE = parseShamsiDate(DATE);
  const { year, month } = PARSE_DATE;
  const remaining = getSummaryByMonth(String(year), String(month));
  const transactions = getTransactionsByMonth(String(year), String(month));
  const [addTransactionModal, setAddTransactionModal] = useState(false);

  const getTransactionActions: SwipeAction<Transaction>[] = [
    {
      type: "edit",
      icon: GrEdit,
      function: (transaction) => {
        console.log(transaction);
      },
      color: "#3B82F6", // Blue
      label: "Edit Transaction",
    },
    {
      type: "delete",
      icon: FiTrash2,
      function: (transaction) => {
        console.log(transaction);
      },
      color: "#EF4444", // Red
      label: "Delete Transaction",
    },
  ];

  return (
    <div className="w-screen min-h-[100svh] pb-[200px]">
      <div className="sticky top-0 mx-2 rounded-3xl overflow-hidden h-[38vh] z-[9999]">
        <Silk
          speed={8}
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
            <BiDollar className="!text-white size-6 mt-0.5" />
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
          <div
            onClick={() => {
              setAddTransactionModal(true);
            }}
            className="bg-background-secondary/40 backdrop-blur-sm w-[40px] h-[40px] rounded-full flex items-center justify-center"
          >
            <IoIosAdd className="size-6" />
          </div>
        </div>
        <TopNavigation className="absolute top-0" />
      </div>

      <div className="mt-2 px-4 flex-1 flex flex-col">
        <div>
          <Paragraph className="font-medium" size="lg">
            {t("dashboard.transactions")}
          </Paragraph>
        </div>
        <div className="p-2 mt-2 flex flex-col-reverse bg-background-secondary justify-center items-center rounded-xl flex-1 overflow-y-auto">
          {transactions?.length && transactions.length > 0 ? (
            transactions.map((item: Transaction, index) => {
              const isLast = index === transactions.length - 1;
              return (
                <div key={item.id} className="w-full">
                  {!isLast && (
                    <div className="w-full h-[1px] my-1 bg-background"></div>
                  )}
                  <SwipeActions
                    item={item}
                    actions={getTransactionActions}
                    actionWidth={70}
                    swipeThreshold={60}
                  >
                    <div className="w-full flex items-center gap-2 py-2">
                      <div className="px-2">
                        {item.type === "income" ? (
                          <div className="flex flex-col gap-1 justify-center items-center">
                            <FaCircleArrowDown className="!text-green-400 size-6" />
                            <p className="text-[9px] font-medium">
                              {item.date}
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1 justify-center items-center">
                            <FaCircleArrowUp className="!text-red-500 size-6" />
                            <p className="text-[9px] font-medium">
                              {item.date}
                            </p>
                          </div>
                        )}
                      </div>
                      <div>
                        <Paragraph size="md" className="font-medium">
                          {numberWithCommas(item.amount)}
                        </Paragraph>
                        {item.description && (
                          <Paragraph>{item.description}</Paragraph>
                        )}
                      </div>
                    </div>
                  </SwipeActions>
                </div>
              );
            })
          ) : (
            <Paragraph>{t("dashboard.noTransaction")}</Paragraph>
          )}
        </div>
      </div>

      <BottomNavigation />
      <Modal
        overflowY="overflow-y-visible"
        size="sm"
        title={t("dashboard.addTransaction")}
        isOpen={addTransactionModal}
        onClose={() => {
          setAddTransactionModal(false);
        }}
      >
        <TransactionForm />
      </Modal>
    </div>
  );
}
