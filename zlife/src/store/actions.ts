// actions.ts
import { type StateCreator } from "zustand";
import {
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
        data: JSON.parse(JSON.stringify(state.data)),
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
      version: 0,
    };
  },

  importData: (backup) => {
    if (!backup?.state) {
      console.error("Invalid backup format");
      return;
    }

    const localData = get();
    const importedData = backup.state;

    // Function to deeply compare two objects
    const hasDifferences = (obj1: any, obj2: any): boolean => {
      if (obj1 === obj2) return false;
      if (
        typeof obj1 !== "object" ||
        typeof obj2 !== "object" ||
        obj1 === null ||
        obj2 === null
      )
        return true;

      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      if (keys1.length !== keys2.length) return true;

      for (const key of keys1) {
        if (!keys2.includes(key)) return true;
        if (hasDifferences(obj1[key], obj2[key])) return true;
      }

      return false;
    };

    // Check if there are any differences in the data
    const hasDataDifferences = hasDifferences(
      localData.data,
      importedData.data
    );

    if (!hasDataDifferences) {
      // No differences found, just update non-data fields if needed
      set({
        ...localData,
        userName: importedData.userName || localData.userName,
        language: importedData.language || localData.language,
        selectedDate: importedData.selectedDate || localData.selectedDate,
        defaultDate: importedData.defaultDate || localData.defaultDate,
        token: importedData.token || localData.token,
        gistId: importedData.gistId || localData.gistId,
        filename: importedData.filename || localData.filename,
        isSyncEnable: importedData.isSyncEnable || localData.isSyncEnable,
        avatarUrl: importedData.avatarUrl || localData.avatarUrl,
      });
      return;
    }

    // If there are differences, ask user what to do
    const userChoice = window.confirm(
      "The imported data is different from your current data.\n\n" +
        'Click "OK" to MERGE the data (keeping both local and imported entries).\n' +
        'Click "Cancel" to REPLACE your current data with the imported data.'
    );

    if (userChoice) {
      // MERGE: Combine both datasets
      const mergedData = { ...localData.data };

      // Merge year by year
      for (const year in importedData.data) {
        if (!mergedData[year]) {
          mergedData[year] = { ...importedData.data[year] };
        } else {
          // Merge month by month
          for (const month in importedData.data[year]) {
            if (!mergedData[year][month]) {
              mergedData[year][month] = { ...importedData.data[year][month] };
            } else {
              // Merge day by day
              for (const day in importedData.data[year][month]) {
                if (!mergedData[year][month][day]) {
                  mergedData[year][month][day] = {
                    ...importedData.data[year][month][day],
                  };
                } else {
                  // Merge transactions and tasks
                  const mergedDay = mergedData[year][month][day];
                  const importedDay = importedData.data[year][month][day];

                  // Merge transactions (avoid duplicates by ID)
                  const existingTxIds = new Set(
                    mergedDay.transactions.map((tx) => tx.id)
                  );
                  mergedDay.transactions.push(
                    ...importedDay.transactions.filter(
                      (tx) => !existingTxIds.has(tx.id)
                    )
                  );

                  // Merge tasks (avoid duplicates by ID)
                  const existingTaskIds = new Set(
                    mergedDay.tasks.map((task) => task.id)
                  );
                  mergedDay.tasks.push(
                    ...importedDay.tasks.filter(
                      (task) => !existingTaskIds.has(task.id)
                    )
                  );
                }
              }
            }
          }
        }
      }

      set({
        ...localData,
        data: mergedData,
        userName: importedData.userName || localData.userName,
        language: importedData.language || localData.language,
        selectedDate: importedData.selectedDate || localData.selectedDate,
        defaultDate: importedData.defaultDate || localData.defaultDate,
        token: importedData.token || localData.token,
        gistId: importedData.gistId || localData.gistId,
        filename: importedData.filename || localData.filename,
        isSyncEnable: importedData.isSyncEnable || localData.isSyncEnable,
        avatarUrl: importedData.avatarUrl || localData.avatarUrl,
      });
    } else {
      // REPLACE: Use the imported data completely
      set({
        ...localData, // Preserve all functions
        data: importedData.data || {},
        userName: importedData.userName || "",
        language: importedData.language || "en",
        selectedDate: importedData.selectedDate || "",
        defaultDate: importedData.defaultDate || "",
        token: importedData.token || "",
        gistId: importedData.gistId || "",
        filename: importedData.filename || "",
        isSyncEnable: importedData.isSyncEnable || false,
        avatarUrl: importedData.avatarUrl || "",
      });
    }
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
    return dayData?.transactions || [];
  },

  getTransactionsByMonth: (year, month) => {
    const monthData = get().data?.[year]?.[month];
    if (!monthData) return [];

    const transactions: Transaction[] = [];
    for (const day in monthData) {
      transactions.push(...monthData[day].transactions);
    }
    return transactions;
  },

  getTransactionsByYear: (year) => {
    const yearData = get().data?.[year];
    if (!yearData) return [];

    const transactions: Transaction[] = [];
    for (const month in yearData) {
      for (const day in yearData[month]) {
        transactions.push(...yearData[month][day].transactions);
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
