import { useRef } from "react";
import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import { GiLongLeggedSpider } from "react-icons/gi";
import { MdOutlineSwipeLeft } from "react-icons/md";
import SwipeActions, {
  type SwipeAction,
} from "../../../components/swipeActions/SwipeActions";
import Paragraph from "../../../components/typography/Paragraph";
import { numberWithCommas } from "../../../utils/helper";
import { FaCircleArrowDown, FaCircleArrowUp } from "react-icons/fa6";
import type { Transaction } from "../../../store/types";

type TransactionListProps = {
  transactions: Transaction[];
  actions: SwipeAction<Transaction>[];
  emptyLabel: string;
};

export function TransactionList({
  transactions,
  actions,
  emptyLabel,
}: TransactionListProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const virtualizer = useVirtualizer({
    count: transactions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 73.5,
    overscan: 10,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      dir="ltr"
      className="p-2 pb-0 mt-2 max-w-screen flex flex-col-reverse bg-background-secondary justify-center items-center rounded-3xl flex-1 overflow-y-auto"
      style={{ height: "600px" }}
    >
      {transactions.length > 0 ? (
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: "100%",
            position: "relative",
          }}
        >
          {virtualItems.map((virtualItem: VirtualItem) => (
            <TransactionRow
              key={virtualItem.key}
              virtualItem={virtualItem}
              transactions={transactions}
              actions={actions}
              isLast={virtualItem.index === transactions.length - 1}
            />
          ))}
        </div>
      ) : (
        <div className="pt-2 pb-4 flex items-center justify-center flex-col gap-4">
          <GiLongLeggedSpider className="!text-primary size-14 opacity-75" />
          <Paragraph size="lg">{emptyLabel}</Paragraph>
        </div>
      )}
    </div>
  );
}

type TransactionRowProps = {
  virtualItem: VirtualItem;
  transactions: Transaction[];
  actions: SwipeAction<Transaction>[];
  isLast: boolean;
};

function TransactionRow({
  virtualItem,
  transactions,
  actions,
  isLast,
}: TransactionRowProps) {
  const item = transactions[virtualItem.index];

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        transform: `translateY(${virtualItem.start}px)`,
      }}
      className="w-full"
    >
      {isLast && <div className="w-full h-[1px] mt-[0.5px] bg-transparent"></div>}
      <SwipeActions item={item} actions={actions} actionWidth={50} swipeThreshold={40}>
        <div className="w-full  flex items-center gap-2 py-2">
          <div className="px-2">
            {item.type === "income" ? (
              <div className="flex flex-col gap-1 justify-center items-center">
                <FaCircleArrowDown className="!text-green-400 size-6" />
                <p className="text-[9px] font-medium">{item.date}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1 justify-center items-center">
                <FaCircleArrowUp className="!text-red-500 size-6" />
                <p className="text-[9px] font-medium">{item.date}</p>
              </div>
            )}
          </div>
          <div className="flex-1">
            <Paragraph size="md" className="font-medium">
              {numberWithCommas(item.amount)}
            </Paragraph>
            {item.description && <Paragraph className="line-clamp-1">{item.description}</Paragraph>}
          </div>
          <div className="px-2 text-primary/40">
            <MdOutlineSwipeLeft />
          </div>
        </div>
      </SwipeActions>
      {!isLast && <div className="w-full h-[1px] my-2 bg-background"></div>}
    </div>
  );
}
