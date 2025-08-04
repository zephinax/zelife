export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description?: string;
  date: string; // ISO Date string (مثلاً "2025-08-03")
  labels?: string[];
}

export interface DayData {
  transactions: Transaction[];
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  isDone: boolean;
  priority?: number;
}

export interface MonthData {
  [day: string]: DayData;
}

export interface YearData {
  [month: string]: MonthData;
}

export interface FinanceState {
  userName: string;
  setUserName: (name: string) => void;
  getUserName: () => string;

  language: string;
  setLanguage: (language: string) => void;
  getLanguage: () => string;

  selectedDate: string;
  setSelectedDate: (date: string) => void;
  getSelectedDate: () => string;

  data: {
    [year: string]: YearData;
  };
}

export interface FinanceActions {
  createYear: (year: string) => void;
  removeYear: (year: string) => void;
  createMonth: (year: string, month: string) => void;
  removeMonth: (year: string, month: string) => void;

  addTransaction: (
    year: string,
    month: string,
    day: string,
    transaction: Transaction
  ) => void;
  removeTransaction: (
    year: string,
    month: string,
    day: string,
    transactionId: string
  ) => void;
  editTransaction: (
    year: string,
    month: string,
    day: string,
    transactionId: string,
    updated: Partial<Omit<Transaction, "id">>
  ) => void;

  addTask: (year: string, month: string, day: string, task: Task) => void;
  removeTask: (
    year: string,
    month: string,
    day: string,
    taskId: string
  ) => void;
  editTask: (
    year: string,
    month: string,
    day: string,
    taskId: string,
    updated: Partial<Omit<Task, "id">>
  ) => void;

  toggleTaskDone: (
    year: string,
    month: string,
    day: string,
    taskId: string
  ) => void;

  resetFinance: () => void;
  resetYear: (year: string) => void;
  resetMonth: (year: string, month: string) => void;
  resetDay: (year: string, month: string, day: string) => void;

  // خلاصه روز، ماه، سال
  getSummaryByDay: (year: string, month: string, day: string) => Summary;
  getSummaryByMonth: (year: string, month: string) => Summary;
  getSummaryByYear: (year: string) => Summary;
}

export interface Summary {
  income: number;
  expense: number;
  balance: number;
}
