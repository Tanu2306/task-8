import React from 'react';

export const LoadingSkeleton: React.FC<{ type?: 'card' | 'stats' | 'list' }> = ({ type = 'card' }) => {
  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm animate-pulse"
          >
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-3" />
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-100 dark:bg-slate-750 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700/60 animate-pulse flex items-center space-x-4"
          >
            <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
              <div className="h-3 bg-gray-100 dark:bg-slate-750 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm animate-pulse space-y-3"
        >
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20" />
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-16" />
          </div>
          <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
          <div className="h-3 bg-gray-100 dark:bg-slate-750 rounded w-full" />
          <div className="flex justify-between items-center pt-2">
            <div className="w-7 h-7 bg-gray-200 dark:bg-slate-700 rounded-full" />
            <div className="h-3 bg-gray-100 dark:bg-slate-750 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};
