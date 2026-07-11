import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Quote } from 'lucide-react';

const WhyPlanBSection = () => {
  const containerRef = useRef(null);

  // Set up scroll tracking for the entire section (250vh scroll duration)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // GPU-accelerated transforms for Stage 0 (Plan A)
  const opacity0 = useTransform(scrollYProgress, [0, 0.22, 0.28], [1, 1, 0]);
  const x0 = useTransform(scrollYProgress, [0, 0.22, 0.28], [0, 0, -40]);
  const scale0 = useTransform(scrollYProgress, [0, 0.22, 0.28], [1, 1, 0.9]);

  // GPU-accelerated transforms for Stage 1 (Life Changes)
  const opacity1 = useTransform(scrollYProgress, [0.26, 0.32, 0.58, 0.64], [0, 1, 1, 0]);
  const x1 = useTransform(scrollYProgress, [0.26, 0.32, 0.58, 0.64], [40, 0, 0, -40]);
  const scale1 = useTransform(scrollYProgress, [0.26, 0.32, 0.58, 0.64], [0.9, 1, 1, 0.9]);

  // GPU-accelerated transforms for Stage 2 (Plan B)
  const opacity2 = useTransform(scrollYProgress, [0.62, 0.68, 0.95], [0, 1, 1]);
  const x2 = useTransform(scrollYProgress, [0.62, 0.68, 0.95], [40, 0, 0]);
  const scale2 = useTransform(scrollYProgress, [0.62, 0.68, 0.95], [0.9, 1, 1]);

  // Background glow animation tied to scroll progress
  const glowColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 0.8],
    [
      "radial-gradient(circle at 70% 50%, rgba(253, 244, 141, 0.08), transparent 60%)",
      "radial-gradient(circle at 70% 50%, rgba(122, 247, 247, 0.06), transparent 60%)",
      "radial-gradient(circle at 70% 50%, rgba(131, 245, 130, 0.09), transparent 60%)",
      "radial-gradient(circle at 50% 50%, rgba(223, 254, 0, 0.06), transparent 60%)"
    ]
  );

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
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row gap-12 lg:gap-16 items-center justify-between relative">
          
          {/* LEFT NARRATIVE PANEL: Fades text blocks in/out on scroll */}
          <div className="w-full lg:w-[48%] relative min-h-[380px] flex items-center text-left">
            
            {/* Stage 0: Plan A */}
            <motion.div
              style={{ opacity: opacity0, x: x0, scale: scale0 }}
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
              style={{ opacity: opacity1, x: x1, scale: scale1 }}
              className="absolute inset-0 flex flex-col justify-center space-y-5 pointer-events-none"
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
              style={{ opacity: opacity2, x: x2, scale: scale2 }}
              className="absolute inset-0 flex flex-col justify-center space-y-5 pointer-events-none"
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
          <div className="w-full lg:w-[48%] h-[320px] md:h-[400px] lg:h-[480px] relative flex items-center justify-center">
            
            {/* Visual Container Frame */}
            <div className="w-full max-w-sm md:max-w-md aspect-square relative flex items-center justify-center bg-white/5 rounded-[40px] border border-white/10 p-8 backdrop-blur-md shadow-2xl overflow-hidden">
              
              {/* STAGE 0 GRAPHIC: Concentrated, closed-loop network (Friends/Family) */}
              <motion.div
                style={{ opacity: opacity0, scale: scale0 }}
                className="absolute inset-0 flex items-center justify-center p-8"
              >
                <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Central Node (Warm Orange) */}
                  <circle cx="100" cy="100" r="22" stroke="#fff48d" strokeWidth="3" fill="#fdad70" />
                  <path d="M100 93c-1.5-3-5-3-6.5 0l6.5 7 6.5-7c-1.5-3-5-3-6.5 0z" fill="black" />

                  {/* Connected Outer Nodes */}
                  {/* Friend 1 (Cricket) */}
                  <line x1="100" y1="100" x2="50" y2="60" stroke="#fff48d" strokeWidth="2.5" />
                  <circle cx="50" cy="60" r="16" stroke="black" strokeWidth="3" fill="white" />
                  <text x="45" y="65" fontSize="14" fill="black">🏏</text>

                  {/* Friend 2 (Movie) */}
                  <line x1="100" y1="100" x2="150" y2="60" stroke="#fff48d" strokeWidth="2.5" />
                  <circle cx="150" cy="60" r="16" stroke="black" strokeWidth="3" fill="white" />
                  <text x="145" y="65" fontSize="14" fill="black">🍿</text>

                  {/* Friend 3 (Cafe) */}
                  <line x1="100" y1="100" x2="55" y2="140" stroke="#fff48d" strokeWidth="2.5" />
                  <circle cx="55" cy="140" r="16" stroke="black" strokeWidth="3" fill="white" />
                  <text x="50" y="145" fontSize="14" fill="black">☕</text>

                  {/* Friend 4 (Trip) */}
                  <line x1="100" y1="100" x2="145" y2="140" stroke="#fff48d" strokeWidth="2.5" />
                  <circle cx="145" cy="140" r="16" stroke="black" strokeWidth="3" fill="white" />
                  <text x="140" y="145" fontSize="14" fill="black">🚗</text>

                  {/* Halo */}
                  <circle cx="100" cy="100" r="75" stroke="#fff48d" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.3" />
                </svg>
              </motion.div>

              {/* STAGE 1 GRAPHIC: Scattered, drifting network (Alone in new city) */}
              <motion.div
                style={{ opacity: opacity1, scale: scale1 }}
                className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none"
              >
                <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Central Node (Dimmed, Blue-Grey) */}
                  <circle cx="100" cy="100" r="22" stroke="#7af7f7" strokeWidth="3" fill="#1e293b" />
                  {/* Isolated/Alert Icon */}
                  <path d="M100 92v10M100 108v2" stroke="#7af7f7" strokeWidth="3" strokeLinecap="round" />

                  {/* Drifting, disconnected outer nodes */}
                  {/* Friend 1 (Drifted top-left) */}
                  <circle cx="35" cy="40" r="14" stroke="black" strokeWidth="2" fill="white" opacity="0.25" />
                  <text x="30" y="45" fontSize="12" opacity="0.2">🏏</text>

                  {/* Friend 2 (Drifted top-right) */}
                  <circle cx="165" cy="35" r="14" stroke="black" strokeWidth="2" fill="white" opacity="0.25" />
                  <text x="160" y="40" fontSize="12" opacity="0.2">🍿</text>

                  {/* Friend 3 (Drifted bottom-left) */}
                  <circle cx="30" cy="160" r="14" stroke="black" strokeWidth="2" fill="white" opacity="0.25" />
                  <text x="25" y="165" fontSize="12" opacity="0.2">☕</text>

                  {/* Friend 4 (Drifted bottom-right) */}
                  <circle cx="170" cy="165" r="14" stroke="black" strokeWidth="2" fill="white" opacity="0.25" />
                  <text x="165" y="170" fontSize="12" opacity="0.2">🚗</text>

                  {/* Broken paths indicators */}
                  <path d="M85 88L55 72" stroke="#7af7f7" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.2" />
                  <path d="M115 88L145 74" stroke="#7af7f7" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.2" />
                  
                  {/* Lone focus spotlight */}
                  <circle cx="100" cy="100" r="40" stroke="#7af7f7" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
                </svg>
              </motion.div>

              {/* STAGE 2 GRAPHIC: New, interconnected mesh network (Plan B) */}
              <motion.div
                style={{ opacity: opacity2, scale: scale2 }}
                className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none"
              >
                <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Central Node (Glowing Green/Yellow) */}
                  <circle cx="100" cy="100" r="22" stroke="#83f582" strokeWidth="3" fill="#DFFE00" />
                  {/* Compass/Connect Icon */}
                  <circle cx="100" cy="100" r="7" stroke="black" strokeWidth="2" />
                  <path d="M100 93l3 7-3 3-3-3z" fill="black" />

                  {/* New glowing connection web */}
                  {/* Connections */}
                  <line x1="100" y1="100" x2="60" y2="55" stroke="#83f582" strokeWidth="3" />
                  <line x1="100" y1="100" x2="145" y2="60" stroke="#83f582" strokeWidth="3" />
                  <line x1="100" y1="100" x2="50" y2="135" stroke="#83f582" strokeWidth="3" />
                  <line x1="100" y1="100" x2="150" y2="130" stroke="#83f582" strokeWidth="3" />
                  
                  <line x1="60" y1="55" x2="145" y2="60" stroke="#83f582" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="50" y1="135" x2="150" y2="130" stroke="#83f582" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

                  {/* Spark 1 */}
                  <circle cx="60" cy="55" r="15" stroke="black" strokeWidth="2.5" fill="white" />
                  <text x="55" y="60" fontSize="13">🎮</text>

                  {/* Spark 2 */}
                  <circle cx="145" cy="60" r="15" stroke="black" strokeWidth="2.5" fill="white" />
                  <text x="140" y="65" fontSize="13">✈️</text>

                  {/* Spark 3 */}
                  <circle cx="50" cy="135" r="15" stroke="black" strokeWidth="2.5" fill="white" />
                  <text x="45" y="140" fontSize="13">🎨</text>

                  {/* Spark 4 */}
                  <circle cx="150" cy="130" r="15" stroke="black" strokeWidth="2.5" fill="white" />
                  <text x="145" y="135" fontSize="13">🏃‍♂️</text>

                  {/* Glow rings */}
                  <circle cx="100" cy="100" r="70" stroke="#83f582" strokeWidth="1.5" opacity="0.45" />
                </svg>
              </motion.div>

            </div>
          </div>

        </div>
      </div>

      {/* FOOTER: Takeaway Quote Section (Centered and styled emotionally) */}
      <div className="relative w-full h-[60vh] flex items-center justify-center z-10 bg-black">
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
};

export default WhyPlanBSection;
