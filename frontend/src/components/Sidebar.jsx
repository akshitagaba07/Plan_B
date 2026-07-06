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
      <aside className="hidden md:flex flex-col fixed top-6 left-6 bottom-6 w-64 glass-card bg-black/55 backdrop-blur-xl border border-white/5 py-8 px-4 justify-between z-30">
        <div>
          {/* Logo Title */}
          <div className="flex items-center gap-4 px-4 mb-8 group cursor-pointer">
            <div className="h-14 w-14 rounded-2xl bg-[#DFFE00] flex items-center justify-center shadow-lg transition-all duration-300 ease-out group-hover:rotate-6 group-hover:scale-115 animate-pulse-glow">
              <span className="text-black font-black text-3xl tracking-tighter">B</span>
            </div>
            <div className="flex flex-col">
              <span className="font-syne font-black text-3xl tracking-tight text-white uppercase transition-all duration-300 group-hover:text-[#DFFE00] group-hover:translate-x-1.5">Plan B</span>
              <p className="text-xs text-[#DFFE00] font-black tracking-[0.2em] uppercase mt-0.5 transition-transform duration-300 group-hover:translate-x-1">Social Wellness</p>
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
                  className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#DFFE00] text-black shadow-lg shadow-[#DFFE00]/15 scale-[1.02]' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
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
            className="flex items-center justify-between w-full px-4 py-3 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white font-semibold text-sm transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              {darkMode ? <Sun className="h-5 w-5 stroke-[1.8px]" /> : <Moon className="h-5 w-5 stroke-[1.8px]" />}
              <span>{darkMode ? 'Light Vibe' : 'Dark Vibe'}</span>
            </div>
            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ${darkMode ? 'bg-[#DFFE00]' : 'bg-white/10'}`}>
              <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-200 ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
          >
            <LogOut className="h-5 w-5 stroke-[1.8px]" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card bg-black/75 backdrop-blur-2xl rounded-t-3xl rounded-b-none border-t border-white/5 py-2 px-4 flex justify-around items-center z-30 shadow-2xl">
        {navItems.slice(0, 8).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-200 ${
                isActive 
                  ? 'text-[#DFFE00] scale-105' 
                  : 'text-slate-400'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              <span className="text-[9px] font-bold tracking-tight font-outfit">{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl text-red-400"
        >
          <LogOut className="h-5 w-5 stroke-[1.8px]" />
          <span className="text-[9px] font-bold tracking-tight font-outfit">Exit</span>
        </button>
      </nav>
    </>
  );
};

export default Sidebar;
