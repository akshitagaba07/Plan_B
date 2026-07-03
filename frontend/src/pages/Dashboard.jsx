import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { moodsAPI, matchesAPI } from '../services/api';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Legend
} from 'recharts';
import { 
  Users, Calendar, MessageSquare, ShieldCheck, Heart, Sparkles, TrendingUp, AlertCircle, Play
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [moodHistory, setMoodHistory] = useState([]);
  const [moodDistribution, setMoodDistribution] = useState({});
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Standard metrics
  const stats = [
    { label: "Connections", value: 24, icon: Users, color: "text-blue-500 bg-blue-500/10" },
    { label: "Events Joined", value: 8, icon: Calendar, color: "text-emerald-500 bg-emerald-500/10" },
    { label: "New Matches", value: 14, icon: Heart, color: "text-rose-500 bg-rose-500/10" },
    { label: "Messages Sent", value: 120, icon: MessageSquare, color: "text-purple-500 bg-purple-500/10" }
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Load stats
        const moodStatsRes = await moodsAPI.getStats();
        setMoodHistory(moodStatsRes.data.history);
        setMoodDistribution(moodStatsRes.data.distribution);

        // Load recommended matches
        const matchesRes = await matchesAPI.getMatches();
        setMatches(matchesRes.data.slice(0, 3)); // show top 3 recommended profiles
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // Format bar chart data for mood distribution
  const moodBarData = Object.entries(moodDistribution).map(([name, value]) => ({
    name,
    count: value,
    fill: name === 'Happy' ? '#60A5FA' : name === 'Excited' ? '#34D399' : name === 'Okay' ? '#94A3B8' : name === 'Lonely' ? '#F87171' : '#F59E0B'
  }));

  // Recharts custom tooltips for modern glass styles
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-white/20 text-xs font-semibold shadow-lg">
          <p className="text-primary-800 dark:text-slate-200">{label}</p>
          <p className="text-secondary-500 mt-1">Score: {payload[0].value}/100</p>
          {payload[0].payload.mood && <p className="text-primary-400 mt-0.5">Vibe: {payload[0].payload.mood}</p>}
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

  return (
    <div className="space-y-6 pb-16 font-outfit">
      
      {/* Welcome Banner */}
      <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-white/30 dark:border-slate-800 bg-gradient-to-tr from-primary-900/5 via-transparent to-secondary-500/5">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 bg-secondary-100/60 dark:bg-slate-900 px-3 py-1 rounded-full text-secondary-600 dark:text-secondary-400 text-xs font-extrabold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Discover Platform</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Hi, {user.profile?.name || 'Vibe Seeker'} 👋
          </h2>
          <p className="text-primary-400 dark:text-slate-400 font-semibold text-sm leading-relaxed max-w-xl">
            You're currently connected with a solid network of buddies. Your social wellness score is looking excellent this week.
          </p>
        </div>

        {/* Radial Social Score Gauge */}
        <div className="flex items-center gap-4 shrink-0 glass-card p-4 border-white/40 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 max-w-xs">
          <div className="relative h-16 w-16 flex items-center justify-center shrink-0">
            {/* SVG Ring */}
            <svg className="absolute inset-0 transform -rotate-90 w-full h-full">
              <circle cx="32" cy="32" r="28" className="stroke-primary-100 dark:stroke-slate-800" strokeWidth="6" fill="transparent" />
              <circle cx="32" cy="32" r="28" className="stroke-secondary-400" strokeWidth="6" fill="transparent" 
                strokeDasharray={2 * Math.PI * 28} 
                strokeDashoffset={2 * Math.PI * 28 * (1 - 0.82)} 
                strokeLinecap="round"
              />
            </svg>
            <span className="text-sm font-extrabold">82</span>
          </div>
          <div className="text-left">
            <p className="text-[10px] text-primary-400 font-bold uppercase tracking-wider">Social Wellness</p>
            <p className="text-base font-extrabold text-secondary-500">82/100</p>
            <span className="text-[10px] text-emerald-500 font-extrabold">▲ +4% vs last week</span>
          </div>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card p-6 flex items-center gap-4 border-white/20 dark:border-slate-800/40 relative overflow-hidden">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${stat.color}`}>
                <Icon className="h-6 w-6 stroke-[2px]" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-primary-400 dark:text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                <h4 className="text-2xl font-extrabold leading-tight mt-0.5">{stat.value}</h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mood Trend Chart */}
        <div className="glass-card p-6 border-white/20 dark:border-slate-800/40 lg:col-span-2 text-left">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-extrabold text-base uppercase tracking-wider">Mental Wellness Trend</h3>
              <p className="text-primary-400 dark:text-slate-400 text-xs font-semibold mt-0.5">Emotional check-in score over the past week</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs bg-emerald-500/10 px-2.5 py-1 rounded-full">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Balanced Vibe</span>
            </div>
          </div>
          
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800/60" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} fontWeight="bold" tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={11} fontWeight="bold" tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="url(#colorWellness)" 
                  strokeWidth={3} 
                  dot={{ r: 5, strokeWidth: 2, stroke: '#FFFFFF', fill: '#60A5FA' }} 
                  activeDot={{ r: 7, strokeWidth: 0 }} 
                />
                <defs>
                  <linearGradient id="colorWellness" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#FF6B6B" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Activity Hours Bar Chart */}
        <div className="glass-card p-6 border-white/20 dark:border-slate-800/40 text-left">
          <div className="mb-6">
            <h3 className="font-extrabold text-base uppercase tracking-wider">Weekly Activity Score</h3>
            <p className="text-primary-400 dark:text-slate-400 text-xs font-semibold mt-0.5">Interaction hours vs Wellness logs</p>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800/60" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} fontWeight="bold" tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} fontWeight="bold" tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: 'none', borderRadius: '16px', fontSize: '12px' }}
                  itemStyle={{ color: '#0F172A' }}
                />
                <Bar dataKey="interaction" name="Interactions" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                <Bar dataKey="wellness" name="Wellness" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommended matches widget */}
      <div className="glass-card p-6 border-white/20 dark:border-slate-800/40 text-left">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-extrabold text-base uppercase tracking-wider">Top Recommended Sparks</h3>
            <p className="text-primary-400 dark:text-slate-400 text-xs font-semibold mt-0.5">AI computed connections nearby who share your interests</p>
          </div>
          <Link to="/discover" className="text-xs font-extrabold text-secondary-500 hover:underline flex items-center gap-1">
            <span>Explore Discovery</span>
            <Play className="h-3 w-3 fill-current" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            // Skeleton loaders
            [1, 2, 3].map(n => (
              <div key={n} className="p-4 bg-white/40 dark:bg-slate-900/30 border border-primary-100/50 dark:border-slate-800 rounded-3xl animate-pulse h-28" />
            ))
          ) : matches.length > 0 ? (
            matches.map(match => (
              <div key={match.id} className="p-4 bg-white/40 dark:bg-slate-900/30 border border-primary-100/50 dark:border-slate-800 rounded-3xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img 
                    src={match.profile.profile_pic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${match.profile.name}`} 
                    alt={match.profile.name} 
                    className="h-12 w-12 rounded-2xl bg-secondary-100 border object-cover shrink-0"
                  />
                  <div>
                    <h5 className="font-bold text-sm leading-tight">{match.profile.name}, {match.profile.age}</h5>
                    <p className="text-[10px] text-primary-400 font-semibold mt-0.5 line-clamp-1 max-w-[120px]">
                      {match.profile.occupation || 'Hobby seeker'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-secondary-100/60 dark:bg-slate-800 text-secondary-600 dark:text-secondary-400 font-extrabold text-[10px] py-1 px-2.5 rounded-full border border-secondary-200/30">
                    {match.score}% Match
                  </span>
                  <p className="text-[9px] text-primary-400 font-bold mt-1 uppercase tracking-tight">
                    {match.distance} km away
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-6 text-primary-400 dark:text-slate-400 text-xs font-semibold">
              No matching profiles found in your city. Ensure location coordinates are accurate.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
