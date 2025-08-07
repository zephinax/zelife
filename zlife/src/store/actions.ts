// actions.ts
import { type StateCreator } from "zustand";
import {
  CURRENT_DATA_VERSION,
  type Backup,
  type DayData,
  type FinanceActions,
  type FinanceState,
  type MonthData,
  type Transaction,
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

  exportData: () => {
    const state = get();
    return {
      state: {
        data: JSON.parse(JSON.stringify(state.data)), // Deep copy
        userName: state.userName,
        language: state.language,
        selectedDate: state.selectedDate,
        defaultDate: state.defaultDate,
        token: state.token,
        gistId: state.gistId,
        filename: state.filename,
        isSyncEnable: state.isSyncEnable,
        avatarUrl: state.avatarUrl,
      },
      version: CURRENT_DATA_VERSION, // Always use current version
    };
  },

  importData: (backup: Backup) => {
    if (!backup?.state) {
      console.error("Invalid backup format");
      return;
    }

    let migratedData = backup.state.data;

    // Handle versioning
    if (backup.version < CURRENT_DATA_VERSION) {
      // Apply migrations for older versions
      if (backup.version === 0) {
        // Migrate from Version 0 (no updatedAt/deletedAt) to Version 1
        const newData: { [year: string]: YearData } = {};
        for (const year in backup.state.data) {
          newData[year] = {};
          for (const month in backup.state.data[year]) {
            newData[year][month] = {};
            for (const day in backup.state.data[year][month]) {
              const dayData = backup.state.data[year][month][day];
              newData[year][month][day] = {
                transactions: dayData.transactions.map((tx) => ({
                  ...tx,
                  id: tx.id || uuidv4(),
                  updatedAt: (tx as any).updatedAt || Date.now(),
                  deletedAt: (tx as any).deletedAt ?? undefined,
                })),
                tasks: dayData.tasks.map((task) => ({
                  ...task,
                  id: task.id || uuidv4(),
                  updatedAt: (task as any).updatedAt || Date.now(),
                  deletedAt: (task as any).deletedAt ?? undefined,
                })),
              };
            }
          }
        }
        migratedData = newData;
      }
      // Add future version migrations here (e.g., if (backup.version === 1) { ... })
    }

    set((state) => ({
      ...state,
      data: migratedData || {},
      userName: backup.state.userName || state.userName,
      language: backup.state.language || state.language,
      selectedDate: backup.state.selectedDate || state.selectedDate,
      defaultDate: backup.state.defaultDate || state.defaultDate,
      token: backup.state.token || state.token,
      gistId: backup.state.gistId || state.gistId,
      filename: backup.state.filename || state.filename,
      isSyncEnable: backup.state.isSyncEnable || state.isSyncEnable,
      avatarUrl: backup.state.avatarUrl || state.avatarUrl,
    }));
  },

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

  language: "en",

  getLanguage: () => {
    return get().language;
  },

  setLanguage: (language) => {
    set({ language: language });
  },

  selectedDate: "",

  setSelectedDate: (date: string) => {
    set(() => ({
      selectedDate: date,
    }));
  },

  getSelectedDate: () => {
    return get().selectedDate;
  },

  defaultDate: "",
  setDefaultDate: (date: string) => {
    set(() => ({
      defaultDate: date,
    }));
  },

  getDefaultDate: () => {
    return get().selectedDate;
  },

  token: "",

  // token
  getToken: () => {
    return get().token;
  },
  setToken: (token: string) => {
    set({ token });
  },

  gistId: "",

  getGistId: () => {
    return get().gistId;
  },
  setGistId: (gistId: string) => {
    set({ gistId });
  },

  filename: "",

  getFilename: () => {
    return get().filename;
  },
  setFilename: (filename: string) => {
    set({ filename });
  },

  isSyncEnable: false,

  getIsSyncEnable: () => {
    return get().isSyncEnable;
  },
  setIsSyncEnable: (value: boolean) => {
    set({ isSyncEnable: value });
  },

  avatarUrl: "",

  getAvatarUrl: () => {
    return get().avatarUrl;
  },
  setAvatarUrl: (url: string) => {
    set({ avatarUrl: url });
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

  getTransactionsByDay: (year, month, day) => {
    const dayData = get().data?.[year]?.[month]?.[day];
    return (dayData?.transactions || []).filter((tx) => !tx.deletedAt);
  },

  getTransactionsByMonth: (year, month) => {
    const monthData = get().data?.[year]?.[month];
    if (!monthData) return [];

    const transactions: Transaction[] = [];
    for (const day in monthData) {
      const dayTxs = monthData[day].transactions.filter((tx) => !tx.deletedAt);
      transactions.push(...dayTxs);
    }
    return transactions;
  },

  getTransactionsByYear: (year) => {
    const yearData = get().data?.[year];
    if (!yearData) return [];

    const transactions: Transaction[] = [];
    for (const month in yearData) {
      for (const day in yearData[month]) {
        const dayTxs = yearData[month][day].transactions.filter(
          (tx) => !tx.deletedAt
        );
        transactions.push(...dayTxs);
      }
    }
    return transactions;
  },

  settings: {
    defaultView: "monthly",
  },

  setDefaultView: async (view, confirm = false) => {
    if (confirm) {
      const currentView = get().settings.defaultView;
      const shouldProceed = window.confirm(
        `Change default view from ${currentView} to ${view}?`
      );
      if (!shouldProceed) return;
    }

    set((state) => ({
      settings: {
        ...state.settings,
        defaultView: view,
      },
    }));
  },

  // Get the current default view
  getDefaultView: () => {
    return get().settings.defaultView;
  },

  // Reset to default settings
  resetReportSettings: () => {
    const shouldReset = window.confirm("Reset report settings to defaults?");
    if (!shouldReset) return;

    set((state) => ({
      settings: {
        ...state.settings,
        defaultView: "monthly", // Reset to monthly
      },
    }));
  },

  // Optional filtered versions
  getIncomeByYear: (year) => {
    return get()
      .getTransactionsByYear(year)
      .filter((tx) => tx.type === "income");
  },

  getExpensesByYear: (year) => {
    return get()
      .getTransactionsByYear(year)
      .filter((tx) => tx.type === "expense");
  },

  addTransaction: (year, month, day, transaction) => {
    set((state) => {
      if (!state.data[year]) state.data[year] = createEmptyYearData();
      if (!state.data[year][month])
        state.data[year][month] = createEmptyMonthData();
      if (!state.data[year][month][day])
        state.data[year][month][day] = createEmptyDayData();

      const txWithId = {
        ...transaction,
        id: transaction.id || uuidv4(),
        updatedAt: Date.now(),
        deletedAt: undefined,
      };

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
      const txIndex = dayData.transactions.findIndex(
        (tx) => tx.id === transactionId
      );
      if (txIndex === -1) return state;

      dayData.transactions[txIndex] = {
        ...dayData.transactions[txIndex],
        deletedAt: Date.now(),
        updatedAt: Date.now(),
      };
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

      txs[idx] = { ...txs[idx], ...updated, updatedAt: Date.now() };
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

      const taskWithId = {
        ...task,
        id: task.id || uuidv4(),
        updatedAt: Date.now(),
        deletedAt: undefined,
      };

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
      const taskIndex = dayData.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return state;

      dayData.tasks[taskIndex] = {
        ...dayData.tasks[taskIndex],
        deletedAt: Date.now(),
        updatedAt: Date.now(),
      };
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

      tasks[idx] = { ...tasks[idx], ...updated, updatedAt: Date.now() };
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

      tasks[idx] = {
        ...tasks[idx],
        isDone: !tasks[idx].isDone,
        updatedAt: Date.now(),
      };
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
      if (tx.deletedAt) continue;
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
        if (tx.deletedAt) continue;
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
          if (tx.deletedAt) continue;
          if (tx.type === "income") income += tx.amount;
          else if (tx.type === "expense") expense += tx.amount;
        }
      }
    }
    return { income, expense, balance: income - expense };
  },
});
