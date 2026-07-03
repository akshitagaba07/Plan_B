import React, { useState, useEffect } from 'react';
import { moodsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Sparkles, CheckCircle, Heart, Calendar, Activity, AlertCircle, Compass, Smile 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const WellnessPage = () => {
  const { user } = useAuth();
  const [mood, setMood] = useState('Happy');
  const [note, setNote] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [moodDistribution, setMoodDistribution] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const moodOptions = [
    { emoji: '😊', label: 'Happy', color: 'border-blue-200 hover:bg-blue-50 text-blue-500 bg-blue-500/5' },
    { emoji: '😐', label: 'Okay', color: 'border-slate-200 hover:bg-slate-50 text-slate-500 bg-slate-500/5' },
    { emoji: '😔', label: 'Lonely', color: 'border-red-200 hover:bg-red-50 text-red-500 bg-red-500/5' },
    { emoji: '😰', label: 'Stressed', color: 'border-amber-200 hover:bg-amber-50 text-amber-500 bg-amber-500/5' },
    { emoji: '😴', label: 'Tired', color: 'border-orange-200 hover:bg-orange-50 text-orange-500 bg-orange-500/5' },
    { emoji: '🎉', label: 'Excited', color: 'border-emerald-200 hover:bg-emerald-50 text-emerald-500 bg-emerald-500/5' }
  ];

  const loadWellnessData = async () => {
    try {
      setLoading(true);
      const res = await moodsAPI.getStats();
      setMoodHistory(res.data.history);
      setMoodDistribution(res.data.distribution);
    } catch (err) {
      console.error("Failed to load wellness datasets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWellnessData();
  }, []);

  const handleMoodSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await moodsAPI.logMood(mood, note);
      
      confetti({
        particleCount: 80,
        spread: 50,
        origin: { y: 0.6 }
      });
      
      setSuccessMsg("Mood logged successfully!");
      setNote('');
      setTimeout(() => setSuccessMsg(''), 2500);
      
      // Reload chart metrics
      await loadWellnessData();
    } catch (err) {
      console.error("Failed to log mood check-in:", err);
      alert("Failed to submit mood. Try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  // Compile distribution charts dataset
  const barChartData = Object.entries(moodDistribution).map(([name, count]) => ({
    name,
    count,
    fill: name === 'Happy' ? '#60A5FA' : name === 'Excited' ? '#34D399' : name === 'Okay' ? '#94A3B8' : name === 'Lonely' ? '#F87171' : '#F59E0B'
  }));

  // Resolve custom mood triggers for Coping Self-Care Tips
  const getCopingAdvice = () => {
    const latestMood = moodHistory[moodHistory.length - 1]?.mood || 'Okay';
    switch (latestMood) {
      case 'Lonely':
        return {
          title: "Embracing Connection",
          tips: [
            "Trigger a conversation with Rohan or Priya using Plan B's AI Icebreakers.",
            "Take a short walk and grab a hot beverage at a nearby cafe.",
            "Post a greeting thread inside the Movie Lovers or Gamers Club communities."
          ]
        };
      case 'Stressed':
        return {
          title: "Slowing Down",
          tips: [
            "Perform a 4-7-8 breathing check-in (inhale 4s, hold 7s, exhale 8s).",
            "Listen to your favorite relaxing acoustic tracks on your headphones.",
            "Wind down with a chapter from a physical book before sleeping."
          ]
        };
      case 'Tired':
        return {
          title: "Restoring Energy",
          tips: [
            "Avoid screen feeds for the next hour to reset your eyes and mind.",
            "Treat yourself to a healthy protein snack and hydrate fully.",
            "Step outdoors for a 10-minute sunshine stretch."
          ]
        };
      default:
        return {
          title: "Maintaining Balance",
          tips: [
            "Write down two achievements you are proud of accomplishing today.",
            "Plan a casual meetup date with a local connection this weekend.",
            "Share your positive vibes by liking posts in the anime community."
          ]
        };
    }
  };

  const advice = getCopingAdvice();

  return (
    <div className="space-y-6 pb-24 font-outfit text-left relative">
      
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mood Check-In Widget */}
        <div className="glass-card p-6 border-white/20 dark:border-slate-800/40 lg:col-span-2 space-y-4">
          <div className="pb-3 border-b border-primary-100/50 dark:border-slate-800/40">
            <h3 className="font-extrabold text-base uppercase tracking-wider">Mood Check-In</h3>
            <p className="text-primary-400 dark:text-slate-400 text-xs font-semibold mt-0.5">How are you feeling today, {user.profile?.name}?</p>
          </div>

          <form onSubmit={handleMoodSubmit} className="space-y-4">
            {/* Mood selector grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {moodOptions.map((opt) => {
                const isSelected = mood === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setMood(opt.label)}
                    className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-gradient-to-tr from-primary-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-primary-950 border-transparent shadow-sm scale-105'
                        : `bg-white/40 dark:bg-slate-900/40 dark:border-slate-800/80 hover:scale-[1.02] ${opt.color}`
                    }`}
                  >
                    <span className="text-2xl mb-1">{opt.emoji}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Note input */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-primary-400 dark:text-slate-400 pl-1">Optional Mood Note</label>
              <textarea 
                rows="2"
                placeholder="What is making you feel this way? (e.g. lots of coding tasks, beautiful sunny day, missing friends...)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="glass-input resize-none text-xs"
              />
            </div>

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={saveLoading}
                className="btn-accent py-2.5 px-6 text-xs flex items-center gap-1.5 font-bold"
              >
                <Smile className="h-4 w-4" />
                <span>{saveLoading ? 'Logging...' : 'Submit Vibe'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* AI Suggested self care guidelines */}
        <div className="glass-card p-6 border-white/20 dark:border-slate-800/40 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-primary-100/50 dark:border-slate-800/40 text-amber-500">
            <Sparkles className="h-5 w-5 fill-amber-500/10 animate-pulse" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-primary-900 dark:text-white">AI Self-Care Guide</h3>
          </div>

          <div className="space-y-3 text-xs leading-relaxed font-semibold">
            <p className="text-primary-800 dark:text-slate-200">
              Focus strategy: <span className="text-secondary-500 font-extrabold">{advice.title}</span>
            </p>
            
            <ul className="space-y-2 text-primary-500 dark:text-slate-400 pl-1">
              {advice.tips.map((tip, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="text-accent-coral shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Wellness historical analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Mood history line chart */}
        <div className="glass-card p-6 border-white/20 dark:border-slate-800/40 text-left">
          <div className="mb-6">
            <h3 className="font-extrabold text-base uppercase tracking-wider">Vibe Over Time</h3>
            <p className="text-primary-400 dark:text-slate-400 text-xs font-semibold mt-0.5">Line map rendering emotional check-in history</p>
          </div>

          <div className="h-[220px] w-full">
            {loading ? (
              <div className="h-full w-full bg-primary-100/50 animate-pulse rounded-2xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800/60" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} fontWeight="bold" tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={10} fontWeight="bold" tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: 'none', borderRadius: '16px', fontSize: '11px' }}
                    itemStyle={{ color: '#0F172A' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#FF6B6B" 
                    strokeWidth={2.5} 
                    dot={{ r: 4, strokeWidth: 1, fill: '#FF6B6B' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Mood distribution bar chart */}
        <div className="glass-card p-6 border-white/20 dark:border-slate-800/40 text-left">
          <div className="mb-6">
            <h3 className="font-extrabold text-base uppercase tracking-wider">Vibe Distribution</h3>
            <p className="text-primary-400 dark:text-slate-400 text-xs font-semibold mt-0.5">Aggregated log quantities per emotional state</p>
          </div>

          <div className="h-[220px] w-full">
            {loading ? (
              <div className="h-full w-full bg-primary-100/50 animate-pulse rounded-2xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800/60" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} fontWeight="bold" tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} fontWeight="bold" tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: 'none', borderRadius: '16px', fontSize: '11px' }}
                    itemStyle={{ color: '#0F172A' }}
                  />
                  <Bar dataKey="count" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default WellnessPage;
