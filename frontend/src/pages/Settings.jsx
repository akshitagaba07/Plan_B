import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { matchesAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Sun, Moon, Ban, ShieldCheck, Heart, User, CheckCircle, CheckSquare 
} from 'lucide-react';

const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  
  const [city, setCity] = useState('');
  const [university, setUniversity] = useState('');
  const [occupation, setOccupation] = useState('');
  
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loadingSafety, setLoadingSafety] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadBlockedMatches = async () => {
    try {
      setLoadingSafety(true);
      const res = await matchesAPI.getMatches();
      // Filter for blocked or reported users
      setBlockedUsers(res.data.filter(m => m.status === 'blocked' || m.status === 'reported'));
    } catch (err) {
      console.error("Failed to load safety exclusions:", err);
    } finally {
      setLoadingSafety(false);
    }
  };

  useEffect(() => {
    if (user?.profile) {
      setCity(user.profile.city || '');
      setUniversity(user.profile.university || '');
      setOccupation(user.profile.occupation || '');
    }
    loadBlockedMatches();
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await updateProfile({
        city,
        university,
        occupation
      });
      setSuccessMsg("Settings updated successfully!");
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Failed to save. Check fields.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleUnblock = async (userId) => {
    try {
      // Connect resets status back to matched/connected, which unblocks the user!
      await matchesAPI.performAction(userId, 'connect');
      setBlockedUsers(prev => prev.filter(item => item.profile.user_id !== userId));
      setSuccessMsg("User unblocked successfully!");
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      console.error("Failed to unblock user:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-24 font-outfit text-left relative">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            className="fixed top-6 right-6 bg-emerald-500 text-white font-bold px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-50 border border-emerald-400"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <CheckCircle className="h-5 w-5 stroke-[2.5px]" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        
        {/* Toggle Theme Widget */}
        <div className="glass-card p-6 border-white/20 dark:border-slate-800/40 flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-sm uppercase tracking-wider">Appearance</h3>
            <p className="text-primary-400 dark:text-slate-400 text-xs font-semibold mt-0.5">Switch between dark mode and light mode templates</p>
          </div>
          
          <button 
            onClick={toggleDarkMode}
            className="btn-secondary py-2.5 px-5 text-xs flex items-center gap-2"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
          </button>
        </div>

        {/* Profile Settings Form */}
        <div className="glass-card p-6 border-white/20 dark:border-slate-800/40">
          <div className="pb-3 border-b border-primary-100/50 dark:border-slate-800/40 mb-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider">Quick Profile Options</h3>
            <p className="text-primary-400 dark:text-slate-400 text-xs font-semibold mt-0.5">Configure core parameters for buddy match targeting</p>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-primary-400 dark:text-slate-400 pl-1">Primary City</label>
                <input 
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="glass-input text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-primary-400 dark:text-slate-400 pl-1">University / Alumnus</label>
                <input 
                  type="text" 
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="glass-input text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-primary-400 dark:text-slate-400 pl-1">Occupation</label>
                <input 
                  type="text" 
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="glass-input text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={saveLoading}
                className="btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-1.5"
              >
                <CheckSquare className="h-4 w-4" />
                <span>{saveLoading ? 'Updating...' : 'Save Settings'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Safety & Moderate list */}
        <div className="glass-card p-6 border-white/20 dark:border-slate-800/40">
          <div className="pb-3 border-b border-primary-100/50 dark:border-slate-800/40 mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-accent-coral stroke-[2px]" />
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Safety & Moderation</h3>
              <p className="text-primary-400 dark:text-slate-400 text-xs font-semibold mt-0.5">Manage excluded connections and blocked profiles</p>
            </div>
          </div>

          <div className="space-y-2">
            {loadingSafety ? (
              <div className="h-10 w-full bg-primary-100/50 rounded-xl animate-pulse" />
            ) : blockedUsers.length > 0 ? (
              blockedUsers.map((item) => (
                <div key={item.id} className="p-3 bg-white/40 dark:bg-slate-900/40 border border-primary-100/50 dark:border-slate-800 rounded-2xl flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={item.profile.profile_pic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${item.profile.name}`} 
                      alt={item.profile.name} 
                      className="h-8 w-8 rounded-lg object-cover bg-slate-100"
                    />
                    <div className="text-left">
                      <h5 className="font-extrabold leading-tight">{item.profile.name}</h5>
                      <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">{item.status}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleUnblock(item.profile.user_id)}
                    className="text-[10px] font-bold px-3.5 py-1.5 bg-secondary-50 hover:bg-secondary-100 text-secondary-500 rounded-xl border border-secondary-200/20"
                  >
                    Unblock
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-primary-400 dark:text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>No users have been blocked or reported. Safety is optimal!</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
