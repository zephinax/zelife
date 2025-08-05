import { useState } from "react";
import ToggleSwitch from "../../components/inputs/ToggleSwitch";
import PageLayout from "../../components/layouts/pageLayout/PageLayout";
import Paragraph from "../../components/typography/Paragraph";
import { useFinanceStore } from "../../store/store";
import Modal from "../../components/modal/Modal";
import UserDataForm from "./UserDataForm";

export default function Setting() {
  const { avatarUrl, userName, isSyncEnable, setIsSyncEnable, token } =
    useFinanceStore();
  const [isGetUserDataModalOpen, setIsGetUserDataModalOpen] = useState(false);
  return (
    <PageLayout>
      <div className="flex flex-col gap-4">
        <div className="bg-background-secondary p-4 rounded-xl flex justify-between items-center">
          <img
            width={80}
            className="rounded-full bg-background-secondary"
            height={80}
            src={avatarUrl ? avatarUrl : "/logo.svg"}
          ></img>
          <Paragraph size="lg">{userName}</Paragraph>
        </div>
        <div className="bg-background-secondary p-4 rounded-xl flex justify-between items-center">
          <Paragraph size="lg">Sync data</Paragraph>
          <div className="flex items-center justify-center">
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
      </div>
      <Modal
        size="sm"
        title={"Enter yout github data"}
        isOpen={isGetUserDataModalOpen}
        onClose={() => {
          setIsGetUserDataModalOpen(false);
        }}
      >
        <UserDataForm />
      </Modal>
    </PageLayout>
  );
}
