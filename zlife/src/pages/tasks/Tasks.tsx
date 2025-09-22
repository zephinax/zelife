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
import { formatJalali, parseShamsiDate } from "../../utils/helper";
import { FiPlusCircle, FiTrash2 } from "react-icons/fi";
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
  MdOutlineSwipeLeft,
} from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import Modal from "../../components/modal/Modal";
import CreateTaskForm from "./CreateTaskForm";
import { GiLongLeggedSpider } from "react-icons/gi";
import TrueFocus from "../../components/reactBits/trueFocus/TrueFocus";
import { useForm } from "react-hook-form";
import { BiChevronDown } from "react-icons/bi";

export default function Tasks() {
  const {
    selectedDate,
    defaultDate,
    getTasksByMonth,
    getTasksByDay,
    toggleTaskDone,
    removeTask,
    settings,
    toggleTaskDoneByDate,
  } = useFinanceStore();
  const [createTaskModal, setCreateTaskModal] = useState(false);
  const { t } = useTranslation();
  const [targetTask, setTargetTask] = useState<Task | undefined>();
  const DATE = selectedDate ? selectedDate : defaultDate;
  const PARSE_DATE = parseShamsiDate(DATE);
  const { year, month, day } = PARSE_DATE;
  const [isDoneTaskOpen, setIsDoneTaskOpen] = useState(true);
  const doneTasksRef = useRef<HTMLDivElement>(null);
  const tasks =
    settings.taskDefaultView === "daily"
      ? getTasksByDay(String(year), String(month), String(day))
      : getTasksByMonth(String(year), String(month));
  const userDataForm = useForm();
  const sortedTasks: Task[] = tasks?.length
    ? tasks.sort((a, b) => {
        const priorityA = a.priority && a.priority > 0 ? a.priority : Infinity;
        const priorityB = b.priority && b.priority > 0 ? b.priority : Infinity;

        return priorityA - priorityB;
      })
    : [];

  const doneTasks = sortedTasks.filter((task: Task) => task.isDone);
  const pendingTasks = sortedTasks.filter((task: Task) => !task.isDone);

  useEffect(() => {
    if (isDoneTaskOpen && doneTasksRef.current) {
      doneTasksRef.current.scrollTop = 0;
    }
  }, [isDoneTaskOpen]);

  function renderTask(item: Task, index: number, arr: Task[]) {
    const isLast = index === arr.length - 1;

    return (
      <div key={item.id} className="w-full">
        <SwipeActions
          item={item}
          actions={getTransactionActions}
          actionWidth={50}
          swipeThreshold={40}
        >
          <div className="w-full flex items-center gap-2 py-1.5">
            {/* Checkbox */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (settings.taskDefaultView === "daily") {
                  toggleTaskDoneByDate(
                    String(year),
                    String(month),
                    String(day),
                    item.id
                  );
                } else {
                  toggleTaskDone(item.id);
                }
              }}
              className="px-2 checkbox-container"
            >
              <div className="flex flex-col items-center justify-center">
                {item.isDone ? (
                  <MdOutlineCheckBox className="!text-primary size-8" />
                ) : (
                  <MdOutlineCheckBoxOutlineBlank className="!text-primary size-8" />
                )}
                <p className="text-[9px] font-medium">
                  {formatJalali(item.updatedAt)}
                </p>
              </div>
            </div>

            {/* Task content */}
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

        {!isLast && <div className="w-full h-[1px] my-2 bg-background"></div>}
      </div>
    );
  }

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
        removeTask(task.id);
      },
      color: "var(--color-background-secondary)",
      textColor: "var(--color-primary)",
      label: "Delete Task",
    },
  ];

  return (
    <PageLayout>
      <div className="relative rounded-[45px] min-h-[90px] h-[90px] overflow-hidden flex justify-start gap-4 items-center">
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
      <div className="mt-2 mx-2 flex-1 flex flex-col pb-[85px]">
        <div className="w-full flex justify-between items-center">
          <Paragraph className="font-medium" size="lg">
            {t("tasks.tasks")} : {pendingTasks.length}
          </Paragraph>
          <Paragraph
            onClick={() => {
              userDataForm.reset();
              setTargetTask(undefined);
              setCreateTaskModal(true);
            }}
            size="md"
            className="!text-primary flex items-center gap-1"
          >
            {t("tasks.createTask")} <FiPlusCircle />
          </Paragraph>
        </div>

        <div
          dir="ltr"
          className="p-2 mt-2 flex flex-col bg-background-secondary justify-center items-center rounded-2xl flex-1 overflow-y-auto"
        >
          {pendingTasks && pendingTasks.length > 0 ? (
            pendingTasks.length > 0 &&
            pendingTasks.map((item, i, arr) => renderTask(item, i, arr))
          ) : (
            <div className="py-2 flex items-center justify-center flex-col gap-4">
              <GiLongLeggedSpider className="!text-primary size-14 opacity-75" />
              <Paragraph size="lg">{t("tasks.noTask")}</Paragraph>
            </div>
          )}
        </div>

        {doneTasks.length > 0 && (
          <div className="my-2">
            <div
              className="w-full flex justify-between items-center cursor-pointer"
              onClick={() => setIsDoneTaskOpen((prev) => !prev)}
            >
              <Paragraph className="font-medium" size="lg">
                {t("tasks.doneTasks")} : {doneTasks.length}
              </Paragraph>
              <BiChevronDown
                className={`size-6 transform transition-transform duration-300 !text-primary ${
                  isDoneTaskOpen ? "rotate-0" : "-rotate-90"
                }`}
              />
            </div>
            {isDoneTaskOpen && (
              <div
                dir="ltr"
                className="mt-2 flex flex-col bg-background-secondary rounded-2xl flex-1"
              >
                <div
                  ref={doneTasksRef}
                  className="p-2 flex flex-col justify-center items-center overflow-y-auto"
                >
                  {doneTasks.length > 0 &&
                    doneTasks.map((item, i, arr) => renderTask(item, i, arr))}
                </div>
              </div>
            )}
          </div>
        )}
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
