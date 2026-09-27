import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, Priority } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import { Calendar, MessageSquare, AlertCircle, Clock, MoreVertical, Trash2, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id.toString(), data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const priorityStyles: Record<Priority, { bg: string; text: string; border: string }> = {
    LOW: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800/50',
    },
    MEDIUM: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800/50',
    },
    HIGH: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800/50',
    },
    URGENT: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-800/50',
    },
  };

  const priorityStyle = priorityStyles[task.priority];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/70 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
        isDragging ? 'ring-2 ring-brand-500 shadow-xl' : ''
      }`}
    >
      {/* Header: Priority & Quick Actions */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
        >
          {task.priority}
        </span>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-1 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
              title="Edit Task"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="p-1 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Task Title */}
      <h4
        onClick={() => navigate(`/tasks/${task.id}`)}
        className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer line-clamp-2 mb-1.5 transition-colors"
      >
        {task.title}
      </h4>

      {/* Description Preview */}
      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer: Due date, Comment count, Assignee */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700/60 mt-3 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-3">
          {task.dueDate && (
            <div
              className={`flex items-center space-x-1 ${
                task.overdue ? 'text-rose-600 dark:text-rose-400 font-medium' : ''
              }`}
            >
              {task.overdue ? (
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              ) : (
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
              )}
              <span className="text-[11px]">
                {format(new Date(task.dueDate), 'MMM d')}
              </span>
            </div>
          )}

          <div className="flex items-center space-x-1 text-gray-400">
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">{task.commentCount || 0}</span>
          </div>
        </div>

        <UserAvatar user={task.assignedTo} size="sm" />
      </div>
    </div>
  );
};
