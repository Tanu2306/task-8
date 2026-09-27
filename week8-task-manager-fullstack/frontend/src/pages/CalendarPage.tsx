import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const CalendarPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskService.getTasks(),
  });

  const tasksWithDueDate = tasks.filter((t) => t.dueDate);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center space-x-3">
        <div className="p-3 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
          <CalendarIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Task Schedule & Calendar
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Timeline of upcoming deadline milestones
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700/80 shadow-sm space-y-4">
        {tasksWithDueDate.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No scheduled tasks with due dates found.</p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-700/60">
            {tasksWithDueDate.map((task) => (
              <div
                key={task.id}
                onClick={() => navigate(`/tasks/${task.id}`)}
                className="py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/40 px-3 rounded-2xl cursor-pointer transition-colors"
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {task.title}
                  </h4>
                  <p className="text-xs text-gray-400 capitalize">
                    Priority: {task.priority.toLowerCase()} • Status: {task.status.toLowerCase()}
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-3 py-1.5 rounded-xl border border-brand-200 dark:border-brand-800">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{format(new Date(task.dueDate!), 'PPP')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
