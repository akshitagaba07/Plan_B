import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchesAPI } from '../services/api';
import { useChat } from '../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MapPin, Sparkles, MessageSquare, AlertCircle, ChevronRight, Ban, EyeOff 
} from 'lucide-react';

const Matches = () => {
  const navigate = useNavigate();
  const { selectContact } = useChat();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Icebreaker modal state
  const [activeMatch, setActiveMatch] = useState(null);
  const [icebreakers, setIcebreakers] = useState([]);
  const [loadingIcebreakers, setLoadingIcebreakers] = useState(false);
  const [showIcebreakerModal, setShowIcebreakerModal] = useState(false);

  const loadConnections = async () => {
    try {
      setLoading(true);
      const res = await matchesAPI.getMatches();
      // Filter for connected status
      setConnections(res.data.filter(m => m.status === 'connected'));
    } catch (err) {
      console.error("Failed to load connected matches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  const handleStartChat = async (userId) => {
    // Select this contact inside ChatContext
    await selectContact(userId);
    // Redirect to chat dashboard screen
    navigate('/chat');
  };

  const handleBlockUser = async (userId) => {
    if (!window.confirm("Are you sure you want to block this connection?")) return;
    try {
      await matchesAPI.performAction(userId, 'block');
      setConnections(prev => prev.filter(c => c.profile.user_id !== userId));
    } catch (err) {
      console.error("Failed to block connection:", err);
    }
  };

  const handleGenerateIcebreakers = async (match) => {
    setActiveMatch(match);
    setLoadingIcebreakers(true);
    setShowIcebreakerModal(true);
    try {
      const res = await matchesAPI.getIcebreakers(match.profile.user_id);
      setIcebreakers(res.data.icebreakers);
    } catch (err) {
      console.error("Failed to load icebreakers:", err);
    } finally {
      setLoadingIcebreakers(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 font-outfit text-left">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Active Connections</h2>
        <p className="text-primary-400 dark:text-slate-400 text-xs font-semibold">Your established connections. Start a chat or view AI suggested icebreakers.</p>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          // Grid loading skeleton
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(n => (
              <div key={n} className="glass-card h-[220px] animate-pulse border-white/30 dark:border-slate-800" />
            ))}
          </div>
        ) : connections.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {connections.map((match) => (
              <div 
                key={match.id}
                className="glass-card p-6 border-white/20 dark:border-slate-800/40 flex flex-col justify-between hover:shadow-lg transition-all duration-300"
              >
                {/* Profile Detail Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={match.profile.profile_pic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${match.profile.name}`} 
                      alt={match.profile.name} 
                      className="h-14 w-14 rounded-2xl bg-secondary-100 border object-cover shadow-sm"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm md:text-base leading-tight">
                        {match.profile.name}, {match.profile.age}
                      </h4>
                      <p className="text-[10px] text-primary-400 font-bold uppercase mt-0.5 tracking-wider">
                        {match.profile.occupation || 'Hobby seeker'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block bg-secondary-100/60 dark:bg-slate-900 text-secondary-600 dark:text-secondary-400 font-extrabold text-[10px] py-1.5 px-3 rounded-full border border-secondary-200/20">
                      {match.score}% Score
                    </span>
                    <div className="flex items-center gap-1 text-[9px] text-primary-400 font-bold mt-1.5 justify-end">
                      <MapPin className="h-3 w-3 text-accent-coral" />
                      <span>{match.distance} km</span>
                    </div>
                  </div>
                </div>

                {/* bio excerpt */}
                <div className="my-4">
                  <p className="text-xs text-primary-500 dark:text-slate-400 font-semibold line-clamp-2 leading-relaxed">
                    "{match.profile.bio || 'Connected! Let\'s coordinate a meetup.'}"
                  </p>
                </div>

                {/* Mutual interests list */}
                {match.mutual_interests.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {match.mutual_interests.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[9px] bg-secondary-50 dark:bg-slate-800/80 text-secondary-500 font-extrabold py-0.5 px-2 rounded-md border border-secondary-200/30">
                          {tag}
                        </span>
                      ))}
                      {match.mutual_interests.length > 3 && (
                        <span className="text-[9px] text-primary-400 font-bold self-center pl-1">
                          +{match.mutual_interests.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions footer */}
                <div className="flex items-center gap-3 pt-3 border-t border-primary-100/50 dark:border-slate-800/40">
                  <button 
                    onClick={() => handleBlockUser(match.profile.user_id)}
                    className="p-2.5 rounded-xl border border-red-200/60 dark:border-red-900/40 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200 shrink-0"
                    title="Block User"
                  >
                    <Ban className="h-4 w-4 stroke-[2px]" />
                  </button>

                  <button 
                    onClick={() => handleGenerateIcebreakers(match)}
                    className="flex-1 btn-secondary py-2.5 px-4 text-xs font-bold border-primary-200/60 dark:border-slate-800 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>AI Icebreaker</span>
                  </button>

                  <button 
                    onClick={() => handleStartChat(match.profile.user_id)}
                    className="flex-1 btn-primary py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Chat Now</span>
                  </button>
                </div>

              </div>
            ))}
          </motion.div>
        ) : (
          // Empty State
          <motion.div 
            key="empty"
            className="glass-card p-10 text-center flex flex-col items-center justify-center space-y-4 border-white/30 dark:border-slate-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Heart className="h-16 w-16 text-rose-300 dark:text-slate-700 animate-pulse" />
            <h3 className="text-lg font-extrabold">No connections yet</h3>
            <p className="text-xs text-primary-400 dark:text-slate-400 font-semibold max-w-xs leading-relaxed">
              Connections are established when you right-swipe on the Discover card deck. Keep exploring!
            </p>
            <button 
              onClick={() => navigate('/discover')}
              className="btn-primary py-2.5 px-6 text-xs"
            >
              Browse Discovery
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icebreaker slide-out modal */}
      <AnimatePresence>
        {showIcebreakerModal && activeMatch && (
          <div className="fixed inset-0 z-40 flex items-end justify-center bg-primary-950/20 backdrop-blur-sm">
            <motion.div 
              className="glass-card w-full max-w-lg p-6 rounded-t-[32px] rounded-b-none border-x-0 border-b-0 border-t border-white/35 dark:border-slate-800 max-h-[380px] overflow-y-auto"
              initial={{ y: 250, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 250, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-amber-500 fill-amber-500/20" />
                  <h4 className="font-extrabold text-sm uppercase tracking-wider">AI Icebreakers with {activeMatch.profile.name}</h4>
                </div>
                <button 
                  onClick={() => setShowIcebreakerModal(false)}
                  className="text-xs font-bold text-primary-400 hover:text-primary-900 dark:hover:text-white"
                >
                  Close
                </button>
              </div>

              {loadingIcebreakers ? (
                <div className="space-y-3 py-6">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="h-14 w-full bg-primary-200/50 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : icebreakers.length > 0 ? (
                <div className="space-y-3 pb-6">
                  {icebreakers.map((ice, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        navigator.clipboard.writeText(ice);
                        alert("Copied to clipboard! Opening chat...");
                        setShowIcebreakerModal(false);
                        handleStartChat(activeMatch.profile.user_id);
                      }}
                      className="w-full text-left p-4 bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 border border-primary-100/50 dark:border-slate-800 rounded-2xl text-xs font-semibold text-secondary-600 dark:text-secondary-400 flex justify-between items-center group transition-colors"
                    >
                      <span className="leading-relaxed pr-4">"{ice}"</span>
                      <ChevronRight className="h-4 w-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-primary-400 text-xs font-semibold flex items-center justify-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Failed to load icebreakers. Try again.</span>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Matches;
