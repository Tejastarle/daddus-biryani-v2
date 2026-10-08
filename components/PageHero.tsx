'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { SplitReveal } from '@/components/Motion';

/** Compact hero for inner pages: a real dish photo drifting behind a green panel. */
export default function PageHero({
  title, intro, image, imageAlt, hindi, children,
}: { title: string; intro?: string; image: string; imageAlt: string; hindi?: string; children?: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);

  return (
    <section ref={ref} className="site relative overflow-hidden jaali-bg text-ivory">
      <div className="wrap relative grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative z-10">
          {hindi && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="font-display text-2xl text-brass-light" lang="hi">
              {hindi}
            </motion.p>
          )}
          <SplitReveal as="h1" text={title} className="display-lg mt-1 max-w-[16ch]" play />
          {intro && (
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }} className="mt-4 max-w-xl text-lg text-ivory/75">
              {intro}
            </motion.p>
          )}
          {children && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }} className="mt-7">
              {children}
            </motion.div>
          )}
        </div>
        <motion.div
          initial={{ clipPath: 'inset(0 0 100% 0 round 28px)' }}
          animate={{ clipPath: 'inset(0 0 0% 0 round 28px)' }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
          className="relative hidden aspect-[4/3] overflow-hidden rounded-[28px] ring-1 ring-brass/30 lg:block"
        >
          <motion.div className="absolute inset-0" style={{ y, scale }}>
            <Image src={image} alt={imageAlt} fill priority sizes="40vw" className="object-cover" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
