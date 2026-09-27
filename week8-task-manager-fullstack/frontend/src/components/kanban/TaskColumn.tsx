import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface TaskColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onAddTask?: (status: TaskStatus) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  id,
  title,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const statusColors: Record<TaskStatus, { badge: string; border: string }> = {
    TODO: {
      badge: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
      border: 'border-slate-200 dark:border-slate-700',
    },
    IN_PROGRESS: {
      badge: 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300',
      border: 'border-brand-200 dark:border-brand-800',
    },
    COMPLETED: {
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
  };

  const statusStyle = statusColors[id];
  const taskIds = tasks.map((t) => t.id.toString());

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col flex-shrink-0 w-80 lg:w-96 rounded-2xl bg-gray-100/60 dark:bg-slate-800/40 p-4 border transition-colors duration-200 min-h-[500px] ${
        isOver
          ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/20 dark:bg-brand-950/10'
          : statusStyle.border
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200/60 dark:border-slate-700/60">
        <div className="flex items-center space-x-2.5">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">{title}</h3>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle.badge}`}
          >
            {tasks.length}
          </span>
        </div>

        {onAddTask && (
          <button
            onClick={() => onAddTask(id)}
            className="p-1.5 rounded-xl text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm"
            title={`Add task to ${title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Column Cards list */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {tasks.length === 0 ? (
            <EmptyState
              title={`No ${title.toLowerCase()} tasks`}
              description="Drag a task here or create a new one."
            />
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};
