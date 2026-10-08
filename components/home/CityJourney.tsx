'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, MotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SpiceLevel from '@/components/SpiceLevel';
import { SplitReveal } from '@/components/Motion';
import { BRAND, type Region } from '@/lib/brand';
import { inr, regionFromPrice } from '@/lib/menu';
import { PHOTOS, type PhotoKey } from '@/lib/site';
import { track } from '@/lib/analytics';

function useDesktop() {
  const [d, setD] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const on = () => setD(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return d;
}

/** Discover India through biryani — one panel per city, scrolled sideways on desktop. */
export default function CityJourney() {
  const ref = useRef<HTMLElement>(null);
  const desktop = useDesktop();
  const reduce = useReducedMotion();
  const pinned = desktop && !reduce;
  const n = BRAND.regions.length;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.0005 });

  /**
   * Each city holds still while you read it, then slides to the next one.
   * Without the hold the panels drift continuously and text is always
   * half off the screen.
   */
  const { stops, frames } = useMemo(() => {
    const step = 1 / n;          // scroll share per city
    const hold = step * 0.55;    // how much of that share the city sits still
    const s: number[] = [];
    const f: string[] = [];
    for (let i = 0; i < n; i++) {
      const start = i * step;
      s.push(start, start + hold);
      f.push(`-${i * (100 / n)}%`, `-${i * (100 / n)}%`);
    }
    s.push(1);
    f.push(`-${((n - 1) / n) * 100}%`);
    return { stops: s, frames: f };
  }, [n]);

  const x = useTransform(smooth, stops, frames);
  const [active, setActive] = useState(0);
  useMotionValueEvent(x, 'change', (v) => {
    const pct = Math.abs(parseFloat(String(v)));
    setActive(Math.min(n - 1, Math.max(0, Math.round(pct / (100 / n)))));
  });

  return (
    <section
      ref={ref}
      id="discover"
      className="site relative jaali-bg text-ivory"
      style={{ height: pinned ? `${n * 100}vh` : undefined }}
      aria-labelledby="discover-title"
    >
      <div className={pinned ? 'sticky top-0 h-screen overflow-hidden' : 'py-20'}>
        <div className={`wrap ${pinned ? 'absolute inset-x-0 top-20 z-10' : ''}`}>
          <SplitReveal as="h2" id="discover-title" text={BRAND.discover.title} className="display-lg max-w-[15ch]" />
          <p className="mt-3 max-w-lg text-ivory/70">{BRAND.discover.sub}</p>
        </div>

        <motion.div
          style={pinned ? { x, width: `${n * 100}%` } : undefined}
          className={pinned ? 'flex h-full' : 'no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5'}
        >
          {BRAND.regions.map((r, i) => (
            <CityPanel key={r.key} r={r} i={i} n={n} pinned={pinned} progress={smooth} />
          ))}
        </motion.div>

        {pinned && (
          <div className="wrap absolute inset-x-0 bottom-8 z-10">
            <ol className="grid grid-cols-4 gap-4" aria-label="Cities">
              {BRAND.regions.map((r, i) => (
                <li key={r.key} className="text-sm">
                  <div className="h-[2px] w-full overflow-hidden rounded bg-ivory/15">
                    <motion.div className="h-full bg-brass" initial={false} animate={{ width: i <= active ? '100%' : '0%' }} transition={{ duration: 0.5 }} />
                  </div>
                  <span className={`mt-2 block font-semibold transition-colors ${i === active ? 'text-brass-light' : 'text-ivory/50'}`}>
                    {r.style}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}

function CityPanel({ r, i, n, pinned, progress }: { r: Region; i: number; n: number; pinned: boolean; progress: MotionValue<number> }) {
  const centre = 0.04 + (0.92 * i) / (n - 1);
  const imgScale = useTransform(progress, [centre - 0.3, centre, centre + 0.3], [1.25, 1.02, 1.25]);
  const imgRotate = useTransform(progress, [centre - 0.3, centre + 0.3], [-4, 4]);
  const photo = PHOTOS[r.photo as PhotoKey];
  const price = regionFromPrice(r.key as 'lucknowi');

  return (
    <article
      style={pinned ? { width: `${100 / n}%` } : undefined}
      className={
        pinned
          ? 'grid h-full flex-none grid-cols-[1fr_1.1fr] items-center gap-12 px-[max(2rem,calc((100vw-76rem)/2+2rem))] pb-24 pt-[14rem]'
          : 'w-[86vw] flex-none snap-center overflow-hidden rounded-3xl bg-dum-deep/60 ring-1 ring-brass/20'
      }
    >
      <div className={pinned ? 'order-1 max-w-lg' : 'order-2 p-6'}>
        <p className="font-display text-2xl text-brass-light" lang="hi">{r.hindi}</p>
        <h3 className={`${pinned ? 'text-[clamp(3.25rem,6vw,5.75rem)]' : 'text-5xl'} mt-1 leading-none`}>{r.city}</h3>
        <p className="mt-3 font-semibold text-brass-light">{r.short}</p>
        <p className="mt-4 text-ivory/80 md:text-lg">{r.body}</p>
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div>
            <dt className="text-ivory/50">Spice level</dt>
            <dd className="font-semibold"><SpiceLevel level={r.spiceLevel} label={r.spice} size={14} tone="dark" /></dd>
          </div>
          <div>
            <dt className="text-ivory/50">Ideal for</dt>
            <dd className="font-semibold">{r.idealFor}</dd>
          </div>
          {price && (
            <div>
              <dt className="text-ivory/50">From</dt>
              <dd className="font-semibold text-brass-light">{inr(price)}</dd>
            </div>
          )}
        </dl>
        <Link
          href={`/biryani/${r.key}`}
          onClick={() => track('style_view', { style: r.key, from: 'journey' })}
          className="group mt-7 inline-flex items-center gap-2 font-semibold text-brass-light"
        >
          See the {r.style} dishes
          <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div
        className={
          pinned
            ? 'order-2 relative h-full max-h-[500px] w-full overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-brass/30'
            : 'order-1 relative aspect-[4/3] w-full overflow-hidden'
        }
      >
        <motion.div className="absolute inset-0" style={pinned ? { scale: imgScale, rotate: imgRotate } : undefined}>
          <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 50vw, 86vw" loading="eager" className="object-cover" />
        </motion.div>
      </div>
    </article>
  );
}
