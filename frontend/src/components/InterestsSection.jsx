import React from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Flame, 
  Coffee, 
  Film, 
  BookOpen, 
  Compass, 
  Palette, 
  Users, 
  ArrowRight 
} from 'lucide-react';

const cardsData = [
  {
    icon: Dumbbell,
    emoji: "🏀",
    title: "Sports Partner",
    desc: "Find teammates for football, badminton, cricket, basketball, tennis or any sport nearby.",
    color: "from-emerald-500/20 to-teal-500/5"
  },
  {
    icon: Flame,
    emoji: "💪",
    title: "Workout Buddy",
    desc: "Stay consistent by finding someone to train, run, cycle or hit the gym with.",
    color: "from-orange-500/20 to-red-500/5"
  },
  {
    icon: Coffee,
    emoji: "☕",
    title: "Explore the City",
    desc: "Visit cafés, restaurants, bowling alleys, malls and hidden gems with like-minded people.",
    color: "from-amber-600/20 to-yellow-600/5"
  },
  {
    icon: Film,
    emoji: "🎬",
    title: "Entertainment",
    desc: "Watch movies, attend concerts, gaming events, stand-up shows or festivals together.",
    color: "from-pink-500/20 to-rose-500/5"
  },
  {
    icon: BookOpen,
    emoji: "📚",
    title: "Study Together",
    desc: "Find coding partners, project teammates, accountability partners or study groups.",
    color: "from-blue-500/20 to-indigo-500/5"
  },
  {
    icon: Compass,
    emoji: "🧳",
    title: "Travel Companion",
    desc: "Plan weekend trips, treks and adventures with verified people sharing your destination.",
    color: "from-cyan-500/20 to-sky-500/5"
  },
  {
    icon: Palette,
    emoji: "🎨",
    title: "Learn Something New",
    desc: "Meet people interested in photography, dancing, cooking, art, music and many other hobbies.",
    color: "from-purple-500/20 to-fuchsia-500/5"
  },
  {
    icon: Users,
    emoji: "🤝",
    title: "Just Need Company",
    desc: "Sometimes all you need is someone to grab coffee, go for a walk or simply enjoy good conversations.",
    color: "from-slate-500/20 to-slate-700/5"
  }
];

const InterestsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15
      }
    }
  };

  return (
    <section className="relative w-full overflow-hidden py-24 z-10">
      {/* Background Soft Glow Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-purple-900/10 filter blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[35vw] h-[35vw] rounded-full bg-[#DFFE00]/5 filter blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <motion.span 
            className="inline-block bg-[#DFFE00]/10 border border-[#DFFE00]/25 rounded-lg p-1.5 px-3.5 font-extrabold text-[10px] text-[#DFFE00] uppercase tracking-widest"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            WHY PLAN B
          </motion.span>
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-syne font-black uppercase tracking-tight text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Built Around Your Interests
          </motion.h2>
          <motion.p 
            className="text-slate-400 font-semibold text-sm md:text-base leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Whether you're looking for teammates, travel companions, study partners, or simply someone to explore the city with, Plan B helps you connect with people who share your interests.
          </motion.p>
        </div>

        {/* 8-Card Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {cardsData.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="glass-card group p-8 border border-white/5 bg-black/45 rounded-[24px] flex flex-col justify-between min-h-[250px] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(223,254,0,0.12)] hover:border-[#DFFE00]/30 cursor-pointer relative overflow-hidden text-left"
                role="button"
                tabIndex={0}
                aria-label={`Interest group: ${card.title}. ${card.desc}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                  }
                }}
              >
                {/* Decorative subtle background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div className="space-y-5 relative z-10">
                  {/* Icon Block */}
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:border-[#DFFE00]/40 group-hover:bg-[#DFFE00]/5 shadow-inner">
                      <IconComponent className="h-5 w-5 text-slate-300 group-hover:text-[#DFFE00] transition-colors duration-300" />
                    </div>
                    <span className="text-2xl select-none" role="img" aria-hidden="true">
                      {card.emoji}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="font-syne font-black text-xl uppercase tracking-tight text-white group-hover:text-[#DFFE00] transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>

                {/* Animated Arrow Footer */}
                <div className="flex items-center justify-between pt-6 mt-auto border-t border-white/5 group-hover:border-[#DFFE00]/20 transition-colors duration-300 relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-[#DFFE00] transition-colors duration-300">
                    Find Sparks
                  </span>
                  <div className="h-6 w-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover:text-black group-hover:bg-[#DFFE00] group-hover:border-transparent transition-all duration-300">
                    <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default InterestsSection;
