import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createFinanceActions } from "./actions";
import type { FinanceState, FinanceActions } from "./types";

type StoreType = FinanceState & FinanceActions;

export const useFinanceStore = create<StoreType>()(
  persist(
    (set, get, store) => ({
      ...createFinanceActions(set, get, store),
    }),
    {
      name: "finance-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
