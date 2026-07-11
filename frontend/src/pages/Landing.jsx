import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, HeartPulse, Compass, CalendarCheck, ShieldCheck, Heart, ArrowRight, CheckCircle2, MessageSquare, Globe, Users, PlusCircle, Quote } from 'lucide-react';
import InterestsSection from '../components/InterestsSection';
import WhyPlanBSection from '../components/WhyPlanBSection';

const Landing = () => {
  const [activeRole, setActiveRole] = useState('seeker'); // 'seeker' or 'host'
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Real-time 3D mouse rotation vectors for hero match card mockup
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    setRotateX(-y / (box.height / 15)); // divisor of 15 gives a highly responsive, heavy tilt!
    setRotateY(x / (box.width / 15));
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 90, damping: 14 }
    }
  };

  const bentoCards = [
    {
      id: 0,
      tag: "Discovery",
      title: "AI Social Discovery",
      desc: "Find like-minded people near you based on core interests, personality compatibility, and hobbies.",
      colSpan: "md:col-span-2",
      rowSpan: "",
      visual: (
        <div className="flex flex-col gap-2 bg-white/5 border border-white/10 rounded-3xl p-4 shadow-md w-full max-w-xs justify-center shrink-0">
          <div className="flex items-center gap-3">
            <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Priya" className="h-10 w-10 rounded-xl bg-slate-900 border border-white/10" alt="Priya" />
            <div className="text-left">
              <p className="text-white font-extrabold text-xs">Priya, 22</p>
              <p className="text-slate-400 text-[10px] font-bold uppercase mt-0.5">Gaming • Coding</p>
            </div>
          </div>
          <div className="w-full h-[1px] bg-white/5 my-1" />
          <div className="flex justify-between items-center text-[10px] font-extrabold text-[#DFFE00] uppercase tracking-wider">
            <span>Compatibility</span>
            <span>94% MATCH</span>
          </div>
        </div>
      )
    },
    {
      id: 1,
      tag: "Wellness",
      title: "Wellness Check-Ins",
      desc: "Track your daily emotional states and visualize wellness trends with simple mood triggers.",
      colSpan: "",
      rowSpan: "md:row-span-2",
      visual: (
        <div className="space-y-3 mt-6 p-4 bg-white/5 border border-white/10 rounded-3xl text-[10px] uppercase font-extrabold tracking-wider w-full">
          <div className="flex justify-between items-center text-slate-300">
            <span>Happy 😊</span>
            <span className="text-[#DFFE00]">85%</span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div className="bg-[#DFFE00] h-full" style={{ width: '85%' }} />
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>Excited 🎉</span>
            <span className="text-[#DFFE00]">92%</span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div className="bg-[#DFFE00] h-full" style={{ width: '92%' }} />
          </div>
        </div>
      )
    },
    {
      id: 2,
      tag: "Copilot",
      title: "AI Companion",
      desc: "A personal social copilot that recommends local events, nearby people, and wellness tips.",
      colSpan: "",
      rowSpan: "",
      visual: (
        <div className="mt-6 p-4 bg-[#DFFE00]/5 border border-[#DFFE00]/15 rounded-2xl text-xs text-[#DFFE00] font-extrabold uppercase tracking-wide text-left w-full">
          🤖 "Found a study group nearby that fits your interest in coding!"
        </div>
      )
    },
    {
      id: 3,
      tag: "Meetups",
      title: "Real-world Meetups",
      desc: "Create or join casual local group events like gaming, sports leagues, and cafe circles.",
      colSpan: "",
      rowSpan: "",
      visual: (
        <div className="flex flex-wrap gap-1.5 mt-6 w-full">
          {["Football", "Gaming", "Cafe"].map(t => (
            <span key={t} className="text-[9px] bg-white/5 border border-white/10 text-slate-400 font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-wider">
              {t}
            </span>
          ))}
        </div>
      )
    },
    {
      id: 4,
      tag: "Icebreakers",
      title: "Gamified Icebreakers",
      desc: "No more awkward first messages. Let our AI analyze interests and propose witty prompts.",
      colSpan: "md:col-span-2",
      rowSpan: "",
      visual: (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-4 shadow-md w-full max-w-xs self-center text-left flex flex-col justify-center shrink-0">
          <p className="text-[9px] text-[#DFFE00] font-extrabold uppercase tracking-widest">AI SUGGESTION</p>
          <p className="text-white text-xs font-semibold mt-1">"I saw you play football. What team do you support?"</p>
        </div>
      )
    },
    {
      id: 5,
      tag: "Safety",
      title: "Safety & Integrity",
      desc: "AI-moderated spaces, spam guards, and user controls to ensure a reliable and warm platform.",
      colSpan: "",
      rowSpan: "",
      visual: (
        <div className="mt-6 flex items-center justify-center p-3.5 bg-white/5 border border-white/10 rounded-2xl w-full">
          <span className="text-[#00D47C] font-extrabold text-[10px] uppercase tracking-widest">✓ AI VERIFIED SAFE</span>
        </div>
      )
    }
  ];
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden font-outfit pb-32 relative">
      
      {/* Premium High-Definition Dynamic Background (Infinite Fluid Mesh & Grid Overlay) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[#000000]">
        
        {/* Background Video - Slot 1 (Autoplay, Loop, Muted, Playsinline) */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute top-0 left-0 w-full h-[100vh] object-cover opacity-[0.55] mix-blend-screen z-0"
        >
          <source src="/background-video.mp4" type="video/mp4" />
          <source src="/background-video.webm" type="video/webm" />
        </video>

        {/* Background Video - Slot 2 (Autoplay, Loop, Muted, Playsinline) */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute top-[100vh] left-0 w-full h-[100vh] object-cover opacity-[0.55] mix-blend-screen z-0"
        >
          <source src="/background-video-2.mp4" type="video/mp4" />
          <source src="/background-video-2.webm" type="video/webm" />
        </video>

        {/* Background Video - Slot 3 (Autoplay, Loop, Muted, Playsinline) */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute top-[200vh] left-0 w-full h-[100vh] object-cover opacity-[0.55] mix-blend-screen z-0"
        >
          <source src="/background-video.mp4" type="video/mp4" />
          <source src="/background-video.webm" type="video/webm" />
        </video>

        {/* Background Video - Slot 4 (Autoplay, Loop, Muted, Playsinline) */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute top-[300vh] left-0 w-full h-[100vh] object-cover opacity-[0.55] mix-blend-screen z-0"
        >
          <source src="/background-video-2.mp4" type="video/mp4" />
          <source src="/background-video-2.webm" type="video/webm" />
        </video>

        {/* Background Video - Slot 5 (Autoplay, Loop, Muted, Playsinline) */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute top-[400vh] left-0 w-full h-[100vh] object-cover opacity-[0.55] mix-blend-screen z-0"
        >
          <source src="/background-video.mp4" type="video/mp4" />
          <source src="/background-video.webm" type="video/webm" />
        </video>

        {/* Frosted Glass Overlay Pane (Blurs background videos for glassmorphic effect) */}
        <div className="absolute inset-0 w-full h-full backdrop-blur-[6px] bg-white/[0.02] z-[1] pointer-events-none" />

        {/* Infinite Fluid Mesh Gradient Flow */}
        <div className="absolute inset-0 filter blur-[130px] opacity-50 z-[1]">
          {/* Neon Purple/Indigo Blob */}
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/35 animate-float-slow" />
          
          {/* Lime Green Ambient Glow */}
          <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#DFFE00]/20 animate-float-medium" />
          
          {/* Deep Royal Blue/Teal Blob */}
          <div className="absolute bottom-[-10%] left-[15%] w-[55vw] h-[55vw] rounded-full bg-blue-600/30 animate-float-fast" />
        </div>

        {/* Ambient Spotlight Gradients to Blend Layout */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(168,85,247,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_60%,rgba(223,254,0,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/85 z-[1]" />




      </div>

      {/* Header (Sticky Navigation Top Bar inspired by Saarthi Techgen) */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'backdrop-blur-md bg-black/85 border-b border-white/5 py-2.5 shadow-xl' : 'backdrop-blur-sm bg-black/30 py-6 border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className={`rounded-2xl bg-[#DFFE00] flex items-center justify-center shadow-lg transition-all duration-300 ease-out group-hover:rotate-6 group-hover:scale-115 animate-pulse-glow ${isScrolled ? 'h-10 w-10' : 'h-14 w-14'}`}>
              <span className={`text-black font-black tracking-tighter transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-3xl'}`}>B</span>
            </div>
            <div className="flex flex-col text-left">
              <span className={`font-syne font-black tracking-tight text-white uppercase transition-all duration-300 group-hover:text-[#DFFE00] group-hover:translate-x-1.5 ${isScrolled ? 'text-lg' : 'text-3xl'}`}>Plan B</span>
              <p className={`text-[9px] text-[#DFFE00] font-black tracking-[0.2em] uppercase mt-0.5 transition-all duration-300 group-hover:translate-x-1 ${isScrolled ? 'opacity-0 h-0 scale-y-0 overflow-hidden mt-0' : 'opacity-100'}`}>Social Wellness</p>
            </div>
          </div>

          {/* Centered Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-extrabold tracking-widest uppercase text-slate-400">
            <a href="#features" className="hover-flashy-gradient">Features</a>
            <Link to="/discover" className="hover-flashy-gradient">Discover</Link>
            <Link to="/community" className="hover-flashy-gradient">Communities</Link>
            <Link to="/wellness" className="hover-flashy-gradient">Wellness</Link>
          </nav>
          
          <div className="flex items-center gap-6">
            <Link to="/login" className="font-semibold text-xs tracking-wider text-slate-300 hover:text-white transition-colors duration-200 uppercase">
              LOG IN
            </Link>
            <Link to="/signup" className="bg-[#DFFE00] hover:bg-[#DFFE00]/90 text-black font-extrabold text-xs tracking-wider py-2.5 px-6 rounded-full transition-all duration-300 uppercase shadow-lg shadow-[#DFFE00]/10">
              GET STARTED
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-36 md:pt-48 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
        <motion.div 
          className="flex-1 text-left space-y-8 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >


          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-syne font-extrabold leading-[0.95] uppercase tracking-tighter text-white">
            FIND YOUR <span className="text-neon-glow text-[#DFFE00] animate-pop-circle">CIRCLE.</span> <br />
            BUILD YOUR <span className="text-flashy-gradient animate-pop-people">PEOPLE.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed max-w-lg">
            Combat isolation and find real-world wellness circles. Plan B matches you based on your vibes, location, interests, and emotional daily check-ins.
          </p>

          {/* Gatekeeper / Path Selector (Wero-style Choice) */}
          <div className="glass-card p-2 rounded-2xl flex max-w-md border-white/5">
            <button 
              onClick={() => setActiveRole('seeker')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                activeRole === 'seeker' 
                  ? 'bg-white text-black shadow-md' 
                  : 'bg-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="h-4 w-4" />
              I want to discover
            </button>
            <button 
              onClick={() => setActiveRole('host')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                activeRole === 'host' 
                  ? 'bg-[#DFFE00] text-black shadow-md shadow-[#DFFE00]/15' 
                  : 'bg-transparent text-slate-400 hover:text-white'
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              I want to host
            </button>
          </div>

          {/* Conditional Guidance text based on Role Selector */}
          <motion.div 
            key={activeRole}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs text-slate-400 font-semibold flex items-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4 text-[#DFFE00]" />
            <span>
              {activeRole === 'seeker' 
                ? "Gain access to 200+ active communities, daily match cards, and direct AI icebreakers."
                : "Host events, coordinate check-ins, build group channels, and grow your local network."}
            </span>
          </motion.div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/signup" className="btn-primary flex items-center gap-2.5 py-4 px-8 text-sm group tracking-wider uppercase">
              <span>START DISCOVERING</span>
              <ArrowRight className="h-4.5 w-4.5 stroke-[2.5px] group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link to="/login" className="btn-secondary py-4 px-8 text-sm tracking-wider uppercase">
              EXPLORE EVENTS
            </Link>
          </div>
        </motion.div>

        {/* Hero Interactive Floating Visuals */}
        <motion.div 
          className="flex-1 relative w-full h-[480px] md:h-[560px] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ perspective: 1200 }}
        >
          {/* Central matching card with 3D Mouse Tilt & Floating Effects */}
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{
              rotateX: rotateX,
              rotateY: rotateY,
              y: rotateX === 0 && rotateY === 0 ? [0, -15, 0] : 0,
              rotateZ: rotateX === 0 && rotateY === 0 ? [0.6, -0.6, 0.6] : 0
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 18,
              y: {
                repeat: Infinity,
                duration: 6,
                ease: "easeInOut"
              },
              rotateZ: {
                repeat: Infinity,
                duration: 6,
                ease: "easeInOut"
              }
            }}
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden"
            }}
            className="glass-card w-[350px] md:w-[370px] h-[430px] p-8 relative flex flex-col justify-between shadow-2xl border-white/10 z-10 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3.5">
                <img 
                  src="https://api.dicebear.com/7.x/adventurer/svg?seed=Rohan" 
                  alt="Rohan" 
                  className="h-14 w-14 rounded-xl bg-slate-900 border-2 border-white/20 object-cover"
                />
                <div>
                  <h4 className="font-bold text-base text-white">Rohan, 23</h4>
                  <p className="text-[11px] text-slate-400 font-bold flex items-center gap-0.5 mt-0.5">
                    <Compass className="h-3.5 w-3.5 text-[#DFFE00]" /> San Francisco
                  </p>
                </div>
              </div>
              <span className="bg-[#DFFE00] text-black font-extrabold text-xs py-1.5 px-4 rounded-full border border-[#DFFE00]/20 tracking-wider">
                92% MATCH
              </span>
            </div>

            <div className="my-4">
              <p className="text-sm text-slate-350 leading-relaxed font-semibold italic">
                "Always up for a Fifa session, programming, or casual weekend football matches!"
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {["Gaming", "Coding", "Football"].map(tag => (
                  <span key={tag} className="text-[10px] bg-white/5 text-slate-300 font-extrabold py-1.5 px-3 rounded-lg border border-white/10 uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="p-4 bg-black/40 border border-white/5 rounded-xl">
                <p className="text-[10px] text-[#DFFE00] uppercase font-extrabold tracking-widest">AI Icebreaker</p>
                <p className="text-sm font-semibold text-slate-300 mt-1">
                  "I saw you play football. What team do you support?"
                </p>
              </div>
            </div>

            {/* Glowing active dots */}
            <div className="absolute top-1/2 -left-3 h-6 w-6 rounded-full bg-[#DFFE00]/10 border border-[#DFFE00]/30 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-[#DFFE00] animate-ping" />
            </div>
          </motion.div>

          {/* Floating mini wellness card */}
          <motion.div 
            animate={{ 
              y: [0, 12, 0],
              rotateZ: [-2, 2, -2]
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut"
            }}
            className="absolute top-6 left-[-10px] md:left-2 glass-card p-4 flex items-center gap-3 shadow-xl z-20 border-white/10 cursor-pointer"
          >
            <div className="h-9 w-9 rounded-full bg-[#DFFE00]/10 border border-[#DFFE00]/20 flex items-center justify-center text-[#DFFE00]">
              <HeartPulse className="h-5 w-5 stroke-[2px]" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">DAILY CHECK</p>
              <p className="text-xs font-extrabold text-white">Logged: Energetic ⚡</p>
            </div>
          </motion.div>

          {/* Floating mini assistant card */}
          <motion.div 
            animate={{ 
              y: [0, -12, 0],
              rotateZ: [2, -2, 2]
            }}
            transition={{
              repeat: Infinity,
              duration: 5.5,
              ease: "easeInOut"
            }}
            className="absolute bottom-4 right-[-10px] md:right-2 glass-card p-4 flex items-center gap-3 shadow-xl z-20 border-white/10 cursor-pointer"
          >
            <div className="h-9 w-9 rounded-full bg-[#DFFE00]/10 border border-[#DFFE00]/20 flex items-center justify-center text-[#DFFE00]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI SOCIAL PILOT</p>
              <p className="text-xs font-semibold text-white max-w-[150px] line-clamp-1">"Found 3 local gaming clubs"</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Emotional Quote Block — placed just below Hero for immediate impact */}
      <div className="relative z-10 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto px-6 text-center space-y-6 flex flex-col items-center"
        >
          <div className="h-12 w-12 rounded-full bg-[#DFFE00]/10 border border-[#DFFE00]/25 flex items-center justify-center text-[#DFFE00]">
            <Quote className="h-5 w-5 rotate-180" />
          </div>
          <blockquote className="text-2xl md:text-4xl lg:text-5xl font-syne font-extrabold uppercase tracking-tight text-white leading-tight">
            "Sometimes life changes your plans. <br />
            Plan B helps you find the <span className="text-[#DFFE00] text-neon-glow">people to make new ones.</span>"
          </blockquote>
          <div className="w-16 h-[3px] bg-[#DFFE00] rounded-full" />
        </motion.div>
      </div>

      {/* Why Plan B Section */}
      <WhyPlanBSection />

      {/* Interests Section */}
      <InterestsSection />

      {/* Features List Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
          <h2 className="text-3xl md:text-5xl font-syne font-extrabold uppercase tracking-tight text-white">Core Capabilities</h2>
          <p className="text-slate-400 font-semibold text-sm md:text-base">
            Plan B maps wellness checks, match filters, and direct group feeds into a unified social engine.
          </p>
        </div>

        {/* Premium Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bentoCards.map((card) => (
            <div 
              key={card.id}
              className={`glass-card p-8 border-white/5 bg-black/45 flex flex-col md:flex-row justify-between gap-6 ${card.colSpan} ${card.rowSpan} hover:scale-[1.05] hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(223,254,0,0.18)] hover:border-[#DFFE00]/30 hover:z-20 transition-all duration-300 ease-out cursor-pointer relative overflow-hidden`}
            >
              <div className="text-left space-y-3 max-w-md">
                <span className="inline-block bg-[#DFFE00]/10 border border-[#DFFE00]/25 rounded-lg p-1.5 px-3 font-extrabold text-[10px] text-[#DFFE00] uppercase tracking-wider">
                  {card.tag}
                </span>
                <h3 className="font-syne font-black text-2xl uppercase tracking-tighter text-flashy-outline">{card.title}</h3>
                <p className="text-slate-400 text-sm font-semibold leading-relaxed">
                  {card.desc}
                </p>
              </div>
              {card.visual}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center relative z-10">
        <div className="max-w-xl mx-auto space-y-4 mb-20">
          <h2 className="text-3xl md:text-5xl font-syne font-extrabold uppercase tracking-tight">Community Feedback</h2>
          <p className="text-slate-400 font-semibold text-sm">Real stories from our urban circles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { quote: "Moving to SF was pretty isolating. Plan B's football matching got me into a weekly recreation group. Saved my weekends!", author: "David M.", occupation: "Product Analyst", pic: "https://api.dicebear.com/7.x/adventurer/svg?seed=David" },
            { quote: "I love the Mood Check-in system. Looking at my stats helped me recognize stress triggers, and the AI Companion recommended the perfect yoga events.", author: "Elena R.", occupation: "Content Lead", pic: "https://api.dicebear.com/7.x/adventurer/svg?seed=Elena" },
            { quote: "The AI icebreakers make matching so easy. I found my current study circle here. Cannot recommend Plan B enough!", author: "Karan S.", occupation: "Data Scientist", pic: "https://api.dicebear.com/7.x/adventurer/svg?seed=Karan" }
          ].map((test, index) => (
            <div key={index} className="glass-card p-8 flex flex-col justify-between text-left border-white/5">
              <p className="text-slate-300 text-sm leading-relaxed italic font-semibold">"{test.quote}"</p>
              <div className="flex items-center gap-4 mt-8 pt-4 border-t border-white/5">
                <img src={test.pic} alt={test.author} className="h-10 w-10 rounded-xl bg-slate-900 border object-cover" />
                <div>
                  <h5 className="font-extrabold text-sm text-white">{test.author}</h5>
                  <p className="text-[9px] text-[#DFFE00] font-extrabold uppercase tracking-wider">{test.occupation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="max-w-7xl mx-auto px-6 py-12 text-center relative z-10">
        <div className="glass-card border-none bg-gradient-to-tr from-wero-dark-900 to-wero-dark-800 p-16 rounded-[40px] text-white flex flex-col items-center justify-center space-y-8 relative overflow-hidden border border-white/5">
          <h2 className="text-4xl md:text-6xl font-syne font-extrabold uppercase tracking-tight max-w-xl leading-none">
            Ready to find your <span className="text-[#DFFE00]">circle?</span>
          </h2>
          <p className="text-slate-300 max-w-lg font-medium text-sm md:text-base leading-relaxed">
            Create your account today, complete your profile details, check in your daily mood, and let our recommendation engine find your connections.
          </p>
          <Link to="/signup" className="btn-primary text-sm font-extrabold py-4 px-10 rounded-2xl shadow-xl uppercase tracking-wider">
            GET STARTED NOW
          </Link>
        </div>
      </section>

      {/* Floating Bottom Navigation Bar (Wero-Inspired) */}
      <nav className="fixed bottom-6 left-0 right-0 z-50 px-6 pointer-events-none">
        <div className="backdrop-blur-xl bg-black/45 border border-white/10 rounded-full py-3.5 px-8 flex items-center justify-between gap-6 md:gap-12 shadow-2xl max-w-2xl mx-auto pointer-events-auto">
          {/* Logo Dot */}
          <div className="flex items-center gap-2">
            <div className="h-5.5 w-5.5 rounded bg-[#DFFE00] flex items-center justify-center">
              <span className="text-black font-black text-xs tracking-tighter">B</span>
            </div>
            <span className="font-syne font-extrabold text-xs tracking-wider uppercase text-white hidden sm:inline">Plan B</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 md:gap-6 text-[10px] font-extrabold tracking-wider uppercase text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <Link to="/discover" className="hover:text-white transition-colors">Discover</Link>
            <Link to="/community" className="hover:text-white transition-colors">Communities</Link>
            <Link to="/wellness" className="hover:text-white transition-colors">Wellness</Link>
          </div>

          {/* CTA inside Bar */}
          <Link to="/signup" className="btn-primary text-[10px] tracking-wider font-extrabold py-2 px-4 rounded-xl uppercase">
            SIGN UP
          </Link>
        </div>
      </nav>

    </div>
  );
};

export default Landing;
