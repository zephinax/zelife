import { useFinanceStore } from "../../store/store";
import { parseShamsiDate } from "../../utils/helper";
import Modal from "../../components/modal/Modal";
import { useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import TransactionForm from "./TransactionForm";
import type { Transaction } from "../../store/types";
import { FiTrash2 } from "react-icons/fi";
import { GrEdit } from "react-icons/gr";
import PageTransition from "../../components/pageTransition/PageTransition";
import { TransactionList } from "./components/TransactionList";
import { DashboardHeader } from "./components/DashboardHeader";
import Paragraph from "../../components/typography/Paragraph";
import type { SwipeAction } from "../../components/swipeActions/SwipeActions";

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
  const { year, month, day } = parseShamsiDate(DATE);

  const remaining =
    settings.defaultView === "daily"
      ? getSummaryByDay(String(year), String(month), String(day))
      : getSummaryByMonth(String(year), String(month));

  const transactions = (
    settings.defaultView === "daily"
      ? getTransactionsByDay(String(year), String(month), String(day))
      : getTransactionsByMonth(String(year), String(month))
  ).slice().reverse();

  const [addTransactionModal, setAddTransactionModal] = useState(false);
  const [targetTransaction, setTargetTransaction] = useState<Transaction>();

  const transactionActions: SwipeAction<Transaction>[] = [
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

  return (
    <PageTransition variant="slide" className="w-full min-h-[100svh] pb-[85px]">
      <DashboardHeader
        remaining={remaining}
        onAddTransaction={() => setAddTransactionModal(true)}
        token={token}
        isLoading={isLoading}
        error={error}
        onSync={triggerSync}
        addLabel={t("dashboard.addTransaction")}
      />

      <div className="mt-2 max-w-5xl mx-auto px-4 flex-1 flex flex-col">
        <div>
          <Paragraph className="font-medium" size="lg">
            {t("dashboard.transactions")}
          </Paragraph>
        </div>
        <TransactionList
          transactions={transactions}
          actions={transactionActions}
          emptyLabel={t("dashboard.noTransaction")}
        />
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
