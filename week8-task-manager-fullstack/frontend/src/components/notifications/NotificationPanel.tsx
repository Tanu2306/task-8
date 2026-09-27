import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../../services/notificationService';
import { Bell, CheckCheck, CheckCircle, AlertTriangle, MessageSquare, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
    enabled: isOpen,
  });

  const markReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  if (!isOpen) return null;

  const handleNotificationClick = (notif: any) => {
    if (!notif.read) {
      markReadMutation.mutate(notif.id);
    }
    if (notif.taskId) {
      navigate(`/tasks/${notif.taskId}`);
      onClose();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return <CheckCircle className="w-4 h-4 text-brand-500" />;
      case 'DUE_SOON':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'COMMENT_ADDED':
        return <MessageSquare className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="absolute right-0 top-14 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 z-50 overflow-hidden animate-fadeIn">
      <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white text-base">Notifications</h3>
        </div>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={() => markAllReadMutation.mutate()}
            className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700/60">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            No notifications yet
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors flex items-start space-x-3 ${
                !notif.read ? 'bg-brand-50/40 dark:bg-brand-950/20' : ''
              }`}
            >
              <div className="mt-0.5 p-1.5 bg-gray-100 dark:bg-slate-700 rounded-lg">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 space-y-1">
                <p
                  className={`text-xs text-gray-800 dark:text-gray-200 leading-snug ${
                    !notif.read ? 'font-semibold' : ''
                  }`}
                >
                  {notif.message}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                </p>
              </div>
              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
