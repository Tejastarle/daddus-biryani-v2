'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { SplitReveal, fadeUp } from '@/components/Motion';
import { BRAND } from '@/lib/brand';
import { PHOTOS } from '@/lib/site';

/**
 * A bed of rice where the flavour reaches every grain and stays there.
 * Deterministic jitter keeps the server and client renders identical.
 */
function GrainDiagram() {
  const reduce = useReducedMotion();

  const grains = [];
  const COLS = 13;
  const ROWS = 6;
  for (let i = 0; i < COLS * ROWS; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const jx = ((i * 73) % 17) - 8;
    const jy = ((i * 131) % 13) - 6;
    grains.push({
      x: 10 + col * 28 + (row % 2) * 14 + jx,
      y: 14 + row * 23 + jy,
      r: -40 + ((i * 53) % 80),
    });
  }

  return (
    <svg viewBox="0 0 390 150" className="h-auto w-full" role="img" aria-label="Flavour spread evenly across every grain of rice">
      <defs>
        <linearGradient id="grain-flavour" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#F3C46B" />
          <stop offset="0.55" stopColor="#E8912D" />
          <stop offset="1" stopColor="#D97A18" />
        </linearGradient>
        <mask id="grain-mask">
          {grains.map((g, i) => (
            <rect
              key={i}
              x={g.x}
              y={g.y}
              width="21"
              height="7.5"
              rx="3.75"
              fill="#fff"
              transform={`rotate(${g.r} ${g.x + 10.5} ${g.y + 3.75})`}
            />
          ))}
        </mask>
        <clipPath id="grain-reveal">
          <motion.rect
            x="0"
            y="0"
            height="150"
            initial={{ width: reduce ? 390 : 0 }}
            whileInView={{ width: 390 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: reduce ? 0 : 2.4, ease: [0.4, 0, 0.2, 1] }}
          />
        </clipPath>
      </defs>

      <g mask="url(#grain-mask)">
        <rect x="0" y="0" width="390" height="150" fill="#E7DAC0" />
        <g clipPath="url(#grain-reveal)">
          <rect x="0" y="0" width="390" height="150" fill="url(#grain-flavour)" />
        </g>
      </g>
    </svg>
  );
}

export default function EveryGrain() {
  return (
    <section className="site bg-ivory py-24 md:py-32" aria-labelledby="grain-title">
      <div className="wrap">
        <SplitReveal
          as="h2"
          id="grain-title"
          text={BRAND.everyGrain.title}
          className="display-md max-w-[22ch] text-dum"
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div {...fadeUp} className="space-y-5 text-[1.0625rem] leading-relaxed text-ink/80" lang="hi">
            {BRAND.everyGrain.paragraphs.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </motion.div>

          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {/*
              SWAP ME: this should be a photograph of someone taking a bite of
              biryani. No such photo has been supplied yet, so a plated dish
              stands in. Replace the two lines below when the bite photo arrives.
            */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/3] overflow-hidden rounded-[2rem] ring-1 ring-dum/10"
            >
              <Image
                src={PHOTOS.kolkata.src}
                alt={PHOTOS.kolkata.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.7 }}
              className="rounded-[2rem] bg-white p-7 ring-1 ring-dum/10"
            >
              <GrainDiagram />
              <p className="mt-4 text-center text-sm text-ink/60" lang="hi">
                {BRAND.everyGrain.close}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
