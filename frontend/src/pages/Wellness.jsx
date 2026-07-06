import React, { useState, useEffect } from 'react';
import { moodsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Sparkles, CheckCircle, Smile 
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
    { emoji: '😊', label: 'Happy', color: 'border-white/10 bg-white/5 text-slate-400 hover:text-white' },
    { emoji: '😐', label: 'Okay', color: 'border-white/10 bg-white/5 text-slate-400 hover:text-white' },
    { emoji: '😔', label: 'Lonely', color: 'border-white/10 bg-white/5 text-slate-400 hover:text-white' },
    { emoji: '😰', label: 'Stressed', color: 'border-white/10 bg-white/5 text-slate-400 hover:text-white' },
    { emoji: '😴', label: 'Tired', color: 'border-white/10 bg-white/5 text-slate-400 hover:text-white' },
    { emoji: '🎉', label: 'Excited', color: 'border-white/10 bg-white/5 text-slate-400 hover:text-white' }
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
      
      await loadWellnessData();
    } catch (err) {
      console.error("Failed to log mood check-in:", err);
      alert("Failed to submit mood. Try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const barChartData = Object.entries(moodDistribution).map(([name, count]) => ({
    name,
    count,
    fill: name === 'Happy' ? '#DFFE00' : name === 'Excited' ? '#DFFE00' : name === 'Okay' ? 'rgba(255, 255, 255, 0.4)' : name === 'Lonely' ? '#ef4444' : '#f59e0b'
  }));

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
    <div className="space-y-6 pb-24 font-outfit text-left text-white relative">
      
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mood Check-In Widget */}
        <div className="glass-card p-6 border-white/5 bg-black/45 lg:col-span-2 space-y-4">
          <div className="pb-3 border-b border-white/5">
            <h3 className="font-syne font-extrabold text-sm uppercase tracking-wider text-white">Mood Check-In</h3>
            <p className="text-slate-400 text-xs font-semibold mt-0.5">How are you feeling today, {user.profile?.name}?</p>
          </div>

          <form onSubmit={handleMoodSubmit} className="space-y-4">
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
                        ? 'bg-[#DFFE00] text-black border-transparent shadow-sm shadow-[#DFFE00]/10 font-bold scale-105'
                        : `${opt.color} hover:scale-[1.02]`
                    }`}
                  >
                    <span className="text-2xl mb-1">{opt.emoji}</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pl-1">Optional Mood Note</label>
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
                className="btn-accent py-2.5 px-6 text-xs flex items-center gap-1.5 font-extrabold uppercase tracking-wider"
              >
                <Smile className="h-4 w-4" />
                <span>{saveLoading ? 'Logging...' : 'Submit Vibe'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* AI Suggested self care guidelines */}
        <div className="glass-card p-6 border-white/5 bg-black/45 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5 text-[#DFFE00]">
            <Sparkles className="h-5 w-5 fill-[#DFFE00]/10 animate-pulse" />
            <h3 className="font-syne font-extrabold text-sm uppercase tracking-wider text-white">AI Self-Care Guide</h3>
          </div>

          <div className="space-y-3 text-xs leading-relaxed font-semibold">
            <p className="text-slate-200">
              Focus strategy: <span className="text-[#DFFE00] font-extrabold uppercase tracking-wider">{advice.title}</span>
            </p>
            
            <ul className="space-y-2 text-slate-400 pl-1">
              {advice.tips.map((tip, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="text-[#DFFE00] shrink-0">•</span>
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
        <div className="glass-card p-6 border-white/5 bg-black/45 text-left">
          <div className="mb-6">
            <h3 className="font-syne font-extrabold text-sm uppercase tracking-wider text-white">Vibe Over Time</h3>
            <p className="text-slate-400 text-xs font-semibold mt-0.5">Line map rendering emotional check-in history</p>
          </div>

          <div className="h-[220px] w-full">
            {loading ? (
              <div className="h-full w-full bg-white/5 border border-white/10 animate-pulse rounded-2xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} fontWeight="bold" tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.3)" fontSize={10} fontWeight="bold" tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0224', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '11px' }}
                    itemStyle={{ color: '#FFFFFF' }}
                    labelStyle={{ color: '#DFFE00', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#DFFE00" 
                    strokeWidth={2.5} 
                    dot={{ r: 4, strokeWidth: 1, stroke: '#0A0224', fill: '#DFFE00' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Mood distribution bar chart */}
        <div className="glass-card p-6 border-white/5 bg-black/45 text-left">
          <div className="mb-6">
            <h3 className="font-syne font-extrabold text-sm uppercase tracking-wider text-white">Vibe Distribution</h3>
            <p className="text-slate-400 text-xs font-semibold mt-0.5">Aggregated log quantities per emotional state</p>
          </div>

          <div className="h-[220px] w-full">
            {loading ? (
              <div className="h-full w-full bg-white/5 border border-white/10 animate-pulse rounded-2xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} fontWeight="bold" tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} fontWeight="bold" tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0224', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '11px' }}
                    itemStyle={{ color: '#FFFFFF' }}
                    labelStyle={{ color: '#DFFE00', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} />
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
