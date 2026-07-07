import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { matchesAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, ShieldCheck, CheckCircle, CheckSquare 
} from 'lucide-react';

const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  
  const [city, setCity] = useState('');
  const [university, setUniversity] = useState('');
  const [occupation, setOccupation] = useState('');
  const [activeGoal, setActiveGoal] = useState('');
  
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loadingSafety, setLoadingSafety] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadBlockedMatches = async () => {
    try {
      setLoadingSafety(true);
      const res = await matchesAPI.getMatches();
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
      setActiveGoal(user.profile.active_goal || '');
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
        occupation,
        active_goal: activeGoal
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
      await matchesAPI.performAction(userId, 'connect');
      setBlockedUsers(prev => prev.filter(item => item.profile.user_id !== userId));
      setSuccessMsg("User unblocked successfully!");
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      console.error("Failed to unblock user:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-24 font-outfit text-left text-white relative animate-fade-in">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            className="fixed top-6 right-6 bg-[#DFFE00] text-black font-extrabold px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-50 border border-[#DFFE00]"
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
        <div className="glass-card p-6 border-white/5 bg-black/45 flex justify-between items-center">
          <div>
            <h3 className="font-syne font-extrabold text-sm uppercase tracking-wider text-white">Appearance</h3>
            <p className="text-slate-400 text-xs font-semibold mt-0.5">Switch between dark mode and light mode templates</p>
          </div>
          
          <button 
            onClick={toggleDarkMode}
            className="btn-secondary py-2.5 px-5 text-xs flex items-center gap-2 uppercase font-bold"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
          </button>
        </div>

        {/* Profile Settings Form */}
        <div className="glass-card p-6 border-white/5 bg-black/45">
          <div className="pb-3 border-b border-white/5 mb-4">
            <h3 className="font-syne font-extrabold text-sm uppercase tracking-wider text-white">Quick Profile Options</h3>
            <p className="text-slate-400 text-xs font-semibold mt-0.5">Configure core parameters for buddy match targeting</p>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pl-1">Primary City</label>
                <input 
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="glass-input text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pl-1">University / Alumnus</label>
                <input 
                  type="text" 
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="glass-input text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pl-1">Occupation</label>
                <input 
                  type="text" 
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="glass-input text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-primary-400 dark:text-slate-400 pl-1">Active Social Goal</label>
                <input 
                  type="text" 
                  value={activeGoal}
                  onChange={(e) => setActiveGoal(e.target.value)}
                  className="glass-input text-xs"
                  placeholder="e.g. Cafe study, Fifa night"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={saveLoading}
                className="btn-primary py-2.5 px-6 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5"
              >
                <CheckSquare className="h-4 w-4" />
                <span>{saveLoading ? 'Updating...' : 'Save Settings'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Safety & Moderate list */}
        <div className="glass-card p-6 border-white/5 bg-black/45">
          <div className="pb-3 border-b border-white/5 mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#DFFE00] stroke-[2px]" />
            <div>
              <h3 className="font-syne font-extrabold text-sm uppercase tracking-wider text-white">Safety & Moderation</h3>
              <p className="text-slate-400 text-xs font-semibold mt-0.5">Manage excluded connections and blocked profiles</p>
            </div>
          </div>

          <div className="space-y-2">
            {loadingSafety ? (
              <div className="h-10 w-full bg-white/5 border border-white/10 rounded-xl animate-pulse" />
            ) : blockedUsers.length > 0 ? (
              blockedUsers.map((item) => (
                <div key={item.id} className="p-3 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={item.profile.profile_pic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${item.profile.name}`} 
                      alt={item.profile.name} 
                      className="h-8 w-8 rounded-lg object-cover bg-slate-900 border border-white/10"
                    />
                    <div>
                      <h5 className="font-extrabold leading-tight text-white">{item.profile.name}</h5>
                      <span className="text-[9px] font-extrabold text-red-500 uppercase tracking-widest">{item.status}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleUnblock(item.profile.user_id)}
                    className="text-[10px] font-extrabold px-3.5 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-[#DFFE00] rounded-xl uppercase tracking-wider"
                  >
                    Unblock
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2">
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
