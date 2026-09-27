import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, Zap, Shield, Users, ArrowRight, LayoutDashboard, Globe } from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      {/* Header / Navbar */}
      <nav className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-xl font-extrabold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            TaskPulse
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-md shadow-brand-600/30 transition-all hover:scale-[1.02]"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl w-full mx-auto px-6 py-16 lg:py-24 text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-950/60 border border-brand-800/60 text-brand-300 text-xs font-semibold tracking-wide uppercase shadow-inner">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Next-Gen Fullstack Task Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
          Manage team workflow in{' '}
          <span className="bg-gradient-to-r from-brand-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            real-time.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
          TaskPulse empowers engineering and product teams with instant WebSocket Kanban boards, JWT security, and interactive productivity analytics.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-base shadow-xl shadow-brand-600/30 transition-all hover:scale-105 flex items-center justify-center space-x-3"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-bold text-base transition-all"
          >
            Demo Sign In
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-6xl mx-auto text-left">
          <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700/60 space-y-4 hover:border-brand-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Real-Time WebSockets</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Instant updates across all active browser windows when tasks are created, assigned, or moved.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700/60 space-y-4 hover:border-brand-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Interactive Kanban</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Fluid drag-and-drop task columns with optimistic UI updates and instant status synchronization.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700/60 space-y-4 hover:border-brand-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Enterprise JWT Security</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              BCrypt password hashing, access/refresh token rotation, and Spring Security protection.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>© 2026 TaskPulse Fullstack Application. Powered by Spring Boot 3 & React 18.</p>
      </footer>
    </div>
  );
};
