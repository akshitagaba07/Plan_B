import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const cardsData = [
  {
    emoji: "👟",
    title: "Sports & Fitness",
    desc: "Find teammates for football, badminton, cricket, or stay consistent by finding a workout buddy for running, cycling, or gym sessions.",
    gradient: "from-[#83f582] to-[#7af7f7]", // Wero Green to Cyan
    illustration: (
      <svg viewBox="0 0 120 120" className="w-24 h-24 md:w-32 md:h-32 select-none pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Dumbbell behind */}
        <rect x="25" y="72" width="70" height="8" rx="2" stroke="black" strokeWidth="3.5" fill="black" />
        <rect x="20" y="62" width="12" height="28" rx="3" stroke="black" strokeWidth="3.5" fill="#fd74fd" />
        <rect x="88" y="62" width="12" height="28" rx="3" stroke="black" strokeWidth="3.5" fill="#fd74fd" />
        
        {/* Sports Ball (Basketball/Soccer hybrid) */}
        <circle cx="60" cy="50" r="36" stroke="black" strokeWidth="3.5" fill="white" />
        <path d="M34 24C47 37 47 63 34 76" stroke="black" strokeWidth="3.5" />
        <path d="M86 24C73 37 73 63 86 76" stroke="black" strokeWidth="3.5" />
        <line x1="60" y1="14" x2="60" y2="86" stroke="black" strokeWidth="3.5" />
        <line x1="24" y1="50" x2="96" y2="50" stroke="black" strokeWidth="3.5" />
        
        {/* Whistle on top */}
        <rect x="75" y="65" width="22" height="14" rx="4" stroke="black" strokeWidth="3" fill="#fff48d" transform="rotate(-15 75 65)" />
        <path d="M92 67h8v5h-8z" stroke="black" strokeWidth="3" fill="black" transform="rotate(-15 75 65)" />
      </svg>
    )
  },
  {
    emoji: "☕",
    title: "Social & Hangouts",
    desc: "Visit cafés, restaurants, hidden gems, or grab a coffee, go for a walk, and enjoy good conversations with like-minded people.",
    gradient: "from-[#fff48d] to-[#fdad70]", // Wero Yellow to Orange
    illustration: (
      <svg viewBox="0 0 120 120" className="w-24 h-24 md:w-32 md:h-32 select-none pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Coffee Mug */}
        <rect x="25" y="50" width="54" height="52" rx="12" stroke="black" strokeWidth="3.5" fill="white" />
        <path d="M79 62c11 0 16 5 16 13s-5 13-16 13" stroke="black" strokeWidth="3.5" fill="none" />
        {/* Steam lines */}
        <path d="M38 38c2-4-2-8 0-12M52 38c2-4-2-8 0-12" stroke="black" strokeWidth="3" strokeLinecap="round" />

        {/* Chat bubble overlay */}
        <rect x="55" y="25" width="48" height="34" rx="8" stroke="black" strokeWidth="3.5" fill="#7af7f7" />
        <path d="M85 59l8 8v-8" stroke="black" strokeWidth="3.5" fill="#7af7f7" />
        <path d="M67 42c4 3 12 3 16 0" stroke="black" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  },
  {
    emoji: "✈️",
    title: "Entertainment & Travel",
    desc: "Watch movies, attend concerts, gaming events, stand-up shows, festivals, or plan weekend trips and adventures together.",
    gradient: "from-[#7af7f7] to-[#fd97fd]", // Wero Cyan to Pink
    illustration: (
      <svg viewBox="0 0 120 120" className="w-24 h-24 md:w-32 md:h-32 select-none pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Suitcase Base */}
        <rect x="25" y="45" width="55" height="60" rx="10" stroke="black" strokeWidth="3.5" fill="white" />
        <path d="M42 45V30h20v15" stroke="black" strokeWidth="3.5" fill="none" />
        
        {/* Movie Clapperboard overlay */}
        <rect x="45" y="55" width="50" height="38" rx="4" stroke="black" strokeWidth="3.5" fill="#83f582" />
        <rect x="42" y="45" width="56" height="10" stroke="black" strokeWidth="3.5" fill="black" transform="rotate(-12 42 45)" />

        {/* Ticket on top */}
        <rect x="70" y="80" width="34" height="20" rx="3" stroke="black" strokeWidth="3" fill="#fff48d" transform="rotate(15 70 80)" />
        <circle cx="70" cy="90" r="3" stroke="black" strokeWidth="3" fill="#fff48d" />
      </svg>
    )
  },
  {
    emoji: "🎨",
    title: "Study & Hobbies",
    desc: "Find coding partners, project teammates, study groups, or meet people interested in photography, music, art, and new skills.",
    gradient: "from-[#fdad70] to-[#fd74fd]", // Wero Orange to Purple
    illustration: (
      <svg viewBox="0 0 120 120" className="w-24 h-24 md:w-32 md:h-32 select-none pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Open Book */}
        <path d="M15 85V35c15 0 25-10 45-10v50c-20 0-30 10-45 10z" stroke="black" strokeWidth="3.5" fill="white" />
        <path d="M105 85V35c-15 0-25-10-45-10v50c20 0 30 10 45 10z" stroke="black" strokeWidth="3.5" fill="white" />
        
        {/* Art Palette overlay */}
        <path d="M60 40c-15-15 0-45 25-45s30 8 30 28-10 28-25 28c-8 0-12-4-15-4s-8 4-15 0z" stroke="black" strokeWidth="3" fill="#7af7f7" transform="scale(0.8) translate(20, 40)" />
        
        {/* Lightbulb rising in middle */}
        <path d="M60 30c-10 0-16 6-16 15 0 6 4 10 6 12v6h20v-6c2-2 6-6 6-12 0-9-6-15-16-15z" stroke="black" strokeWidth="3.5" fill="#fff48d" />
        <rect x="53" y="63" width="14" height="4" stroke="black" strokeWidth="3.5" fill="black" />
      </svg>
    )
  }
];

const InterestsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-play slideshow timer (cycles every 4.5 seconds).
  // Including activeIndex in the dependency array clears the interval and resets the 4.5s countdown
  // whenever the active slide is changed (e.g. on manual hover), preventing premature skips.
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cardsData.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeIndex]);

  const activeCard = cardsData[activeIndex];

  return (
    <section className="relative w-full overflow-hidden py-24 z-10">
      {/* Dynamic Ambient Spotlight Background */}
      <motion.div 
        animate={{
          backgroundColor: activeIndex === 0 ? "rgba(131, 245, 130, 0.12)" : 
                           activeIndex === 1 ? "rgba(253, 173, 112, 0.12)" :
                           activeIndex === 2 ? "rgba(122, 247, 247, 0.12)" : 
                           "rgba(253, 116, 253, 0.12)",
          x: activeIndex % 2 === 0 ? -60 : 60,
          y: activeIndex > 1 ? 60 : -60,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 w-[450px] h-[450px] rounded-full filter blur-[110px] pointer-events-none z-0"
      />

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center relative z-10">
        
        {/* Left Column: Presentation Navigation */}
        <div className="w-full lg:w-[40%] text-left space-y-8">
          <div className="space-y-4">
            <span className="inline-block bg-[#DFFE00]/10 border border-[#DFFE00]/25 rounded-lg p-1.5 px-3.5 font-extrabold text-[10px] text-[#DFFE00] uppercase tracking-widest">
              WHY PLAN B
            </span>
            <h2 className="text-4xl md:text-5xl font-syne font-black uppercase tracking-tight text-white leading-[0.95]">
              Built Around <br />
              Your Interests
            </h2>
            <p className="text-slate-400 font-semibold text-sm leading-relaxed max-w-md">
              Hover over the interests below to preview how Plan B matches you with people who share your vibe.
            </p>
          </div>

          {/* Navigation Items (Tabs) with spring highlight slider */}
          <div className="flex flex-col gap-3.5 w-full relative">
            {cardsData.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={idx}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${
                    isActive 
                      ? 'border-[#DFFE00] text-black' 
                      : 'border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {/* Sliding Spring Highlight Background */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeInterestTab"
                      className="absolute inset-0 bg-[#DFFE00] -z-10 shadow-lg shadow-[#DFFE00]/10"
                      transition={{ type: "spring", stiffness: 220, damping: 22 }}
                    />
                  )}

                  <div className="flex items-center gap-4 relative z-10">
                    <span className={`text-sm font-black transition-colors ${isActive ? 'text-black/60' : 'text-slate-600'}`}>
                      0{idx + 1}
                    </span>
                    <span className="font-syne font-bold text-lg md:text-xl uppercase tracking-tight">
                      {item.title}
                    </span>
                  </div>
                  
                  <span className="text-2xl select-none transform group-hover:scale-110 transition-transform duration-200 relative z-10">
                    {item.emoji}
                  </span>

                  {/* Active Slide Timer Line */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-black/10 overflow-hidden">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        key={activeIndex}
                        transition={{ duration: 4.5, ease: "linear" }}
                        className="h-full bg-black/35"
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Large Slide Card View */}
        <div className="w-full lg:w-[60%] flex items-center justify-center min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // smooth apple-like ease-out
              className="w-full"
            >
              {/* Card wrapper */}
              <div className={`group border-[4px] border-black bg-gradient-to-br ${activeCard.gradient} rounded-[32px] p-8 md:p-12 text-[#1d1c1c] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 ease-out cursor-pointer relative overflow-hidden flex flex-col md:flex-row gap-8 md:gap-12 items-center`}>
                
                {/* Left Side: Parallax Spring Illustration */}
                <div className="w-full md:w-[40%] flex items-center justify-center">
                  <motion.div 
                    initial={{ opacity: 0, x: -40, rotate: -12 }}
                    animate={{ opacity: 1, x: 0, rotate: idx => idx % 2 === 0 ? -1.2 : 1.2 }}
                    key={activeIndex}
                    transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.1 }}
                    className="scale-110 md:scale-125"
                  >
                    {activeCard.illustration}
                  </motion.div>
                </div>

                {/* Right Side: Staggered text details */}
                <div className="w-full md:w-[60%] flex flex-col justify-between min-h-[220px] text-left">
                  <div className="space-y-4">
                    {/* Title */}
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={`title-${activeIndex}`}
                      transition={{ duration: 0.4, delay: 0.15 }}
                      className="flex items-center gap-3"
                    >
                      <h3 className="font-syne font-black text-2xl md:text-3xl uppercase tracking-tighter text-black leading-tight">
                        {activeCard.title}
                      </h3>
                      <span className="text-3xl select-none">
                        {activeCard.emoji}
                      </span>
                    </motion.div>

                    {/* Description */}
                    <motion.p 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={`desc-${activeIndex}`}
                      transition={{ duration: 0.4, delay: 0.25 }}
                      className="text-slate-800 text-sm md:text-base font-bold leading-relaxed"
                    >
                      {activeCard.desc}
                    </motion.p>
                  </div>

                  {/* Action Footer */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={`footer-${activeIndex}`}
                    transition={{ type: "spring", stiffness: 120, damping: 10, delay: 0.35 }}
                    className="flex items-center justify-between pt-6 mt-6 border-t border-black/10 group-hover:border-black/20"
                  >
                    <span className="text-sm font-black uppercase tracking-wider text-black">
                      Find Sparks
                    </span>
                    <div className="h-10 w-10 rounded-full border-2 border-black bg-white flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all duration-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none">
                      <ArrowRight className="h-5 w-5 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </motion.div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default InterestsSection;
