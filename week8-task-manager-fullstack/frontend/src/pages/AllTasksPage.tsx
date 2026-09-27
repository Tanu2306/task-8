import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { userService } from '../services/notificationService';
import { TaskBoard } from '../components/kanban/TaskBoard';
import { FilterPanel } from '../components/tasks/FilterPanel';
import { TaskModal } from '../components/tasks/TaskModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { Task, TaskFilters, TaskStatus } from '../types';
import { useOutletContext } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const AllTasksPage: React.FC = () => {
  const { searchQuery, openNewTaskModal } = useOutletContext<{
    searchQuery: string;
    openNewTaskModal: () => void;
  }>();

  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<TaskFilters>({
    status: '',
    priority: '',
    assignedToId: '',
    sortBy: 'newest',
  });

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers,
  });

  const combinedFilters = { ...filters, search: searchQuery || filters.search };

  const {
    data: tasks = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['tasks', combinedFilters],
    queryFn: () => taskService.getTasks(combinedFilters),
  });

  const deleteMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      setDeletingTaskId(null);
    },
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            All Tasks
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Browse, search, and manage all organization tasks
          </p>
        </div>

        <button
          onClick={openNewTaskModal}
          className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all shadow-md shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        users={users}
        onChange={setFilters}
        onReset={() => setFilters({ status: '', priority: '', assignedToId: '', sortBy: 'newest' })}
      />

      {/* Main Board view */}
      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <LoadingSkeleton type="card" />
      ) : (
        <TaskBoard
          tasks={tasks}
          onAddTask={openNewTaskModal}
          onEditTask={(task) => setEditingTask(task)}
          onDeleteTask={(id) => setDeletingTaskId(id)}
        />
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskModal
          isOpen={!!editingTask}
          taskToEdit={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deletingTaskId}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete Task"
        isDestructive
        isLoading={deleteMutation.isPending}
        onConfirm={() => deletingTaskId && deleteMutation.mutate(deletingTaskId)}
        onClose={() => setDeletingTaskId(null)}
      />
    </div>
  );
};
