import { GrEdit } from "react-icons/gr";
import PageLayout from "../../components/layouts/pageLayout/PageLayout";
import Silk from "../../components/react-bits/Silk";
import SwipeActions, {
  type SwipeAction,
} from "../../components/swipeActions/SwipeActions";
import Paragraph from "../../components/typography/Paragraph";
import Title from "../../components/typography/Title";
import { useTranslation } from "../../hooks/useTranslation";
import { useFinanceStore } from "../../store/store";
import type { Task } from "../../store/types";
import { numberWithCommas, parseShamsiDate } from "../../utils/helper";
import { FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { FaCircleArrowDown, FaCircleArrowUp } from "react-icons/fa6";
import { MdOutlineSwipeLeft } from "react-icons/md";
import { useState } from "react";
import Modal from "../../components/modal/Modal";
import CreateTaskForm from "./CreateTaskForm";

export default function Tasks() {
  const { selectedDate, defaultDate, getTasksByMonth } = useFinanceStore();
  const [createTaskModal, setCreateTaskModal] = useState(false);
  const { t } = useTranslation();
  const [targetTask, setTargetTask] = useState<Task | undefined>();
  const DATE = selectedDate ? selectedDate : defaultDate;
  const PARSE_DATE = parseShamsiDate(DATE);
  const { year, month } = PARSE_DATE;
  const tasks = getTasksByMonth(String(year), String(month));
  const getTransactionActions: SwipeAction<Task>[] = [
    {
      type: "edit",
      icon: GrEdit,
      function: (task) => {
        setTargetTask(task);
      },
      color: "#427bf5",
      label: "Edit Transaction",
    },
    {
      type: "delete",
      icon: FiTrash2,
      function: () => {},
      color: "#EF4444",
      label: "Delete Transaction",
    },
  ];
  return (
    <PageLayout>
      <div className="relative rounded-full h-[75px] overflow-hidden flex justify-start gap-4 items-center">
        <Silk
          speed={8}
          scale={0.6}
          color="#d24670"
          noiseIntensity={1.5}
          rotation={0}
        />
        <div className="absolute px-6 gap-4 top-[50%] translate-y-[-50%] w-full flex items-center justify-center">
          <Title className="!text-white">{t("tasks.taskManager")}</Title>
        </div>
      </div>
      <div className="mt-2 mx-2 flex-1 flex flex-col">
        <div className="w-full flex justify-between items-center">
          <Paragraph className="font-medium" size="lg">
            {t("tasks.tasks")}
          </Paragraph>
          <Paragraph
            onClick={() => {
              setCreateTaskModal(true);
            }}
            size="sm"
            className="!text-primary flex items-center gap-1"
          >
            {t("tasks.createTask")} <FiPlusCircle />
          </Paragraph>
        </div>
        <div
          dir="ltr"
          className="p-2 mt-2 flex flex-col-reverse bg-background-secondary justify-center items-center rounded-2xl flex-1 overflow-y-auto"
        >
          {tasks && tasks?.length && tasks.length > 0 ? (
            tasks?.map((item: Task, index) => {
              const isLast = index === tasks.length - 1;
              return (
                <div key={item.id} className="w-full">
                  {!isLast && (
                    <div className="w-full h-[1px] my-2 bg-background"></div>
                  )}
                  <SwipeActions
                    item={item}
                    actions={getTransactionActions}
                    actionWidth={70}
                    swipeThreshold={60}
                  >
                    <div className="w-full flex items-center gap-2 py-2">
                      <div className="px-2">
                        {item.isDone ? (
                          <div className="flex flex-col gap-1 justify-center items-center">
                            <FaCircleArrowDown className="!text-green-400 size-6" />
                            <p className="text-[9px] font-medium">
                              {item.priority}
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1 justify-center items-center">
                            <FaCircleArrowUp className="!text-red-500 size-6" />
                            <p className="text-[9px] font-medium">
                              {item.priority}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <Paragraph size="md" className="font-medium">
                          {numberWithCommas(item.title)}
                        </Paragraph>
                        {item.description && (
                          <Paragraph className="line-clamp-1">
                            {item.description}
                          </Paragraph>
                        )}
                      </div>
                      <div className="px-2 text-primary/40">
                        <MdOutlineSwipeLeft />
                      </div>
                    </div>
                  </SwipeActions>
                </div>
              );
            })
          ) : (
            <div className="py-2">
              <Paragraph>{t("tasks.noTask")}</Paragraph>
            </div>
          )}
        </div>
      </div>
      <Modal
        size="sm"
        title={t("setting.enterYourGithubData")}
        isOpen={createTaskModal}
        onClose={() => {
          setCreateTaskModal(false);
        }}
      >
        <CreateTaskForm
          targetData={targetTask}
          onSuccess={() => {
            setCreateTaskModal(false);
          }}
        />
      </Modal>
    </PageLayout>
  );
}
