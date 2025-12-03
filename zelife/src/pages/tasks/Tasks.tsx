import PageLayout from "../../components/layouts/pageLayout/PageLayout";
import Paragraph from "../../components/typography/Paragraph";
import { useTranslation } from "../../hooks/useTranslation";
import { useFinanceStore } from "../../store/store";
import type { Task } from "../../store/types";
import { parseShamsiDate } from "../../utils/helper";
import { FiPlusCircle } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import Modal from "../../components/modal/Modal";
import CreateTaskForm from "./CreateTaskForm";
import { GiLongLeggedSpider } from "react-icons/gi";
import { useForm } from "react-hook-form";
import { TaskHero, TaskToolbar } from "./components/TaskHeader";
import { TaskListSection } from "./components/TaskListSection";

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
  const { year, month, day } = parseShamsiDate(DATE);
  const [isDoneTaskOpen, setIsDoneTaskOpen] = useState(true);
  const doneTasksRef = useRef<HTMLDivElement>(null);
  const tasks =
    settings.taskDefaultView === "daily"
      ? getTasksByDay(String(year), String(month), String(day))
      : getTasksByMonth(String(year), String(month));
  const userDataForm = useForm();
  const sortedTasks: Task[] = tasks?.length
    ? [...tasks].sort((a, b) => {
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

  const toggleTaskStatus = (task: Task) => {
    if (settings.taskDefaultView === "daily") {
      toggleTaskDoneByDate(String(year), String(month), String(day), task.id);
      return;
    }
    toggleTaskDone(task.id);
  };

  const handleEditTask = (task: Task) => {
    setTargetTask(task);
    setCreateTaskModal(true);
  };

  const handleDeleteTask = (task: Task) => {
    removeTask(task.id);
  };

  const handleCreateTask = () => {
    userDataForm.reset();
    setTargetTask(undefined);
    setCreateTaskModal(true);
  };

  const emptyState = (
    <>
      <GiLongLeggedSpider className="!text-primary size-14 opacity-75" />
      <Paragraph size="lg">{t("tasks.noTask")}</Paragraph>
    </>
  );

  return (
    <PageLayout>
      <TaskHero title={t("tasks.taskManager")} />
      <div className="mt-2 mx-2 flex-1 flex flex-col pb-[85px]">
        <TaskToolbar
          tasksLabel={t("tasks.tasks")}
          createLabel={t("tasks.createTask")}
          pendingCount={pendingTasks.length}
          onCreate={handleCreateTask}
          createIcon={<FiPlusCircle />}
        />

        <TaskListSection
          tasks={pendingTasks}
          emptyState={emptyState}
          onToggleTask={toggleTaskStatus}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          className="flex-1"
        />

        {doneTasks.length > 0 && (
          <TaskListSection
            tasks={doneTasks}
            onToggleTask={toggleTaskStatus}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            isCollapsible
            isOpen={isDoneTaskOpen}
            onToggleOpen={() => setIsDoneTaskOpen((prev) => !prev)}
            title={t("tasks.doneTasks")}
            listRef={doneTasksRef}
          />
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
