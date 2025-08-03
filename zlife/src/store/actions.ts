// actions.ts
import { type StateCreator } from "zustand";
import {
  type DayData,
  type FinanceActions,
  type FinanceState,
  type MonthData,
  type YearData,
} from "./types";
import { v4 as uuidv4 } from "uuid";

const createEmptyDayData = (): DayData => ({
  transactions: [],
  tasks: [],
});

const createEmptyMonthData = (): MonthData => ({});

const createEmptyYearData = (): YearData => ({});

export const createFinanceActions: StateCreator<
  FinanceState & FinanceActions
> = (set, get) => ({
  data: {},

  createYear: (year) => {
    set((state) => {
      if (!state.data[year]) {
        state.data[year] = createEmptyYearData();
      }
      return { data: { ...state.data } };
    });
  },

  userName: "",

  setUserName: (name) => {
    set({ userName: name });
  },

  getUserName: () => {
    return get().userName;
  },

  removeYear: (year) => {
    set((state) => {
      if (!state.data[year]) return state;
      delete state.data[year];
      return { data: { ...state.data } };
    });
  },

  createMonth: (year, month) => {
    set((state) => {
      if (!state.data[year]) {
        state.data[year] = createEmptyYearData();
      }
      if (!state.data[year][month]) {
        state.data[year][month] = createEmptyMonthData();
      }
      return { data: { ...state.data } };
    });
  },

  removeMonth: (year, month) => {
    set((state) => {
      if (!state.data[year] || !state.data[year][month]) return state;
      delete state.data[year][month];
      return { data: { ...state.data } };
    });
  },

  addTransaction: (year, month, day, transaction) => {
    set((state) => {
      if (!state.data[year]) state.data[year] = createEmptyYearData();
      if (!state.data[year][month])
        state.data[year][month] = createEmptyMonthData();
      if (!state.data[year][month][day])
        state.data[year][month][day] = createEmptyDayData();

      const txWithId = { ...transaction, id: transaction.id || uuidv4() };

      state.data[year][month][day].transactions.push(txWithId);

      return { data: { ...state.data } };
    });
  },

  removeTransaction: (year, month, day, transactionId) => {
    set((state) => {
      if (
        !state.data[year] ||
        !state.data[year][month] ||
        !state.data[year][month][day]
      ) {
        return state;
      }
      const dayData = state.data[year][month][day];
      dayData.transactions = dayData.transactions.filter(
        (tx) => tx.id !== transactionId
      );
      return { data: { ...state.data } };
    });
  },

  editTransaction: (year, month, day, transactionId, updated) => {
    set((state) => {
      if (
        !state.data[year] ||
        !state.data[year][month] ||
        !state.data[year][month][day]
      ) {
        return state;
      }
      const txs = state.data[year][month][day].transactions;
      const idx = txs.findIndex((tx) => tx.id === transactionId);
      if (idx === -1) return state;

      txs[idx] = { ...txs[idx], ...updated };
      return { data: { ...state.data } };
    });
  },

  addTask: (year, month, day, task) => {
    set((state) => {
      if (!state.data[year]) state.data[year] = createEmptyYearData();
      if (!state.data[year][month])
        state.data[year][month] = createEmptyMonthData();
      if (!state.data[year][month][day])
        state.data[year][month][day] = createEmptyDayData();

      const taskWithId = { ...task, id: task.id || uuidv4() };

      state.data[year][month][day].tasks.push(taskWithId);

      return { data: { ...state.data } };
    });
  },

  removeTask: (year, month, day, taskId) => {
    set((state) => {
      if (
        !state.data[year] ||
        !state.data[year][month] ||
        !state.data[year][month][day]
      ) {
        return state;
      }
      const dayData = state.data[year][month][day];
      dayData.tasks = dayData.tasks.filter((t) => t.id !== taskId);
      return { data: { ...state.data } };
    });
  },

  editTask: (year, month, day, taskId, updated) => {
    set((state) => {
      if (
        !state.data[year] ||
        !state.data[year][month] ||
        !state.data[year][month][day]
      ) {
        return state;
      }
      const tasks = state.data[year][month][day].tasks;
      const idx = tasks.findIndex((t) => t.id === taskId);
      if (idx === -1) return state;

      tasks[idx] = { ...tasks[idx], ...updated };
      return { data: { ...state.data } };
    });
  },

  toggleTaskDone: (year, month, day, taskId) => {
    set((state) => {
      if (
        !state.data[year] ||
        !state.data[year][month] ||
        !state.data[year][month][day]
      ) {
        return state;
      }
      const tasks = state.data[year][month][day].tasks;
      const idx = tasks.findIndex((t) => t.id === taskId);
      if (idx === -1) return state;

      tasks[idx].isDone = !tasks[idx].isDone;
      return { data: { ...state.data } };
    });
  },

  resetFinance: () => set({ data: {} }),

  resetYear: (year) => {
    set((state) => {
      if (!state.data[year]) return state;
      delete state.data[year];
      return { data: { ...state.data } };
    });
  },

  resetMonth: (year, month) => {
    set((state) => {
      if (!state.data[year] || !state.data[year][month]) return state;
      delete state.data[year][month];
      return { data: { ...state.data } };
    });
  },

  resetDay: (year, month, day) => {
    set((state) => {
      if (
        !state.data[year] ||
        !state.data[year][month] ||
        !state.data[year][month][day]
      )
        return state;
      delete state.data[year][month][day];
      return { data: { ...state.data } };
    });
  },

  getSummaryByDay: (year, month, day) => {
    const dayData = get().data?.[year]?.[month]?.[day];
    if (!dayData) return { income: 0, expense: 0, balance: 0 };

    let income = 0;
    let expense = 0;
    for (const tx of dayData.transactions) {
      if (tx.type === "income") income += tx.amount;
      else if (tx.type === "expense") expense += tx.amount;
    }
    return { income, expense, balance: income - expense };
  },

  getSummaryByMonth: (year, month) => {
    const monthData = get().data?.[year]?.[month];
    if (!monthData) return { income: 0, expense: 0, balance: 0 };

    let income = 0;
    let expense = 0;
    for (const day in monthData) {
      const dayData = monthData[day];
      for (const tx of dayData.transactions) {
        if (tx.type === "income") income += tx.amount;
        else if (tx.type === "expense") expense += tx.amount;
      }
    }
    return { income, expense, balance: income - expense };
  },

  getSummaryByYear: (year) => {
    const yearData = get().data?.[year];
    if (!yearData) return { income: 0, expense: 0, balance: 0 };

    let income = 0;
    let expense = 0;
    for (const month in yearData) {
      const monthData = yearData[month];
      for (const day in monthData) {
        const dayData = monthData[day];
        for (const tx of dayData.transactions) {
          if (tx.type === "income") income += tx.amount;
          else if (tx.type === "expense") expense += tx.amount;
        }
      }
    }
    return { income, expense, balance: income - expense };
  },
});
