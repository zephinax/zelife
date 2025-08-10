import { GrEdit } from "react-icons/gr";
import PageLayout from "../../components/layouts/pageLayout/PageLayout";
import Silk from "../../components/react-bits/Silk";
import SwipeActions, {
  type SwipeAction,
} from "../../components/swipeActions/SwipeActions";
import Paragraph from "../../components/typography/Paragraph";
import { useTranslation } from "../../hooks/useTranslation";
import { useFinanceStore } from "../../store/store";
import type { Task } from "../../store/types";
import { parseShamsiDate } from "../../utils/helper";
import { FiPlusCircle, FiTrash2 } from "react-icons/fi";
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
  MdOutlineSwipeLeft,
} from "react-icons/md";
import { useState } from "react";
import Modal from "../../components/modal/Modal";
import CreateTaskForm from "./CreateTaskForm";
import { GiLongLeggedSpider } from "react-icons/gi";
import TrueFocus from "../../components/reactBits/trueFocus/TrueFocus";
import { useForm } from "react-hook-form";

export default function Tasks() {
  const {
    selectedDate,
    defaultDate,
    getTasksByMonth,
    getTasksByDay,
    toggleTaskDone,
    removeTask,
    settings,
  } = useFinanceStore();
  const [createTaskModal, setCreateTaskModal] = useState(false);
  const { t } = useTranslation();
  const [targetTask, setTargetTask] = useState<Task | undefined>();
  const DATE = selectedDate ? selectedDate : defaultDate;
  const PARSE_DATE = parseShamsiDate(DATE);
  const { year, month, day } = PARSE_DATE;
  const tasks =
    settings.defaultView === "daily"
      ? getTasksByDay(String(year), String(month), String(day))
      : getTasksByMonth(String(year), String(month));
  const userDataForm = useForm();
  // ---- SORTING LOGIC ----
  // Groups:
  // 0 = undone && has priority  (sorted by priority asc)
  // 1 = undone && no priority   (kept original order)
  // 2 = done                    (kept original order)
  const sortedTasks: Task[] = tasks?.length
    ? tasks.sort((a, b) => {
        // فقط بر اساس isDone سورت کن
        if (a.isDone !== b.isDone) {
          return a.isDone ? 1 : -1; // undone tasks اول، done tasks آخر
        }
        return 0; // ترتیب باقی تسک‌ها تغییر نکند
      })
    : [];

  const getTransactionActions: SwipeAction<Task>[] = [
    {
      type: "edit",
      icon: GrEdit,
      function: (task) => {
        setTargetTask(task);
        setCreateTaskModal(true);
      },
      color: "var(--color-background-secondary)",
      textColor: "var(--color-primary)",
      label: "Edit Task",
    },
    {
      type: "delete",
      icon: FiTrash2,
      function: (task) => {
        removeTask(String(year), String(month), String(day), task.id);
      },
      color: "var(--color-background-secondary)",
      textColor: "var(--color-primary)",
      label: "Delete Task",
    },
  ];

  return (
    <PageLayout>
      <div className="relative rounded-full h-[90px] overflow-hidden flex justify-start gap-4 items-center">
        <Silk
          speed={8}
          scale={0.6}
          color="#d24670"
          noiseIntensity={1.5}
          rotation={0}
        />
        <div className="!text-white text-2xl absolute px-6 gap-4 top-[50%] translate-y-[-50%] w-full flex items-center justify-center">
          {/* <Title className="!text-white">{t("tasks.taskManager")}</Title> */}
          <TrueFocus
            blurAmount={2.5}
            manualMode={false}
            borderColor="var(--color-primary)"
            sentence={t("tasks.taskManager")}
          />
        </div>
      </div>
      <div className="mt-2 mx-2 flex-1 flex flex-col">
        <div className="w-full flex justify-between items-center">
          <Paragraph className="font-medium" size="lg">
            {t("tasks.tasks")}
          </Paragraph>
          <Paragraph
            onClick={() => {
              userDataForm.reset();
              setTargetTask(undefined);
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
          className="p-2 mt-2 flex flex-col bg-background-secondary justify-center items-center rounded-2xl flex-1 overflow-y-auto"
        >
          {sortedTasks && sortedTasks.length > 0 ? (
            sortedTasks.map((item: Task, index) => {
              const isLast = index === sortedTasks.length - 1;
              return (
                <div key={item.id} className="w-full">
                  <SwipeActions
                    item={item}
                    actions={getTransactionActions}
                    actionWidth={50}
                    swipeThreshold={40}
                  >
                    <div className="w-full flex items-center gap-2 py-2">
                      <div
                        onClick={() => {
                          toggleTaskDone(
                            String(year),
                            String(month),
                            String(day),
                            item.id
                          );
                        }}
                        className="px-2"
                      >
                        {item.isDone ? (
                          <div className="flex flex-col gap-1 justify-center items-center">
                            <MdOutlineCheckBox className="!text-primary size-8" />
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1 justify-center items-center">
                            <MdOutlineCheckBoxOutlineBlank className="!text-primary size-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <Paragraph
                          size="md"
                          className={`font-medium ${
                            item.isDone ? "!line-through opacity-70" : ""
                          }`}
                        >
                          {item.title}
                        </Paragraph>
                        {item.description && (
                          <Paragraph
                            className={`line-clamp-1 ${
                              item.isDone ? "line-through opacity-70" : ""
                            }`}
                          >
                            {item.description}
                          </Paragraph>
                        )}
                      </div>
                      <div className="px-2 text-primary/40">
                        <MdOutlineSwipeLeft />
                      </div>
                    </div>
                  </SwipeActions>
                  {!isLast && (
                    <div className="w-full h-[1px] my-2 bg-background"></div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-2 flex items-center justify-center flex-col gap-4">
              <GiLongLeggedSpider className="!text-primary size-14 opacity-75" />
              <Paragraph size="lg">{t("tasks.noTask")}</Paragraph>
            </div>
          )}
        </div>
      </div>
      <Modal
        size="sm"
        overflowY="overflow-y-visible"
        title={
          Boolean(targetTask?.id) ? t("tasks.editTask") : t("tasks.createTask")
        }
        isOpen={createTaskModal}
        onClose={() => {
          setCreateTaskModal(false);
        }}
      >
        <CreateTaskForm
          userDataForm={userDataForm}
          targetData={targetTask}
          onSuccess={() => {
            setCreateTaskModal(false);
          }}
        />
      </Modal>
    </PageLayout>
  );
}
