import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, Sparkles, MapPin, Compass, MessageCircle, RotateCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMatches } from '../context/MatchContext';
import confetti from 'canvas-confetti';

/* ─── Mock Profiles ─── */
const MOCK_PROFILES = [
  {
    id: 1, name: 'Rohan', age: 23, city: 'Mumbai',
    occupation: 'Software Engineer', university: 'IIT Bombay',
    bio: "Gaming, coding, and casual football matches. Always up for a FIFA session or outdoor sports! Looking for teammates, study partners, or just someone to grab chai with.",
    interests: ['Gaming', 'Coding', 'Football'],
    hobbies: ['FIFA', 'Trekking', 'Open Source'],
    active_goal: 'Weekend Football Match',
    profile_pic: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rohan',
    distance: 1.2, score: 92, languages: ['English', 'Hindi'],
  },
  {
    id: 2, name: 'Priya', age: 22, city: 'Bangalore',
    occupation: 'Graphic Designer', university: 'NID Ahmedabad',
    bio: "Art enthusiast, coffee lover, and acoustic guitar player. Let's discover local cafes and art galleries together! I'm always looking for creative souls.",
    interests: ['Art', 'Coffee', 'Music'],
    hobbies: ['Painting', 'Guitar', 'Sketching'],
    active_goal: 'Cafe Hopping',
    profile_pic: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Priya',
    distance: 2.4, score: 88, languages: ['English', 'Kannada'],
  },
  {
    id: 3, name: 'Sarah', age: 24, city: 'Delhi',
    occupation: 'Content Writer', university: 'Delhi University',
    bio: "Books devourer, anime binger, and amateur photographer. Always down for anime watch parties or photo walks around the city. Let's explore together!",
    interests: ['Books', 'Anime', 'Photography'],
    hobbies: ['Reading', 'Drawing', 'Journaling'],
    active_goal: 'Anime Night',
    profile_pic: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah',
    distance: 3.1, score: 85, languages: ['English', 'Hindi'],
  },
  {
    id: 4, name: 'Alex', age: 25, city: 'Pune',
    occupation: 'Personal Trainer', university: 'Sports Academy',
    bio: "Fitness nut, travel addict, and cricket fanatic. Let's hit the gym together or plan a quick weekend hike. I can coach you through a workout!",
    interests: ['Gym', 'Travel', 'Cricket'],
    hobbies: ['Powerlifting', 'Hiking', 'Cycling'],
    active_goal: 'Morning Workout',
    profile_pic: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex',
    distance: 0.8, score: 78, languages: ['English', 'Marathi'],
  },
  {
    id: 5, name: 'Sofia', age: 25, city: 'Hyderabad',
    occupation: 'Data Analyst', university: 'BITS Pilani',
    bio: "Freelance writer and book reviewer. Let's grab iced matchas and read at a park or explore bookstores together. I always have great book recommendations!",
    interests: ['Books', 'Coffee', 'Anime'],
    hobbies: ['Novels', 'Sketching', 'Blogging'],
    active_goal: 'Bookstore Crawl',
    profile_pic: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sofia',
    distance: 4.5, score: 81, languages: ['English', 'Telugu'],
  },
  {
    id: 6, name: 'Jamal', age: 24, city: 'Chennai',
    occupation: 'Data Scientist', university: 'IIT Madras',
    bio: "PC builder and competitive gamer. Looking for local players to team up for Valorant lobbies or FIFA nights. Also enjoy lo-fi music sessions.",
    interests: ['Gaming', 'Coding', 'Music'],
    hobbies: ['Esports', 'Keyboard Building', 'Lo-fi'],
    active_goal: 'Valorant Lobby',
    profile_pic: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jamal',
    distance: 2.0, score: 90, languages: ['English', 'Tamil'],
  },
  {
    id: 7, name: 'David', age: 26, city: 'Kolkata',
    occupation: 'Photographer', university: 'Jadavpur University',
    bio: "Street photography enthusiast. Always roaming with a film camera looking for the perfect shot. Seeking photo walk partners and fellow creatives!",
    interests: ['Photography', 'Travel', 'Art'],
    hobbies: ['Film Scan', 'Cycling', 'Cafe Visits'],
    active_goal: 'Photo Walk',
    profile_pic: 'https://api.dicebear.com/7.x/adventurer/svg?seed=David',
    distance: 1.7, score: 76, languages: ['English', 'Bengali'],
  },
  {
    id: 8, name: 'Jessica', age: 22, city: 'Ahmedabad',
    occupation: 'Culinary Student', university: 'CEPT University',
    bio: "Foodie and culinary student exploring the best bakeries and street food. Join me for food crawls — I always find the best hidden gems!",
    interests: ['Food', 'Coffee', 'Music'],
    hobbies: ['Cooking', 'Guitar', 'Baking'],
    active_goal: 'Food Crawl',
    profile_pic: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jessica',
    distance: 3.8, score: 83, languages: ['English', 'Gujarati'],
  },
  {
    id: 9, name: 'Marcus', age: 24, city: 'Jaipur',
    occupation: 'Architecture Student', university: 'CEPT Ahmedabad',
    bio: "Sports enthusiast and casual basketball player. Down for pick-up games, watching matches, or gaming sessions. Let's get active together!",
    interests: ['Football', 'Basketball', 'Gaming'],
    hobbies: ['Sports', 'Architecture', 'Sketching'],
    active_goal: 'Basketball Pick-up',
    profile_pic: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus',
    distance: 5.2, score: 71, languages: ['English', 'Hindi'],
  },
  {
    id: 10, name: 'Aisha', age: 23, city: 'Kochi',
    occupation: 'Yoga Instructor', university: 'Kerala University',
    bio: "Yoga instructor and travel enthusiast. Looking for someone to join morning yoga sessions or explore new hiking trails. Good vibes only! 🌿",
    interests: ['Yoga', 'Travel', 'Cooking'],
    hobbies: ['Meditation', 'Hiking', 'Painting'],
    active_goal: 'Morning Yoga',
    profile_pic: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aisha',
    distance: 2.9, score: 87, languages: ['English', 'Malayalam'],
  },
];

