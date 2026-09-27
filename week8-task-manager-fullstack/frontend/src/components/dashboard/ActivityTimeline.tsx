import React from 'react';
import { Task } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { UserAvatar } from '../common/UserAvatar';
import { Activity, CheckCircle2, Clock, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActivityTimelineProps {
  tasks: Task[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ tasks }) => {
  const navigate = useNavigate();

  // Take latest 5 tasks as activity items
  const recentActivities = tasks.slice(0, 6);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/70 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700/60">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h3 className="font-bold text-gray-900 dark:text-white text-base">
            Recent Task Activity
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        {recentActivities.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No recent activity</p>
        ) : (
          recentActivities.map((task) => (
            <div
              key={task.id}
              onClick={() => navigate(`/tasks/${task.id}`)}
              className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/40 cursor-pointer transition-colors"
            >
              <UserAvatar user={task.createdBy} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                  <span className="font-semibold">{task.createdBy?.name || 'Someone'}</span>{' '}
                  created task{' '}
                  <span className="text-brand-600 dark:text-brand-400 font-semibold">
                    "{task.title}"
                  </span>
                </p>
                <div className="flex items-center space-x-2 text-[11px] text-gray-400 mt-0.5">
                  <span className="capitalize font-medium text-slate-500 dark:text-slate-400">
                    Status: {task.status.replace('_', ' ')}
                  </span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
