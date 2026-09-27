import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  ListTodo,
  Calendar,
  Users,
  Settings,
  Bell,
  X,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'My Tasks', icon: CheckSquare, path: '/my-tasks' },
    { label: 'All Tasks', icon: ListTodo, path: '/tasks' },
    { label: 'Calendar', icon: Calendar, path: '/calendar' },
    { label: 'Team', icon: Users, path: '/team' },
    { label: 'Notifications', icon: Bell, path: '/notifications' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700/80 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div>
          {/* Logo / Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-gray-100 dark:border-slate-700/60">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
                TaskPulse
              </span>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Pro Banner / Footer */}
        <div className="p-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white space-y-2 shadow-lg shadow-brand-500/20">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-semibold tracking-wide uppercase">Pro Plan</span>
            </div>
            <p className="text-xs text-brand-100 leading-relaxed">
              Real-time WebSocket collaboration & unlimited team tasks active.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
