import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, HeartPulse, Compass, CalendarCheck, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const featureCards = [
    { title: "AI Social Discovery", desc: "Find like-minded people near you based on core interests, personality types, and hobbies.", icon: Compass, color: "bg-blue-500/10 text-blue-500" },
    { title: "Wellness Check-Ins", desc: "Track your daily emotional states and visualize mental health trends with simple mood triggers.", icon: HeartPulse, color: "bg-emerald-500/10 text-emerald-500" },
    { title: "AI Companion", desc: "A personal social copilot that recommends local events, nearby people, and wellness tips.", icon: Sparkles, color: "bg-amber-500/10 text-amber-500" },
    { title: "Real-world Meetups", desc: "Create or join casual local group events like gaming, sports leagues, and cafe study circles.", icon: CalendarCheck, color: "bg-purple-500/10 text-purple-500" },
    { title: "Gamified Icebreakers", desc: "No more awkward first messages. Let our AI analyze interests and propose witty prompts.", icon: Heart, color: "bg-rose-500/10 text-rose-500" },
    { title: "Safety & Integrity", desc: "AI-moderated spaces, spam guards, and user controls to ensure a reliable and warm platform.", icon: ShieldCheck, color: "bg-slate-500/10 text-slate-700 dark:text-slate-300" }
  ];

  return (
    <div className="min-h-screen bg-gradient-mesh dark:bg-slate-950 text-primary-900 dark:text-slate-100 overflow-x-hidden font-outfit pb-20">
      {/* Sleek Landing Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-20 relative">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary-900 to-secondary-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-extrabold text-xl">B</span>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary-900 via-secondary-500 to-accent-coral bg-clip-text text-transparent dark:from-white dark:via-secondary-400">Plan B</span>
            <p className="text-[10px] text-primary-400 font-bold tracking-widest uppercase">Social Wellness</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/login" className="font-semibold text-sm hover:text-secondary-500 transition-colors duration-200">
            Login
          </Link>
          <Link to="/signup" className="bg-gradient-to-r from-primary-900 to-primary-800 dark:from-white dark:to-slate-100 text-white dark:text-primary-950 font-bold px-5 py-2.5 rounded-xl shadow-md active:scale-95 text-sm transition-all duration-200">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 flex flex-col md:flex-row items-center justify-between gap-12 relative">
        <motion.div 
          className="flex-1 text-left space-y-6 max-w-xl z-10"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-secondary-100/60 dark:bg-slate-900 border border-secondary-200/50 dark:border-slate-800 rounded-full px-4 py-1.5 text-secondary-600 dark:text-secondary-400 text-xs font-bold shadow-sm">
            <Sparkles className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '3s' }} />
            <span>AI-Powered Real Connection</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Find your people. <br />
            <span className="bg-gradient-to-r from-secondary-500 via-accent-coral to-rose-500 bg-clip-text text-transparent">
              Build connections.
            </span>
          </h2>

          <p className="text-primary-500 dark:text-slate-400 text-base md:text-lg font-medium leading-relaxed">
            An AI-powered social discovery and wellness platform that helps people overcome loneliness and connect through shared interests, personality, and real-world experiences.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/signup" className="btn-primary flex items-center gap-2 py-3.5 px-7 text-base group">
              <span>Start For Free</span>
              <ArrowRight className="h-5 w-5 stroke-[2.5px] group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link to="/login" className="btn-secondary py-3.5 px-7 text-base">
              Explore Events
            </Link>
          </div>
        </motion.div>

        {/* Hero Interactive Floating Visuals */}
        <motion.div 
          className="flex-1 relative w-full h-[380px] md:h-[450px] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main card */}
          <div className="glass-card w-[290px] h-[360px] p-6 relative flex flex-col justify-between shadow-2xl animate-float z-10 border-white/30 dark:border-slate-800">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <img 
                  src="https://api.dicebear.com/7.x/adventurer/svg?seed=Rohan" 
                  alt="Rohan" 
                  className="h-12 w-12 rounded-xl bg-secondary-100 border-2 border-white object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm">Rohan, 23</h4>
                  <p className="text-[10px] text-primary-400 font-semibold flex items-center gap-0.5">
                    <Compass className="h-3 w-3" /> San Francisco
                  </p>
                </div>
              </div>
              <span className="bg-emerald-500/10 text-emerald-500 font-extrabold text-[10px] py-1 px-2.5 rounded-full border border-emerald-500/20">
                92% Match
              </span>
            </div>

            <div className="my-4">
              <p className="text-xs text-primary-500 dark:text-slate-400 leading-relaxed font-semibold italic">
                "Up for a coding session or outdoor soccer match this weekend!"
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {["Gaming", "Coding", "Football"].map(tag => (
                  <span key={tag} className="text-[10px] bg-primary-100 dark:bg-slate-800/80 text-primary-600 dark:text-slate-300 font-bold py-0.5 px-2 rounded-lg border border-primary-200/50 dark:border-slate-800">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="p-3 bg-secondary-50/50 dark:bg-slate-950/40 border border-secondary-200/30 rounded-xl">
                <p className="text-[9px] text-primary-400 uppercase font-bold tracking-widest">AI Icebreaker</p>
                <p className="text-xs font-semibold text-secondary-600 dark:text-secondary-400 mt-0.5">
                  "I saw you're into soccer. What team do you support?"
                </p>
              </div>
            </div>
          </div>

          {/* Secondary mini card (floating) */}
          <div className="absolute top-4 left-4 glass-card p-4 flex items-center gap-3 animate-float-delayed shadow-xl z-20 border-white/30 dark:border-slate-800">
            <div className="h-8 w-8 rounded-full bg-accent-coral/10 flex items-center justify-center text-accent-coral">
              <HeartPulse className="h-4 w-4 stroke-[2.5px]" />
            </div>
            <div>
              <p className="text-[10px] text-primary-400 font-bold">DAILY WELLNESS CHECK</p>
              <p className="text-xs font-extrabold">Logged: Happy 😊</p>
            </div>
          </div>

          {/* Third mini card (floating) */}
          <div className="absolute bottom-6 right-4 glass-card p-4 flex items-center gap-3 animate-float shadow-xl z-20 border-white/30 dark:border-slate-800" style={{ animationDelay: '3.5s' }}>
            <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] text-primary-400 font-bold">AI ASSISTANT</p>
              <p className="text-xs font-semibold max-w-[150px] line-clamp-1">"Found 3 coffee events..."</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="glass-card grid grid-cols-2 md:grid-cols-4 gap-8 p-10 text-center relative border-white/30 dark:border-slate-800">
          <div>
            <h3 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-secondary-500 to-blue-600 bg-clip-text text-transparent">12,000+</h3>
            <p className="text-primary-400 dark:text-slate-400 text-xs md:text-sm font-bold uppercase tracking-wider mt-2">Active Users</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-accent-coral to-rose-500 bg-clip-text text-transparent">48,000+</h3>
            <p className="text-primary-400 dark:text-slate-400 text-xs md:text-sm font-bold uppercase tracking-wider mt-2">Sparks Connected</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-secondary-500 to-emerald-500 bg-clip-text text-transparent">1,200+</h3>
            <p className="text-primary-400 dark:text-slate-400 text-xs md:text-sm font-bold uppercase tracking-wider mt-2">Local Events Hosted</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-primary-950 to-primary-800 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">82%</h3>
            <p className="text-primary-400 dark:text-slate-400 text-xs md:text-sm font-bold uppercase tracking-wider mt-2">Loneliness Reduction</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center max-w-xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Platform Core Features</h2>
          <p className="text-primary-400 dark:text-slate-400 font-semibold text-sm md:text-base">
            Plan B integrates mental health support, hobby circles, and localized matchmaking vectors into a premium community suite.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featureCards.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div 
                key={feat.title}
                className="glass-card glass-card-hover p-8 text-left border-white/20 dark:border-slate-800/40 relative overflow-hidden"
                variants={itemVariants}
              >
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${feat.color}`}>
                  <Icon className="h-6 w-6 stroke-[2.2px]" />
                </div>
                <h3 className="font-extrabold text-lg mb-2">{feat.title}</h3>
                <p className="text-primary-400 dark:text-slate-400 text-sm font-medium leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="max-w-xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Real People. Real Connection.</h2>
          <p className="text-primary-400 dark:text-slate-400 font-semibold text-sm">Here is how Plan B is combating isolation in cities worldwide.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { quote: "Moving to SF was pretty isolating. Plan B's football matching got me into a weekly recreation group. Saved my weekends!", author: "David M.", occupation: "Product Analyst", pic: "https://api.dicebear.com/7.x/adventurer/svg?seed=David" },
            { quote: "I love the Mood Check-in system. Looking at my stats helped me recognize stress triggers, and the AI Companion recommended the perfect yoga events.", author: "Elena R.", occupation: "Content Lead", pic: "https://api.dicebear.com/7.x/adventurer/svg?seed=Elena" },
            { quote: "The AI icebreakers make matching so easy. I found my current study circle here. Cannot recommend Plan B enough!", author: "Karan S.", occupation: "Data Scientist", pic: "https://api.dicebear.com/7.x/adventurer/svg?seed=Karan" }
          ].map((test, index) => (
            <div key={index} className="glass-card p-8 flex flex-col justify-between text-left border-white/30 dark:border-slate-800">
              <p className="text-primary-500 dark:text-slate-300 text-sm leading-relaxed italic font-medium">"{test.quote}"</p>
              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-primary-100/50 dark:border-slate-800/40">
                <img src={test.pic} alt={test.author} className="h-10 w-10 rounded-xl bg-secondary-50 border object-cover" />
                <div>
                  <h5 className="font-extrabold text-sm">{test.author}</h5>
                  <p className="text-[10px] text-primary-400 font-bold">{test.occupation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="max-w-7xl mx-auto px-6 py-8 text-center">
        <div className="glass-card bg-gradient-to-tr from-primary-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 p-12 rounded-[40px] text-white border-none flex flex-col items-center justify-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">Ready to find your circle?</h2>
          <p className="text-slate-300 max-w-lg font-medium text-sm md:text-base leading-relaxed">
            Create your account today, complete your profile details, check in your mood, and let our recommendation engine find your matches.
          </p>
          <Link to="/signup" className="bg-white text-primary-950 hover:bg-slate-100 font-extrabold py-3.5 px-8 rounded-2xl shadow-xl active:scale-95 transition-all duration-200 inline-block text-sm">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
