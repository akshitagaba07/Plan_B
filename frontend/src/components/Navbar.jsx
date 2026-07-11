import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, Compass, Heart, Calendar, Users, MessageSquare, Activity, Bot, Settings, LogOut, Sun, Moon, Bell 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

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
  ];

  return (
    <header className="w-full glass-card bg-black/55 backdrop-blur-xl border border-white/5 py-4 px-6 md:px-8 flex justify-between items-center z-30 mb-6 shadow-xl">
      {/* Brand Logo & Name */}
      <Link to="/dashboard" className="flex items-center gap-3 group cursor-pointer mr-6">
        <div className="h-10 w-10 rounded-xl bg-[#DFFE00] flex items-center justify-center shadow-lg transition-all duration-300 ease-out group-hover:rotate-6 group-hover:scale-110">
          <span className="text-black font-black text-xl tracking-tighter">B</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-syne font-black text-lg tracking-tight text-white uppercase transition-all duration-300 group-hover:text-[#DFFE00]">Plan B</span>
        </div>
      </Link>

      {/* Desktop Navigation Links */}
      <nav className="hidden lg:flex items-center gap-5 text-xs font-bold uppercase tracking-wider text-slate-400">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`hover-flashy-gradient py-1.5 px-3 rounded-xl ${
                isActive ? 'text-[#DFFE00] bg-white/5 border border-white/5' : ''
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors"
          title="Toggle Vibe"
        >
          {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#DFFE00]" />
        </button>

        {/* Settings shortcut on desktop */}
        <Link 
          to="/settings" 
          className="hidden sm:block p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors"
          title="Settings"
        >
          <Settings className="h-4.5 w-4.5" />
        </Link>

        {/* User Card */}
        <Link to="/profile" className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-all duration-200">
          <img 
            src={user.profile?.profile_pic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.profile?.name || 'Default'}`} 
            alt="Profile" 
            className="h-8 w-8 rounded-lg bg-slate-900 border border-[#DFFE00] object-cover"
          />
          <span className="hidden md:block text-xs font-bold text-slate-200 pr-1">
            {user.profile?.name || 'Vibe Seeker'}
          </span>
        </Link>

        {/* Logout on desktop */}
        <button 
          onClick={logout}
          className="hidden lg:block p-2 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut className="h-4.5 w-4.5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
