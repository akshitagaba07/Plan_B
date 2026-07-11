import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

/*
  Each entry in SCRIPT is a single "breath unit" — a word or phrase
  that appears on screen with a soft fade. pauseAfter is milliseconds
  of silence BEFORE the next word appears (like a human speaker pausing).
  highlight = true renders the word in the neon gold colour.
  newLine = true adds a line break before this word.
*/
const SCRIPT = [
  { word: '"Sometimes',  pauseAfter: 420 },
  { word: 'life',        pauseAfter: 380 },
  { word: 'changes',     pauseAfter: 380 },
  { word: 'your',        pauseAfter: 380 },
  { word: 'plans."',     pauseAfter: 1600 },   // ← long breath after the full stop

  { word: 'Plan',        pauseAfter: 380, newLine: true },
  { word: 'B',           pauseAfter: 380 },
  { word: 'helps',       pauseAfter: 380 },
  { word: 'you',         pauseAfter: 380 },
  { word: 'find',        pauseAfter: 380 },
  { word: 'the',         pauseAfter: 900 },   // ← a held breath before the climax

  { word: 'people',      pauseAfter: 480, newLine: true, highlight: true },
  { word: 'to',          pauseAfter: 420, highlight: true },
  { word: 'make',        pauseAfter: 440, highlight: true },
  { word: 'new',         pauseAfter: 460, highlight: true },
  { word: 'ones."',      pauseAfter: 0,   highlight: true, last: true },
];

/* Soft "landing" animation for each word */
const WORD_TRANSITION = {
  duration: 1.05,
  ease: [0.16, 1, 0.3, 1],   // expo-out — instant snap then very slow settle
};

