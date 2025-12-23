import { useEffect, useState } from "react";
import ToggleSwitch from "../../components/inputs/ToggleSwitch";
import PageLayout from "../../components/layouts/pageLayout/PageLayout";
import Paragraph from "../../components/typography/Paragraph";
import { useFinanceStore } from "../../store/store";
import Modal from "../../components/modal/Modal";
import UserDataForm from "./UserDataForm";
import { useTranslation } from "../../hooks/useTranslation";
import { GrEdit } from "react-icons/gr";
import { MdOutlineSync, MdSyncProblem } from "react-icons/md";
import version from "./../../../package.json";
import { FiDownload, FiTrash2 } from "react-icons/fi";
import Button from "../../components/button/Button";
import { parseShamsiDate } from "../../utils/helper";
import { IoCopy, IoCopyOutline } from "react-icons/io5";
import { useServiceWorker } from "../../providers/ServiceWorkerProvider";
import {
  LabeledToggle,
  SettingCard,
  SettingDivider,
  SettingHeader,
  SettingRow,
} from "./components/SettingLayout";

type SyncAction =
  | "created"
  | "updated"
  | "merged"
  | "overwritten"
  | "no_changes"
  | null;

type SettingProps = {
  isLoading: boolean;
  lastSyncAt: Date | null;
  error: string | null;
  lastAction: SyncAction;
  triggerSync: () => void;
};

type StatusKey =
  | "check"
  | "checking"
  | "updateAvailable"
  | "upToDate"
  | "serviceWorkerNotSupported"
  | "noServiceWorker"
  | "errorChecking"
  | "errorUpdating";

