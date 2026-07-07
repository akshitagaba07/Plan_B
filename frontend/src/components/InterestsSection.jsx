import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const cardsData = [
  {
    emoji: "🏀",
    title: "Sports Partner",
    desc: "Find teammates for football, badminton, cricket, basketball, tennis or any sport nearby.",
    gradient: "from-[#83f582] to-[#7af7f7]", // Wero Green to Cyan
    illustration: (
      <svg viewBox="0 0 120 120" className="w-32 h-32 md:w-40 md:h-40 select-none pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Sports Ball (Basketball/Soccer hybrid) */}
        <circle cx="60" cy="60" r="42" stroke="black" strokeWidth="3.5" fill="white" />
        <path d="M30 30C45 45 45 75 30 90" stroke="black" strokeWidth="3.5" />
        <path d="M90 30C75 45 75 75 90 90" stroke="black" strokeWidth="3.5" />
        <line x1="60" y1="18" x2="60" y2="102" stroke="black" strokeWidth="3.5" />
        <line x1="18" y1="60" x2="102" y2="60" stroke="black" strokeWidth="3.5" />
        {/* Whistle */}
        <rect x="75" y="70" width="25" height="15" rx="4" stroke="black" strokeWidth="3" fill="#fd74fd" transform="rotate(-15 75 70)" />
        <path d="M95 72h10v6h-10z" stroke="black" strokeWidth="3" fill="black" transform="rotate(-15 75 70)" />
      </svg>
    )
  },
  {
    emoji: "💪",
    title: "Workout Buddy",
    desc: "Stay consistent by finding someone to train, run, cycle or hit the gym with.",
    gradient: "from-[#fd97fd] to-[#fdad70]", // Wero Pink to Orange
    illustration: (
      <svg viewBox="0 0 120 120" className="w-32 h-32 md:w-40 md:h-40 select-none pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Kettlebell */}
        <path d="M35 60h50v35a10 10 0 01-10 10H45a10 10 0 01-10-10V60z" stroke="black" strokeWidth="3.5" fill="white" />
        <path d="M45 60V40a15 15 0 0130 0v20" stroke="black" strokeWidth="3.5" fill="none" />
        {/* Dumbbell */}
        <rect x="25" y="75" width="70" height="8" rx="2" stroke="black" strokeWidth="3.5" fill="black" />
        <rect x="20" y="65" width="12" height="28" rx="3" stroke="black" strokeWidth="3.5" fill="#83f582" />
        <rect x="88" y="65" width="12" height="28" rx="3" stroke="black" strokeWidth="3.5" fill="#83f582" />
      </svg>
    )
  },
  {
    emoji: "☕",
    title: "Explore the City",
    desc: "Visit cafés, restaurants, bowling alleys, malls and hidden gems with like-minded people.",
    gradient: "from-[#fff48d] to-[#fdad70]", // Wero Yellow to Orange
    illustration: (
      <svg viewBox="0 0 120 120" className="w-32 h-32 md:w-40 md:h-40 select-none pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Coffee Mug */}
        <rect x="30" y="45" width="50" height="50" rx="10" stroke="black" strokeWidth="3.5" fill="white" />
        <path d="M80 55c10 0 15 5 15 12s-5 12-15 12" stroke="black" strokeWidth="3.5" fill="none" />
        {/* Location Pin */}
        <path d="M80 20c-10 0-18 8-18 18 0 12 18 27 18 27s18-15 18-27c0-10-8-18-18-18z" stroke="black" strokeWidth="3.5" fill="#7af7f7" />
        <circle cx="80" cy="38" r="6" stroke="black" strokeWidth="3.5" fill="white" />
      </svg>
    )
  },
  {
    emoji: "🎬",
    title: "Entertainment",
    desc: "Watch movies, attend concerts, gaming events, stand-up shows or festivals together.",
    gradient: "from-[#7af7f7] to-[#fd97fd]", // Wero Cyan to Pink
    illustration: (
      <svg viewBox="0 0 120 120" className="w-32 h-32 md:w-40 md:h-40 select-none pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Cinema Ticket */}
        <rect x="25" y="40" width="70" height="42" rx="4" stroke="black" strokeWidth="3.5" fill="white" />
        <circle cx="25" cy="61" r="8" stroke="black" strokeWidth="3.5" fill="#fdad70" />
        <circle cx="95" cy="61" r="8" stroke="black" strokeWidth="3.5" fill="#fdad70" />
        <line x1="45" y1="40" x2="45" y2="82" stroke="black" strokeWidth="3.5" strokeDasharray="4 4" />
        {/* Movie Clapperboard */}
        <rect x="40" y="62" width="45" height="35" rx="4" stroke="black" strokeWidth="3.5" fill="#83f582" />
        <rect x="37" y="52" width="51" height="10" stroke="black" strokeWidth="3.5" fill="black" transform="rotate(-10 37 52)" />
      </svg>
    )
  },
  {
    emoji: "📚",
    title: "Study Together",
    desc: "Find coding partners, project teammates, accountability partners or study groups.",
    gradient: "from-[#83f582] to-[#fff48d]", // Wero Green to Yellow
    illustration: (
      <svg viewBox="0 0 120 120" className="w-32 h-32 md:w-40 md:h-40 select-none pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Open Book */}
        <path d="M15 85V35c15 0 25-10 45-10v50c-20 0-30 10-45 10z" stroke="black" strokeWidth="3.5" fill="white" />
        <path d="M105 85V35c-15 0-25-10-45-10v50c20 0 30 10 45 10z" stroke="black" strokeWidth="3.5" fill="white" />
        {/* Lightbulb */}
        <path d="M60 20c-12 0-20 8-20 18 0 8 5 13 8 16v8h24v-8c3-3 8-8 8-16 0-10-8-18-20-18z" stroke="black" strokeWidth="3.5" fill="#7af7f7" />
        <rect x="52" y="62" width="16" height="5" stroke="black" strokeWidth="3.5" fill="black" />
      </svg>
    )
  },
  {
    emoji: "🧳",
    title: "Travel Companion",
    desc: "Plan weekend trips, treks and adventures with verified people sharing your destination.",
    gradient: "from-[#fdad70] to-[#fd74fd]", // Wero Orange to Purple
    illustration: (
      <svg viewBox="0 0 120 120" className="w-32 h-32 md:w-40 md:h-40 select-none pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Suitcase / Luggage */}
        <rect x="35" y="45" width="50" height="55" rx="8" stroke="black" strokeWidth="3.5" fill="white" />
        <path d="M50 45V30h20v15" stroke="black" strokeWidth="3.5" fill="none" />
        <rect x="42" y="55" width="8" height="35" rx="2" stroke="black" strokeWidth="3.5" fill="#83f582" />
        <rect x="70" y="55" width="8" height="35" rx="2" stroke="black" strokeWidth="3.5" fill="#83f582" />
        {/* Compass */}
        <circle cx="85" cy="40" r="18" stroke="black" strokeWidth="3.5" fill="#7af7f7" />
        <path d="M85 30l4 10h-8z" stroke="black" strokeWidth="3.5" fill="black" />
        <path d="M85 50l4-10h-8z" stroke="black" strokeWidth="3.5" fill="white" />
      </svg>
    )
  },
  {
    emoji: "🎨",
    title: "Learn Something New",
    desc: "Meet people interested in photography, dancing, cooking, art, music and many other hobbies.",
    gradient: "from-[#7af7f7] to-[#83f582]", // Wero Cyan to Green
    illustration: (
      <svg viewBox="0 0 120 120" className="w-32 h-32 md:w-40 md:h-40 select-none pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Art Palette */}
        <path d="M30 80c-15-15 0-55 35-55s40 10 40 35-15 35-35 35c-10 0-15-5-20-5s-10 5-20 0z" stroke="black" strokeWidth="3.5" fill="white" />
        <circle cx="45" cy="42" r="5" stroke="black" strokeWidth="3.5" fill="#fd74fd" />
        <circle cx="65" cy="38" r="5" stroke="black" strokeWidth="3.5" fill="#fdad70" />
        <circle cx="82" cy="50" r="5" stroke="black" strokeWidth="3.5" fill="#fff48d" />
        <circle cx="50" cy="72" r="6" stroke="black" strokeWidth="3.5" fill="black" /> {/* Thumb hole */}
        {/* Paintbrush */}
        <line x1="20" y1="100" x2="70" y2="50" stroke="black" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M15 105c-3-3 2-12 5-15s12-2 15 5c0 0-17 13-20 10z" stroke="black" strokeWidth="3.5" fill="#fdad70" />
      </svg>
    )
  },
  {
    emoji: "🤝",
    title: "Just Need Company",
    desc: "Sometimes all you need is someone to grab coffee, go for a walk or simply enjoy good conversations.",
    gradient: "from-[#fd97fd] to-[#fff48d]", // Wero Pink to Yellow
    illustration: (
      <svg viewBox="0 0 120 120" className="w-32 h-32 md:w-40 md:h-40 select-none pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Two Chat Bubbles */}
        <rect x="25" y="35" width="50" height="35" rx="8" stroke="black" strokeWidth="3.5" fill="white" />
        <path d="M35 70l-8 8v-8" stroke="black" strokeWidth="3.5" fill="white" />
        
        <rect x="52" y="55" width="48" height="32" rx="8" stroke="black" strokeWidth="3.5" fill="#7af7f7" />
        <path d="M85 87l8 8v-8" stroke="black" strokeWidth="3.5" fill="#7af7f7" />
        {/* Smiles inside bubbles */}
        <path d="M40 52c5 4 15 4 20 0" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M68 70c4 3 12 3 16 0" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    )
  }
];

const InterestsSection = () => {
  return (
    <section className="relative w-full overflow-hidden py-24 z-10">
      {/* Background Soft Glow Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-purple-900/10 filter blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] rounded-full bg-[#DFFE00]/5 filter blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start relative">
        
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
            Whether you're looking for teammates, travel companions, study partners, or simply someone to explore the city with, Plan B helps you connect with people who share your interests.
          </p>
        </div>

        {/* Right Column: Sticky Timeline Cards Stacking on Scroll */}
        <div className="w-full lg:w-[60%] pl-12 lg:pl-16 relative">
          {/* Vertical Path Line on the Left (Wero style) */}
          <div className="absolute left-6 lg:left-0 top-4 bottom-4 w-[3px] bg-white/10" />

          {/* Cards Stack */}
          <div className="relative pb-20">
            {cardsData.map((card, idx) => {
              const isEven = idx % 2 === 0;
              // Calculate progressive sticky top coordinates so the cards stack neatly and overlap
              const stickyTopOffset = 130 + idx * 16;

              return (
                <div 
                  key={idx}
                  className={`sticky w-full ${idx > 0 ? 'mt-[-35px] lg:mt-[-55px]' : ''}`}
                  style={{ 
                    top: `${stickyTopOffset}px`, 
                    zIndex: (idx + 1) * 10 
                  }}
                >
                  {/* Left-Aligned Number Badge on the line */}
                  <div className="absolute left-[-42px] lg:left-[-76px] top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-[3px] border-black bg-white text-black font-black text-sm flex items-center justify-center z-20 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {idx + 1}
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                  >
                    <div
                      className={`group border-[3px] border-black bg-gradient-to-r ${card.gradient} rounded-[24px] p-8 md:p-10 text-[#1d1c1c] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer relative overflow-hidden flex flex-col md:flex-row gap-6 md:gap-10 items-center ${isEven ? '-rotate-[1.2deg] hover:-rotate-0' : 'rotate-[1.2deg] hover:rotate-0'}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`Interest group ${idx + 1}: ${card.title}. ${card.desc}`}
                    >
                      {/* Left Side: Large Vector Illustration */}
                      <div className="w-full md:w-[35%] flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                        {card.illustration}
                      </div>

                      {/* Right Side: Copy & Actions */}
                      <div className="w-full md:w-[65%] flex flex-col justify-between h-full min-h-[180px] text-left">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-syne font-black text-2xl md:text-3xl uppercase tracking-tighter text-black leading-tight">
                              {card.title}
                            </h3>
                            <span className="text-2xl select-none" role="img" aria-hidden="true">
                              {card.emoji}
                            </span>
                          </div>
                          <p className="text-slate-800 text-sm font-bold leading-relaxed">
                            {card.desc}
                          </p>
                        </div>

                        {/* Action Footer */}
                        <div className="flex items-center justify-between pt-6 mt-6 border-t border-black/10 group-hover:border-black/25 transition-colors duration-300">
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InterestsSection;
