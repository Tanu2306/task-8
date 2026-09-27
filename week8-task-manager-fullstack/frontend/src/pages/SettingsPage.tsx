import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Settings, User, Moon, Sun, Shield, Bell } from 'lucide-react';
import { UserAvatar } from '../components/common/UserAvatar';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex items-center space-x-3">
        <div className="p-3 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Account & Preferences
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage profile settings and application theme
          </p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700/80 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <User className="w-5 h-5 text-brand-500" />
          <span>Profile Information</span>
        </h3>

        <div className="flex items-center space-x-4">
          <UserAvatar user={user} size="lg" />
          <div>
            <h4 className="text-base font-bold text-gray-900 dark:text-white">{user?.name}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
              Role: {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700/80 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <Sun className="w-5 h-5 text-amber-500" />
          <span>Appearance</span>
        </h3>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Theme Mode</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Currently using {theme} mode
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white font-medium text-xs hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
      </div>
    </div>
  );
};
