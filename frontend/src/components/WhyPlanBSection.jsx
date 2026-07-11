import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

const storyStages = [
  {
    title: "Plan A",
    label: "Family & Friends",
    badge: "THE FIRST CHOICE",
    gradient: "from-[#fff48d] to-[#fdad70]", // Warm Gold/Orange
    color: "#fff48d",
    subtitle: "We all make our first plans with the people closest to us.",
    bullets: [
      { text: "A cricket match with friends", emoji: "🏏" },
      { text: "A movie with siblings", emoji: "🍿" },
      { text: "A café visit with your best friend", emoji: "☕" },
      { text: "A weekend trip with family", emoji: "🚗" }
    ],
    footer: "Those are our first choice—our Plan A.",
    illustration: (
      <svg viewBox="0 0 120 120" className="w-24 h-24 md:w-32 md:h-32 select-none pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Connection paths */}
        <line x1="60" y1="60" x2="25" y2="25" stroke="black" strokeWidth="3.5" />
        <line x1="60" y1="60" x2="95" y2="25" stroke="black" strokeWidth="3.5" />
        <line x1="60" y1="60" x2="25" y2="95" stroke="black" strokeWidth="3.5" />
        <line x1="60" y1="60" x2="95" y2="95" stroke="black" strokeWidth="3.5" />

        {/* Outer nodes */}
        <circle cx="25" cy="25" r="14" stroke="black" strokeWidth="3.5" fill="white" />
        <text x="17" y="31" fontSize="16" fill="black">🏏</text>

        <circle cx="95" cy="25" r="14" stroke="black" strokeWidth="3.5" fill="white" />
        <text x="87" y="31" fontSize="16" fill="black">🍿</text>

        <circle cx="25" cy="95" r="14" stroke="black" strokeWidth="3.5" fill="white" />
        <text x="17" y="101" fontSize="16" fill="black">☕</text>

        <circle cx="95" cy="95" r="14" stroke="black" strokeWidth="3.5" fill="white" />
        <text x="87" y="101" fontSize="16" fill="black">🚗</text>

        {/* Central Hub */}
        <circle cx="60" cy="60" r="18" stroke="black" strokeWidth="3.5" fill="#ff4d4d" />
        <path d="M60 55.5c-1-2-3-2-4 0l4 4.5 4-4.5c-1-2-3-2-4 0z" fill="black" />
      </svg>
    )
  },
  {
    title: "Life Changes",
    label: "The Unfamiliar Shift",
    badge: "THE TRANSITION",
    gradient: "from-[#7af7f7] to-[#8fe0ff]", // Cool Teal/Ice
    color: "#7af7f7",
    subtitle: "But life moves forward. We adapt.",
    bullets: [
      { text: "College takes us to a new city", emoji: "🎓" },
      { text: "Work brings us somewhere unfamiliar", emoji: "💼" },
      { text: "Friends become busy with routines", emoji: "⏳" },
      { text: "Family lives far away", emoji: "📍" }
    ],
    footer: "Suddenly, the plans are still there... but the people aren't.",
    illustration: (
      <svg viewBox="0 0 120 120" className="w-24 h-24 md:w-32 md:h-32 select-none pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Broken dotted lines */}
        <line x1="60" y1="60" x2="15" y2="15" stroke="black" strokeWidth="3" strokeDasharray="4 4" opacity="0.35" />
        <line x1="60" y1="60" x2="105" y2="15" stroke="black" strokeWidth="3" strokeDasharray="4 4" opacity="0.35" />
        <line x1="60" y1="60" x2="15" y2="105" stroke="black" strokeWidth="3" strokeDasharray="4 4" opacity="0.35" />
        <line x1="60" y1="60" x2="105" y2="105" stroke="black" strokeWidth="3" strokeDasharray="4 4" opacity="0.35" />

        {/* Faded nodes drifting away */}
        <circle cx="15" cy="15" r="11" stroke="black" strokeWidth="2.5" fill="white" opacity="0.25" />
        <text x="10" y="20" fontSize="12" opacity="0.2" fill="black">🏏</text>

        <circle cx="105" cy="15" r="11" stroke="black" strokeWidth="2.5" fill="white" opacity="0.25" />
        <text x="100" y="20" fontSize="12" opacity="0.2" fill="black">🍿</text>

        <circle cx="15" cy="105" r="11" stroke="black" strokeWidth="2.5" fill="white" opacity="0.25" />
        <text x="10" y="110" fontSize="12" opacity="0.2" fill="black">☕</text>

        <circle cx="105" cy="105" r="11" stroke="black" strokeWidth="2.5" fill="white" opacity="0.25" />
        <text x="100" y="110" fontSize="12" opacity="0.2" fill="black">🚗</text>

        {/* Isolated Node */}
        <circle cx="60" cy="60" r="18" stroke="black" strokeWidth="3.5" fill="#7af7f7" />
        <line x1="60" y1="51" x2="60" y2="59" stroke="black" strokeWidth="3" strokeLinecap="round" />
        <circle cx="60" cy="67" r="2" fill="black" />
      </svg>
    )
  },
  {
    title: "Plan B",
    label: "Find Your People",
    badge: "THE SOLUTION",
    gradient: "from-[#83f582] to-[#7af7f7]", // Wero Green/Teal
    color: "#83f582",
    subtitle: "That's where Plan B begins.",
    bullets: [
      { text: "Find people who share your interests", emoji: "🤝" },
      { text: "Never cancel an experience", emoji: "✨" },
      { text: "Make memories on your own terms", emoji: "⚡" }
    ],
    footer: "Plan B helps you find people who share your interests, so you never have to cancel an experience just because your usual group is unavailable.",
    illustration: (
      <svg viewBox="0 0 120 120" className="w-24 h-24 md:w-32 md:h-32 select-none pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Connected web lines */}
        <line x1="60" y1="60" x2="30" y2="30" stroke="black" strokeWidth="3.5" />
        <line x1="60" y1="60" x2="90" y2="30" stroke="black" strokeWidth="3.5" />
        <line x1="60" y1="60" x2="25" y2="80" stroke="black" strokeWidth="3.5" />
        <line x1="60" y1="60" x2="95" y2="80" stroke="black" strokeWidth="3.5" />
        
        <line x1="30" y1="30" x2="90" y2="30" stroke="black" strokeWidth="2" strokeDasharray="3 3" />
        <line x1="25" y1="80" x2="95" y2="80" stroke="black" strokeWidth="2" strokeDasharray="3 3" />

        {/* Connected nodes */}
        <circle cx="30" cy="30" r="13" stroke="black" strokeWidth="3" fill="white" />
        <text x="24" y="36" fontSize="14" fill="black">🎮</text>

        <circle cx="90" cy="30" r="13" stroke="black" strokeWidth="3" fill="white" />
        <text x="84" y="36" fontSize="14" fill="black">✈️</text>

        <circle cx="25" cy="80" r="13" stroke="black" strokeWidth="3" fill="white" />
        <text x="19" y="86" fontSize="14" fill="black">🎨</text>

        <circle cx="95" cy="80" r="13" stroke="black" strokeWidth="3" fill="white" />
        <text x="89" y="86" fontSize="14" fill="black">🏃‍♂️</text>

        {/* Central Plan B Node */}
        <circle cx="60" cy="60" r="18" stroke="black" strokeWidth="3.5" fill="#DFFE00" />
        <circle cx="60" cy="60" r="6" stroke="black" strokeWidth="2.5" fill="white" />
      </svg>
    )
  }
];

const WhyPlanBSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const p0Ref = useRef(null);
  const p1Ref = useRef(null);
  const p2Ref = useRef(null);

  // Responsive layout check
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Intersection observer to track active panels
  useEffect(() => {
    if (!isDesktop) return;

    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -25% 0px",
      threshold: 0.15
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index'), 10);
          setActiveIndex(index);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    if (p0Ref.current) observer.observe(p0Ref.current);
    if (p1Ref.current) observer.observe(p1Ref.current);
    if (p2Ref.current) observer.observe(p2Ref.current);

    return () => observer.disconnect();
  }, [isDesktop]);

  const activeStage = storyStages[activeIndex];

  return (
    <section className="relative w-full overflow-hidden bg-transparent text-white py-24 border-t border-b border-white/5">
      
      {/* Dynamic Ambient Spotlights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{
            backgroundColor: activeIndex === 0 ? "rgba(253, 244, 141, 0.08)" : 
                             activeIndex === 1 ? "rgba(122, 247, 247, 0.08)" : 
                             "rgba(131, 245, 130, 0.09)",
            x: activeIndex === 0 ? -100 : activeIndex === 1 ? 100 : 0,
            y: activeIndex === 2 ? 80 : -80
          }}
          transition={{ duration: 0.8 }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full filter blur-[140px]"
        />
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* NON-STICKY Section Header (Prevents overlaps) */}
        <div className="space-y-4 mb-20 text-left">
          <span className="inline-block bg-[#DFFE00]/10 border border-[#DFFE00]/25 rounded-lg p-1.5 px-3.5 font-extrabold text-[10px] text-[#DFFE00] uppercase tracking-widest">
            OUR STORY
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-syne font-black uppercase tracking-tight text-white leading-[0.95]">
            Why Plan B?
          </h2>
        </div>

        {/* Content Columns */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start justify-between">
          
          {/* LEFT COLUMN: Narrative Panels */}
          <div className="w-full lg:w-[48%] flex flex-col justify-start space-y-24 lg:space-y-36">
            
            {/* Stage 0 panel */}
            <motion.div
              ref={p0Ref}
              data-index="0"
              animate={{ opacity: isDesktop ? (activeIndex === 0 ? 1 : 0.25) : 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-5 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="inline-block text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded border border-[#fff48d]/30 text-[#fff48d] bg-[#fff48d]/10 uppercase">
                  STAGE 01 — PLAN A
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-syne font-extrabold uppercase tracking-tight text-white leading-tight">
                {storyStages[0].subtitle}
              </h3>
              
              {/* Styled list bullets matching core theme */}
              <div className="space-y-3.5 pl-1">
                {storyStages[0].bullets.map((b, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-base shadow-inner shadow-white/5">
                      {b.emoji}
                    </div>
                    <span className="font-outfit font-bold text-slate-300 text-sm md:text-base">{b.text}</span>
                  </div>
                ))}
              </div>

              <p className="text-slate-400 font-semibold text-xs md:text-sm italic pt-3 border-t border-white/5 max-w-md">
                {storyStages[0].footer}
              </p>
            </motion.div>

            {/* Stage 1 panel */}
            <motion.div
              ref={p1Ref}
              data-index="1"
              animate={{ opacity: isDesktop ? (activeIndex === 1 ? 1 : 0.25) : 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-5 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="inline-block text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded border border-[#7af7f7]/30 text-[#7af7f7] bg-[#7af7f7]/10 uppercase">
                  STAGE 02 — LIFE CHANGES
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-syne font-extrabold uppercase tracking-tight text-white leading-tight">
                {storyStages[1].subtitle}
              </h3>

              <div className="space-y-3.5 pl-1">
                {storyStages[1].bullets.map((b, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-base shadow-inner shadow-white/5">
                      {b.emoji}
                    </div>
                    <span className="font-outfit font-bold text-slate-300 text-sm md:text-base">{b.text}</span>
                  </div>
                ))}
              </div>

              <p className="text-slate-400 font-semibold text-xs md:text-sm italic pt-3 border-t border-white/5 max-w-md">
                {storyStages[1].footer}
              </p>
            </motion.div>

            {/* Stage 2 panel */}
            <motion.div
              ref={p2Ref}
              data-index="2"
              animate={{ opacity: isDesktop ? (activeIndex === 2 ? 1 : 0.25) : 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-5 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="inline-block text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded border border-[#83f582]/30 text-[#83f582] bg-[#83f582]/10 uppercase">
                  STAGE 03 — PLAN B
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-syne font-extrabold uppercase tracking-tight text-white leading-tight">
                {storyStages[2].subtitle}
              </h3>

              <div className="space-y-3.5 pl-1">
                {storyStages[2].bullets.map((b, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-base shadow-inner shadow-white/5">
                      {b.emoji}
                    </div>
                    <span className="font-outfit font-bold text-slate-300 text-sm md:text-base">{b.text}</span>
                  </div>
                ))}
              </div>

              <p className="text-slate-400 font-semibold text-xs md:text-sm italic pt-3 border-t border-white/5 max-w-md">
                {storyStages[2].footer}
              </p>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: Sticky Visual Mockups (Consistent Neo-Brutalist Cyber Theme) */}
          <div className={`w-full lg:w-[45%] h-[320px] md:h-[400px] lg:h-[480px] flex items-center justify-center relative ${isDesktop ? 'lg:sticky lg:top-48' : 'mt-12'}`}>
            <div className="w-full max-w-sm md:max-w-md aspect-square relative flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full relative"
                >
                  {/* Premium Neo-Brutalist Frame matching InterestsSection */}
                  <div className={`absolute inset-0 border-[4px] border-black bg-gradient-to-br ${activeStage.gradient} rounded-[32px] p-8 text-[#1d1c1c] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden`}>
                    
                    {/* Glowing mesh blob within frame */}
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-[45px] opacity-20 bg-white" />
                    
                    {/* The Clean Vector Illustration */}
                    <motion.div 
                      className="w-full h-full flex items-center justify-center"
                      initial={{ scale: 0.8, rotate: -8 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.05 }}
                    >
                      {activeStage.illustration}
                    </motion.div>

                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      {/* closing emotional quote block */}
      <div className="max-w-6xl mx-auto px-6 mt-24 md:mt-36 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 max-w-4xl mx-auto border-t border-white/10 pt-16 flex flex-col items-center"
        >
          <div className="h-12 w-12 rounded-full bg-[#DFFE00]/10 border border-[#DFFE00]/25 flex items-center justify-center text-[#DFFE00]">
            <Quote className="h-5 w-5 rotate-180" />
          </div>
          <blockquote className="text-2xl md:text-4xl font-syne font-extrabold uppercase tracking-tight text-white leading-tight">
            "Sometimes life changes your plans. <br />
            Plan B helps you find the <span className="text-[#DFFE00] text-neon-glow">people to make new ones.</span>"
          </blockquote>
          <div className="w-16 h-[3px] bg-[#DFFE00] rounded-full mt-4" />
        </motion.div>
      </div>
    </section>
  );
};

export default WhyPlanBSection;
