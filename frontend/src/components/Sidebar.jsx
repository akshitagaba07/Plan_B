import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  Compass, 
  Heart, 
  Calendar, 
  Users, 
  MessageSquare, 
  Activity, 
  Bot, 
  Settings, 
  LogOut,
  Sun,
  Moon
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  
  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Discover', path: '/discover', icon: Compass },
    { name: 'Matches', path: '/matches', icon: Heart },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Community', path: '/community', icon: Users },
    { name: 'Chat', path: '/chat', icon: MessageSquare },
    { name: 'Wellness', path: '/wellness', icon: Activity },
    { name: 'AI Companion', path: '/assistant', icon: Bot },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed top-6 left-6 bottom-6 w-64 glass-card py-8 px-4 justify-between z-30">
        <div>
          {/* Logo Title */}
          <div className="flex items-center gap-3 px-4 mb-8">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary-900 to-secondary-500 flex items-center justify-center shadow-md">
              <span className="text-white font-extrabold text-xl font-outfit">B</span>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary-900 via-secondary-500 to-accent-coral bg-clip-text text-transparent dark:from-white dark:via-secondary-400">Plan B</span>
              <p className="text-[10px] text-primary-400 font-medium tracking-widest uppercase">Social Wellness</p>
            </div>
          </div>

          {/* Navigation Options */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary-900 to-slate-800 text-white shadow-md shadow-primary-900/10 dark:from-white dark:to-slate-100 dark:text-primary-950' 
                      : 'text-primary-500 dark:text-slate-400 hover:bg-primary-100/50 dark:hover:bg-slate-800/40 hover:text-primary-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="space-y-2">
          {/* Dark Mode toggle in sidebar */}
          <button 
            onClick={toggleDarkMode}
            className="flex items-center justify-between w-full px-4 py-3 rounded-2xl text-primary-500 dark:text-slate-400 hover:bg-primary-100/50 dark:hover:bg-slate-800/40 hover:text-primary-900 dark:hover:text-slate-100 font-semibold text-sm transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              {darkMode ? <Sun className="h-5 w-5 stroke-[1.8px]" /> : <Moon className="h-5 w-5 stroke-[1.8px]" />}
              <span>{darkMode ? 'Light Vibe' : 'Dark Vibe'}</span>
            </div>
            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ${darkMode ? 'bg-secondary-400' : 'bg-primary-300'}`}>
              <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-200 ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl font-semibold text-sm text-red-500 hover:bg-rose-500/5 hover:text-rose-600 transition-all duration-200"
          >
            <LogOut className="h-5 w-5 stroke-[1.8px]" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card rounded-t-3xl rounded-b-none border-t border-white/20 dark:border-slate-800/50 py-2 px-4 flex justify-around items-center z-30 shadow-2xl">
        {navItems.slice(0, 8).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-200 ${
                isActive 
                  ? 'text-secondary-500 dark:text-secondary-400 scale-105' 
                  : 'text-primary-400 dark:text-slate-400'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              <span className="text-[9px] font-bold tracking-tight font-outfit">{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl text-red-500"
        >
          <LogOut className="h-5 w-5 stroke-[1.8px]" />
          <span className="text-[9px] font-bold tracking-tight font-outfit">Exit</span>
        </button>
      </nav>
    </>
  );
};

export default Sidebar;
