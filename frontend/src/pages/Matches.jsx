import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchesAPI } from '../services/api';
import { useChat } from '../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MapPin, Sparkles, MessageSquare, AlertCircle, ChevronRight, Ban 
} from 'lucide-react';

const Matches = () => {
  const navigate = useNavigate();
  const { selectContact } = useChat();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeMatch, setActiveMatch] = useState(null);
  const [icebreakers, setIcebreakers] = useState([]);
  const [loadingIcebreakers, setLoadingIcebreakers] = useState(false);
  const [showIcebreakerModal, setShowIcebreakerModal] = useState(false);

  const loadConnections = async () => {
    try {
      setLoading(true);
      const res = await matchesAPI.getMatches();
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
    await selectContact(userId);
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
    <div className="space-y-6 pb-24 font-outfit text-left text-white">
      <div>
        <h2 className="text-xl md:text-2xl font-syne font-extrabold uppercase tracking-tight text-white">Active Connections</h2>
        <p className="text-slate-400 text-xs font-semibold">Your established connections. Start a chat or view AI suggested icebreakers.</p>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(n => (
              <div key={n} className="glass-card h-[220px] animate-pulse border-white/5 bg-black/45" />
            ))}
          </div>
        ) : connections.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {connections.map((match) => (
              <div 
                key={match.id}
                className="glass-card p-6 border-white/5 bg-black/45 flex flex-col justify-between hover:border-[#DFFE00]/20 hover:shadow-lg transition-all duration-300"
              >
                {/* Profile Detail Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={match.profile.profile_pic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${match.profile.name}`} 
                      alt={match.profile.name} 
                      className="h-14 w-14 rounded-2xl bg-slate-900 border-2 border-white/10 object-cover shadow-sm"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm md:text-base leading-tight text-white">
                        {match.profile.name}, {match.profile.age}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-1 tracking-wider">
                        {match.profile.occupation || 'Hobby seeker'}
                      </p>
                      {match.profile.active_goal && (
                        <span className="inline-flex items-center gap-1 mt-1 bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border border-rose-500/20">
                          🎯 Seeking: {match.profile.active_goal}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block bg-[#DFFE00] text-black font-extrabold text-[10px] py-1 px-3 rounded-full tracking-wider shadow-md shadow-[#DFFE00]/10">
                      {match.score}% MATCH
                    </span>
                    <div className="flex items-center gap-1 text-[9px] text-[#DFFE00] font-extrabold mt-2 justify-end tracking-wider">
                      <MapPin className="h-3 w-3" />
                      <span>{match.distance} km</span>
                    </div>
                  </div>
                </div>

                {/* bio excerpt */}
                <div className="my-4">
                  <p className="text-xs text-slate-300 font-semibold line-clamp-2 leading-relaxed">
                    "{match.profile.bio || 'Connected! Let\'s coordinate a meetup.'}"
                  </p>
                </div>

                {/* Mutual interests list */}
                {match.mutual_interests.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {match.mutual_interests.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[9px] bg-[#DFFE00]/10 border border-[#DFFE00]/25 text-[#DFFE00] font-extrabold py-0.5 px-2 rounded-md uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                      {match.mutual_interests.length > 3 && (
                        <span className="text-[9px] text-slate-500 font-extrabold self-center pl-1.5 uppercase tracking-wider">
                          +{match.mutual_interests.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions footer */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <button 
                    onClick={() => handleBlockUser(match.profile.user_id)}
                    className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white hover:border-transparent transition-colors duration-200 shrink-0"
                    title="Block User"
                  >
                    <Ban className="h-4 w-4 stroke-[2px]" />
                  </button>

                  <button 
                    onClick={() => handleGenerateIcebreakers(match)}
                    className="flex-1 btn-secondary py-2.5 px-4 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#DFFE00] animate-pulse" />
                    <span>AI Icebreaker</span>
                  </button>

                  <button 
                    onClick={() => handleStartChat(match.profile.user_id)}
                    className="flex-1 btn-primary py-2.5 px-4 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Chat Now</span>
                  </button>
                </div>

              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            className="glass-card p-10 text-center flex flex-col items-center justify-center space-y-4 border-white/5 bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Heart className="h-16 w-16 text-[#DFFE00] animate-pulse" />
            <h3 className="text-lg font-syne font-extrabold uppercase tracking-tight text-white">No connections yet</h3>
            <p className="text-xs text-slate-400 font-semibold max-w-xs leading-relaxed">
              Connections are established when you right-swipe on the Discover card deck. Keep exploring!
            </p>
            <button 
              onClick={() => navigate('/discover')}
              className="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider font-bold"
            >
              Browse Discovery
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icebreaker slide-out modal */}
      <AnimatePresence>
        {showIcebreakerModal && activeMatch && (
          <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 backdrop-blur-sm">
            <motion.div 
              className="glass-card bg-black/85 w-full max-w-lg p-6 rounded-t-[32px] rounded-b-none border-x-0 border-b-0 border-t border-white/10 max-h-[380px] overflow-y-auto"
              initial={{ y: 250, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 250, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-[#DFFE00]" />
                  <h4 className="font-syne font-extrabold text-sm uppercase tracking-wider text-white">AI Icebreakers with {activeMatch.profile.name}</h4>
                </div>
                <button 
                  onClick={() => setShowIcebreakerModal(false)}
                  className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider"
                >
                  Close
                </button>
              </div>

              {loadingIcebreakers ? (
                <div className="space-y-3 py-6">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="h-14 w-full bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
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
                      className="w-full text-left p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-xs font-semibold text-[#DFFE00] flex justify-between items-center group transition-colors"
                    >
                      <span className="leading-relaxed pr-4 text-white">"{ice}"</span>
                      <ChevronRight className="h-4 w-4 shrink-0 group-hover:translate-x-1 transition-transform text-[#DFFE00]" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
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
