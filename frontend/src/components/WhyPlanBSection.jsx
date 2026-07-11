import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Quote } from 'lucide-react';

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
  const containerRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Responsive layout check
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set up scroll tracking for the entire section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Explicit, fully-clamped GPU-driven opacity transforms mapping 0.0 to 1.0 (prevents overlapping)
  const opacity0 = useTransform(scrollYProgress, [0, 0.25, 0.32, 1], [1, 1, 0, 0]);
  const x0 = useTransform(scrollYProgress, [0, 0.25, 0.32, 1], [0, 0, -40, -40]);
  const scale0 = useTransform(scrollYProgress, [0, 0.25, 0.32, 1], [1, 1, 0.9, 0.9]);
  const display0 = useTransform(scrollYProgress, [0, 0.25, 0.32, 1], ["flex", "flex", "none", "none"]);

  const opacity1 = useTransform(scrollYProgress, [0, 0.26, 0.32, 0.58, 0.65, 1], [0, 0, 1, 1, 0, 0]);
  const x1 = useTransform(scrollYProgress, [0, 0.26, 0.32, 0.58, 0.65, 1], [40, 40, 0, 0, -40, -40]);
  const scale1 = useTransform(scrollYProgress, [0, 0.26, 0.32, 0.58, 0.65, 1], [0.9, 0.9, 1, 1, 0.9, 0.9]);
  const display1 = useTransform(scrollYProgress, [0, 0.26, 0.32, 0.58, 0.65, 1], ["none", "none", "flex", "flex", "none", "none"]);

  const opacity2 = useTransform(scrollYProgress, [0, 0.59, 0.65, 1], [0, 0, 1, 1]);
  const x2 = useTransform(scrollYProgress, [0, 0.59, 0.65, 1], [40, 40, 0, 0]);
  const scale2 = useTransform(scrollYProgress, [0, 0.59, 0.65, 1], [0.9, 0.9, 1, 1]);
  const display2 = useTransform(scrollYProgress, [0, 0.59, 0.65, 1], ["none", "none", "flex", "flex"]);

  // Background glow animation tied to scroll progress
  const glowColor = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 1],
    [
      "radial-gradient(circle at 70% 50%, rgba(253, 244, 141, 0.08), transparent 60%)",
      "radial-gradient(circle at 70% 50%, rgba(122, 247, 247, 0.06), transparent 60%)",
      "radial-gradient(circle at 70% 50%, rgba(131, 245, 130, 0.09), transparent 60%)",
      "radial-gradient(circle at 50% 50%, rgba(223, 254, 0, 0.06), transparent 60%)"
    ]
  );

  if (isDesktop) {
    return (
      <section 
        ref={containerRef}
        className="relative w-full bg-black text-white h-[320vh] z-10"
      >
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

        {/* Dynamic Ambient Spotlights (GPU-driven) */}
        <motion.div 
          style={{ background: glowColor }}
          className="absolute inset-0 pointer-events-none z-[2]"
        />

        {/* Sticky viewport container (keeps visual and copy locked on screen while scrolling) */}
        <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center z-10">
          <div className="max-w-7xl mx-auto px-6 w-full flex flex-row gap-16 items-center justify-between relative">
            
            {/* LEFT NARRATIVE PANEL: Fades text blocks in/out on scroll */}
            <div className="w-[48%] relative h-[400px] flex items-center text-left">
              
              {/* Stage 0: Plan A */}
              <motion.div
                style={{ opacity: opacity0, x: x0, scale: scale0, display: display0 }}
                className="absolute inset-0 flex flex-col justify-center space-y-5"
              >
                <div className="space-y-3">
                  <span className="inline-block bg-[#fff48d]/10 border border-[#fff48d]/25 rounded-lg p-1.5 px-3.5 font-extrabold text-[10px] text-[#fff48d] uppercase tracking-widest">
                    STAGE 01 — PLAN A
                  </span>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-syne font-black uppercase tracking-tight text-white leading-[0.95]">
                    We All Start <br />With Plan A
                  </h2>
                </div>
                <p className="text-slate-300 font-semibold text-base md:text-lg leading-relaxed max-w-lg">
                  We make our first plans with the people closest to us. A cricket match with friends, a movie with siblings, a café visit with your best friend, or a weekend trip with family.
                </p>
                <p className="text-slate-400 font-bold text-sm italic">
                  Those are our first choice—our Plan A.
                </p>
              </motion.div>

              {/* Stage 1: Life Changes */}
              <motion.div
                style={{ opacity: opacity1, x: x1, scale: scale1, display: display1 }}
                className="absolute inset-0 flex flex-col justify-center space-y-5"
              >
                <div className="space-y-3">
                  <span className="inline-block bg-[#7af7f7]/10 border border-[#7af7f7]/25 rounded-lg p-1.5 px-3.5 font-extrabold text-[10px] text-[#7af7f7] uppercase tracking-widest">
                    STAGE 02 — LIFE CHANGES
                  </span>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-syne font-black uppercase tracking-tight text-white leading-[0.95]">
                    But Life <br />Moves Forward
                  </h2>
                </div>
                <p className="text-slate-300 font-semibold text-base md:text-lg leading-relaxed max-w-lg">
                  College takes us to a new city. Work brings us somewhere unfamiliar. Friends become busy with their own routines. Family lives far away.
                </p>
                <p className="text-slate-400 font-bold text-sm italic">
                  Suddenly, the plans are still there... but the people aren't.
                </p>
              </motion.div>

              {/* Stage 2: Plan B */}
              <motion.div
                style={{ opacity: opacity2, x: x2, scale: scale2, display: display2 }}
                className="absolute inset-0 flex flex-col justify-center space-y-5"
              >
                <div className="space-y-3">
                  <span className="inline-block bg-[#DFFE00]/10 border border-[#DFFE00]/25 rounded-lg p-1.5 px-3.5 font-extrabold text-[10px] text-[#DFFE00] uppercase tracking-widest">
                    STAGE 03 — PLAN B
                  </span>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-syne font-black uppercase tracking-tight text-white leading-[0.95]">
                    That's Where <br />Plan B Begins
                  </h2>
                </div>
                <p className="text-slate-300 font-semibold text-base md:text-lg leading-relaxed max-w-lg">
                  Plan B helps you find people who share your interests, so you never have to cancel an experience just because you don't have someone to share it with.
                </p>
                <p className="text-slate-400 font-bold text-sm italic">
                  Because great memories shouldn't depend on whether your usual group is available.
                </p>
              </motion.div>

            </div>

            {/* RIGHT VISUAL PANEL: Abstract premium glowing mockups */}
            <div className="w-[48%] h-[480px] relative flex items-center justify-center">
              
              {/* Visual Container Frame */}
              <div className="w-full max-w-md aspect-square relative flex items-center justify-center bg-white/5 rounded-[40px] border border-white/10 p-8 backdrop-blur-md shadow-2xl overflow-hidden">
                
                {/* STAGE 0 GRAPHIC */}
                <motion.div
                  style={{ opacity: opacity0, scale: scale0, display: display0 }}
                  className="absolute inset-0 flex items-center justify-center p-8"
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="22" stroke="#fff48d" strokeWidth="3" fill="#fdad70" />
                    <path d="M100 93c-1.5-3-5-3-6.5 0l6.5 7 6.5-7c-1.5-3-5-3-6.5 0z" fill="black" />

                    <line x1="100" y1="100" x2="50" y2="60" stroke="#fff48d" strokeWidth="2.5" />
                    <circle cx="50" cy="60" r="16" stroke="black" strokeWidth="3" fill="white" />
                    <text x="45" y="65" fontSize="14" fill="black">🏏</text>

                    <line x1="100" y1="100" x2="150" y2="60" stroke="#fff48d" strokeWidth="2.5" />
                    <circle cx="150" cy="60" r="16" stroke="black" strokeWidth="3" fill="white" />
                    <text x="145" y="65" fontSize="14" fill="black">🍿</text>

                    <line x1="100" y1="100" x2="55" y2="140" stroke="#fff48d" strokeWidth="2.5" />
                    <circle cx="55" cy="140" r="16" stroke="black" strokeWidth="3" fill="white" />
                    <text x="50" y="145" fontSize="14" fill="black">☕</text>

                    <line x1="100" y1="100" x2="145" y2="140" stroke="#fff48d" strokeWidth="2.5" />
                    <circle cx="145" cy="140" r="16" stroke="black" strokeWidth="3" fill="white" />
                    <text x="140" y="145" fontSize="14" fill="black">🚗</text>

                    <circle cx="100" cy="100" r="75" stroke="#fff48d" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.3" />
                  </svg>
                </motion.div>

                {/* STAGE 1 GRAPHIC */}
                <motion.div
                  style={{ opacity: opacity1, scale: scale1, display: display1 }}
                  className="absolute inset-0 flex items-center justify-center p-8"
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="22" stroke="#7af7f7" strokeWidth="3" fill="#1e293b" />
                    <path d="M100 92v10M100 108v2" stroke="#7af7f7" strokeWidth="3" strokeLinecap="round" />

                    <circle cx="35" cy="40" r="14" stroke="black" strokeWidth="2" fill="white" opacity="0.25" />
                    <text x="30" y="45" fontSize="12" opacity="0.2">🏏</text>

                    <circle cx="165" cy="35" r="14" stroke="black" strokeWidth="2" fill="white" opacity="0.25" />
                    <text x="160" y="40" fontSize="12" opacity="0.2">🍿</text>

                    <circle cx="30" cy="160" r="14" stroke="black" strokeWidth="2" fill="white" opacity="0.25" />
                    <text x="25" y="165" fontSize="12" opacity="0.2">☕</text>

                    <circle cx="170" cy="165" r="14" stroke="black" strokeWidth="2" fill="white" opacity="0.25" />
                    <text x="165" y="170" fontSize="12" opacity="0.2">🚗</text>

                    <path d="M85 88L55 72" stroke="#7af7f7" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.2" />
                    <path d="M115 88L145 74" stroke="#7af7f7" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.2" />
                    
                    <circle cx="100" cy="100" r="40" stroke="#7af7f7" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
                  </svg>
                </motion.div>

                {/* STAGE 2 GRAPHIC */}
                <motion.div
                  style={{ opacity: opacity2, scale: scale2, display: display2 }}
                  className="absolute inset-0 flex items-center justify-center p-8"
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="22" stroke="#83f582" strokeWidth="3" fill="#DFFE00" />
                    <circle cx="100" cy="100" r="7" stroke="black" strokeWidth="2" />
                    <path d="M100 93l3 7-3 3-3-3z" fill="black" />

                    <line x1="100" y1="100" x2="60" y2="55" stroke="#83f582" strokeWidth="3" />
                    <line x1="100" y1="100" x2="145" y2="60" stroke="#83f582" strokeWidth="3" />
                    <line x1="100" y1="100" x2="50" y2="135" stroke="#83f582" strokeWidth="3" />
                    <line x1="100" y1="100" x2="150" y2="130" stroke="#83f582" strokeWidth="3" />
                    
                    <line x1="60" y1="55" x2="145" y2="60" stroke="#83f582" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                    <line x1="50" y1="135" x2="150" y2="130" stroke="#83f582" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

                    <circle cx="60" cy="55" r="15" stroke="black" strokeWidth="2.5" fill="white" />
                    <text x="55" y="60" fontSize="13">🎮</text>

                    <circle cx="145" cy="60" r="15" stroke="black" strokeWidth="2.5" fill="white" />
                    <text x="140" y="65" fontSize="13">✈️</text>

                    <circle cx="50" cy="135" r="15" stroke="black" strokeWidth="2.5" fill="white" />
                    <text x="45" y="140" fontSize="13">🎨</text>

                    <circle cx="150" cy="130" r="15" stroke="black" strokeWidth="2.5" fill="white" />
                    <text x="145" y="135" fontSize="13">🏃‍♂️</text>

                    <circle cx="100" cy="100" r="70" stroke="#83f582" strokeWidth="1.5" opacity="0.45" />
                  </svg>
                </motion.div>

              </div>
            </div>

          </div>
        </div>

        {/* Large takeaway quote closing the story section */}
        <div className="relative w-full h-[50vh] flex items-center justify-center z-10 bg-black">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6 flex flex-col items-center">
            <div className="h-14 w-14 rounded-full bg-[#DFFE00]/10 border border-[#DFFE00]/25 flex items-center justify-center text-[#DFFE00]">
              <Quote className="h-6 w-6 rotate-180" />
            </div>
            <blockquote className="text-3xl md:text-5xl font-syne font-black uppercase tracking-tight text-white leading-tight">
              "Sometimes life changes your plans. <br />
              Plan B helps you find the <span className="text-[#DFFE00] text-neon-glow">people to make new ones.</span>"
            </blockquote>
            <div className="w-20 h-[4px] bg-[#DFFE00] rounded-full mt-6" />
          </div>
        </div>
      </section>
    );
  } else {
    // Beautiful, clean mobile/tablet layout without absolute overlapping layers
    return (
      <section className="relative w-full overflow-hidden bg-black text-white py-20 px-6 z-10">
        {/* Background Loop Video specifically fitted and styled for this section */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-[0.35] mix-blend-screen z-0"
          >
            <source src="/background-video-2.mp4" type="video/mp4" />
            <source src="/background-video-2.webm" type="video/webm" />
          </video>
          {/* Blurring glass layer to blend text overlay */}
          <div className="absolute inset-0 w-full h-full backdrop-blur-[4px] bg-black/70 z-[1]" />
        </div>

        <div className="max-w-3xl mx-auto space-y-16 relative z-10">
          {/* Header Title block */}
          <div className="space-y-3 text-center">
            <span className="inline-block bg-[#DFFE00]/10 border border-[#DFFE00]/25 rounded-lg p-1.5 px-3.5 font-extrabold text-[10px] text-[#DFFE00] uppercase tracking-widest">
              OUR STORY
            </span>
            <h2 className="text-4xl md:text-5xl font-syne font-black uppercase tracking-tight text-white leading-[0.95]">
              Why Plan B?
            </h2>
          </div>

          {/* Cards Loop */}
          <div className="space-y-12">
            {storyStages.map((stage, idx) => {
              const borderTheme = idx === 0 ? "border-[#fff48d]/30" : idx === 1 ? "border-[#7af7f7]/30" : "border-[#83f582]/30";
              const tagBg = idx === 0 ? "text-[#fff48d] bg-[#fff48d]/10 border-[#fff48d]/20" : idx === 1 ? "text-[#7af7f7] bg-[#7af7f7]/10 border-[#7af7f7]/20" : "text-[#83f582] bg-[#83f582]/10 border-[#83f582]/20";

              return (
                <div key={idx} className={`glass-card p-6 md:p-8 rounded-[28px] border-2 ${borderTheme} space-y-6 flex flex-col md:flex-row gap-6 items-center text-left`}>
                  {/* Left block: details */}
                  <div className="flex-1 space-y-4">
                    <span className={`inline-block text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded border ${tagBg}`}>
                      {stage.badge}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-syne font-extrabold uppercase tracking-tight text-white leading-tight">
                      {stage.subtitle}
                    </h3>
                    <ul className="space-y-2 pl-0">
                      {stage.bullets.map((b, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-slate-350 font-bold text-sm md:text-base">
                          <span>{b.emoji}</span>
                          <span>{b.text}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-slate-400 font-semibold text-xs md:text-sm italic pt-1">
                      {stage.footer}
                    </p>
                  </div>

                  {/* Right block: illustration */}
                  <div className="w-40 h-40 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-center shrink-0">
                    {stage.illustration}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Centered Takeaway Quote */}
          <div className="space-y-6 text-center border-t border-white/10 pt-16 flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-[#DFFE00]/10 border border-[#DFFE00]/25 flex items-center justify-center text-[#DFFE00]">
              <Quote className="h-5 w-5 rotate-180" />
            </div>
            <blockquote className="text-2xl md:text-3xl font-syne font-extrabold uppercase tracking-tight text-white leading-tight">
              "Sometimes life changes your plans. <br />
              Plan B helps you find the <span className="text-[#DFFE00] text-neon-glow">people to make new ones.</span>"
            </blockquote>
          </div>
        </div>
      </section>
    );
  }
};

export default WhyPlanBSection;
