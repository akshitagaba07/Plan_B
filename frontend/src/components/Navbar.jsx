import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MapPin, Sun, Moon, Bell } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  if (!user) return null;

  // Resolve page header titles dynamically
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/discover')) return 'Social Discovery';
    if (path.startsWith('/matches')) return 'AI Matches';
    if (path.startsWith('/events')) return 'Events & Meetups';
    if (path.startsWith('/community')) return 'Community Groups';
    if (path.startsWith('/chat')) return 'Direct Messages';
    if (path.startsWith('/wellness')) return 'Wellness Center';
    if (path.startsWith('/assistant')) return 'AI Social Companion';
    if (path.startsWith('/settings')) return 'Settings';
    if (path.startsWith('/profile')) return 'Complete Your Profile';
    return 'Plan B';
  };

  return (
    <header className="glass-card rounded-2xl md:rounded-3xl border border-white/20 dark:border-slate-800/50 py-4 px-6 flex justify-between items-center mb-6 z-20">
      {/* Title / Context */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-primary-900 dark:text-white">
          {getPageTitle()}
        </h1>
        {user.profile?.city && (
          <div className="flex items-center gap-1.5 text-primary-400 dark:text-slate-400 text-xs font-semibold mt-0.5">
            <MapPin className="h-3.5 w-3.5 text-accent-coral stroke-[2px]" />
            <span>{user.profile.city}</span>
          </div>
        )}
      </div>

      {/* Right side items */}
      <div className="flex items-center gap-4">
        {/* Toggle dark mode button on mobile (hidden on desktop sidebar) */}
        <button 
          onClick={toggleDarkMode}
          className="md:hidden p-2.5 rounded-xl hover:bg-primary-100/60 dark:hover:bg-slate-800 text-primary-500 dark:text-slate-400"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications Mock Icon */}
        <button className="relative p-2.5 rounded-xl hover:bg-primary-100/60 dark:hover:bg-slate-800 text-primary-500 dark:text-slate-400 transition-colors duration-200">
          <Bell className="h-5 w-5 stroke-[1.8px]" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent-coral" />
        </button>

        {/* User Card */}
        <Link to="/profile" className="flex items-center gap-3 p-1 rounded-2xl hover:bg-primary-100/40 dark:hover:bg-slate-800/30 transition-all duration-200">
          <img 
            src={user.profile?.profile_pic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.profile?.name || 'Default'}`} 
            alt="Profile Avatar" 
            className="h-10 w-10 rounded-xl bg-secondary-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 object-cover shadow-sm"
          />
          <div className="hidden sm:block text-left pr-2">
            <p className="text-sm font-bold text-primary-800 dark:text-slate-200 line-clamp-1">
              {user.profile?.name || 'Vibe Seeker'}
            </p>
            <p className="text-[10px] text-primary-400 font-bold tracking-widest uppercase">
              Member
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