export default function QuoteBlock() {
  const sectionRef     = useRef(null);
  const inView         = useInView(sectionRef, { once: true, margin: '-80px' });

  /* index of the last visible word (-1 = none shown yet) */
  const [visibleUpTo, setVisibleUpTo]   = useState(-1);
  const [bloomDone,   setBloomDone]     = useState(false);
  const [cursorOn,    setCursorOn]      = useState(true);   // blinking cursor
  const [cycle,       setCycle]         = useState(0);      // increments to restart loop

  /* ── drive the sequential reveal — loops forever ── */
  useEffect(() => {
    if (!inView) return;

    let cancelled = false;
    let currentIndex = 0;

    // Reset state for this cycle
    setVisibleUpTo(-1);
    setBloomDone(false);
    setCursorOn(true);

    const scheduleNext = () => {
      if (cancelled || currentIndex >= SCRIPT.length) return;

      const entry = SCRIPT[currentIndex];
      setVisibleUpTo(currentIndex);
      currentIndex++;

      if (currentIndex < SCRIPT.length) {
        setTimeout(scheduleNext, entry.pauseAfter + 120);
      } else {
        // All words shown — bloom, hold, then reset for next cycle
        setTimeout(() => {
          if (cancelled) return;
          setBloomDone(true);
          // Hold the final state for 2.5 s then restart
          setTimeout(() => {
            if (!cancelled) {
              setVisibleUpTo(-1);
              setBloomDone(false);
              setCursorOn(true);
              setCycle(c => c + 1); // triggers the effect again
            }
          }, 2500);
        }, 800);
      }
    };

    // Short initial delay so the user can settle
    const start = setTimeout(scheduleNext, 400);
    return () => { cancelled = true; clearTimeout(start); };
  }, [inView, cycle]);   // re-runs every cycle

  /* blinking cursor while words are being placed */
  useEffect(() => {
    if (bloomDone) { setCursorOn(false); return; }
    const id = setInterval(() => setCursorOn(v => !v), 530);
    return () => clearInterval(id);
  }, [bloomDone]);

  /* build line groups for layout */
  const line1 = SCRIPT.slice(0, 5);
  const line2 = SCRIPT.slice(5, 11);
  const line3 = SCRIPT.slice(11);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 overflow-hidden py-28 md:py-40"
    >
      {/* ── very subtle ambient glow — grows when bloom fires ── */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        animate={bloomDone ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 2.4, ease: 'easeOut' }}
      >
        <div style={{
          width: '800px', height: '480px',
          background: 'radial-gradient(ellipse at center, rgba(223,254,0,0.12) 0%, rgba(223,254,0,0.04) 40%, transparent 68%)',
          filter: 'blur(32px)',
        }} />
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 text-center">

        {/* ── tiny section label ── */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#DFFE00]/60 mb-10"
        >
          A message for you
        </motion.p>

        {/* ── the quote ── */}
        <blockquote
          className="font-syne font-extrabold uppercase tracking-tight leading-snug
                     text-3xl md:text-5xl lg:text-6xl text-center"
          aria-label="Sometimes life changes your plans. Plan B helps you find the people to make new ones."
        >

          {/* Line 1 */}
          <div className="flex flex-wrap justify-center gap-x-[0.3em] gap-y-2 mb-3">
            {line1.map((entry, i) => (
              <Word
                key={i}
                globalIndex={i}
                entry={entry}
                visible={visibleUpTo >= i}
              />
            ))}
          </div>

          {/* Line 2 */}
          <div className="flex flex-wrap justify-center gap-x-[0.3em] gap-y-2 mb-3">
            {line2.map((entry, i) => {
              const gi = 5 + i;
              return (
                <Word
                  key={gi}
                  globalIndex={gi}
                  entry={entry}
                  visible={visibleUpTo >= gi}
                />
              );
            })}
          </div>

          {/* Line 3 — gold climax */}
          <div className="flex flex-wrap justify-center gap-x-[0.3em] gap-y-2">
            {line3.map((entry, i) => {
              const gi = 11 + i;
              return (
                <Word
                  key={gi}
                  globalIndex={gi}
                  entry={entry}
                  visible={visibleUpTo >= gi}
                  bloomDone={entry.last ? bloomDone : false}
                />
              );
            })}

            {/* blinking cursor — vanishes after bloom */}
            <AnimatePresence>
              {!bloomDone && (
                <motion.span
                  aria-hidden
                  key="cursor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: cursorOn ? 1 : 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="inline-block w-[3px] h-[0.85em] rounded-sm bg-[#DFFE00] self-center ml-1"
                  style={{ boxShadow: '0 0 8px rgba(223,254,0,0.8)' }}
                />
              )}
            </AnimatePresence>
          </div>
        </blockquote>

        {/* ── neon underline — draws itself after bloom ── */}
        <motion.div
          className="mx-auto mt-10 h-[2px] rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #DFFE00 50%, transparent 100%)',
            boxShadow: '0 0 14px rgba(223,254,0,0.7)',
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={bloomDone ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* ── closing line after bloom ── */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={bloomDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, delay: 0.5, ease: 'easeOut' }}
          className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
        >
          Because every great story needs the right people.
        </motion.p>

      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────
   Word — renders a single token with its soft "landing" entry
─────────────────────────────────────────────────────────── */
function Word({ entry, visible, bloomDone }) {
  const isGold = entry.highlight;

  /* gold words pulse gently with a slow glow once bloom fires */
  const goldGlow = bloomDone
    ? { textShadow: ['0 0 8px rgba(223,254,0,0.4)', '0 0 28px rgba(223,254,0,0.85)', '0 0 8px rgba(223,254,0,0.4)'] }
    : isGold
      ? { textShadow: '0 0 14px rgba(223,254,0,0.55)' }
      : {};

  const goldTransition = bloomDone
    ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
    : {};

  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          key="word"
          initial={{
            opacity: 0,
            y: 10,
            filter: 'blur(5px)',
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            scale: 1,
            ...goldGlow,
          }}
          transition={bloomDone ? goldTransition : WORD_TRANSITION}
          className={isGold ? 'text-[#DFFE00]' : 'text-white'}
        >
          {entry.word}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
