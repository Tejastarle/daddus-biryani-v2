'use client';

import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Headline that rises word by word from behind a mask. */
export function SplitReveal({
  text, className = '', delay = 0, as: Tag = 'h2', once = true, play, id,
}: { text: string; className?: string; delay?: number; as?: 'h1' | 'h2' | 'h3' | 'p'; once?: boolean; play?: boolean; id?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  const MotionTag = motion[Tag];
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: delay } },
  };
  const child = {
    hidden: { y: reduce ? 0 : '110%', opacity: reduce ? 0 : 1 },
    show: { y: '0%', opacity: 1, transition: { duration: 0.9, ease: EASE } },
  };
  return (
    <MotionTag
      id={id}
      className={className}
      variants={container}
      initial="hidden"
      {...(play !== undefined ? { animate: play ? 'show' : 'hidden' } : { whileInView: 'show', viewport: { once, margin: '-10% 0px' } })}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
          <motion.span className="inline-block" variants={child}>
            {w}
            {i < words.length - 1 ? '\u00a0' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/** Card that tilts toward the pointer. Falls back to static on touch and reduced motion. */
export function Tilt({ children, className = '', max = 7 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });

  function onMove(e: React.PointerEvent) {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => { px.set(0.5); py.set(0.5); }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Button that leans toward the cursor. */
export function Magnetic({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18 });
  const sy = useSpring(y, { stiffness: 250, damping: 18 });
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`inline-flex ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse') return;
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.25);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

export const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8% 0px' },
  transition: { duration: 0.8, ease: EASE },
};
