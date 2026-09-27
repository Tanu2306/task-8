import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { StatsCard } from '../components/dashboard/StatsCard';
import { TaskBoard } from '../components/kanban/TaskBoard';
import { ActivityTimeline } from '../components/dashboard/ActivityTimeline';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { Task, TaskStatus } from '../types';

export const DashboardPage: React.FC = () => {
  const { searchQuery, openNewTaskModal } = useOutletContext<{
    searchQuery: string;
    openNewTaskModal: () => void;
  }>();

  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: taskService.getDashboardStats,
  });

  const {
    data: tasks = [],
    isLoading: isTasksLoading,
    isError: isTasksError,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: ['tasks', searchQuery],
    queryFn: () => taskService.getTasks({ search: searchQuery }),
  });

  if (isStatsError || isTasksError) {
    return (
      <ErrorState
        message="Could not connect to backend server. Make sure Spring Boot is running on port 8080."
        onRetry={() => {
          refetchStats();
          refetchTasks();
        }}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Workspace Dashboard
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time Kanban status and productivity metrics
          </p>
        </div>

        <button
          onClick={openNewTaskModal}
          className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all shadow-md shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Task (N)</span>
        </button>
      </div>

      {/* Productivity Stats Cards */}
      {isStatsLoading ? (
        <LoadingSkeleton type="stats" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard
            title="Total Tasks"
            value={stats?.totalTasks ?? 0}
            subtitle="All active & done"
            icon={ListTodo}
            color="indigo"
          />
          <StatsCard
            title="To Do"
            value={stats?.todoTasks ?? 0}
            subtitle="Backlog queue"
            icon={Clock}
            color="blue"
          />
          <StatsCard
            title="In Progress"
            value={stats?.inProgressTasks ?? 0}
            subtitle="Active sprints"
            icon={TrendingUp}
            color="amber"
          />
          <StatsCard
            title="Completed"
            value={stats?.completedTasks ?? 0}
            subtitle="Finished work"
            icon={CheckCircle2}
            color="emerald"
          />
          <StatsCard
            title="Overdue"
            value={stats?.overdueTasks ?? 0}
            subtitle="Passed due date"
            icon={AlertCircle}
            color="rose"
          />
        </div>
      )}

      {/* Main Kanban Board & Timeline split */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Kanban Task Board
          </h2>
          <span className="text-xs text-gray-400">
            Drag cards between status columns to update live
          </span>
        </div>

        {isTasksLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LoadingSkeleton type="card" />
            <LoadingSkeleton type="card" />
            <LoadingSkeleton type="card" />
          </div>
        ) : (
          <TaskBoard tasks={tasks} onAddTask={openNewTaskModal} />
        )}
      </div>

      {/* Recent Activity Section */}
      <ActivityTimeline tasks={tasks} />
    </div>
  );
};
