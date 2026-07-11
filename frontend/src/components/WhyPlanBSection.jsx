import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ─── Story chapters ─── */
const CHAPTERS = [
  {
    num: '01',
    tag: 'THE BEGINNING',
    tagColor: '#DFFE00',
    title: 'Everyone starts\nwith a Plan A.',
    body: 'A cricket match with friends. A café trip with your best friend. A movie night with siblings. A weekend getaway with family. The people you love are always your first choice.',
    accent: 'rgba(223,254,0,0.08)',
    accentBorder: 'rgba(223,254,0,0.15)',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
        <circle cx="40" cy="40" r="38" stroke="rgba(223,254,0,0.2)" strokeWidth="1" />
        {/* Centre person */}
        <circle cx="40" cy="40" r="8" fill="#DFFE00" opacity="0.9" />
        {/* Orbiting people */}
        {[
          { cx: 40, cy: 10 },
          { cx: 68, cy: 26 },
          { cx: 68, cy: 54 },
          { cx: 40, cy: 70 },
          { cx: 12, cy: 54 },
          { cx: 12, cy: 26 },
        ].map((p, i) => (
          <g key={i}>
            <line x1="40" y1="40" x2={p.cx} y2={p.cy} stroke="rgba(223,254,0,0.3)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx={p.cx} cy={p.cy} r="5" fill="white" opacity="0.7" />
          </g>
        ))}
      </svg>
    ),
    pills: ['Friends 🏏', 'Siblings 🍿', 'Best friend ☕', 'Family 🚗'],
  },
  {
    num: '02',
    tag: 'THE SHIFT',
    tagColor: '#7af7f7',
    title: 'Then life\nrearranges everything.',
    body: 'College pulls you to a new city. Work lands you somewhere unfamiliar. Friends get busy. Family lives far. The plans stay in your head — but suddenly there\'s no one to share them with.',
    accent: 'rgba(122,247,247,0.06)',
    accentBorder: 'rgba(122,247,247,0.12)',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
        {/* Drifting nodes */}
        {[
          { cx: 15, cy: 15, op: 0.2 },
          { cx: 65, cy: 12, op: 0.15 },
          { cx: 70, cy: 65, op: 0.2 },
          { cx: 10, cy: 68, op: 0.15 },
        ].map((p, i) => (
          <g key={i}>
            <line x1="40" y1="40" x2={p.cx} y2={p.cy} stroke={`rgba(122,247,247,${p.op})`} strokeWidth="1.5" strokeDasharray="4 5" />
            <circle cx={p.cx} cy={p.cy} r="5" fill="#7af7f7" opacity={p.op * 1.5} />
          </g>
        ))}
        {/* Lone centre */}
        <circle cx="40" cy="40" r="10" stroke="#7af7f7" strokeWidth="1.5" fill="none" opacity="0.6" />
        <circle cx="40" cy="40" r="3" fill="#7af7f7" opacity="0.5" />
        {/* question mark */}
        <text x="36" y="44" fill="rgba(122,247,247,0.7)" fontSize="10" fontWeight="bold">?</text>
      </svg>
    ),
    pills: ['New city 🎓', 'New job 💼', 'Busy friends ⏳', 'Far family 📍'],
  },
  {
    num: '03',
    tag: 'THE SOLUTION',
    tagColor: '#DFFE00',
    title: 'Plan B finds you\nnew people.',
    body: 'Plan B matches you with people who share your interests, energy, and location — so you never have to cancel an experience just because your usual circle isn\'t available.',
    accent: 'rgba(223,254,0,0.08)',
    accentBorder: 'rgba(223,254,0,0.2)',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
        {/* Full web of connections */}
        {[
          { cx: 40, cy: 10 },
          { cx: 68, cy: 28 },
          { cx: 62, cy: 65 },
          { cx: 18, cy: 65 },
          { cx: 12, cy: 28 },
        ].map((p, i, arr) => (
          <g key={i}>
            <line x1="40" y1="40" x2={p.cx} y2={p.cy} stroke="rgba(223,254,0,0.5)" strokeWidth="1.5" />
            {arr.map((q, j) =>
              j > i ? (
                <line key={j} x1={p.cx} y1={p.cy} x2={q.cx} y2={q.cy} stroke="rgba(223,254,0,0.15)" strokeWidth="1" />
              ) : null
            )}
            <circle cx={p.cx} cy={p.cy} r="5" fill="#DFFE00" opacity="0.85" />
          </g>
        ))}
        {/* Centre B node */}
        <circle cx="40" cy="40" r="12" fill="#DFFE00" />
        <text x="35" y="45" fill="black" fontSize="11" fontWeight="900">B</text>
      </svg>
    ),
    pills: ['Match by vibe 🤝', 'Never cancel ✨', 'Local circles ⚡', 'Real connections 💛'],
  },
];

