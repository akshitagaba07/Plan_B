import React, { useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* ─────────────────────────────────────────────
   3D tilt card hook (Raycast-style)
───────────────────────────────────────────── */
function useTilt() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onMouseLeave = () => { x.set(0); y.set(0); };
  return { rotateX, rotateY, onMouseMove, onMouseLeave };
}

/* ─────────────────────────────────────────────
   Large SVG illustrations — one per chapter
───────────────────────────────────────────── */
const IllustrationA = () => (
  <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
    <defs>
      <radialGradient id="gA" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#DFFE00" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#DFFE00" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="90" fill="url(#gA)" />
    {/* Spokes */}
    {[[100,20],[170,55],[170,145],[100,180],[30,145],[30,55]].map(([cx,cy],i)=>(
      <g key={i}>
        <line x1="100" y1="100" x2={cx} y2={cy} stroke="#DFFE00" strokeWidth="1.5" strokeOpacity="0.5" />
        <circle cx={cx} cy={cy} r="10" fill="#DFFE00" fillOpacity="0.15" stroke="#DFFE00" strokeOpacity="0.6" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r="4" fill="#DFFE00" fillOpacity="0.8" />
      </g>
    ))}
    {/* Centre hub */}
    <circle cx="100" cy="100" r="22" fill="#DFFE00" fillOpacity="0.12" stroke="#DFFE00" strokeWidth="2" />
    <circle cx="100" cy="100" r="10" fill="#DFFE00" />
    {/* Outer ring */}
    <circle cx="100" cy="100" r="60" stroke="#DFFE00" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="4 6" />
  </svg>
);

const IllustrationB = () => (
  <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
    <defs>
      <radialGradient id="gB" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#7af7f7" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#7af7f7" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="90" fill="url(#gB)" />
    {/* Drifting nodes */}
    {[[20,25,0.2],[175,30,0.15],[180,160,0.2],[15,170,0.15],[100,15,0.18],[100,185,0.12]].map(([cx,cy,op],i)=>(
      <g key={i}>
        <line x1="100" y1="100" x2={cx} y2={cy} stroke="#7af7f7" strokeWidth="1.5" strokeOpacity={op} strokeDasharray="5 7" />
        <circle cx={cx} cy={cy} r="8" fill="#7af7f7" fillOpacity={op * 0.5} stroke="#7af7f7" strokeOpacity={op * 1.5} strokeWidth="1.5" />
      </g>
    ))}
    {/* Isolated lone node */}
    <circle cx="100" cy="100" r="28" stroke="#7af7f7" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
    <circle cx="100" cy="100" r="14" stroke="#7af7f7" strokeWidth="2" strokeOpacity="0.6" fill="none" />
    <circle cx="100" cy="100" r="5" fill="#7af7f7" fillOpacity="0.7" />
    {/* Crack lines */}
    <line x1="100" y1="72" x2="100" y2="86" stroke="#7af7f7" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.8" />
    <circle cx="100" cy="95" r="2.5" fill="#7af7f7" fillOpacity="0.8" />
  </svg>
);

const IllustrationC = () => (
  <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
    <defs>
      <radialGradient id="gC" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#DFFE00" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#DFFE00" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="90" fill="url(#gC)" />
    {/* Full dense web */}
    {[[100,22],[165,62],[155,148],[100,178],[45,148],[35,62]].map(([cx,cy],i,arr)=>(
      <g key={i}>
        {arr.map(([qx,qy],j)=> j!==i ? (
          <line key={j} x1={cx} y1={cy} x2={qx} y2={qy} stroke="#DFFE00" strokeWidth="1" strokeOpacity="0.2" />
        ):null)}
        <line x1="100" y1="100" x2={cx} y2={cy} stroke="#DFFE00" strokeWidth="2" strokeOpacity="0.7" />
        <circle cx={cx} cy={cy} r="11" fill="#DFFE00" fillOpacity="0.2" stroke="#DFFE00" strokeWidth="2" strokeOpacity="0.8" />
        <circle cx={cx} cy={cy} r="5" fill="#DFFE00" />
      </g>
    ))}
    {/* Centre B */}
    <circle cx="100" cy="100" r="24" fill="#DFFE00" />
    <text x="91" y="108" fill="black" fontSize="20" fontWeight="900" fontFamily="sans-serif">B</text>
    {/* Outer pulse rings */}
    <circle cx="100" cy="100" r="50" stroke="#DFFE00" strokeOpacity="0.2" strokeWidth="1" />
    <circle cx="100" cy="100" r="72" stroke="#DFFE00" strokeOpacity="0.1" strokeWidth="1" />
  </svg>
);

/* ─────────────────────────────────────────────
   Chapter data
───────────────────────────────────────────── */
const CHAPTERS = [
  {
    num: '01',
    tag: 'THE BEGINNING',
    title: 'Everyone starts\nwith a Plan A.',
    body: 'A cricket match with friends. A café with your best friend. A movie with siblings. A weekend trip with family. The people you love — always your first choice.',
    accent: '#DFFE00',
    glow: 'rgba(223,254,0,0.12)',
    glowStrong: 'rgba(223,254,0,0.25)',
    border: 'rgba(223,254,0,0.2)',
    illustration: <IllustrationA />,
    pills: ['Friends 🏏', 'Siblings 🍿', 'Café ☕', 'Family 🚗'],
  },
  {
    num: '02',
    tag: 'THE SHIFT',
    title: 'Then life\nrearranges\neverything.',
    body: 'College pulls you to a new city. Work lands you somewhere unfamiliar. Friends get busy. Family lives far. The plans stay in your head — but suddenly no one\'s around to share them.',
    accent: '#7af7f7',
    glow: 'rgba(122,247,247,0.08)',
    glowStrong: 'rgba(122,247,247,0.2)',
    border: 'rgba(122,247,247,0.2)',
    illustration: <IllustrationB />,
    pills: ['New city 🎓', 'New job 💼', 'Busy friends ⏳', 'Far family 📍'],
  },
  {
    num: '03',
    tag: 'THE SOLUTION',
    title: 'Plan B finds\nyou new\npeople.',
    body: 'Plan B matches you with people who share your interests, energy, and location — so you never have to cancel an experience because your usual circle isn\'t available.',
    accent: '#DFFE00',
    glow: 'rgba(223,254,0,0.12)',
    glowStrong: 'rgba(223,254,0,0.3)',
    border: 'rgba(223,254,0,0.25)',
    illustration: <IllustrationC />,
    pills: ['Match by vibe 🤝', 'Never cancel ✨', 'Local circles ⚡', 'Real connections 💛'],
  },
];

