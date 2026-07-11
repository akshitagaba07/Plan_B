import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Compass, Sparkles, MapPin, Quote } from 'lucide-react';

const storyStages = [
  {
    title: "Plan A",
    label: "Family & Friends",
    badge: "THE FIRST CHOICE",
    gradient: "from-[#fff48d] to-[#fffbde]", // Soft gold
    color: "#fff48d",
    subtitle: "We all make our first plans with the people closest to us.",
    bullets: [
      { text: "A cricket match with friends", emoji: "🏏" },
      { text: "A movie with siblings", emoji: "🍿" },
      { text: "A café visit with your best friend", emoji: "☕" },
      { text: "A weekend trip with family", emoji: "🚗" }
    ],
    footer: "Those are our first choice—our Plan A.",
    // Warm vector scene showing group connection
    illustration: (
      <svg viewBox="0 0 200 200" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="80" fill="url(#sunGlow)" opacity="0.15" />
        <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="2" strokeDasharray="6 6" opacity="0.3" />
        
        {/* Left Friend */}
        <path d="M50 140c0-15 12-25 25-25s25 10 25 25" stroke="black" strokeWidth="4.5" fill="#fdad70" />
        <circle cx="75" cy="100" r="14" stroke="black" strokeWidth="4.5" fill="white" />
        
        {/* Right Friend */}
        <path d="M100 140c0-15 12-25 25-25s25 10 25 25" stroke="black" strokeWidth="4.5" fill="#fd97fd" />
        <circle cx="125" cy="100" r="14" stroke="black" strokeWidth="4.5" fill="white" />
        
        {/* Heart */}
        <path d="M100 75c-3-6-10-6-13 0l13 13 13-13c-3-6-10-6-13 0z" stroke="black" strokeWidth="4" fill="#ff4d4d" transform="scale(1.1) translate(-10, -5)" />
        
        <line x1="100" y1="20" x2="100" y2="35" stroke="#fff48d" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="30" y1="50" x2="42" y2="60" stroke="#fff48d" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="170" y1="50" x2="158" y2="60" stroke="#fff48d" strokeWidth="4.5" strokeLinecap="round" />
        
        <defs>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff48d" />
            <stop offset="100%" stopColor="#ff4d4d" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    )
  },
  {
    title: "Life Changes",
    label: "The Unfamiliar Shift",
    badge: "THE TRANSITION",
    gradient: "from-[#7af7f7] to-[#8fe0ff]", // Cool ice/cyan
    color: "#7af7f7",
    subtitle: "But life moves forward.",
    bullets: [
      { text: "College takes us to a new city", emoji: "🎓" },
      { text: "Work brings us somewhere unfamiliar", emoji: "💼" },
      { text: "Friends become busy", emoji: "⏳" },
      { text: "Family lives far away", emoji: "📍" }
    ],
    footer: "Suddenly, the plans are still there... but the people aren't.",
    // Isolated figure with location pins and clouds
    illustration: (
      <svg viewBox="0 0 200 200" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="75" fill="url(#isolatedGlow)" opacity="0.12" />
        <path d="M70 55c-5 0-10 4-10 9 0 1 .1 2 .2 3C53 69 48 76 48 83c0 9 8 16 17 16h60c9 0 16-7 16-16 0-7-5-13-11-15 0-1 .1-1.5.1-2.5 0-9-7-16-16-16-4 0-8 1.5-11 4.5C98 58 90 55 85 55c-6 0-11 3-15 0z" stroke="black" strokeWidth="4.5" fill="white" />
        
        <line x1="65" y1="110" x2="60" y2="125" stroke="#7af7f7" strokeWidth="3" strokeLinecap="round" />
        <line x1="85" y1="115" x2="80" y2="130" stroke="#7af7f7" strokeWidth="3" strokeLinecap="round" />
        <line x1="125" y1="112" x2="120" y2="127" stroke="#7af7f7" strokeWidth="3" strokeLinecap="round" />
        
        <path d="M85 160c0-12 10-20 20-20s20 8 20 20" stroke="black" strokeWidth="4.5" fill="#7af7f7" />
        <circle cx="105" cy="128" r="11" stroke="black" strokeWidth="4.5" fill="white" />
        
        <path d="M45 135c0-5 5-10 5-15s-5-5-5 0c0 5-5 15-5 15z" stroke="black" strokeWidth="2.5" fill="none" opacity="0.4" />
        <circle cx="45" cy="115" r="3" fill="#fd74fd" opacity="0.4" />
        
        <path d="M155 125c0-5 5-10 5-15s-5-5-5 0c0 5-5 15-5 15z" stroke="black" strokeWidth="2.5" fill="none" opacity="0.4" transform="rotate(25 155 125)" />
        <circle cx="157" cy="105" r="3" fill="#fd74fd" opacity="0.4" />

        <defs>
          <radialGradient id="isolatedGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7af7f7" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    )
  },
  {
    title: "Plan B",
    label: "Find Your People",
    badge: "THE SOLUTION",
    gradient: "from-[#83f582] to-[#7af7f7]", // Green to cyan
    color: "#83f582",
    subtitle: "That's where Plan B begins.",
    bullets: [
      { text: "Find people who share your interests", emoji: "🤝" },
      { text: "Never cancel an experience", emoji: "✨" },
      { text: "Make memories on your own terms", emoji: "⚡" }
    ],
    footer: "Plan B helps you find people who share your interests, so you never have to cancel an experience just because your usual group is unavailable.",
    // Fully connected happy network scene
    illustration: (
      <svg viewBox="0 0 200 200" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="75" fill="url(#activeGlow)" opacity="0.2" />
        
        <line x1="100" y1="70" x2="60" y2="120" stroke="black" strokeWidth="4.5" strokeDasharray="4 4" />
        <line x1="100" y1="70" x2="140" y2="120" stroke="black" strokeWidth="4.5" strokeDasharray="4 4" />
        <line x1="60" y1="120" x2="140" y2="120" stroke="black" strokeWidth="4.5" strokeDasharray="4 4" />
        
        <g transform="translate(0, -10)">
          <path d="M80 90c0-12 10-20 20-20s20 8 20 20" stroke="black" strokeWidth="4.5" fill="#83f582" />
          <circle cx="100" cy="58" r="11" stroke="black" strokeWidth="4.5" fill="white" />
        </g>
        
        <g transform="translate(-40, 40)">
          <path d="M85 90c0-10 8-16 15-16s15 6 15 16" stroke="black" strokeWidth="4" fill="#7af7f7" />
          <circle cx="100" cy="62" r="9" stroke="black" strokeWidth="4" fill="white" />
        </g>
        
        <g transform="translate(40, 40)">
          <path d="M85 90c0-10 8-16 15-16s15 6 15 16" stroke="black" strokeWidth="4" fill="#fd97fd" />
          <circle cx="100" cy="62" r="9" stroke="black" strokeWidth="4" fill="white" />
        </g>
        
        <g transform="translate(100, 100) scale(0.65)">
          <circle cx="0" cy="0" r="18" stroke="black" strokeWidth="4" fill="#fff48d" />
          <path d="M-8-4h12v10a4 4 0 01-4 4h-4a4 4 0 01-4-4V-4z" stroke="black" strokeWidth="2.5" fill="white" />
          <path d="M4-2c2 0 3 1 3 3s-1 3-3 3" stroke="black" strokeWidth="2.5" />
        </g>
        
        <g transform="translate(45, 60) scale(0.65)">
          <circle cx="0" cy="0" r="18" stroke="black" strokeWidth="4" fill="#fdad70" />
          <path d="M-4 6V-6l8-2v12" stroke="black" strokeWidth="2.5" fill="none" />
          <circle cx="-6" cy="6" r="3" fill="black" />
          <circle cx="2" cy="4" r="3" fill="black" />
        </g>

        <g transform="translate(155, 60) scale(0.65)">
          <circle cx="0" cy="0" r="18" stroke="black" strokeWidth="4" fill="#83f582" />
          <circle cx="0" cy="0" r="8" stroke="black" strokeWidth="2.5" fill="white" />
        </g>

        <defs>
          <radialGradient id="activeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#83f582" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    )
  }
];

const WhyPlanBSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Observer refs for high-performance scroll tracking
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

  // Optimized Intersection Observer to handle stage changes on scroll without lag
  useEffect(() => {
    if (!isDesktop) return;

    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -25% 0px", // Triggers when the panel is in the middle 50% of screen
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
    <section className="relative w-full overflow-hidden bg-black text-white py-24">
      {/* Background Loop Video specifically fitted and styled for this section */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-[0.45] mix-blend-screen z-0"
        >
          <source src="/background-video-2.mp4" type="video/mp4" />
          <source src="/background-video-2.webm" type="video/webm" />
        </video>
        {/* Blurring glass layer to blend text overlay */}
        <div className="absolute inset-0 w-full h-full backdrop-blur-[6px] bg-black/65 z-[1]" />
      </div>

      {/* Dynamic Ambient Spotlights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
        <motion.div 
          animate={{
            backgroundColor: activeIndex === 0 ? "rgba(253, 244, 141, 0.08)" : 
                             activeIndex === 1 ? "rgba(122, 247, 247, 0.08)" : 
                             "rgba(131, 245, 130, 0.09)",
            x: activeIndex === 0 ? -120 : activeIndex === 1 ? 120 : 0,
            y: activeIndex === 2 ? 120 : -120
          }}
          transition={{ duration: 0.8 }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full filter blur-[140px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start justify-between">
        
        {/* LEFT COLUMN: Narrative story scroll-panels */}
        <div className="w-full lg:w-[48%] flex flex-col justify-start text-left space-y-4">
          
          {/* Header Title block */}
          <div className="space-y-3 mb-10 sticky top-28 bg-transparent z-20">
            <span className="inline-block bg-[#DFFE00]/10 border border-[#DFFE00]/25 rounded-lg p-1.5 px-3.5 font-extrabold text-[10px] text-[#DFFE00] uppercase tracking-widest">
              OUR STORY
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-syne font-black uppercase tracking-tight text-white leading-[0.95]">
              Why Plan B?
            </h2>
          </div>

          {/* Narrative panels (observed on desktop for scroll transitions) */}
          <div className="space-y-24 lg:space-y-44 relative">
            {/* Stage 0 panel */}
            <motion.div
              ref={p0Ref}
              data-index="0"
              animate={{ opacity: isDesktop ? (activeIndex === 0 ? 1 : 0.25) : 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className={`inline-block text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded border border-[#fff48d]/30 text-[#fff48d] bg-[#fff48d]/10`}>
                  STAGE 01 — PLAN A
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-syne font-extrabold uppercase tracking-tight text-white">
                {storyStages[0].subtitle}
              </h3>
              <ul className="space-y-2.5 pl-1.5">
                {storyStages[0].bullets.map((b, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-350 font-bold text-sm md:text-base">
                    <span className="text-base select-none" role="img" aria-hidden="true">{b.emoji}</span>
                    <span>{b.text}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-400 font-semibold text-xs md:text-sm italic pt-2">
                {storyStages[0].footer}
              </p>
            </motion.div>

            {/* Stage 1 panel */}
            <motion.div
              ref={p1Ref}
              data-index="1"
              animate={{ opacity: isDesktop ? (activeIndex === 1 ? 1 : 0.25) : 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className={`inline-block text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded border border-[#7af7f7]/30 text-[#7af7f7] bg-[#7af7f7]/10`}>
                  STAGE 02 — LIFE CHANGES
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-syne font-extrabold uppercase tracking-tight text-white">
                {storyStages[1].subtitle}
              </h3>
              <ul className="space-y-2.5 pl-1.5">
                {storyStages[1].bullets.map((b, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-350 font-bold text-sm md:text-base">
                    <span className="text-base select-none" role="img" aria-hidden="true">{b.emoji}</span>
                    <span>{b.text}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-400 font-semibold text-xs md:text-sm italic pt-2">
                {storyStages[1].footer}
              </p>
            </motion.div>

            {/* Stage 2 panel */}
            <motion.div
              ref={p2Ref}
              data-index="2"
              animate={{ opacity: isDesktop ? (activeIndex === 2 ? 1 : 0.25) : 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className={`inline-block text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded border border-[#83f582]/30 text-[#83f582] bg-[#83f582]/10`}>
                  STAGE 03 — PLAN B
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-syne font-extrabold uppercase tracking-tight text-white">
                {storyStages[2].subtitle}
              </h3>
              <ul className="space-y-2.5 pl-1.5">
                {storyStages[2].bullets.map((b, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-350 font-bold text-sm md:text-base">
                    <span className="text-base select-none" role="img" aria-hidden="true">{b.emoji}</span>
                    <span>{b.text}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-400 font-semibold text-sm md:text-base leading-relaxed pt-2">
                {storyStages[2].footer}
              </p>
            </motion.div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky visual mockups */}
        <div className={`w-full lg:w-[45%] h-[320px] md:h-[400px] lg:h-[480px] flex items-center justify-center relative ${isDesktop ? 'lg:sticky lg:top-40' : 'mt-12'}`}>
          <div className="w-full max-w-sm md:max-w-md aspect-square relative flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.92, rotateY: 30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.92, rotateY: -30 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="w-full h-full relative"
                style={{ perspective: 1000 }}
              >
                {/* Clean glass box frame for custom SVGs */}
                <div className="absolute inset-0 bg-white/5 rounded-[40px] border border-white/10 flex items-center justify-center p-8 backdrop-blur-sm shadow-2xl overflow-hidden animate-float">
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full filter blur-[45px] opacity-10 bg-gradient-to-br ${activeStage.gradient}`} />
                  
                  {/* The Vector Illustration */}
                  <div className="w-full h-full flex items-center justify-center scale-95 md:scale-105">
                    {activeStage.illustration}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Large takeaway quote closing the story section */}
      <div className="max-w-6xl mx-auto px-6 mt-20 md:mt-32 relative z-10 text-center">
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