export default function Setting({
  lastSyncAt,
  isLoading,
  error,
  lastAction,
  triggerSync,
}: SettingProps) {
  const { t } = useTranslation();
  const {
    avatarUrl,
    userName,
    isSyncEnable,
    setIsSyncEnable,
    language,
    settings,
    setLanguage,
    token,
    setDefaultView,
    gistId,
    selectedDate,
    filename,
    defaultDate,
    resetFinance,
    getTransactionsByDay,
    getTransactionsByMonth,
    setTaskDefaultView,
  } = useFinanceStore();

  const [isGetUserDataModalOpen, setIsGetUserDataModalOpen] = useState(false);
  const [isResetDataModalOpen, setIsResetDataModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [copyMessage, setCopyMessage] = useState(false);
  const [statusKey, setStatusKey] = useState<StatusKey>("check");
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  const DATE = selectedDate ? selectedDate : defaultDate;
  const { year, month, day } = parseShamsiDate(DATE);
  const transactions =
    settings.defaultView === "daily"
      ? getTransactionsByDay(String(year), String(month), String(day))
      : getTransactionsByMonth(String(year), String(month));

  const { needRefresh, updateServiceWorker, swRegistration, setNeedRefresh } =
    useServiceWorker();

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      setStatusKey("serviceWorkerNotSupported");
      return;
    }

    if (!swRegistration) {
      setStatusKey("noServiceWorker");
      return;
    }

    if (needRefresh) {
      setStatusKey("updateAvailable");
      setIsUpdateModalOpen(true);
    } else if (!isCheckingUpdate && !isUpdating) {
      setStatusKey("check");
    }
  }, [needRefresh, swRegistration, isCheckingUpdate, isUpdating]);

  const waitForServiceWorkerUpdate = (
    registration: ServiceWorkerRegistration,
    timeoutMs = 15000,
    pollIntervalMs = 1000
  ) => {
    if (registration.waiting) {
      return Promise.resolve(true);
    }

    return new Promise<boolean>((resolve) => {
      const installing = registration.installing;
      let timer: ReturnType<typeof setTimeout> | null = null;
      let interval: ReturnType<typeof setInterval> | null = null;
      let resolved = false;

      const cleanup = () => {
        registration.removeEventListener("updatefound", onUpdateFound);
        installing?.removeEventListener("statechange", onInstallingStateChange);
        if (timer) clearTimeout(timer);
        if (interval) clearInterval(interval);
      };

      const finish = (found: boolean) => {
        if (resolved) return;
        resolved = true;
        cleanup();
        resolve(found);
      };

      const onInstallingStateChange = (event: Event) => {
        const worker = event.target as ServiceWorker;
        if (worker.state === "installed" || worker.state === "redundant") {
          finish(Boolean(registration.waiting));
        }
      };

      const onUpdateFound = () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener("statechange", (event) => {
          const worker = event.target as ServiceWorker;
          if (worker.state === "installed" || worker.state === "redundant") {
            finish(Boolean(registration.waiting));
          }
        });
      };

      if (installing) {
        installing.addEventListener("statechange", onInstallingStateChange);
      }

      registration.addEventListener("updatefound", onUpdateFound);

      interval = setInterval(() => {
        if (registration.waiting) {
          finish(true);
        }
      }, pollIntervalMs);

      timer = setTimeout(
        () => finish(Boolean(registration.waiting)),
        timeoutMs
      );
    });
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await updateServiceWorker(true);
      setIsUpdateModalOpen(false);
      setNeedRefresh(false);
      setStatusKey("check");
      setUpdateError(null);
    } catch (error) {
      console.error("Update failed:", error);
      setStatusKey("errorUpdating");
      setUpdateError(t("setting.errorUpdating"));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLater = () => {
    setNeedRefresh(false);
    setIsUpdateModalOpen(false);
    setStatusKey("check");
  };

  const handleCheckUpdate = async () => {
    setIsCheckingUpdate(true);
    setStatusKey("checking");
    setUpdateError(null);
    try {
      if (!("serviceWorker" in navigator)) {
        setStatusKey("serviceWorkerNotSupported");
        return;
      }
      if (!swRegistration) {
        setStatusKey("noServiceWorker");
        return;
      }
      await swRegistration.update();
      const hasUpdate = await waitForServiceWorkerUpdate(swRegistration);
      if (hasUpdate) {
        setNeedRefresh(true);
        setStatusKey("updateAvailable");
        setIsUpdateModalOpen(true);
      } else {
        setStatusKey("upToDate");
      }
    } catch (error) {
      console.error("Check update failed:", error);
      setStatusKey("errorChecking");
      setUpdateError(t("setting.errorChecking"));
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const handleCopy = (jsonInput: unknown) => {
    try {
      const isCopyableObject =
        jsonInput !== null &&
        (typeof jsonInput === "object" || Array.isArray(jsonInput));

      if (!isCopyableObject) {
        console.error("Input must be an object or array!");
        setCopyMessage(false);
        return;
      }
      const minified = JSON.stringify(jsonInput);
      navigator.clipboard
        .writeText(minified)
        .then(() => {
          setCopyMessage(true);
          setTimeout(() => setCopyMessage(false), 2000);
        })
        .catch((err) => {
          console.error("Clipboard write failed:", err);
          setCopyMessage(false);
        });
    } catch (error) {
      console.error("Unexpected error:", error);
      setCopyMessage(false);
    }
  };

  const handleSyncToggle = (value: boolean) => {
    if (token) {
      setIsSyncEnable(value);
      return;
    }
    setIsGetUserDataModalOpen(true);
  };

  const handleLanguageToggle = (value: boolean) => {
    setLanguage(value ? "fa" : "en");
  };

  const handleDefaultViewToggle = (value: boolean) => {
    setDefaultView(value ? "daily" : "monthly");
  };

  const handleTaskViewToggle = (value: boolean) => {
    setTaskDefaultView(value ? "daily" : "monthly");
  };

  const handleExportTransactions = () => handleCopy(transactions);

  const handleResetData = () => {
    resetFinance();
    setIsResetDataModalOpen(false);
  };

  const versionLabel = `V${version.version}`;
  const canCheckForUpdate =
    Boolean(swRegistration) && !needRefresh && !isCheckingUpdate;

  return (
    <PageLayout>
      <div className="flex flex-col gap-2">
        <SettingHeader
          avatarUrl={avatarUrl}
          userName={userName}
          title={t("navbar.setting")}
          versionLabel={versionLabel}
        />
        <SettingCard>
          <SyncRow
            label={t("setting.syncData")}
            token={token}
            isSyncEnable={isSyncEnable}
            onToggle={handleSyncToggle}
            onTriggerSync={triggerSync}
            onEditCredentials={() => setIsGetUserDataModalOpen(true)}
            isLoading={isLoading}
            error={error}
            lastSyncAt={lastSyncAt}
            lastAction={lastAction}
          />
          <SettingDivider />
          <SettingRow>
            <Paragraph size="lg">{t("setting.language")}</Paragraph>
            <LabeledToggle
              checked={language === "fa"}
              onChange={handleLanguageToggle}
              leftLabel="En"
              rightLabel="Fa"
              reverse={language === "fa"}
            />
          </SettingRow>
          <SettingRow>
            <Paragraph size="lg">{t("setting.viewType")}</Paragraph>
            <LabeledToggle
              checked={settings.defaultView === "daily"}
              onChange={handleDefaultViewToggle}
              leftLabel="M"
              rightLabel="D"
              reverse={language === "fa"}
            />
          </SettingRow>
          <SettingRow>
            <Paragraph size="lg">{t("setting.taskViewType")}</Paragraph>
            <LabeledToggle
              checked={settings.taskDefaultView === "daily"}
              onChange={handleTaskViewToggle}
              leftLabel="M"
              rightLabel="D"
              reverse={language === "fa"}
            />
          </SettingRow>
          <SettingRow
            onClick={canCheckForUpdate ? handleCheckUpdate : undefined}
            interactive={canCheckForUpdate}
          >
            <Paragraph
              size="lg"
              className={`${needRefresh ? "!text-primary font-semibold" : ""} ${
                !needRefresh ? "cursor-pointer" : ""
              }`}
            >
              {t(`setting.${statusKey}`)}
            </Paragraph>
            <div className="flex items-center relative justify-center gap-3">
              {isCheckingUpdate && !needRefresh && (
                <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
              )}
              <FiDownload
                size={20}
                className={needRefresh ? "text-primary animate-bounce" : ""}
              />
            </div>
          </SettingRow>
          {updateError && (
            <Paragraph className="text-red-400 text-sm px-4">
              {updateError}
            </Paragraph>
          )}
          <SettingRow onClick={handleExportTransactions}>
            <Paragraph size="lg">{t("setting.exportFinancial")}</Paragraph>
            {copyMessage ? (
              <IoCopy className="!text-primary" size={20} />
            ) : (
              <IoCopyOutline size={20} />
            )}
          </SettingRow>
          <SettingRow
            onClick={() => {
              setIsResetDataModalOpen(true);
            }}
            className="cursor-pointer"
            isLast
          >
            <Paragraph className="!text-primary" size="lg">
              {t("setting.resetData")}
            </Paragraph>
            <div className="flex items-center relative justify-center gap-4">
              <FiTrash2 size={20} className="text-primary" />
            </div>
          </SettingRow>
        </SettingCard>
      </div>

      {/* Github Data Modal */}
      <Modal
        size="sm"
        overflowY="overflow-y-visible"
        title={t("setting.enterYourGithubData")}
        isOpen={isGetUserDataModalOpen}
        onClose={() => {
          setIsGetUserDataModalOpen(false);
        }}
      >
        <UserDataForm
          targetData={{
            token,
            filename,
            gistId,
          }}
          onSuccess={() => {
            setIsGetUserDataModalOpen(false);
            triggerSync();
          }}
        />
      </Modal>

      {/* Reset Data Modal */}
      <Modal
        overflowY="overflow-y-visible"
        size="sm"
        title={t("setting.resetData")}
        onClose={() => {
          setIsResetDataModalOpen(false);
        }}
        isOpen={isResetDataModalOpen}
      >
        <Paragraph className="mb-4">{t("setting.resetWarn")}</Paragraph>
        <div className="flex gap-3 pb-2">
          <Button
            onClick={() => {
              setIsResetDataModalOpen(false);
            }}
            className="flex-1"
          >
            {t("setting.cancel")}
          </Button>
          <Button onClick={handleResetData} className="flex-1">
            {t("setting.resetData")}
          </Button>
        </div>
      </Modal>

      {/* Update Available Modal */}
      <Modal
        overflowY="overflow-y-visible"
        size="sm"
        title={t("setting.updateAvailable")}
        onClose={() => {
          setIsUpdateModalOpen(false);
        }}
        isOpen={isUpdateModalOpen}
      >
        <div className="space-y-4 pb-3">
          <Paragraph className="text-center">
            {t("setting.updateMessage")}
          </Paragraph>

          {isUpdating && (
            <div className="flex items-center justify-center gap-2 text-primary">
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
              <Paragraph className="text-primary">
                {t("setting.updating")}
              </Paragraph>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => {
                handleLater();
              }}
              className="flex-1"
              disabled={isUpdating}
            >
              {t("setting.later")}
            </Button>
            <Button
              onClick={handleUpdate}
              className="flex-1"
              disabled={isUpdating}
            >
              {t("setting.updateNow")}
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
}

type SyncRowProps = {
  label: string;
  token: string;
  isSyncEnable: boolean;
  onToggle: (value: boolean) => void;
  onTriggerSync: () => void;
  onEditCredentials: () => void;
  isLoading: boolean;
  error: string | null;
  lastSyncAt: Date | null;
  lastAction: SyncAction;
};

function SyncRow({
  label,
  token,
  isSyncEnable,
  onToggle,
  onTriggerSync,
  onEditCredentials,
  isLoading,
  error,
  lastSyncAt,
  lastAction,
}: SyncRowProps) {
  return (
    <div className="p-4 flex flex-col gap-2 cursor-pointer hover:bg-background/30 transition-colors">
      <div className="flex justify-between items-center">
        <Paragraph size="lg">{label}</Paragraph>
        <div className="flex items-center gap-4 justify-center">
          {token && (
            <div className="flex items-center gap-3 justify-center">
              <div onClick={onTriggerSync}>
                {error ? (
                  <MdSyncProblem className="text-primary size-5" />
                ) : (
                  <MdOutlineSync
                    className={`text-primary size-5 ${
                      isLoading ? "animate-spin" : ""
                    }`}
                  />
                )}
              </div>
              <div onClick={onEditCredentials}>
                <GrEdit className="text-primary" />
              </div>
            </div>
          )}
          <ToggleSwitch checked={isSyncEnable} onChange={onToggle} />
        </div>
      </div>
      {error && <Paragraph>{error}</Paragraph>}
      {lastSyncAt && (
        <Paragraph>
          {lastAction && `${lastAction} : `}
          {`${lastSyncAt.toLocaleDateString()} at ${lastSyncAt.toLocaleTimeString()}`}
        </Paragraph>
      )}
    </div>
  );
}