/* ─── Icebreaker suggestions by interest ─── */
const ICEBREAKER_MAP = {
  Gaming: [
    "I saw you game — what's your main title right now? 🎮",
    "Any multiplayer games you'd want to squad up on?",
  ],
  Football: [
    "Seen any good matches lately? Who's your team? ⚽",
    "Up for a casual kick-around this weekend?",
  ],
  Coffee: [
    "Best café you've discovered recently? ☕",
    "Are you a latte person or black coffee?",
  ],
  Music: [
    "What's been on your playlist lately? 🎵",
    "Do you play any instruments or just listen?",
  ],
  Art: [
    "What kind of art are you into — digital or traditional? 🎨",
    "Seen any interesting exhibitions around recently?",
  ],
  Anime: [
    "What anime are you watching right now? 👀",
    "Up for an anime watch party sometime?",
  ],
  Books: [
    "What's the last book you couldn't put down? 📖",
    "Any bookstore recommendations in the city?",
  ],
  Travel: [
    "Where was your last trip? Where's next? ✈️",
    "Are you more of a mountains or beaches person?",
  ],
  Photography: [
    "What's your favourite subject to shoot? 📷",
    "Would you be up for a photo walk together?",
  ],
  Gym: [
    "Morning or evening gym person? 💪",
    "Would you be up for a workout session together?",
  ],
  Food: [
    "What's the best dish you've tried recently? 🍜",
    "Know any hidden gem restaurants nearby?",
  ],
  Yoga: [
    "Do you practice yoga indoors or outdoors? 🧘",
    "Morning yoga sounds amazing — are you an early riser?",
  ],
  Coding: [
    "What stack are you working with these days? 💻",
    "Any cool side projects I should know about?",
  ],
};

