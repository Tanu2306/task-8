import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import { TaskBoard } from '../components/kanban/TaskBoard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { CheckSquare } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export const MyTasksPage: React.FC = () => {
  const { user } = useAuth();
  const { searchQuery, openNewTaskModal } = useOutletContext<{
    searchQuery: string;
    openNewTaskModal: () => void;
  }>();

  const {
    data: tasks = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['tasks', 'my-tasks', user?.id, searchQuery],
    queryFn: () =>
      taskService.getTasks({
        assignedToId: user?.id,
        search: searchQuery,
      }),
    enabled: !!user?.id,
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center space-x-3">
        <div className="p-3 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
          <CheckSquare className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            My Assigned Tasks
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Tasks assigned directly to {user?.name}
          </p>
        </div>
      </div>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <LoadingSkeleton type="card" />
      ) : (
        <TaskBoard tasks={tasks} onAddTask={openNewTaskModal} />
      )}
    </div>
  );
};
