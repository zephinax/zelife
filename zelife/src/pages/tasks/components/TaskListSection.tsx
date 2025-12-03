import { useMemo, type ReactNode, type RefObject } from "react";
import { BiChevronDown } from "react-icons/bi";
import { GrEdit } from "react-icons/gr";
import { FiTrash2 } from "react-icons/fi";
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
  MdOutlineSwipeLeft,
} from "react-icons/md";
import SwipeActions, {
  type SwipeAction,
} from "../../../components/swipeActions/SwipeActions";
import Paragraph from "../../../components/typography/Paragraph";
import { formatJalali } from "../../../utils/helper";
import type { Task } from "../../../store/types";

type TaskListSectionProps = {
  tasks: Task[];
  emptyState?: ReactNode;
  onToggleTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  isCollapsible?: boolean;
  isOpen?: boolean;
  onToggleOpen?: () => void;
  title?: string;
  listRef?: RefObject<HTMLDivElement | null>;
  className?: string;
};

export function TaskListSection({
  tasks,
  emptyState,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  isCollapsible,
  isOpen = true,
  onToggleOpen,
  title,
  listRef,
  className = "",
}: TaskListSectionProps) {
  const actions = useMemo<SwipeAction<Task>[]>(
    () => [
      {
        type: "edit",
        icon: GrEdit,
        function: onEditTask,
        color: "var(--color-background-secondary)",
        textColor: "var(--color-primary)",
        label: "Edit Task",
      },
      {
        type: "delete",
        icon: FiTrash2,
        function: (task) => onDeleteTask(task),
        color: "var(--color-background-secondary)",
        textColor: "var(--color-primary)",
        label: "Delete Task",
      },
    ],
    [onDeleteTask, onEditTask]
  );

  const content = (
    <div
      dir="ltr"
      className="p-2 flex flex-col bg-background-secondary rounded-3xl flex-1 overflow-y-auto"
      ref={listRef}
    >
      {tasks.length > 0 ? (
        tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            isLast={index === tasks.length - 1}
            actions={actions}
            onToggleTask={() => onToggleTask(task)}
          />
        ))
      ) : (
        <div className="py-2 flex items-center justify-center flex-col gap-4">
          {emptyState}
        </div>
      )}
    </div>
  );

  if (isCollapsible && title) {
    return (
      <div className={`my-2 ${className}`}>
        <div
          className="w-full flex justify-between items-center cursor-pointer"
          onClick={onToggleOpen}
        >
          <Paragraph className="font-medium" size="lg">
            {title} : {tasks.length}
          </Paragraph>
          <BiChevronDown
            className={`size-6 transform transition-transform duration-300 !text-primary ${
              isOpen ? "rotate-0" : "-rotate-90"
            }`}
          />
        </div>
        {isOpen && <div className="mt-2">{content}</div>}
      </div>
    );
  }

  return <div className={`mt-2 ${className}`}>{content}</div>;
}

type TaskItemProps = {
  task: Task;
  isLast: boolean;
  actions: SwipeAction<Task>[];
  onToggleTask: () => void;
};

function TaskItem({ task, isLast, actions, onToggleTask }: TaskItemProps) {
  return (
    <div className="w-full">
      <SwipeActions item={task} actions={actions} actionWidth={50} swipeThreshold={40}>
        <div className="w-full flex items-center gap-2 py-1.5">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onToggleTask();
            }}
            className="px-2 checkbox-container"
          >
            <div className="flex flex-col items-center justify-center">
              {task.isDone ? (
                <MdOutlineCheckBox className="!text-primary size-8" />
              ) : (
                <MdOutlineCheckBoxOutlineBlank className="!text-primary size-8" />
              )}
              <p className="text-[9px] font-medium">{formatJalali(task.updatedAt)}</p>
            </div>
          </div>

          <div className="flex-1">
            <Paragraph
              size="md"
              className={`font-medium ${task.isDone ? "!line-through opacity-70" : ""}`}
            >
              {task.title}
            </Paragraph>
            {task.description && (
              <Paragraph
                className={`line-clamp-1 ${task.isDone ? "line-through opacity-70" : ""}`}
              >
                {task.description}
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
