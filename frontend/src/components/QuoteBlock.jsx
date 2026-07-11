import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Quote, Heart } from 'lucide-react';

/* ─── floating particle seeds (deterministic so no hydration flicker) ─── */
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: 10 + ((i * 37 + 13) % 80),   // 10–90 % horizontal
  y: 5  + ((i * 53 + 7)  % 85),   // 5–90 % vertical
  r: 1.5 + (i % 5) * 0.6,         // radius 1.5–4.5
  dur: 3 + (i % 7) * 0.8,         // float duration 3–8.4 s
  delay: (i * 0.31) % 4,
  opacity: 0.25 + (i % 4) * 0.15,
}));

/* ─── split text into animatable words ─── */
const line1Words = ['Sometimes', 'life', 'changes', 'your', 'plans.'];
const line2Words = ['Plan', 'B', 'helps', 'you', 'find', 'the'];
const line2Highlight = ['people', 'to', 'make', 'new', 'ones.'];

const wordVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function QuoteBlock() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  /* trigger heart-burst once words finish */
  useEffect(() => {
    if (!inView) return;
    const totalWords = line1Words.length + line2Words.length + line2Highlight.length;
    const ms = totalWords * 90 + 700;
    const t = setTimeout(() => setShowHeartBurst(true), ms);
    return () => clearTimeout(t);
  }, [inView]);

  const allWordCount = line1Words.length + line2Words.length + line2Highlight.length;

  return (
    <section
      ref={ref}
      className="relative z-10 overflow-hidden py-24 md:py-32"
    >
      {/* ── radial ambient glow ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          style={{
            width: '700px',
            height: '420px',
            background:
              'radial-gradient(ellipse at center, rgba(223,254,0,0.10) 0%, rgba(223,254,0,0.03) 45%, transparent 70%)',
            filter: 'blur(24px)',
          }}
        />
      </div>

      {/* ── floating gold particles ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLES.map((p) => (
          <motion.span
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.r * 2,
              height: p.r * 2,
              borderRadius: '50%',
              background: '#DFFE00',
              opacity: 0,
              boxShadow: `0 0 ${p.r * 3}px rgba(223,254,0,0.8)`,
            }}
            animate={
              inView
                ? {
                    opacity: [0, p.opacity, p.opacity * 0.6, p.opacity, 0],
                    y: [0, -18, 8, -12, 0],
                    scale: [1, 1.3, 0.9, 1.2, 1],
                  }
                : {}
            }
            transition={{
              duration: p.dur,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ── quote icon with pulsing heartbeat ring ── */}
      <div className="relative flex flex-col items-center gap-8 max-w-5xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center"
        >
          {/* outer pulsing ring */}
          <motion.div
            className="absolute rounded-full border border-[#DFFE00]/40"
            style={{ width: 72, height: 72 }}
            animate={inView ? { scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] } : {}}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          />
          {/* inner pulsing ring */}
          <motion.div
            className="absolute rounded-full border border-[#DFFE00]/25"
            style={{ width: 56, height: 56 }}
            animate={inView ? { scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] } : {}}
            transition={{ duration: 2.4, delay: 0.5, repeat: Infinity, ease: 'easeOut' }}
          />
          {/* icon circle */}
          <div className="relative h-12 w-12 rounded-full bg-[#DFFE00]/10 border border-[#DFFE00]/30 flex items-center justify-center text-[#DFFE00] z-10">
            <Quote className="h-5 w-5 rotate-180" />
          </div>
        </motion.div>

        {/* ── word-by-word stagger blockquote ── */}
        <blockquote className="text-center font-syne font-extrabold uppercase tracking-tight leading-tight text-2xl md:text-4xl lg:text-5xl">

          {/* line 1 */}
          <div className="flex flex-wrap justify-center gap-x-[0.35em] gap-y-1 text-white">
            {line1Words.map((word, i) => (
              <motion.span
                key={`l1-${i}`}
                custom={i}
                variants={wordVariants}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
              >
                {word}
              </motion.span>
            ))}
          </div>

          {/* line 2 — normal words + highlighted words */}
          <div className="flex flex-wrap justify-center gap-x-[0.35em] gap-y-1 mt-2">
            {line2Words.map((word, i) => (
              <motion.span
                key={`l2-${i}`}
                custom={line1Words.length + i}
                variants={wordVariants}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="text-white"
              >
                {word}
              </motion.span>
            ))}
            {line2Highlight.map((word, i) => (
              <motion.span
                key={`l2h-${i}`}
                custom={line1Words.length + line2Words.length + i}
                variants={wordVariants}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="relative text-[#DFFE00]"
                style={{ textShadow: '0 0 18px rgba(223,254,0,0.7), 0 0 40px rgba(223,254,0,0.35)' }}
              >
                {/* shimmer sweep overlay */}
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                  }}
                  animate={inView ? { backgroundPosition: ['-100% 0', '200% 0'] } : {}}
                  transition={{
                    duration: 1.4,
                    delay: (line1Words.length + line2Words.length + i) * 0.09 + 0.7,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatDelay: 3.5,
                  }}
                />
                {word}
              </motion.span>
            ))}
          </div>
        </blockquote>

        {/* ── animated neon underline ── */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{
            duration: 0.9,
            delay: allWordCount * 0.09 + 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ originX: 0.5 }}
          className="w-20 h-[3px] rounded-full"
          aria-hidden
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #DFFE00, transparent)',
              boxShadow: '0 0 12px rgba(223,254,0,0.8)',
            }}
          />
        </motion.div>

        {/* ── heart-burst celebration (fires once after words finish) ── */}
        <AnimatePresence>
          {showHeartBurst &&
            Array.from({ length: 7 }).map((_, i) => {
              const angle = (i / 7) * 2 * Math.PI;
              const dx = Math.cos(angle) * (55 + (i % 3) * 20);
              const dy = Math.sin(angle) * (45 + (i % 3) * 18);
              return (
                <motion.span
                  key={`hb-${i}`}
                  aria-hidden
                  initial={{ opacity: 1, x: 0, y: 0, scale: 0.4 }}
                  animate={{ opacity: 0, x: dx, y: dy, scale: 1.2 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    pointerEvents: 'none',
                    color: i % 2 === 0 ? '#DFFE00' : '#fff',
                  }}
                >
                  <Heart
                    style={{
                      width: 12 + (i % 3) * 5,
                      height: 12 + (i % 3) * 5,
                      fill: 'currentColor',
                    }}
                  />
                </motion.span>
              );
            })}
        </AnimatePresence>

      </div>
    </section>
  );
}
