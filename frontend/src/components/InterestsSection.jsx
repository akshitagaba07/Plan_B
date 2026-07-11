import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  const containerRef = useRef(null);
  
  // Check if viewport is desktop width
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Calculate y translation offsets dynamically.
  // When stacked: offset is only 45px per card (only corners/headers visible).
  // When scrolled/revealed: offset increases to 270px per card (fully fanning out).
  const y0 = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.25, 0.45, 1], [45, 45, 270, 270]);
  const y2 = useTransform(scrollYProgress, [0, 0.25, 0.45, 0.65, 1], [90, 90, 315, 540, 540]);
  const y3 = useTransform(scrollYProgress, [0, 0.25, 0.45, 0.65, 0.85, 1], [135, 135, 360, 585, 810, 810]);

  const yTransforms = [y0, y1, y2, y3];

  return (
    <section 
      ref={containerRef}
      className={`relative w-full overflow-hidden py-24 z-10 ${isDesktop ? 'h-[250vh]' : ''}`}
    >
      {/* Background Soft Glow Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-purple-900/10 filter blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] rounded-full bg-[#DFFE00]/5 filter blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start relative h-full">
        
        {/* Left Column: Sticky Headers */}
        <div className="w-full lg:w-[35%] lg:sticky lg:top-36 h-fit text-left space-y-4">
          <span className="inline-block bg-[#DFFE00]/10 border border-[#DFFE00]/25 rounded-lg p-1.5 px-3.5 font-extrabold text-[10px] text-[#DFFE00] uppercase tracking-widest">
            WHY PLAN B
          </span>
          <h2 className="text-4xl md:text-5xl font-syne font-black uppercase tracking-tight text-white leading-[0.95]">
            Built Around <br className="hidden lg:block" />
            Your Interests
          </h2>
          <p className="text-slate-400 font-semibold text-sm leading-relaxed max-w-md">
            Whether you're looking for teammates, travel companions, study partners, or meet people with similar vibes, Plan B matches you based on your interests.
          </p>
        </div>

        {/* Right Column: Sticky Timeline Cards Stacking on Scroll */}
        <div className={`w-full lg:w-[60%] relative ${isDesktop ? 'lg:sticky lg:top-36 h-[1100px]' : ''}`}>
          
          {/* Vertical Path Line (Mobile/Tablet only) */}
          {!isDesktop && (
            <div className="absolute left-6 top-4 bottom-4 w-[3px] bg-white/10" />
          )}

          {/* Cards Stack */}
          <div className="relative w-full h-full">
            {cardsData.map((card, idx) => {
              const isEven = idx % 2 === 0;
              const isLast = idx === cardsData.length - 1;
              const zIndexVal = (4 - idx) * 10; // First card has highest z-index so it sits on top

              if (isDesktop) {
                return (
                  <motion.div
                    key={idx}
                    className="absolute w-full top-0 left-0"
                    style={{
                      y: yTransforms[idx],
                      zIndex: zIndexVal
                    }}
                  >
                    <div
                      className={`group border-[3px] border-black bg-gradient-to-r ${card.gradient} rounded-[24px] p-6 md:p-8 text-[#1d1c1c] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer relative overflow-hidden flex flex-col md:flex-row gap-6 md:gap-8 items-center ${isEven ? '-rotate-[1.2deg] hover:-rotate-0' : 'rotate-[1.2deg] hover:rotate-0'}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`Interest group ${idx + 1}: ${card.title}. ${card.desc}`}
                    >
                      {/* Left Side: Large Vector Illustration */}
                      <div className="w-full md:w-[30%] flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                        {card.illustration}
                      </div>

                      {/* Right Side: Copy & Actions */}
                      <div className="w-full md:w-[70%] flex flex-col justify-between h-full min-h-[130px] text-left">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-syne font-black text-xl md:text-2xl uppercase tracking-tighter text-black leading-tight">
                              {card.title}
                            </h3>
                            <span className="text-2xl select-none" role="img" aria-hidden="true">
                              {card.emoji}
                            </span>
                          </div>
                          <p className="text-slate-800 text-xs md:text-sm font-bold leading-relaxed">
                            {card.desc}
                          </p>
                        </div>

                        {/* Action Footer */}
                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-black/10 group-hover:border-black/25 transition-colors duration-300">
                          <span className="text-xs font-black uppercase tracking-wider text-black">
                            Find Sparks
                          </span>
                          <div className="h-8 w-8 rounded-full border-2 border-black bg-white flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all duration-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none">
                            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              } else {
                // Mobile list view
                return (
                  <div 
                    key={idx}
                    className={`w-full relative pl-12 ${!isLast ? 'mb-8' : ''}`}
                  >
                    {/* Left-Aligned Number Badge on the line */}
                    <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-[3px] border-black bg-white text-black font-black text-sm flex items-center justify-center z-20 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {idx + 1}
                    </div>

                    <div
                      className={`group border-[3px] border-black bg-gradient-to-r ${card.gradient} rounded-[24px] p-6 text-[#1d1c1c] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col gap-6 items-center`}
                    >
                      {/* Left Side: Large Vector Illustration */}
                      <div className="w-full flex items-center justify-center">
                        {card.illustration}
                      </div>

                      {/* Right Side: Copy & Actions */}
                      <div className="w-full flex flex-col justify-between text-left">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-syne font-black text-xl uppercase tracking-tighter text-black leading-tight">
                              {card.title}
                            </h3>
                            <span className="text-2xl select-none">
                              {card.emoji}
                            </span>
                          </div>
                          <p className="text-slate-800 text-xs font-bold leading-relaxed">
                            {card.desc}
                          </p>
                        </div>

                        {/* Action Footer */}
                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-black/10">
                          <span className="text-xs font-black uppercase tracking-wider text-black">
                            Find Sparks
                          </span>
                          <div className="h-8 w-8 rounded-full border-2 border-black bg-white flex items-center justify-center text-black">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InterestsSection;
