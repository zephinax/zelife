export const CURRENT_DATA_VERSION = 1;
export type TransactionType = "income" | "expense";

export interface Backup {
  state: {
    data: { [year: string]: YearData };
    userName: string;
    language: string;
    selectedDate: string;
    defaultDate: string;
    token: string;
    gistId: string;
    filename: string;
    isSyncEnable: boolean;
    avatarUrl: string;
  };
  version: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description?: string;
  date: string;
  labels?: string[];
  updatedAt: number;
  deletedAt?: number;
}

export interface ReportSettings {
  defaultView: "daily" | "monthly" | "yearly";
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
  updatedAt: number;
  deletedAt?: number;
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

  defaultDate: string;
  setDefaultDate: (date: string) => void;
  getDefaultDate: () => string;

  token: string;
  setToken: (token: string) => void;
  getToken: () => string;

  gistId: string;
  setGistId: (gistId: string) => void;
  getGistId: () => string;

  filename: string;
  setFilename: (filename: string) => void;
  getFilename: () => string;

  isSyncEnable: boolean;
  setIsSyncEnable: (value: boolean) => void;
  getIsSyncEnable: () => boolean;

  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  getAvatarUrl: () => string;

  data: {
    [year: string]: YearData;
  };
}

export interface FinanceActions {
  exportData: () => Backup;
  importData: (backup: Backup) => void;
  createYear: (year: string) => void;
  removeYear: (year: string) => void;
  createMonth: (year: string, month: string) => void;
  removeMonth: (year: string, month: string) => void;
  settings: ReportSettings;

  getTransactionsByYear: (year: string) => Transaction[];
  getTransactionsByMonth: (year: string, month: string) => Transaction[];
  getTransactionsByDay: (
    year: string,
    month: string,
    day: string
  ) => Transaction[];
  setDefaultView: (
    view: "daily" | "monthly" | "yearly",
    confirm?: boolean
  ) => Promise<void>;

  getDefaultView: () => "daily" | "monthly" | "yearly";
  resetReportSettings: () => void;

  // Optionally, you could add filtered versions
  getIncomeByYear: (year: string) => Transaction[];
  getExpensesByYear: (year: string) => Transaction[];

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

  getTasksByDay: (year: string, month: string, day: string) => Task[];
  getTasksByMonth: (year: string, month: string) => Task[];
  getTasksByYear: (year: string) => Task[];

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
