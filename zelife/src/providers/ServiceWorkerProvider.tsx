import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

interface ServiceWorkerContextValue {
  needRefresh: boolean;
  setNeedRefresh: Dispatch<SetStateAction<boolean>>;
  updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  swRegistration: ServiceWorkerRegistration | null;
}

const ServiceWorkerContext = createContext<ServiceWorkerContextValue | null>(
  null
);

export function ServiceWorkerProvider({ children }: { children: ReactNode }) {
  const [swRegistration, setSwRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(
      _swUrl: string,
      registration: ServiceWorkerRegistration | undefined
    ) {
      if (registration?.waiting) {
        setNeedRefresh(true);
      }
      setSwRegistration(registration || null);
    },
    onRegisterError(error: any) {
      console.error("Service Worker Registration Error:", error);
    },
  });

  const value = useMemo<ServiceWorkerContextValue>(
    () => ({
      needRefresh,
      setNeedRefresh,
      updateServiceWorker,
      swRegistration,
    }),
    [needRefresh, setNeedRefresh, updateServiceWorker, swRegistration]
  );

  return (
    <ServiceWorkerContext.Provider value={value}>
      {children}
    </ServiceWorkerContext.Provider>
  );
}

export function useServiceWorker() {
  const ctx = useContext(ServiceWorkerContext);
  if (!ctx) {
    throw new Error("useServiceWorker must be used within ServiceWorkerProvider");
  }
  return ctx;
}
