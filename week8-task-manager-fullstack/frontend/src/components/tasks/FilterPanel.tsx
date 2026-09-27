import React from 'react';
import { TaskFilters, TaskStatus, Priority, User } from '../../types';
import { Filter, SortAsc, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  filters: TaskFilters;
  users?: User[];
  onChange: (filters: TaskFilters) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  users = [],
  onChange,
  onReset,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/70 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
          <Filter className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Filters:</span>
        </div>

        {/* Status Filter */}
        <select
          value={filters.status || ''}
          onChange={(e) => onChange({ ...filters, status: e.target.value as TaskStatus })}
          className="px-3 py-1.5 text-xs bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 dark:text-gray-200"
        >
          <option value="">All Statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority || ''}
          onChange={(e) => onChange({ ...filters, priority: e.target.value as Priority })}
          className="px-3 py-1.5 text-xs bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 dark:text-gray-200"
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>

        {/* Assignee Filter */}
        <select
          value={filters.assignedToId || ''}
          onChange={(e) =>
            onChange({ ...filters, assignedToId: e.target.value ? Number(e.target.value) : undefined })
          }
          className="px-3 py-1.5 text-xs bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 dark:text-gray-200"
        >
          <option value="">All Assignees</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sorting & Reset */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <SortAsc className="w-4 h-4 text-gray-400" />
          <select
            value={filters.sortBy || 'newest'}
            onChange={(e) =>
              onChange({ ...filters, sortBy: e.target.value as any })
            }
            className="px-3 py-1.5 text-xs bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 dark:text-gray-200"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Priority</option>
            <option value="duedate">Due Date</option>
          </select>
        </div>

        <button
          onClick={onReset}
          className="p-1.5 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          title="Reset Filters"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
