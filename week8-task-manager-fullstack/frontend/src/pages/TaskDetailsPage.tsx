import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { CommentList } from '../components/comments/CommentList';
import { UserAvatar } from '../components/common/UserAvatar';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { TaskModal } from '../components/tasks/TaskModal';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User as UserIcon,
  Tag,
  AlertCircle,
  Edit3,
  Trash2,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { TaskStatus } from '../types';

export const TaskDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const taskId = Number(id);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    data: task,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => taskService.getTaskById(taskId),
    enabled: !!taskId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: TaskStatus) => taskService.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => taskService.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigate('/tasks');
    },
  });

  if (isLoading) return <LoadingSkeleton type="card" />;
  if (isError || !task)
    return <ErrorState message="Task not found or failed to load." onRetry={() => refetch()} />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Back button & Action Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to tasks</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-sm font-semibold hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Task Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-slate-700/80 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
              {task.priority} Priority
            </span>

            {/* Quick Status Dropdown */}
            <select
              value={task.status}
              onChange={(e) => updateStatusMutation.mutate(e.target.value as TaskStatus)}
              className="px-3 py-1 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-slate-700 border border-transparent focus:border-brand-500 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
            >
              <option value="TODO">Status: To Do</option>
              <option value="IN_PROGRESS">Status: In Progress</option>
              <option value="COMPLETED">Status: Completed</option>
            </select>
          </div>

          <span className="text-xs text-gray-400">Task #{task.id}</span>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white leading-tight">
            {task.title}
          </h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {task.description || 'No description provided.'}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-slate-700/40 border border-gray-100 dark:border-slate-700/60">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Assignee
            </span>
            <div className="flex items-center space-x-2">
              <UserAvatar user={task.assignedTo} size="sm" />
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                {task.assignedTo?.name || 'Unassigned'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Created By
            </span>
            <div className="flex items-center space-x-2">
              <UserAvatar user={task.createdBy} size="sm" />
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                {task.createdBy?.name || 'System'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Due Date
            </span>
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>
                {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No due date'}
              </span>
            </p>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Created Date
            </span>
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
            </p>
          </div>
        </div>

        {/* Activity Timeline snippet */}
        <div className="pt-4 border-t border-gray-100 dark:border-slate-700/60 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center space-x-1">
            <Activity className="w-4 h-4 text-brand-500" />
            <span>Activity History</span>
          </h4>
          <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 pl-4 list-disc">
            <li>Created on {format(new Date(task.createdAt), 'PPP p')} by {task.createdBy?.name}</li>
            <li>Last updated {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}</li>
          </ul>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-slate-700/80 shadow-sm">
        <CommentList taskId={taskId} />
      </div>

      {/* Modals */}
      {isEditModalOpen && (
        <TaskModal
          isOpen={isEditModalOpen}
          taskToEdit={task}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"?`}
        confirmLabel="Delete Task"
        isDestructive
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
