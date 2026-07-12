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