/* ─────────────────────────────────────────────
   Single chapter card
───────────────────────────────────────────── */
function ChapterCard({ chapter, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.025 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative h-full flex flex-col overflow-hidden rounded-[28px] cursor-default group"
        // Card shell
      >
        {/* Glass background */}
        <div
          className="absolute inset-0 rounded-[28px]"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
            border: `1px solid ${chapter.border}`,
            backdropFilter: 'blur(20px)',
          }}
        />

        {/* Hover glow bloom */}
        <motion.div
          className="absolute inset-0 rounded-[28px] pointer-events-none"
          style={{ background: chapter.glow }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-8 right-8 h-[1px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${chapter.accent}, transparent)`,
            opacity: 0.6,
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-8 md:p-10 flex flex-col h-full gap-6">

          {/* Top row: tag + number */}
          <div className="flex items-start justify-between">
            <span
              className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border"
              style={{ color: chapter.accent, borderColor: chapter.border, background: chapter.glow }}
            >
              {chapter.tag}
            </span>
            <span
              className="font-syne font-black text-7xl leading-none select-none"
              style={{ color: chapter.accent, opacity: 0.12 }}
            >
              {chapter.num}
            </span>
          </div>

          {/* Illustration — large and prominent */}
          <div className="w-full aspect-square max-w-[160px] mx-auto relative">
            {/* Glow behind illustration */}
            <div
              className="absolute inset-0 rounded-full blur-2xl"
              style={{ background: chapter.glowStrong }}
            />
            <div className="relative w-full h-full">
              {chapter.illustration}
            </div>
          </div>

          {/* Title — big and bold */}
          <h3
            className="font-syne font-black uppercase tracking-tighter text-white leading-[0.9]"
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              whiteSpace: 'pre-line',
              textShadow: `0 0 40px ${chapter.glowStrong}`,
            }}
          >
            {chapter.title}
          </h3>

          {/* Body */}
          <p className="text-slate-400 text-sm leading-relaxed font-medium flex-1">
            {chapter.body}
          </p>

          {/* Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
            {chapter.pills.map((pill, i) => (
              <motion.span
                key={i}
                whileHover={{ scale: 1.05, borderColor: chapter.accent }}
                className="text-[11px] font-bold px-3 py-1 rounded-full border transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderColor: 'rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.55)',
                }}
              >
                {pill}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Corner glow */}
        <div
          className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: chapter.glowStrong }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main section
───────────────────────────────────────────── */
export default function WhyPlanBSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' });

  return (
    <section className="relative w-full overflow-hidden py-28 md:py-36">

      {/* Background radial */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{
            width: 1000, height: 600,
            background: 'radial-gradient(ellipse at center top, rgba(223,254,0,0.05) 0%, transparent 60%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── Section header ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-20"
        >
          {/* Label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#DFFE00]/40" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#DFFE00]/70">
              Our Story
            </span>
          </div>

          {/* Heading */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-syne font-black uppercase tracking-tighter text-white leading-[0.9]"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}>
              Why{' '}
              <span
                style={{
                  color: '#DFFE00',
                  textShadow: '0 0 60px rgba(223,254,0,0.5), 0 0 120px rgba(223,254,0,0.2)',
                }}
              >
                Plan B?
              </span>
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[240px] md:text-right pb-2">
              A three-chapter story about connection, distance, and finding your people again.
            </p>
          </div>
        </motion.div>

        {/* ── Progress connector (desktop only) ── */}
        <div className="hidden lg:flex items-center justify-between mb-10 px-12 relative">
          <div className="absolute left-12 right-12 top-1/2 h-px bg-gradient-to-r from-[#DFFE00]/30 via-[#7af7f7]/20 to-[#DFFE00]/30" />
          {CHAPTERS.map((ch, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={headerInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
              className="relative z-10 flex flex-col items-center gap-1"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: ch.accent, boxShadow: `0 0 12px ${ch.glowStrong}` }}
              />
              <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: ch.accent, opacity: 0.7 }}>
                {ch.tag}
              </span>
            </motion.div>
          ))}
        </div>

        {/* ── Chapter cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {CHAPTERS.map((chapter, i) => (
            <ChapterCard key={i} chapter={chapter} index={i} />
          ))}
        </div>

        {/* ── Bottom statement ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="font-syne font-black uppercase tracking-tighter text-white"
            style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)' }}>
            Your Plan A isn't gone.{' '}
            <span
              style={{
                color: '#DFFE00',
                textShadow: '0 0 30px rgba(223,254,0,0.6)',
              }}
            >
              Plan B just expands it.
            </span>
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#DFFE00] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#DFFE00]/50">
              Always here. Always available.
            </span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#DFFE00] animate-pulse" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
