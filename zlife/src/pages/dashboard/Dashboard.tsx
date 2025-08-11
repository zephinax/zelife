import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import TopNavigation from "../../components/navigation/topNavigation/TopNavigation";
import Silk from "../../components/react-bits/Silk";
import Paragraph from "../../components/typography/Paragraph";
import { useFinanceStore } from "../../store/store";
import { numberWithCommas, parseShamsiDate } from "../../utils/helper";
import { BiDollar } from "react-icons/bi";
import { IoIosAdd } from "react-icons/io";
import Modal from "../../components/modal/Modal";
import { useEffect, useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";

import TransactionForm from "./TransactionForm";
import type { Transaction } from "../../store/types";
import { FaCircleArrowDown, FaCircleArrowUp } from "react-icons/fa6";
import SwipeActions, {
  type SwipeAction,
} from "../../components/swipeActions/SwipeActions";
import { FiTrash2 } from "react-icons/fi";
import { GrEdit } from "react-icons/gr";
import {
  MdOutlineSwipeLeft,
  MdOutlineSync,
  MdSyncProblem,
} from "react-icons/md";
import { GiLongLeggedSpider } from "react-icons/gi";
import PageTransition from "../../components/pageTransition/PageTransition";

export default function Dashboard({
  isLoading,
  error,
  triggerSync,
}: {
  isLoading: boolean;
  error: string | null;
  triggerSync: () => void;
}) {
  const {
    getSummaryByMonth,
    selectedDate,
    defaultDate,
    token,
    settings,
    removeTransaction,
    getTransactionsByMonth,
    getTransactionsByDay,
    getSummaryByDay,
  } = useFinanceStore();
  const { t } = useTranslation();
  const DATE = selectedDate ? selectedDate : defaultDate;
  const PARSE_DATE = parseShamsiDate(DATE);
  const { year, month, day } = PARSE_DATE;
  const remaining =
    settings.defaultView === "daily"
      ? getSummaryByDay(String(year), String(month), String(day))
      : getSummaryByMonth(String(year), String(month));

  const transactions =
    settings.defaultView === "daily"
      ? getTransactionsByDay(String(year), String(month), String(day))
      : getTransactionsByMonth(String(year), String(month));
  const [addTransactionModal, setAddTransactionModal] = useState(false);
  const [targetTransaction, setTargetTransaction] = useState<Transaction>();
  const getTransactionActions: SwipeAction<Transaction>[] = [
    {
      type: "edit",
      icon: GrEdit,
      function: (transaction) => {
        setTargetTransaction(transaction);
      },
      color: "var(--color-background-secondary)",
      textColor: "var(--color-primary)",
      label: "Edit Transaction",
    },
    {
      type: "delete",
      icon: FiTrash2,
      function: (transaction) => {
        if (!transaction.id) return;
        const transitionDate = parseShamsiDate(transaction.date);
        removeTransaction(
          String(transitionDate.year),
          String(transitionDate.month),
          String(transitionDate.day),
          transaction.id
        );
      },
      color: "var(--color-background-secondary)",
      textColor: "var(--color-primary)",
      label: "Delete Transaction",
    },
  ];

  useEffect(() => {
    console.log("selected Date", selectedDate);
    console.log("default Date", defaultDate);
    console.log("date", DATE);
  }, [selectedDate, defaultDate, DATE]);

  return (
    <PageTransition variant="slide" className="w-full min-h-[100svh] pb-[85px]">
      <div className="sticky top-0 max-w-screen  mx-2 rounded-4xl overflow-hidden h-[38vh] min-h-[38vh] z-[9999]">
        <Silk
          speed={8}
          scale={1}
          color="#d24670"
          noiseIntensity={1.5}
          rotation={0}
        />
        <div
          dir="ltr"
          className="absolute z-[9999] top-[50%] flex-col justify-center gap-2 items-center flex left-[50%] translate-x-[-50%] translate-y-[-50%] "
        >
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
        <div className="absolute z-[9999] bottom-0 w-full p-4 flex justify-between items-center !text-white">
          <div
            onClick={() => {
              setAddTransactionModal(true);
            }}
            className="bg-background-secondary/40 pr-[var(--padding-end)] !text-white pl-[var(--padding-start)] backdrop-blur-sm h-[40px] rounded-full flex items-center justify-center"
            style={{
              paddingInlineStart: "0.5rem",
              paddingInlineEnd: "0.75rem",
            }}
          >
            <IoIosAdd className="size-6" />
            <Paragraph className="!text-white">
              {t("dashboard.addTransaction")}
            </Paragraph>
          </div>
          {token && (
            <div className="bg-background-secondary/40 backdrop-blur-sm h-[40px] w-[40px] flex items-center justify-center rounded-full">
              <div
                onClick={() => {
                  triggerSync();
                }}
              >
                {error ? (
                  <MdSyncProblem className="text-white size-5" />
                ) : (
                  <MdOutlineSync
                    className={`text-white size-5 ${
                      isLoading ? "animate-spin" : ""
                    }`}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        <TopNavigation className="absolute top-0" />
      </div>

      <div className="mt-2 px-4 flex-1 flex flex-col">
        <div>
          <Paragraph className="font-medium" size="lg">
            {t("dashboard.transactions")}
          </Paragraph>
        </div>
        <div
          dir="ltr"
          className="p-2 mt-2 max-w-screen flex flex-col-reverse bg-background-secondary justify-center items-center rounded-2xl flex-1 overflow-y-auto"
        >
          {transactions && transactions?.length && transactions.length > 0 ? (
            transactions?.map((item: Transaction, index) => {
              const isLast = index === transactions.length - 1;
              return (
                <div key={item.id} className="w-full">
                  {!isLast && (
                    <div className="w-full h-[1px] my-2 bg-background"></div>
                  )}
                  <SwipeActions
                    item={item}
                    actions={getTransactionActions}
                    actionWidth={50}
                    swipeThreshold={40}
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
                      <div className="flex-1">
                        <Paragraph size="md" className="font-medium">
                          {numberWithCommas(item.amount)}
                        </Paragraph>
                        {item.description && (
                          <Paragraph className="line-clamp-1">
                            {item.description}
                          </Paragraph>
                        )}
                      </div>
                      <div className="px-2 text-primary/40">
                        <MdOutlineSwipeLeft />
                      </div>
                    </div>
                  </SwipeActions>
                </div>
              );
            })
          ) : (
            <div className="py-2 flex items-center justify-center flex-col gap-4">
              <GiLongLeggedSpider className="!text-primary size-14 opacity-75" />
              <Paragraph size="lg">{t("dashboard.noTransaction")}</Paragraph>
            </div>
          )}
        </div>
      </div>

      <Modal
        overflowY="overflow-y-visible"
        size="sm"
        title={
          targetTransaction
            ? t("dashboard.editTransaction")
            : t("dashboard.addTransaction")
        }
        isOpen={addTransactionModal || Boolean(targetTransaction)}
        onClose={() => {
          setAddTransactionModal(false);
          setTargetTransaction(undefined);
        }}
      >
        <TransactionForm
          targetTransaction={targetTransaction}
          onSuccess={() => {
            setAddTransactionModal(false);
            setTargetTransaction(undefined);
          }}
        />
      </Modal>
    </PageTransition>
  );
}
