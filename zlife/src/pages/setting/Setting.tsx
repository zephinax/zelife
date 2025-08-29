import { useEffect, useState } from "react";
import ToggleSwitch from "../../components/inputs/ToggleSwitch";
import PageLayout from "../../components/layouts/pageLayout/PageLayout";
import Paragraph from "../../components/typography/Paragraph";
import { useFinanceStore } from "../../store/store";
import Modal from "../../components/modal/Modal";
import UserDataForm from "./UserDataForm";
import Silk from "../../components/react-bits/Silk";
import { useTranslation } from "../../hooks/useTranslation";
import { GrEdit } from "react-icons/gr";
import { MdOutlineSync, MdSyncProblem } from "react-icons/md";
import version from "./../../../package.json";
import { FiDownload, FiTrash2 } from "react-icons/fi";
import Button from "../../components/button/Button";
import { Workbox } from "workbox-window";
import { GoCopy } from "react-icons/go";
import { parseShamsiDate } from "../../utils/helper";
import { PiCopy, PiCopyFill } from "react-icons/pi";

export default function Setting({
  lastSyncAt,
  isLoading,
  error,
  lastAction,
  triggerSync,
}: {
  isLoading: boolean;
  lastSyncAt: Date | null;
  error: string | null;
  lastAction:
    | "created"
    | "updated"
    | "merged"
    | "overwritten"
    | "no_changes"
    | null;
  triggerSync: () => void;
}) {
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
  const [copyMessage, setCopyMessage] = useState(false);
  const [status, setStatus] = useState(t("setting.check"));
  const DATE = selectedDate ? selectedDate : defaultDate;
  const PARSE_DATE = parseShamsiDate(DATE);
  const { year, month, day } = PARSE_DATE;
  const transactions =
    settings.defaultView === "daily"
      ? getTransactionsByDay(String(year), String(month), String(day))
      : getTransactionsByMonth(String(year), String(month));

  useEffect(() => {
    setStatus(t("setting.check"));
  }, [language, t]);

  const checkForUpdate = async () => {
    if (!("serviceWorker" in navigator)) return;
    const wb = new Workbox("/sw.js");
    setStatus(t("setting.checking"));
    wb.addEventListener("waiting", () => {
      setStatus(t("setting.updateAvailable"));
      wb.messageSW({ type: "SKIP_WAITING" });
      window.location.reload();
    });

    try {
      await wb.register();
      setStatus(t("setting.upToDate"));
    } catch (error) {
      console.error(error);
      setStatus(t("setting.error"));
    }
  };

  const handleCopy = (jsonInput: any) => {
    try {
      if (
        !jsonInput ||
        (typeof jsonInput !== "object" && !Array.isArray(jsonInput))
      ) {
        console.error("Input must be an object or array!");
        setCopyMessage(false);
        return;
      }
      const minified = JSON.stringify(jsonInput);
      navigator.clipboard
        .writeText(minified)
        .then(() => {
          setCopyMessage(true);
          setTimeout(() => setCopyMessage(false), 3000);
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

  return (
    <PageLayout>
      <div className="flex flex-col gap-2">
        <div className="relative rounded-full min-h-[90px] h-[90px] overflow-hidden flex justify-start gap-4 items-center">
          <Silk
            speed={8}
            scale={0.6}
            color="#d24670"
            noiseIntensity={1.5}
            rotation={0}
          />
          <div className="absolute px-2 gap-4 top-[50%] translate-y-[-50%] w-full flex items-center justify-start">
            <img
              width={74}
              className="rounded-full bg-background"
              height={74}
              alt="Z"
              src={avatarUrl ? avatarUrl : "/logo.svg"}
            ></img>
            <Paragraph size="lg" className="!text-white">
              {userName}
            </Paragraph>
          </div>
        </div>
        <div className="mx-2 flex items-center justify-between">
          <Paragraph className="font-medium" size="lg">
            {t("navbar.setting")}
          </Paragraph>
          <Paragraph className="!text-primary">V{version.version}</Paragraph>
        </div>
        <div className="bg-background-secondary mx-2 rounded-2xl">
          <div className="p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Paragraph size="lg">{t("setting.syncData")}</Paragraph>
              <div className="flex items-center gap-4 justify-center">
                {token && (
                  <div className="flex items-center gap-3 justify-center">
                    <div
                      onClick={() => {
                        triggerSync();
                      }}
                    >
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
                    <div
                      onClick={() => {
                        setIsGetUserDataModalOpen(true);
                      }}
                    >
                      <GrEdit className="text-primary" />
                    </div>
                  </div>
                )}
                <ToggleSwitch
                  checked={isSyncEnable}
                  onChange={(value) => {
                    if (token) {
                      setIsSyncEnable(value);
                    } else {
                      setIsGetUserDataModalOpen(true);
                    }
                  }}
                />
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
          <div className="w-full h-[1px] bg-background mx-2"></div>
          <div className="p-4 flex justify-between items-center">
            <Paragraph size="lg">{t("setting.language")}</Paragraph>
            <div className="flex items-center relative justify-cente gap-4">
              <ToggleSwitch
                checked={language === "fa"}
                onChange={(value) => {
                  if (value === true) {
                    setLanguage("fa");
                  } else {
                    setLanguage("en");
                  }
                }}
              />
              <div
                className={`absolute flex bottom-[-12px] w-[40px] justify-between left-1 ${
                  language === "fa" ? "flex-row-reverse" : ""
                }`}
              >
                <Paragraph className="text-[8px]">En</Paragraph>
                <Paragraph className="text-[8px]">Fa</Paragraph>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-background mx-2"></div>
          <div className="p-4 flex justify-between items-center">
            <Paragraph size="lg">{t("setting.viewType")}</Paragraph>
            <div className="flex items-center relative justify-cente gap-4">
              <ToggleSwitch
                checked={settings.defaultView === "daily"}
                onChange={(value) => {
                  if (value === true) {
                    setDefaultView("daily");
                  } else {
                    setDefaultView("monthly");
                  }
                }}
              />
              <div
                className={`absolute flex bottom-[-12px] w-[40px] justify-between left-1 ${
                  language === "fa" ? "flex-row-reverse" : ""
                }`}
              >
                <Paragraph className="text-[8px]">M</Paragraph>
                <Paragraph className="text-[8px]">D</Paragraph>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-background mx-2"></div>
          <div className="p-4 flex justify-between items-center">
            <Paragraph size="lg">{t("setting.taskViewType")}</Paragraph>
            <div className="flex items-center relative justify-cente gap-4">
              <ToggleSwitch
                checked={settings.taskDefaultView === "daily"}
                onChange={(value) => {
                  if (value === true) {
                    setTaskDefaultView("daily");
                  } else {
                    setTaskDefaultView("monthly");
                  }
                }}
              />
              <div
                className={`absolute flex bottom-[-12px] w-[40px] justify-between left-1 ${
                  language === "fa" ? "flex-row-reverse" : ""
                }`}
              >
                <Paragraph className="text-[8px]">M</Paragraph>
                <Paragraph className="text-[8px]">D</Paragraph>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-background mx-2"></div>
          <div
            onClick={() => {
              checkForUpdate();
            }}
            className="p-4 flex justify-between items-center"
          >
            <Paragraph size="lg">{status}</Paragraph>
            <div className="flex items-center relative justify-cente gap-4">
              <FiDownload size={20} />
            </div>
          </div>
          <div className="w-full h-[1px] bg-background mx-2"></div>
          <div
            onClick={() => {
              handleCopy(transactions);
            }}
            className="p-4 flex justify-between items-center"
          >
            <Paragraph size="lg">{t("setting.exportFinancial")}</Paragraph>
            {copyMessage ? (
              <PiCopyFill className="!text-primary" size={20} />
            ) : (
              <PiCopy size={20} />
            )}
          </div>
          <div className="w-full h-[1px] bg-background mx-2"></div>
          <div className="p-4 flex justify-between items-center">
            <Paragraph className="!text-primary" size="lg">
              {t("setting.resetData")}
            </Paragraph>
            <div
              onClick={() => {
                setIsResetDataModalOpen(true);
              }}
              className="flex items-center relative justify-cente gap-4"
            >
              <FiTrash2 size={20} className="text-primary" />
            </div>
          </div>
        </div>
      </div>
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
      <Modal
        overflowY="overflow-y-visible"
        size="sm"
        title={t("setting.resetData")}
        onClose={() => {
          setIsResetDataModalOpen(false);
        }}
        isOpen={isResetDataModalOpen}
      >
        <Paragraph>{t("setting.resetWarn")}</Paragraph>
        <Button
          onClick={() => {
            resetFinance();
            setIsResetDataModalOpen(false);
          }}
          className="w-full my-5"
        >
          {t("setting.resetData")}
        </Button>
      </Modal>
    </PageLayout>
  );
}
