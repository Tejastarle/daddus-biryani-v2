'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { MapPin, MessageCircle, Pause, Play, UtensilsCrossed } from 'lucide-react';
import { Magnetic, SplitReveal } from '@/components/Motion';
import { BRAND } from '@/lib/brand';
import { SITE, WA, waLink } from '@/lib/site';
import { track } from '@/lib/analytics';

const JAALI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'%3E%3Cg fill='none' stroke='%23C9A24B' stroke-width='1.6' stroke-opacity='.55'%3E%3Cpath d='M36 6 L66 36 L36 66 L6 36 Z'/%3E%3Cpath d='M36 20 L52 36 L36 52 L20 36 Z'/%3E%3Ccircle cx='36' cy='36' r='5'/%3E%3Cpath d='M0 0 L12 12 M72 0 L60 12 M0 72 L12 60 M72 72 L60 60'/%3E%3C/g%3E%3C/svg%3E\")";

export default function Hero() {
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [intro, setIntro] = useState<'pending' | 'playing' | 'done'>('pending');
  const [paused, setPaused] = useState(false);

  // The doors play once per visit; returning and reduced-motion visitors go straight in.
  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem('db_intro');
      sessionStorage.setItem('db_intro', '1');
    } catch {
      /* storage unavailable */
    }
    if (seen || reduce) {
      setIntro('done');
      return;
    }
    setIntro('playing');
    const t = setTimeout(() => setIntro('done'), 2300);
    return () => clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    if (reduce && video.current) {
      video.current.pause();
      setPaused(true);
    }
  }, [reduce]);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const inset = useTransform(scrollYProgress, [0, 0.7], [0, 5]);
  const radius = useTransform(scrollYProgress, [0, 0.7], [0, 36]);
  const clip = useMotionTemplate`inset(${inset}% ${inset}% 0% ${inset}% round ${radius}px)`;
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.18]);
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, -90]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const ready = intro === 'done' || intro === 'playing';
  const delay = (n: number) => (intro === 'playing' ? n + 1.25 : n * 0.5 + 0.1);

  function togglePlay() {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  }

  return (
    <section ref={section} className="relative min-h-[100svh] bg-ivory">
      <motion.div style={{ clipPath: reduce ? undefined : clip }} className="absolute inset-0 overflow-hidden bg-dum-deep grain">
        <motion.video
          ref={video}
          style={{ scale: reduce ? 1 : videoScale }}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={SITE.heroPoster}
          aria-label="Our storefront, and a handi of biryani being opened"
        >
          <source src={SITE.heroVideo} type="video/mp4" />
        </motion.video>
        <div className="absolute inset-0 bg-gradient-to-t from-dum-deep via-dum-deep/55 to-dum-deep/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-dum-deep/85 via-dum-deep/25 to-transparent" />

        <motion.div
          style={{ y: reduce ? 0 : textY, opacity: reduce ? 1 : textOpacity }}
          className="relative z-10 flex min-h-[100svh] items-end pb-28 pt-28 md:pb-20"
        >
          <div className="wrap">
            <SplitReveal
              as="h1"
              text={BRAND.hero.kicker}
              className="display-xl max-w-[13ch] text-ivory"
              delay={delay(0.1)}
              play={ready}
            />

            <motion.ul
              initial={{ opacity: 0, y: 12 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: delay(0.55), duration: 0.7 }}
              className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-xl text-brass-light md:text-2xl"
            >
              {BRAND.hero.cities.map((c, i) => (
                <li key={c} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden className="text-brass/50">•</span>}
                  {c}
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: delay(0.7), duration: 0.8 }}
            >
              <p className="mt-6 max-w-xl text-lg text-ivory/85 md:text-xl">{BRAND.hero.line}</p>

              <p className="mt-7 inline-flex items-center gap-3 border-l-2 border-brass pl-4 font-display text-2xl text-ivory md:text-3xl">
                {BRAND.hero.promise}
              </p>
              <p className="mt-2 max-w-lg text-ivory/70">{BRAND.hero.support}</p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <a
                    href={waLink(WA.tasting)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('tasting_enquiry', { from: 'hero' })}
                    className="btn-brass"
                  >
                    <UtensilsCrossed size={19} /> Experience the tasting
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href={waLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('whatsapp_click', { from: 'hero' })}
                    className="btn-ghost"
                  >
                    <MessageCircle size={19} /> Order on WhatsApp
                  </a>
                </Magnetic>
                <Link href="/menu" className="px-2 py-2 font-semibold text-ivory/80 underline underline-offset-4 hover:text-ivory">
                  View menu
                </Link>
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ivory/75">
                <li className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-brass" /> Express Zone, Malad East
                </li>
                <li>{SITE.hours}</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>

        <button
          onClick={togglePlay}
          className="absolute right-5 top-24 z-10 grid h-11 w-11 place-items-center rounded-full border border-ivory/40 text-ivory hover:bg-ivory/10 md:right-8"
          aria-label={paused ? 'Play background video' : 'Pause background video'}
        >
          {paused ? <Play size={18} /> : <Pause size={18} />}
        </button>
      </motion.div>

      <AnimatePresence>
        {intro !== 'done' && (
          <motion.div className="jaali-intro pointer-events-none fixed inset-0 z-[120]" exit={{ opacity: 0 }} transition={{ duration: 0.3 }} aria-hidden>
            {(['left', 'right'] as const).map((side) => (
              <motion.div
                key={side}
                className={`absolute top-0 h-full w-1/2 bg-dum ${side === 'left' ? 'left-0 origin-left border-r' : 'right-0 origin-right border-l'} border-brass/60`}
                style={{ backgroundImage: JAALI, backgroundSize: '72px 72px' }}
                initial={{ x: '0%', rotateY: 0 }}
                animate={intro === 'playing' ? { x: side === 'left' ? '-102%' : '102%', rotateY: side === 'left' ? 18 : -18 } : {}}
                transition={{ delay: 0.95, duration: 1.15, ease: [0.76, 0, 0.24, 1] }}
              >
                <div className={`absolute inset-y-0 ${side === 'left' ? 'right-0' : 'left-0'} w-3 bg-gradient-to-b from-brass-dark via-brass to-brass-dark opacity-80`} />
              </motion.div>
            ))}
            <motion.div
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={intro === 'playing' ? { opacity: [0, 1, 1, 0], scale: [0.85, 1, 1, 1.08] } : {}}
              transition={{ duration: 1.3, times: [0, 0.35, 0.7, 1] }}
            >
              <Image src="/logo.png" alt="" width={132} height={132} priority className="drop-shadow-2xl" />
              <p className="site mt-3 font-display text-3xl text-brass-light" lang="hi">
                {SITE.taglineHindi}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
