import React, { useState } from 'react';
import { Menu, Search, Bell, LogOut, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { UserAvatar } from '../common/UserAvatar';
import { NotificationPanel } from '../notifications/NotificationPanel';
import { useQuery } from '@tanstack/react-query';
import { notificationService } from '../../services/notificationService';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  onMenuToggle: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onMenuToggle,
  searchQuery,
  onSearchChange,
}) => {
  const { user, logout } = useAuth();
  const { isConnected, isOnline } = useWebSocket();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const navigate = useNavigate();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: notificationService.getUnreadCount,
    refetchInterval: 15000,
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-200/80 dark:border-slate-700/80 px-4 lg:px-8 flex items-center justify-between transition-colors">
      {/* Left side: Hamburger & Search */}
      <div className="flex items-center space-x-4 flex-1">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white lg:hidden hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-xs sm:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks, descriptions... (Press '/' to focus)"
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100/70 dark:bg-slate-700/50 border border-transparent focus:border-brand-500 dark:focus:border-brand-400 rounded-xl focus:bg-white dark:focus:bg-slate-800 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
          />
          <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded">
            /
          </kbd>
        </div>
      </div>

      {/* Right side: Presence indicator, Theme toggle, Notifications, User Profile & Logout */}
      <div className="flex items-center space-x-3">
        {/* Connection / Online Presence Badge */}
        <div
          className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            isOnline && isConnected
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50'
              : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50'
          }`}
          title={
            !isOnline
              ? 'Browser is offline'
              : isConnected
              ? 'Real-time WebSocket connected'
              : 'Connecting to WebSocket...'
          }
        >
          {isOnline && isConnected ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-amber-500" />
              <span>Offline</span>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center space-x-3 pl-2 border-l border-gray-200 dark:border-slate-700">
          <UserAvatar user={user} size="md" showOnlineStatus isOnline={isOnline && isConnected} />

          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {user?.role?.toLowerCase()}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
