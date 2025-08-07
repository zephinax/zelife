import { useState } from "react";
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
    setLanguage,
    token,
    gistId,
    filename,
  } = useFinanceStore();
  const [isGetUserDataModalOpen, setIsGetUserDataModalOpen] = useState(false);
  return (
    <PageLayout>
      <div className="flex flex-col gap-2">
        <div className="relative rounded-full h-[90px] overflow-hidden flex justify-start gap-4 items-center">
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
              src={avatarUrl ? avatarUrl : "/logo.svg"}
            ></img>
            <Paragraph size="lg" className="!text-white">
              {userName}
            </Paragraph>
          </div>
        </div>
        <div>
          <Paragraph className="font-medium" size="lg">
            {t("navbar.setting")}
          </Paragraph>
        </div>
        <div className="bg-background-secondary  rounded-2xl">
          <div className="p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Paragraph size="lg">{t("setting.syncData")}</Paragraph>
              <div className="flex items-center gap-3 justify-center">
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
                {`${lastSyncAt.toLocaleDateString()} at ${lastSyncAt.toLocaleTimeString()}`}
                {lastAction && ` - ${lastAction}`}
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
        </div>
      </div>
      <Modal
        size="sm"
        title={"Enter yout github data"}
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
        />
      </Modal>
    </PageLayout>
  );
}