/* ─── single chapter card ─── */
function ChapterCard({ chapter, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="relative group flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${chapter.accentBorder}`,
        borderRadius: 24,
        padding: '40px 36px',
        backdropFilter: 'blur(12px)',
        transition: 'border-color 0.3s',
      }}
    >
      {/* ambient glow */}
      <div
        className="absolute inset-0 rounded-[24px] pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
        style={{ background: chapter.accent, filter: 'blur(1px)' }}
      />

      {/* chapter number */}
      <span
        className="absolute top-6 right-8 font-syne font-black text-[64px] leading-none select-none pointer-events-none"
        style={{ color: chapter.tagColor, opacity: 0.07 }}
      >
        {chapter.num}
      </span>

      {/* tag */}
      <span
        className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] mb-5 px-3 py-1 rounded-full border w-fit"
        style={{ color: chapter.tagColor, borderColor: chapter.accentBorder, background: chapter.accent }}
      >
        {chapter.tag}
      </span>

      {/* icon */}
      <div className="w-20 h-20 mb-6">
        {chapter.icon}
      </div>

      {/* title */}
      <h3
        className="font-syne font-black uppercase tracking-tight leading-[1.05] mb-4 text-white"
        style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', whiteSpace: 'pre-line' }}
      >
        {chapter.title}
      </h3>

      {/* body */}
      <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
        {chapter.body}
      </p>

      {/* pills */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {chapter.pills.map((pill, i) => (
          <span
            key={i}
            className="text-[11px] font-bold px-3 py-1 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            {pill}
          </span>
        ))}
      </div>

      {/* bottom arrow connector (not on last) */}
      {index < CHAPTERS.length - 1 && (
        <div
          className="hidden lg:flex absolute -right-[25px] top-1/2 -translate-y-1/2 z-10 items-center justify-center w-12 h-12 rounded-full"
          style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}

/* ─── main section ─── */
export default function WhyPlanBSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' });

  return (
    <section className="relative w-full overflow-hidden py-28 md:py-36 border-t border-white/5">

      {/* background texture */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 900,
            height: 500,
            background: 'radial-gradient(ellipse at center, rgba(223,254,0,0.04) 0%, transparent 65%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── Header ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-20"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-block bg-[#DFFE00]/10 border border-[#DFFE00]/25 rounded-lg px-3 py-1 font-extrabold text-[10px] text-[#DFFE00] uppercase tracking-[0.2em]">
              OUR STORY
            </span>
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-[#DFFE00]/30 to-transparent" />
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-syne font-black uppercase tracking-tight text-white leading-[0.95]">
              Why{' '}
              <span
                className="text-[#DFFE00]"
                style={{ textShadow: '0 0 40px rgba(223,254,0,0.3)' }}
              >
                Plan B?
              </span>
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs md:text-right">
              A three-chapter story about connection, distance, and finding your people again.
            </p>
          </div>
        </motion.div>

        {/* ── Three chapter cards in a horizontal row ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {CHAPTERS.map((chapter, i) => (
            <ChapterCard key={i} chapter={chapter} index={i} />
          ))}
        </div>

        {/* ── Bottom narrative bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          className="mt-16 md:mt-20 flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-6 rounded-2xl"
          style={{
            background: 'rgba(223,254,0,0.04)',
            border: '1px solid rgba(223,254,0,0.12)',
          }}
        >
          <p className="text-white font-syne font-extrabold uppercase tracking-tight text-lg md:text-xl text-center md:text-left">
            Your Plan A isn't gone.{' '}
            <span className="text-[#DFFE00]">Plan B just expands it.</span>
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-2 w-2 rounded-full bg-[#DFFE00] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#DFFE00]/70">
              Always available
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
