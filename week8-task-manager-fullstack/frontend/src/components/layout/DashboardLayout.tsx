import React, { useState, useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { TaskModal } from '../tasks/TaskModal';
import { useWebSocket } from '../../context/WebSocketContext';
import { WifiOff } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const { isOnline } = useWebSocket();

  // Global Keyboard Shortcuts (N -> New task, / -> search, Esc -> close modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcut if user is typing inside an input/textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (!isInput && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsNewTaskModalOpen(true);
      }

      if (!isInput && e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }

      if (e.key === 'Escape') {
        setIsNewTaskModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Offline Banner */}
        {!isOnline && (
          <div className="bg-amber-500 text-slate-950 font-medium text-xs py-1.5 px-4 text-center flex items-center justify-center space-x-2 animate-fadeIn">
            <WifiOff className="w-4 h-4" />
            <span>You are currently offline. Local changes will sync when network returns.</span>
          </div>
        )}

        {/* Topbar */}
        <Topbar
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet context={{ searchQuery, openNewTaskModal: () => setIsNewTaskModalOpen(true) }} />
        </main>
      </div>

      {/* Create Task Modal */}
      <TaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
      />
    </div>
  );
};
