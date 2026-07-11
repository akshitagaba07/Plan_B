import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Heart, Compass, Sparkles, MapPin, ChevronRight, Quote } from 'lucide-react';

const storyStages = [
  {
    title: "Plan A",
    label: "Family & Friends",
    icon: <Heart className="h-5 w-5 text-red-500 fill-red-500" />,
    badge: "THE FIRST CHOICE",
    gradient: "from-[#fff48d] to-[#fffbde]", // Soft gold
    color: "#fff48d",
    paragraphs: [
      "We all make our first plans with the people closest to us.",
      "A cricket match with friends. A movie with siblings. A café visit with your best friend. A weekend trip with family.",
      "Those are our first choice—our Plan A."
    ],
    // Warm vector scene showing group connection
    illustration: (
      <svg viewBox="0 0 200 200" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Sunny Glow Background */}
        <circle cx="100" cy="100" r="80" fill="url(#sunGlow)" opacity="0.15" />
        <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="2" strokeDasharray="6 6" opacity="0.3" />
        
        {/* Left Friend (Orange) */}
        <path d="M50 140c0-15 12-25 25-25s25 10 25 25" stroke="black" strokeWidth="4.5" fill="#fdad70" />
        <circle cx="75" cy="100" r="14" stroke="black" strokeWidth="4.5" fill="white" />
        
        {/* Right Friend (Pink) */}
        <path d="M100 140c0-15 12-25 25-25s25 10 25 25" stroke="black" strokeWidth="4.5" fill="#fd97fd" />
        <circle cx="125" cy="100" r="14" stroke="black" strokeWidth="4.5" fill="white" />
        
        {/* Connecting Heart / Friendship Spark */}
        <path d="M100 75c-3-6-10-6-13 0l13 13 13-13c-3-6-10-6-13 0z" stroke="black" strokeWidth="4" fill="#ff4d4d" transform="scale(1.1) translate(-10, -5)" />
        
        {/* Happy rays */}
        <line x1="100" y1="20" x2="100" y2="35" stroke="#fff48d" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="30" y1="50" x2="42" y2="60" stroke="#fff48d" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="170" y1="50" x2="158" y2="60" stroke="#fff48d" strokeWidth="4.5" strokeLinecap="round" />
        
        {/* Gradients */}
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
    icon: <MapPin className="h-5 w-5 text-sky-400" />,
    badge: "THE TRANSITION",
    gradient: "from-[#7af7f7] to-[#8fe0ff]", // Cool ice/cyan
    color: "#7af7f7",
    paragraphs: [
      "But life moves forward.",
      "College takes us to a new city. Work brings us somewhere unfamiliar. Friends become busy. Family lives far away.",
      "Suddenly, the plans are still there... but the people aren't."
    ],
    // Isolated figure with location pins and clouds
    illustration: (
      <svg viewBox="0 0 200 200" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Isolated Shadow Glow */}
        <circle cx="100" cy="100" r="75" fill="url(#isolatedGlow)" opacity="0.12" />
        
        {/* Rain Cloud */}
        <path d="M70 55c-5 0-10 4-10 9 0 1 .1 2 .2 3C53 69 48 76 48 83c0 9 8 16 17 16h60c9 0 16-7 16-16 0-7-5-13-11-15 0-1 .1-1.5.1-2.5 0-9-7-16-16-16-4 0-8 1.5-11 4.5C98 58 90 55 85 55c-6 0-11 3-15 0z" stroke="black" strokeWidth="4.5" fill="white" />
        
        {/* Rain Drops */}
        <line x1="65" y1="110" x2="60" y2="125" stroke="#7af7f7" strokeWidth="3" strokeLinecap="round" />
        <line x1="85" y1="115" x2="80" y2="130" stroke="#7af7f7" strokeWidth="3" strokeLinecap="round" />
        <line x1="125" y1="112" x2="120" y2="127" stroke="#7af7f7" strokeWidth="3" strokeLinecap="round" />
        
        {/* Single Lonely Figure */}
        <path d="M85 160c0-12 10-20 20-20s20 8 20 20" stroke="black" strokeWidth="4.5" fill="#7af7f7" />
        <circle cx="105" cy="128" r="11" stroke="black" strokeWidth="4.5" fill="white" />
        
        {/* Fading pins going away */}
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
    icon: <Sparkles className="h-5 w-5 text-[#DFFE00]" />,
    badge: "THE SOLUTION",
    gradient: "from-[#83f582] to-[#7af7f7]", // Green to cyan
    color: "#83f582",
    paragraphs: [
      "That's where Plan B begins.",
      "Plan B helps you find people who share your interests, so you never have to cancel an experience just because you don't have someone to share it with.",
      "Because great memories shouldn't depend on whether your usual group is available."
    ],
    // Fully connected happy network scene
    illustration: (
      <svg viewBox="0 0 200 200" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Active connection web */}
        <circle cx="100" cy="100" r="75" fill="url(#activeGlow)" opacity="0.2" />
        
        {/* Connection Paths (glowing lines) */}
        <line x1="100" y1="70" x2="60" y2="120" stroke="black" strokeWidth="4.5" strokeDasharray="4 4" />
        <line x1="100" y1="70" x2="140" y2="120" stroke="black" strokeWidth="4.5" strokeDasharray="4 4" />
        <line x1="60" y1="120" x2="140" y2="120" stroke="black" strokeWidth="4.5" strokeDasharray="4 4" />
        
        {/* Central Figure (User - Neon Green) */}
        <g transform="translate(0, -10)">
          <path d="M80 90c0-12 10-20 20-20s20 8 20 20" stroke="black" strokeWidth="4.5" fill="#83f582" />
          <circle cx="100" cy="58" r="11" stroke="black" strokeWidth="4.5" fill="white" />
        </g>
        
        {/* Connected Friend Left (Cyan) */}
        <g transform="translate(-40, 40)">
          <path d="M85 90c0-10 8-16 15-16s15 6 15 16" stroke="black" strokeWidth="4" fill="#7af7f7" />
          <circle cx="100" cy="62" r="9" stroke="black" strokeWidth="4" fill="white" />
        </g>
        
        {/* Connected Friend Right (Pink) */}
        <g transform="translate(40, 40)">
          <path d="M85 90c0-10 8-16 15-16s15 6 15 16" stroke="black" strokeWidth="4" fill="#fd97fd" />
          <circle cx="100" cy="62" r="9" stroke="black" strokeWidth="4" fill="white" />
        </g>
        
        {/* Floating Sparks / Hobbies */}
        {/* Coffee Cup Badge */}
        <g transform="translate(100, 100) scale(0.65)">
          <circle cx="0" cy="0" r="18" stroke="black" strokeWidth="4" fill="#fff48d" />
          <path d="M-8-4h12v10a4 4 0 01-4 4h-4a4 4 0 01-4-4V-4z" stroke="black" strokeWidth="2.5" fill="white" />
          <path d="M4-2c2 0 3 1 3 3s-1 3-3 3" stroke="black" strokeWidth="2.5" />
        </g>
        
        {/* Music Badge */}
        <g transform="translate(45, 60) scale(0.65)">
          <circle cx="0" cy="0" r="18" stroke="black" strokeWidth="4" fill="#fdad70" />
          <path d="M-4 6V-6l8-2v12" stroke="black" strokeWidth="2.5" fill="none" />
          <circle cx="-6" cy="6" r="3" fill="black" />
          <circle cx="2" cy="4" r="3" fill="black" />
        </g>

        {/* Sports Badge */}
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
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Responsive boundary check
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set up scroll progress tracking across the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Automatically update the active illustration index based on scroll position on desktop
  useEffect(() => {
    if (!isDesktop) return;
    const unsubscribe = scrollYProgress.onChange((latest) => {
      // Map scroll progress intervals to index 0, 1, 2
      if (latest < 0.33) {
        setActiveIndex(0);
      } else if (latest >= 0.33 && latest < 0.68) {
        setActiveIndex(1);
      } else {
        setActiveIndex(2);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, isDesktop]);

  const activeStage = storyStages[activeIndex];

  return (
    <section 
      ref={sectionRef}
      className={`relative w-full overflow-hidden bg-black text-white ${isDesktop ? 'h-[250vh]' : 'py-20'}`}
    >
      {/* Background Soft Ambient Spotlights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{
            backgroundColor: activeIndex === 0 ? "rgba(253, 244, 141, 0.05)" : 
                             activeIndex === 1 ? "rgba(122, 247, 247, 0.05)" : 
                             "rgba(131, 245, 130, 0.06)",
            x: activeIndex === 0 ? -100 : activeIndex === 1 ? 100 : 0,
            y: activeIndex === 2 ? 100 : -100
          }}
          transition={{ duration: 0.8 }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full filter blur-[150px]"
        />
      </div>

      {/* Sticky layout container for Desktop */}
      <div className={`max-w-7xl mx-auto px-6 relative z-10 h-full flex flex-col justify-between ${isDesktop ? 'lg:flex-row' : ''}`}>
        
        {/* Sticky wrapper: Holds left column content & right column illustration side by side */}
        <div className={`w-full flex flex-col lg:flex-row gap-12 lg:gap-16 items-start justify-between ${isDesktop ? 'lg:sticky lg:top-28 lg:h-[75vh]' : ''}`}>
          
          {/* LEFT COLUMN: Story Copy */}
          <div className="w-full lg:w-[48%] flex flex-col justify-center h-full text-left pt-6">
            <div className="space-y-3 mb-6">
              <span className="inline-block bg-[#DFFE00]/10 border border-[#DFFE00]/25 rounded-lg p-1.5 px-3.5 font-extrabold text-[10px] text-[#DFFE00] uppercase tracking-widest">
                OUR STORY
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-syne font-black uppercase tracking-tight text-white leading-[0.95]">
                Why Plan B?
              </h2>
            </div>

            {/* Split Story Text Blocks */}
            <div className="space-y-10 mt-6 relative">
              {/* Vertical timeline connecting line (grows with index) */}
              <div className="absolute left-3.5 top-2 bottom-2 w-[2px] bg-white/10 hidden md:block">
                <motion.div 
                  animate={{ height: `${(activeIndex / (storyStages.length - 1)) * 100}%` }}
                  transition={{ duration: 0.4 }}
                  className="w-full bg-[#DFFE00]" 
                />
              </div>

              {storyStages.map((stage, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <motion.div
                    key={idx}
                    onMouseEnter={() => {
                      if (isDesktop) setActiveIndex(idx);
                    }}
                    onClick={() => setActiveIndex(idx)}
                    animate={{ 
                      opacity: isDesktop ? (isActive ? 1 : 0.25) : 1,
                      x: isDesktop ? (isActive ? 12 : 0) : 0 
                    }}
                    transition={{ duration: 0.35 }}
                    className={`flex gap-6 items-start cursor-pointer group relative pl-0 md:pl-10`}
                  >
                    {/* Node Badge on the vertical line */}
                    <div className={`absolute left-0 top-1.5 h-8 w-8 rounded-full border-[2.5px] items-center justify-center hidden md:flex transition-all duration-300 ${
                      isActive 
                        ? 'bg-black border-[#DFFE00] text-[#DFFE00] scale-110 shadow-lg shadow-[#DFFE00]/15' 
                        : 'bg-black border-white/15 text-slate-500 hover:border-white/40'
                    }`}>
                      {stage.icon}
                    </div>

                    <div className="space-y-3 text-left">
                      <div className="flex items-center gap-3">
                        <span className={`inline-block text-[9px] font-black tracking-widest px-2 py-0.5 rounded border ${
                          isActive 
                            ? 'bg-[#DFFE00]/10 border-[#DFFE00]/30 text-[#DFFE00]' 
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}>
                          {stage.badge}
                        </span>
                        <h4 className={`font-syne font-extrabold uppercase tracking-tight transition-colors duration-200 ${
                          isActive ? 'text-[#DFFE00]' : 'text-slate-400 group-hover:text-white'
                        }`}>
                          {stage.title} — {stage.label}
                        </h4>
                      </div>
                      
                      <div className="space-y-2 max-w-lg">
                        {stage.paragraphs.map((p, pIdx) => (
                          <p 
                            key={pIdx} 
                            className={`text-sm md:text-base font-bold leading-relaxed transition-colors duration-200 ${
                              isActive ? 'text-slate-200' : 'text-slate-500'
                            }`}
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive 3D Vector Illustration */}
          <div className="w-full lg:w-[45%] h-[320px] md:h-[400px] lg:h-full flex items-center justify-center relative mt-6 lg:mt-0">
            {/* Visual Frame */}
            <div className="w-full max-w-md aspect-square relative flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.9, rotateY: 45 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: -45 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full h-full relative"
                  style={{ perspective: 1000 }}
                >
                  {/* Glowing halo behind illustration card */}
                  <div className="absolute inset-0 bg-white/5 rounded-[40px] border border-white/10 flex items-center justify-center p-8 backdrop-blur-sm shadow-2xl overflow-hidden animate-float">
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full filter blur-[40px] opacity-10 bg-gradient-to-br ${activeStage.gradient}`} />
                    
                    {/* The Illustration SVG */}
                    <div className="w-full h-full flex items-center justify-center scale-95 md:scale-105">
                      {activeStage.illustration}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER: Large Centered Quote Takeaway */}
      <div className={`max-w-6xl mx-auto px-6 relative z-10 text-center ${isDesktop ? 'mt-[100vh] py-24' : 'pt-24 pb-12'}`}>
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
