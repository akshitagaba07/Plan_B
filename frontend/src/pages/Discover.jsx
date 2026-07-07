import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { matchesAPI } from '../services/api';
import { 
  Heart, X, Compass, MapPin, Sparkles, AlertCircle, ChevronRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const Discover = () => {
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [icebreakers, setIcebreakers] = useState([]);
  const [loadingIcebreakers, setLoadingIcebreakers] = useState(false);
  const [showIcebreakerModal, setShowIcebreakerModal] = useState(false);

  const loadDiscoverMatches = async () => {
    try {
      setLoading(true);
      const res = await matchesAPI.getMatches();
      setMatches(res.data.filter(m => m.status === 'matched'));
      setCurrentIndex(0);
    } catch (err) {
      console.error("Failed to load match listings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiscoverMatches();
  }, []);

  const currentMatch = matches[currentIndex];

  const handleAction = async (actionType) => {
    if (!currentMatch) return;
    
    try {
      if (actionType === 'connect') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.7 }
        });
        await matchesAPI.performAction(currentMatch.profile.user_id, 'connect');
      } else {
        await matchesAPI.performAction(currentMatch.profile.user_id, 'block');
      }
      
      setCurrentIndex(prev => prev + 1);
      setShowIcebreakerModal(false);
      setIcebreakers([]);
    } catch (err) {
      console.error(`Failed to execute ${actionType} action on discover profile:`, err);
    }
  };

  const handleGenerateIcebreakers = async () => {
    if (!currentMatch) return;
    setLoadingIcebreakers(true);
    setShowIcebreakerModal(true);
    try {
      const res = await matchesAPI.getIcebreakers(currentMatch.profile.user_id);
      setIcebreakers(res.data.icebreakers);
    } catch (err) {
      console.error("Failed to generate AI conversation starters:", err);
    } finally {
      setLoadingIcebreakers(false);
    }
  };

  // Drag coordinates hook for Framer Motion card swiping
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-150, 0, 150], [0.6, 1, 0.6]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 120) {
      handleAction('connect');
    } else if (info.offset.x < -120) {
      handleAction('skip');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 relative font-outfit text-left text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-syne font-extrabold uppercase tracking-tight text-white">Discover Buddies</h2>
          <p className="text-slate-400 text-xs font-semibold">Swipe right to connect or generate a custom AI icebreaker</p>
        </div>
        <button 
          onClick={loadDiscoverMatches}
          className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-[#DFFE00] shadow-md shadow-[#DFFE00]/5"
        >
          <Compass className="h-4 w-4" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="skeleton"
            className="glass-card w-full h-[520px] animate-pulse flex flex-col justify-between p-6 border-white/5 bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="h-12 w-32 bg-white/5 border border-white/10 rounded-2xl" />
            <div className="h-44 w-full bg-white/5 border border-white/10 rounded-3xl" />
            <div className="space-y-3">
              <div className="h-6 w-3/4 bg-white/5 border border-white/10 rounded-xl" />
              <div className="h-4 w-1/2 bg-white/5 border border-white/10 rounded-xl" />
            </div>
          </motion.div>
        ) : currentMatch ? (
          <div className="relative w-full h-[550px]">
            <motion.div
              key={currentMatch.id}
              style={{ x, rotate, opacity }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 glass-card p-6 border-white/5 bg-black/45 flex flex-col justify-between shadow-2xl cursor-grab active:cursor-grabbing select-none"
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: -10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Header Info */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img 
                    src={currentMatch.profile.profile_pic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentMatch.profile.name}`} 
                    alt={currentMatch.profile.name}
                    className="h-16 w-16 rounded-2xl bg-slate-900 border-2 border-[#DFFE00] object-cover shadow-md shadow-[#DFFE00]/10 pointer-events-none"
                  />
                  <div>
                    <h3 className="font-extrabold text-base md:text-lg text-white">{currentMatch.profile.name}, {currentMatch.profile.age}</h3>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5">{currentMatch.profile.occupation || 'Hobby Seeker'}</p>
                    {currentMatch.profile.active_goal && (
                      <span className="inline-flex items-center gap-1 mt-1.5 bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 text-[10px] font-extrabold px-2 py-0.5 rounded-lg border border-rose-500/20">
                        🎯 Seeking: {currentMatch.profile.active_goal}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-[#DFFE00] text-black font-extrabold text-xs py-1.5 px-3.5 rounded-full tracking-wider shadow-md shadow-[#DFFE00]/10">
                    {currentMatch.score}% MATCH
                  </span>
                  <div className="flex items-center gap-1 text-[9px] text-[#DFFE00] font-extrabold mt-2 uppercase justify-end tracking-wider">
                    <MapPin className="h-3 w-3" />
                    <span>{currentMatch.distance} km away</span>
                  </div>
                </div>
              </div>

              {/* Bio description */}
              <div className="my-6 p-4 bg-white/5 border border-white/5 rounded-2xl max-h-[120px] overflow-y-auto">
                <p className="text-xs md:text-sm text-slate-300 font-semibold leading-relaxed">
                  "{currentMatch.profile.bio || 'Hello! Let\'s meet up and enjoy activities!'}"
                </p>
              </div>

              {/* Tags lists */}
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest pl-1 mb-1.5">Core Interests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentMatch.profile.interests.map((tag) => (
                      <span 
                        key={tag} 
                        className={`text-[10px] font-extrabold py-1.5 px-3 rounded-lg border transition-colors ${
                          currentMatch.mutual_interests.includes(tag)
                            ? 'bg-[#DFFE00] text-black border-transparent shadow-sm'
                            : 'bg-white/5 text-slate-400 border-white/10'
                        }`}
                      >
                        {tag} {currentMatch.mutual_interests.includes(tag) && '✓'}
                      </span>
                    ))}
                  </div>
                </div>

                {currentMatch.profile.hobbies.length > 0 && (
                  <div>
                    <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest pl-1 mb-1.5">Hobbies</p>
                    <div className="flex flex-wrap gap-1.5">
                      {currentMatch.profile.hobbies.map((hobby) => (
                        <span key={hobby} className="text-[10px] bg-white/5 text-slate-400 border border-white/10 font-bold py-1 px-2.5 rounded-lg uppercase tracking-wider">
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons footer */}
              <div className="flex justify-between items-center gap-4 mt-6 pt-4 border-t border-white/5">
                <button 
                  onClick={() => handleAction('skip')}
                  className="h-12 w-12 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-transparent transition-all duration-200 shrink-0"
                >
                  <X className="h-5 w-5 stroke-[2.5px]" />
                </button>

                <button 
                  onClick={handleGenerateIcebreakers}
                  className="flex-1 btn-secondary h-12 flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-wider"
                >
                  <Sparkles className="h-4 w-4 text-[#DFFE00] animate-pulse" />
                  <span>Generate Icebreaker</span>
                </button>

                <button 
                  onClick={() => handleAction('connect')}
                  className="h-12 w-12 rounded-full bg-[#DFFE00] text-black flex items-center justify-center hover:bg-yellow-400 shadow-md shadow-[#DFFE00]/15 transition-all duration-200 shrink-0 border border-transparent"
                >
                  <Heart className="h-5 w-5 stroke-[2.5px] fill-current" />
                </button>
              </div>

            </motion.div>
          </div>
        ) : (
          <motion.div 
            key="empty"
            className="glass-card p-10 text-center flex flex-col items-center justify-center space-y-4 border-white/5 bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Compass className="h-16 w-16 text-[#DFFE00] animate-spin" style={{ animationDuration: '6s' }} />
            <h3 className="text-lg font-syne font-extrabold uppercase tracking-tight text-white">All caught up!</h3>
            <p className="text-xs text-slate-400 font-semibold max-w-xs leading-relaxed">
              We couldn't find any more matches in your area right now. Check back later or expand your profile interests.
            </p>
            <button 
              onClick={loadDiscoverMatches}
              className="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider font-extrabold"
            >
              Refresh Discovery
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icebreaker slide-out overlay / modal */}
      <AnimatePresence>
        {showIcebreakerModal && (
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
                  <h4 className="font-syne font-extrabold text-sm uppercase tracking-wider text-white">AI Icebreakers with {currentMatch?.profile.name}</h4>
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
                        alert("Copied to clipboard! Send it when you connect.");
                        setShowIcebreakerModal(false);
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

export default Discover;