const getIcebreakers = (interests = []) => {
  const pool = [];
  for (const interest of interests) {
    if (ICEBREAKER_MAP[interest]) pool.push(...ICEBREAKER_MAP[interest]);
  }
  // fallback generic ones
  const fallbacks = [
    "What's one thing you've always wanted to do but haven't found the right person to join you?",
    "If you could do one activity this weekend, what would it be?",
    "What's your idea of the perfect Plan B hangout?",
  ];
  const all = [...pool, ...fallbacks];
  // deduplicate and return 3
  return [...new Set(all)].slice(0, 3);
};

/* ─── Component ─── */
const Discover = () => {
  const navigate = useNavigate();
  const { addMatch } = useMatches();

  const [profiles] = useState(() => [...MOCK_PROFILES].sort(() => Math.random() - 0.5));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedProfile, setMatchedProfile] = useState(null); // triggers "It's a Match!" overlay
  const [showIcebreakers, setShowIcebreakers] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-22, 22]);
  const cardOpacity = useTransform(x, [-200, 0, 200], [0.7, 1, 0.7]);
  const connectOpacity = useTransform(x, [0, 90], [0, 1]);
  const skipOpacity = useTransform(x, [-90, 0], [1, 0]);

  const currentProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];
  const nextNextProfile = profiles[currentIndex + 2];

  const handleSwipeRight = (profile) => {
    confetti({ particleCount: 130, spread: 80, origin: { y: 0.65 } });
    addMatch(profile);
    setMatchedProfile(profile);
    setCurrentIndex(prev => prev + 1);
    setShowIcebreakers(false);
    x.set(0);
  };

  const handleSwipeLeft = () => {
    setCurrentIndex(prev => prev + 1);
    setShowIcebreakers(false);
    x.set(0);
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 120) {
      handleSwipeRight(currentProfile);
    } else if (info.offset.x < -120) {
      handleSwipeLeft();
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setShowIcebreakers(false);
  };

  const icebreakers = currentProfile ? getIcebreakers(currentProfile.interests) : [];

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 relative font-outfit text-white select-none">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-syne font-extrabold uppercase tracking-tight text-white">Discover</h2>
          <p className="text-slate-400 text-xs font-semibold mt-0.5">Swipe right to connect · left to skip</p>
        </div>
        <div className="flex items-center gap-2">
          {currentIndex > 0 && (
            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-slate-400"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
          <div className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-[10px] font-extrabold text-[#DFFE00] uppercase tracking-wider">
            {Math.max(0, profiles.length - currentIndex)} left
          </div>
        </div>
      </div>

      {/* Card Stack */}
      <AnimatePresence mode="wait">
        {currentProfile ? (
          <div className="relative w-full" style={{ height: 560 }}>

            {/* Card Behind — next next */}
            {nextNextProfile && (
              <div
                className="absolute inset-0 glass-card border-white/5 bg-black/40 rounded-[28px]"
                style={{ transform: 'scale(0.92) translateY(16px)', zIndex: 1, opacity: 0.35 }}
              />
            )}

            {/* Card Behind — next */}
            {nextProfile && (
              <div
                className="absolute inset-0 glass-card border-white/5 bg-black/40 rounded-[28px]"
                style={{ transform: 'scale(0.96) translateY(8px)', zIndex: 2, opacity: 0.6 }}
              />
            )}

            {/* Active (Top) Card */}
            <motion.div
              key={currentProfile.id}
              style={{ x, rotate, opacity: cardOpacity, zIndex: 10 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.9}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 glass-card border-white/8 bg-black/50 flex flex-col overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing rounded-[28px]"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
              {/* Swipe badges */}
              <motion.div
                style={{ opacity: connectOpacity }}
                className="absolute top-7 left-7 border-4 border-[#00D47C] text-[#00D47C] font-black text-2xl uppercase px-4 py-1.5 rounded-xl -rotate-12 tracking-widest z-20 pointer-events-none"
              >
                LIKE 💚
              </motion.div>
              <motion.div
                style={{ opacity: skipOpacity }}
                className="absolute top-7 right-7 border-4 border-red-500 text-red-500 font-black text-2xl uppercase px-4 py-1.5 rounded-xl rotate-12 tracking-widest z-20 pointer-events-none"
              >
                SKIP ✕
              </motion.div>

              {/* Profile Header */}
              <div className="p-5 border-b border-white/5">
                {/* Top row: avatar + name + match badge */}
                <div className="flex items-center gap-4">
                  <img
                    src={currentProfile.profile_pic}
                    alt={currentProfile.name}
                    className="h-16 w-16 rounded-2xl bg-slate-900 border-2 border-[#DFFE00]/40 shadow-lg shadow-[#DFFE00]/10 pointer-events-none shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    {/* Name row with badge */}
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-extrabold text-lg text-white leading-tight truncate">
                        {currentProfile.name}, {currentProfile.age}
                      </h3>
                      <span className="shrink-0 bg-[#DFFE00] text-black font-extrabold text-[10px] py-1 px-2.5 rounded-full tracking-wider shadow-md shadow-[#DFFE00]/15 whitespace-nowrap">
                        {currentProfile.score}% MATCH
                      </span>
                    </div>
                    {/* Occupation */}
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5 truncate">
                      {currentProfile.occupation} · {currentProfile.university}
                    </p>
                    {/* Location on one line */}
                    <div className="flex items-center gap-1 mt-1 text-[9px] text-[#DFFE00] font-extrabold uppercase tracking-wider">
                      <MapPin className="h-2.5 w-2.5 shrink-0" />
                      <span className="truncate">{currentProfile.city} · {currentProfile.distance} km away</span>
                    </div>
                    {/* Active goal — its own row, below location */}
                    {currentProfile.active_goal && (
                      <div className="mt-1.5 inline-flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-extrabold px-2 py-0.5 rounded-lg uppercase tracking-wider">
                        🎯 {currentProfile.active_goal}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="px-6 pt-4 pb-3">
                <p className="text-xs text-slate-300 font-semibold leading-relaxed italic">
                  "{currentProfile.bio}"
                </p>
              </div>

              {/* Interests */}
              <div className="px-6 space-y-3 flex-1">
                <div>
                  <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest mb-2">Interests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentProfile.interests.map(tag => (
                      <span key={tag} className="text-[10px] font-extrabold py-1.5 px-3 rounded-lg border bg-[#DFFE00]/10 text-[#DFFE00] border-[#DFFE00]/20 uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest mb-2">Hobbies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentProfile.hobbies.map(h => (
                      <span key={h} className="text-[10px] font-bold py-1.5 px-3 rounded-lg border border-white/10 bg-white/5 text-slate-400 uppercase tracking-wider">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentProfile.languages.map(l => (
                    <span key={l} className="text-[9px] font-bold py-1 px-2.5 rounded-full border border-white/8 bg-white/4 text-slate-500 uppercase tracking-wider">
                      🌐 {l}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-4 pb-5 pt-4 border-t border-white/5 flex items-center gap-2 overflow-hidden">
                <button
                  onClick={handleSwipeLeft}
                  className="h-11 w-11 rounded-full border border-red-500/30 bg-red-500/8 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-transparent transition-all duration-200 shrink-0"
                >
                  <X className="h-5 w-5 stroke-[2.5px]" />
                </button>

                <button
                  onClick={() => setShowIcebreakers(v => !v)}
                  className="flex-1 min-w-0 h-11 btn-secondary flex items-center justify-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#DFFE00] shrink-0" />
                  <span className="truncate">Icebreaker</span>
                </button>

                <button
                  onClick={() => handleSwipeRight(currentProfile)}
                  className="h-11 w-11 rounded-full bg-[#DFFE00] text-black flex items-center justify-center hover:bg-yellow-300 shadow-lg shadow-[#DFFE00]/20 transition-all duration-200 shrink-0"
                >
                  <Heart className="h-5 w-5 stroke-[2.5px] fill-current" />
                </button>
              </div>

            </motion.div>
          </div>
        ) : (
          /* All swiped */
          <motion.div
            key="empty"
            className="glass-card p-12 text-center flex flex-col items-center justify-center space-y-5 border-white/5 bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Compass className="h-16 w-16 text-[#DFFE00]" style={{ animation: 'spin 6s linear infinite' }} />
            <h3 className="text-lg font-syne font-extrabold uppercase tracking-tight text-white">You've seen everyone!</h3>
            <p className="text-xs text-slate-400 font-semibold max-w-xs leading-relaxed">
              You've gone through all profiles. Reset to start again or check your matches in Chat.
            </p>
            <div className="flex gap-3">
              <button onClick={handleReset} className="btn-secondary py-2.5 px-5 text-xs uppercase tracking-wider font-extrabold">
                Start Over
              </button>
              <Link to="/chat" className="btn-primary py-2.5 px-5 text-xs uppercase tracking-wider font-extrabold flex items-center gap-2">
                <MessageCircle className="h-4 w-4" /> Go to Chat
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icebreaker Slide-up Panel */}
      <AnimatePresence>
        {showIcebreakers && currentProfile && (
          <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowIcebreakers(false)}>
            <motion.div
              className="glass-card bg-black/90 w-full max-w-lg p-6 rounded-t-[32px] rounded-b-none border-x-0 border-b-0 border-t border-white/10"
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 300, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#DFFE00]" />
                  <h4 className="font-syne font-extrabold text-sm uppercase tracking-wider text-white">
                    Icebreakers for {currentProfile.name}
                  </h4>
                </div>
                <button onClick={() => setShowIcebreakers(false)} className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider">
                  Close
                </button>
              </div>
              <div className="space-y-3 pb-4">
                {icebreakers.map((ice, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      navigator.clipboard?.writeText(ice);
                      setShowIcebreakers(false);
                    }}
                    className="w-full text-left p-4 bg-white/5 hover:bg-[#DFFE00]/10 border border-white/8 hover:border-[#DFFE00]/25 rounded-2xl text-xs font-semibold text-white transition-colors group"
                  >
                    <span className="leading-relaxed">"{ice}"</span>
                    <span className="block text-[9px] text-[#DFFE00] font-extrabold uppercase tracking-wider mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      Tap to copy
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* "It's a Match!" Overlay */}
      <AnimatePresence>
        {matchedProfile && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div style={{
                width: 500, height: 500,
                background: 'radial-gradient(ellipse, rgba(223,254,0,0.18) 0%, transparent 65%)',
                filter: 'blur(40px)'
              }} />
            </div>

            <motion.div
              className="relative z-10 text-center space-y-6"
              initial={{ scale: 0.7, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            >
              {/* Avatars */}
              <div className="flex items-center justify-center gap-4">
                <div className="h-20 w-20 rounded-2xl border-4 border-[#DFFE00] shadow-lg shadow-[#DFFE00]/20 overflow-hidden bg-slate-900">
                  <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=You" alt="You" className="h-full w-full" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                  className="text-4xl"
                >
                  💛
                </motion.div>
                <div className="h-20 w-20 rounded-2xl border-4 border-[#DFFE00] shadow-lg shadow-[#DFFE00]/20 overflow-hidden bg-slate-900">
                  <img src={matchedProfile.profile_pic} alt={matchedProfile.name} className="h-full w-full" />
                </div>
              </div>

              {/* Text */}
              <div className="space-y-2">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#DFFE00]/60">Plan B says</p>
                <h2 className="font-syne font-black text-5xl uppercase tracking-tighter text-[#DFFE00]" style={{ textShadow: '0 0 40px rgba(223,254,0,0.6)' }}>
                  It's a Match!
                </h2>
                <p className="text-slate-400 text-sm font-semibold">
                  You and <span className="text-white font-bold">{matchedProfile.name}</span> liked each other!
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  to="/chat"
                  onClick={() => setMatchedProfile(null)}
                  className="btn-primary py-3.5 px-8 text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Start Chatting
                </Link>
                <button
                  onClick={() => setMatchedProfile(null)}
                  className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider transition-colors"
                >
                  Keep Swiping
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Discover;
