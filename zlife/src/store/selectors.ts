import type { FinanceState, Summary } from "./types";

export const selectData = (state: FinanceState) => state.data;

export const selectSummaryByDay =
  (year: string, month: string, day: string) =>
  (state: FinanceState): Summary => {
    const dayData = state.data?.[year]?.[month]?.[day];
    if (!dayData) return { income: 0, expense: 0, balance: 0 };

    let income = 0;
    let expense = 0;

    for (const tx of dayData.transactions) {
      if (tx.type === "income") income += tx.amount;
      else if (tx.type === "expense") expense += tx.amount;
    }

    return { income, expense, balance: income - expense };
  };

export const selectSummaryByMonth =
  (year: string, month: string) =>
  (state: FinanceState): Summary => {
    const monthData = state.data?.[year]?.[month];
    if (!monthData) return { income: 0, expense: 0, balance: 0 };

    let income = 0;
    let expense = 0;

    for (const day in monthData) {
      for (const tx of monthData[day].transactions) {
        if (tx.type === "income") income += tx.amount;
        else if (tx.type === "expense") expense += tx.amount;
      }
    }

    return { income, expense, balance: income - expense };
  };

export const selectSummaryByYear =
  (year: string) =>
  (state: FinanceState): Summary => {
    const yearData = state.data?.[year];
    if (!yearData) return { income: 0, expense: 0, balance: 0 };

    let income = 0;
    let expense = 0;

    for (const month in yearData) {
      for (const day in yearData[month]) {
        for (const tx of yearData[month][day].transactions) {
          if (tx.type === "income") income += tx.amount;
          else if (tx.type === "expense") expense += tx.amount;
        }
      }
    }

    return { income, expense, balance: income - expense };
  };
