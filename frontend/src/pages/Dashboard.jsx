import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { moodsAPI, matchesAPI } from '../services/api';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Users, Calendar, MessageSquare, Heart, Sparkles, TrendingUp, Play
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [moodHistory, setMoodHistory] = useState([]);
  const [moodDistribution, setMoodDistribution] = useState({});
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeGoal, setActiveGoal] = useState(user?.profile?.active_goal || '');
  const [customGoal, setCustomGoal] = useState('');
  const [isUpdatingGoal, setIsUpdatingGoal] = useState(false);
  const [goalMessage, setGoalMessage] = useState('');

  // Sync active goal state with user context profile
  useEffect(() => {
    if (user?.profile) {
      setActiveGoal(user.profile.active_goal || '');
    }
  }, [user]);

  const handleUpdateGoal = async (newGoal) => {
    try {
      setIsUpdatingGoal(true);
      await updateProfile({ active_goal: newGoal });
      setActiveGoal(newGoal);
      setGoalMessage("Social goal updated! Recalculating sparks...");
      // Re-load recommended matches to get updated scores based on new goal
      const matchesRes = await matchesAPI.getMatches();
      setMatches(matchesRes.data.slice(0, 3));
      setTimeout(() => setGoalMessage(''), 3000);
    } catch (err) {
      console.error("Failed to update goal:", err);
    } finally {
      setIsUpdatingGoal(false);
    }
  };

  // Standard metrics
  const stats = [
    { label: "Connections", value: 24, icon: Users, color: "text-[#DFFE00] bg-[#DFFE00]/10 border-[#DFFE00]/15" },
    { label: "Events Joined", value: 8, icon: Calendar, color: "text-white bg-white/5 border-white/10" },
    { label: "New Matches", value: 14, icon: Heart, color: "text-[#DFFE00] bg-[#DFFE00]/10 border-[#DFFE00]/15" },
    { label: "Messages Sent", value: 120, icon: MessageSquare, color: "text-white bg-white/5 border-white/10" }
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const moodStatsRes = await moodsAPI.getStats();
        setMoodHistory(moodStatsRes.data.history);
        setMoodDistribution(moodStatsRes.data.distribution);

        const matchesRes = await matchesAPI.getMatches();
        setMatches(matchesRes.data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // Recharts custom tooltips for modern glass styles
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-white/10 text-xs font-semibold shadow-lg bg-black/80">
          <p className="text-white font-bold">{label}</p>
          <p className="text-[#DFFE00] mt-1 font-extrabold">Score: {payload[0].value}/100</p>
          {payload[0].payload.mood && <p className="text-slate-400 mt-0.5">Vibe: {payload[0].payload.mood}</p>}
        </div>
      );
    }
    return null;
  };

  // Mock data for weekly activity hours (e.g. social interactions, events)
  const activityData = [
    { day: "Mon", interaction: 12, wellness: 65 },
    { day: "Tue", interaction: 19, wellness: 70 },
    { day: "Wed", interaction: 15, wellness: 68 },
    { day: "Thu", interaction: 24, wellness: 72 },
    { day: "Fri", interaction: 32, wellness: 80 },
    { day: "Sat", interaction: 45, wellness: 85 },
    { day: "Sun", interaction: 35, wellness: 82 }
  ];

  const gridVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-16 font-outfit text-white text-left"
    >
      
      {/* Welcome Banner */}
      <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-white/5 bg-gradient-to-tr from-wero-dark-900/40 via-transparent to-[#DFFE00]/5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#DFFE00]/10 border border-[#DFFE00]/25 px-3 py-1 rounded-full text-[#DFFE00] text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Discover Platform</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-syne font-extrabold uppercase tracking-tight text-white mt-2">
            Hi, <span className="text-neon-glow text-[#DFFE00]">{user.profile?.name || 'Vibe Seeker'}</span> 👋
          </h2>
          <p className="text-slate-400 font-semibold text-sm leading-relaxed max-w-xl">
            You're currently connected with a solid network of buddies. Your social wellness score is looking excellent this week.
          </p>
        </div>

        {/* Radial Social Score Gauge */}
        <div className="flex items-center gap-4 shrink-0 glass-card p-4 border-white/5 bg-black/40 max-w-xs">
          <div className="relative h-16 w-16 flex items-center justify-center shrink-0">
            <svg className="absolute inset-0 transform -rotate-90 w-full h-full">
              <circle cx="32" cy="32" r="28" className="stroke-white/5" strokeWidth="6" fill="transparent" />
              <circle cx="32" cy="32" r="28" className="stroke-[#DFFE00]" strokeWidth="6" fill="transparent" 
                strokeDasharray={2 * Math.PI * 28} 
                strokeDashoffset={2 * Math.PI * 28 * (1 - 0.82)} 
                strokeLinecap="round"
              />
            </svg>
            <span className="text-sm font-extrabold text-[#DFFE00]">82</span>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Social Wellness</p>
            <p className="text-base font-extrabold text-[#DFFE00]">82/100</p>
            <span className="text-[10px] text-[#DFFE00] font-extrabold">▲ +4% vs last week</span>
          </div>
        </div>
      </div>

      {/* Active Goal / Status Widget */}
      <div className="glass-card p-6 border-white/30 dark:border-slate-800 bg-gradient-to-r from-secondary-500/5 to-primary-900/5 text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-base uppercase tracking-wider flex items-center gap-2">
              <span className="text-secondary-500">🎯</span> Your Active Social Goal
            </h3>
            <p className="text-primary-400 dark:text-slate-400 text-xs font-semibold">
              Set your target activity today to instantly discover buddies nearby with matching intentions.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs text-primary-400 font-bold uppercase">Current:</span>
            <span className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border ${
              activeGoal 
                ? 'bg-gradient-to-r from-secondary-400 to-blue-500 text-white border-transparent shadow-sm' 
                : 'bg-primary-100 dark:bg-slate-800 text-primary-400 dark:text-slate-500 border-primary-200/50 dark:border-slate-800/80'
            }`}>
              {activeGoal || 'No active goal'}
            </span>
          </div>
        </div>

        {/* Success toast inside card */}
        {goalMessage && (
          <div className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20 animate-pulse">
            {goalMessage}
          </div>
        )}

        {/* Quick action options */}
        <div className="space-y-3">
          <p className="text-[10px] text-primary-400 font-extrabold uppercase tracking-widest pl-0.5">Quick Select Vibe</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Cafe study",
              "Workout",
              "Play Football",
              "Museum stroll",
              "Park reading",
              "Fifa night",
              "Photo walk",
              "Food crawl"
            ].map((g) => (
              <button
                key={g}
                type="button"
                disabled={isUpdatingGoal}
                onClick={() => handleUpdateGoal(g)}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all duration-150 ${
                  activeGoal.toLowerCase() === g.toLowerCase()
                    ? 'bg-gradient-to-r from-primary-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-primary-950 border-transparent shadow-sm'
                    : 'bg-white/40 dark:bg-slate-900/40 border-primary-200/50 dark:border-slate-800/80 text-primary-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (customGoal.trim()) {
              handleUpdateGoal(customGoal.trim());
              setCustomGoal('');
            }
          }}
          className="flex items-center gap-3 max-w-md pt-2"
        >
          <input 
            type="text" 
            placeholder="Or type a custom goal (e.g. Vintage shopping, Boardgames)..."
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            className="glass-input text-xs py-2.5"
            disabled={isUpdatingGoal}
          />
          <button 
            type="submit"
            disabled={isUpdatingGoal || !customGoal.trim()}
            className="btn-primary py-2.5 px-5 text-xs font-bold shrink-0"
          >
            Update
          </button>
        </form>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={idx} 
              className="glass-card glass-card-hover p-6 flex items-center gap-4 border-white/5 relative overflow-hidden bg-black/35"
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border ${stat.color}`}>
                <Icon className="h-6 w-6 stroke-[2px]" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                <h4 className="text-2xl font-extrabold leading-tight mt-0.5">{stat.value}</h4>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mood Trend Chart */}
        <div className="glass-card p-6 border-white/5 bg-black/30 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-syne font-extrabold text-sm uppercase tracking-wider text-white">Mental Wellness Trend</h3>
              <p className="text-slate-400 text-xs font-semibold mt-0.5">Emotional check-in score over the past week</p>
            </div>
            <div className="flex items-center gap-1 text-[#DFFE00] font-bold text-xs bg-[#DFFE00]/10 border border-[#DFFE00]/15 px-2.5 py-1 rounded-full">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Balanced Vibe</span>
            </div>
          </div>
          
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={11} fontWeight="bold" tickLine={false} />
                <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.3)" fontSize={11} fontWeight="bold" tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="url(#colorWellness)" 
                  strokeWidth={3} 
                  dot={{ r: 5, strokeWidth: 2, stroke: '#0A0224', fill: '#DFFE00' }} 
                  activeDot={{ r: 7, strokeWidth: 0 }} 
                />
                <defs>
                  <linearGradient id="colorWellness" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#DFFE00" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Activity Hours Bar Chart */}
        <div className="glass-card p-6 border-white/5 bg-black/30">
          <div className="mb-6">
            <h3 className="font-syne font-extrabold text-sm uppercase tracking-wider text-white">Weekly Activity</h3>
            <p className="text-slate-400 text-xs font-semibold mt-0.5">Interaction hours vs Wellness logs</p>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={11} fontWeight="bold" tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} fontWeight="bold" tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0224', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px' }}
                  itemStyle={{ color: '#FFFFFF' }}
                  labelStyle={{ color: '#DFFE00', fontWeight: 'bold' }}
                />
                <Bar dataKey="interaction" name="Interactions" fill="#DFFE00" radius={[4, 4, 0, 0]} />
                <Bar dataKey="wellness" name="Wellness" fill="rgba(255, 255, 255, 0.3)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommended matches widget */}
      <div className="glass-card p-6 border-white/5 bg-black/30">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-syne font-extrabold text-sm uppercase tracking-wider text-white">Recommended Sparks</h3>
            <p className="text-slate-400 text-xs font-semibold mt-0.5">AI computed connections nearby who share your interests</p>
          </div>
          <Link to="/discover" className="text-xs font-extrabold text-[#DFFE00] hover:underline flex items-center gap-1.5 uppercase tracking-wider">
            <span>Explore Discovery</span>
            <Play className="h-3 w-3 fill-current" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3].map(n => (
              <div key={n} className="p-4 bg-white/5 border border-white/5 rounded-3xl animate-pulse h-28" />
            ))
          ) : matches.length > 0 ? (
            matches.map(match => (
              <div key={match.id} className="p-4 bg-white/5 border border-white/5 rounded-3xl flex justify-between items-center hover:border-[#DFFE00]/20 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <img 
                    src={match.profile.profile_pic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${match.profile.name}`} 
                    alt={match.profile.name} 
                    className="h-12 w-12 rounded-2xl bg-slate-900 border border-white/10 object-cover shrink-0"
                  />
                  <div>
                    <h5 className="font-bold text-sm leading-tight text-white">{match.profile.name}, {match.profile.age}</h5>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 line-clamp-1 max-w-[120px] uppercase">
                      {match.profile.occupation || 'Hobby seeker'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-[#DFFE00] text-black font-extrabold text-[10px] py-1 px-3 rounded-full border border-transparent tracking-wider">
                    {match.score}% MATCH
                  </span>
                  <p className="text-[9px] text-slate-400 font-extrabold mt-1.5 uppercase tracking-wider">
                    {match.distance} km away
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-6 text-slate-500 text-xs font-bold uppercase tracking-wider">
              No matching profiles found in your city. Ensure location coordinates are accurate.
            </div>
          )}
        </div>
      </div>

    </motion.div>
  );
};

export default Dashboard;
