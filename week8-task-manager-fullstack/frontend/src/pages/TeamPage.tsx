import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/notificationService';
import { UserAvatar } from '../components/common/UserAvatar';
import { useWebSocket } from '../context/WebSocketContext';
import { Users, Mail, ShieldCheck, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const TeamPage: React.FC = () => {
  const { onlineUsers } = useWebSocket();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers,
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center space-x-3">
        <div className="p-3 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Team Members
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time presence tracking and workspace directory
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 animate-pulse h-40"
              />
            ))
          : users.map((u) => {
              const isOnline = onlineUsers.has(u.email);
              return (
                <div
                  key={u.id}
                  className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all flex items-start space-x-4"
                >
                  <UserAvatar user={u} size="lg" showOnlineStatus isOnline={isOnline} />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                        {u.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                        {u.role}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{u.email}</span>
                    </p>

                    <div className="pt-2 text-[11px] text-gray-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {isOnline
                          ? 'Online now'
                          : u.lastSeen
                          ? `Last seen ${formatDistanceToNow(new Date(u.lastSeen), { addSuffix: true })}`
                          : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};
