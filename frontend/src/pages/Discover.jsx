import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { matchesAPI } from '../services/api';
import { 
  Heart, X, Compass, MapPin, Sparkles, AlertCircle, MessageCircle, ChevronRight, UserPlus 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const Discover = () => {
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Icebreaker modal state
  const [icebreakers, setIcebreakers] = useState([]);
  const [loadingIcebreakers, setLoadingIcebreakers] = useState(false);
  const [showIcebreakerModal, setShowIcebreakerModal] = useState(false);

  // Load matches
  const loadDiscoverMatches = async () => {
    try {
      setLoading(true);
      const res = await matchesAPI.getMatches();
      // Only keep people that we haven't connected with yet
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
        // Trigger confetti explosion on liking a user
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.7 }
        });
        await matchesAPI.performAction(currentMatch.profile.user_id, 'connect');
      } else {
        await matchesAPI.performAction(currentMatch.profile.user_id, 'block'); // Skip uses block/exclude database-wise
      }
      
      // Move to next card
      setCurrentIndex(prev => prev + 1);
      // Close icebreaker modal if open
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
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 120) {
      handleAction('connect');
    } else if (info.offset.x < -120) {
      handleAction('skip');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 relative font-outfit text-left">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Discover Buddies</h2>
          <p className="text-primary-400 dark:text-slate-400 text-xs font-semibold">Swipe right to connect or generate a custom AI icebreaker</p>
        </div>
        <button 
          onClick={loadDiscoverMatches}
          className="p-2.5 rounded-xl border border-primary-200/50 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-colors"
        >
          <Compass className="h-4 w-4 text-primary-500" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          // Card Skeleton Loading State
          <motion.div 
            key="skeleton"
            className="glass-card w-full h-[520px] animate-pulse flex flex-col justify-between p-6 border-white/30 dark:border-slate-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="h-12 w-32 bg-primary-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-44 w-full bg-primary-200 dark:bg-slate-800 rounded-3xl" />
            <div className="space-y-3">
              <div className="h-6 w-3/4 bg-primary-200 dark:bg-slate-800 rounded-xl" />
              <div className="h-4 w-1/2 bg-primary-200 dark:bg-slate-800 rounded-xl" />
            </div>
          </motion.div>
        ) : currentMatch ? (
          <div className="relative w-full h-[550px]">
            {/* Card Swiper Container */}
            <motion.div
              key={currentMatch.id}
              style={{ x, rotate, opacity }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 glass-card p-6 border-white/40 dark:border-slate-800 flex flex-col justify-between shadow-2xl cursor-grab active:cursor-grabbing select-none"
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header Info */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img 
                    src={currentMatch.profile.profile_pic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentMatch.profile.name}`} 
                    alt={currentMatch.profile.name}
                    className="h-16 w-16 rounded-2xl bg-secondary-50 border-2 border-white object-cover shadow-sm pointer-events-none"
                  />
                  <div>
                    <h3 className="font-extrabold text-base md:text-lg">{currentMatch.profile.name}, {currentMatch.profile.age}</h3>
                    <p className="text-[10px] text-primary-400 font-bold uppercase tracking-widest">{currentMatch.profile.occupation || 'Hobby Seeker'}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-secondary-100/80 dark:bg-slate-900 text-secondary-600 dark:text-secondary-400 font-extrabold text-xs py-1.5 px-3.5 rounded-full border border-secondary-200/20">
                    {currentMatch.score}% Match
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-primary-400 font-bold mt-1.5 uppercase justify-end">
                    <MapPin className="h-3 w-3 text-accent-coral" />
                    <span>{currentMatch.distance} km away</span>
                  </div>
                </div>
              </div>

              {/* Bio description */}
              <div className="my-6 p-4 bg-primary-100/30 dark:bg-slate-900/30 border border-primary-200/10 dark:border-slate-800/80 rounded-2xl max-h-[120px] overflow-y-auto">
                <p className="text-xs md:text-sm text-primary-600 dark:text-slate-300 font-semibold leading-relaxed">
                  "{currentMatch.profile.bio || 'Hello! Let\'s meet up and enjoy activities!'}"
                </p>
              </div>

              {/* Tags lists */}
              <div className="space-y-4">
                {/* Interests Tags */}
                <div>
                  <p className="text-[9px] text-primary-400 font-extrabold uppercase tracking-widest pl-1 mb-1.5">Core Interests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentMatch.profile.interests.map((tag) => (
                      <span 
                        key={tag} 
                        className={`text-[10px] font-bold py-1 px-2.5 rounded-lg border ${
                          currentMatch.mutual_interests.includes(tag)
                            ? 'bg-secondary-50 dark:bg-secondary-900/20 text-secondary-500 border-secondary-200/40'
                            : 'bg-white/50 dark:bg-slate-900/60 text-primary-400 border-primary-100/50 dark:border-slate-800/60'
                        }`}
                      >
                        {tag} {currentMatch.mutual_interests.includes(tag) && '✓'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hobbies list */}
                {currentMatch.profile.hobbies.length > 0 && (
                  <div>
                    <p className="text-[9px] text-primary-400 font-extrabold uppercase tracking-widest pl-1 mb-1.5">Hobbies</p>
                    <div className="flex flex-wrap gap-1.5">
                      {currentMatch.profile.hobbies.map((hobby) => (
                        <span key={hobby} className="text-[10px] bg-white/50 dark:bg-slate-900/60 text-primary-400 border border-primary-100/50 dark:border-slate-800/60 font-semibold py-0.5 px-2 rounded-lg">
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons footer */}
              <div className="flex justify-between items-center gap-4 mt-6 pt-4 border-t border-primary-100/50 dark:border-slate-800/40">
                <button 
                  onClick={() => handleAction('skip')}
                  className="h-12 w-12 rounded-full border border-red-200/60 dark:border-red-900/40 bg-red-500/5 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-200 shrink-0"
                >
                  <X className="h-5 w-5 stroke-[2.5px]" />
                </button>

                <button 
                  onClick={handleGenerateIcebreakers}
                  className="flex-1 btn-secondary h-12 flex items-center justify-center gap-2 text-xs border-primary-200/80 dark:border-slate-800"
                >
                  <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                  <span>Generate Icebreaker</span>
                </button>

                <button 
                  onClick={() => handleAction('connect')}
                  className="h-12 w-12 rounded-full border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-500/5 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all duration-200 shrink-0"
                >
                  <Heart className="h-5 w-5 stroke-[2.5px] fill-current" />
                </button>
              </div>

            </motion.div>
          </div>
        ) : (
          // End of cards pile
          <motion.div 
            key="empty"
            className="glass-card p-10 text-center flex flex-col items-center justify-center space-y-4 border-white/30 dark:border-slate-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Compass className="h-16 w-16 text-primary-300 dark:text-slate-700 animate-spin" style={{ animationDuration: '6s' }} />
            <h3 className="text-lg font-extrabold">All caught up!</h3>
            <p className="text-xs text-primary-400 dark:text-slate-400 font-semibold max-w-xs leading-relaxed">
              We couldn't find any more matches in your area right now. Check back later or expand your profile interests.
            </p>
            <button 
              onClick={loadDiscoverMatches}
              className="btn-primary py-2.5 px-6 text-xs"
            >
              Refresh Discovery
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icebreaker slide-out overlay / modal */}
      <AnimatePresence>
        {showIcebreakerModal && (
          <div className="fixed inset-0 z-40 flex items-end justify-center bg-primary-950/20 backdrop-blur-sm">
            <motion.div 
              className="glass-card w-full max-w-lg p-6 rounded-t-[32px] rounded-b-none border-x-0 border-b-0 border-t border-white/30 dark:border-slate-800 max-h-[380px] overflow-y-auto"
              initial={{ y: 250, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 250, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-amber-500 fill-amber-500/20" />
                  <h4 className="font-extrabold text-sm uppercase tracking-wider">AI Icebreakers with {currentMatch?.profile.name}</h4>
                </div>
                <button 
                  onClick={() => setShowIcebreakerModal(false)}
                  className="text-xs font-bold text-primary-400 hover:text-primary-900 dark:hover:text-white"
                >
                  Close
                </button>
              </div>

              {loadingIcebreakers ? (
                // Skeleton list for icebreakers
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
                        // Quick copy helper or action helper
                        navigator.clipboard.writeText(ice);
                        alert("Copied to clipboard! Send it when you connect.");
                        setShowIcebreakerModal(false);
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

export default Discover;
