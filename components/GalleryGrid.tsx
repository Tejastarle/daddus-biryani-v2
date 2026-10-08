'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { PHOTOS, SITE } from '@/lib/site';

type Item = { src: string; alt: string; w: number; h: number; caption: string; video?: boolean };

const ITEMS: Item[] = [
  { ...PHOTOS.kolkataTall, caption: 'Kolkata Biryani' },
  { src: SITE.heroPoster, alt: 'Steaming biryani in a copper handi', w: 1280, h: 720, caption: 'Fresh off the dum', video: true },
  { ...PHOTOS.lucknowi, caption: 'Chicken Lucknowi Biryani' },
  { ...PHOTOS.shamiTall, caption: 'Chicken Shami Kebab' },
  { ...PHOTOS.hyderabadi, caption: 'Chicken Hyderabadi Biryani' },
  { ...PHOTOS.muttonYakhniTall, caption: 'Mutton Yakhni Pulao' },
  { ...PHOTOS.seekh, caption: 'Chicken Seekh Kebab' },
  { ...PHOTOS.mumbaiTall, caption: 'Mumbai Biryani' },
  { ...PHOTOS.muttonAwadhi, caption: 'Mutton Awadhi Pulao' },
  { ...PHOTOS.vegHyderabadiTall, caption: 'Veg Hyderabadi Biryani' },
  { ...PHOTOS.soya, caption: 'Soya Chunks Biryani' },
  { ...PHOTOS.vegLucknowiTall, caption: 'Veg Lucknowi Biryani' },
  { ...PHOTOS.kolkata, caption: 'Kolkata Biryani, plated' },
  { ...PHOTOS.seekhTall, caption: 'Chicken Seekh Kebab, plated' },
  { ...PHOTOS.lucknowiTall, caption: 'Chicken Lucknowi Biryani, plated' },
  { ...PHOTOS.vegHyderabadi, caption: 'Veg Hyderabadi Biryani, plated' },
  { ...PHOTOS.shami, caption: 'Chicken Shami Kebab, plated' },
  { ...PHOTOS.soyaTall, caption: 'Soya Chunks Biryani, plated' },
];

export default function GalleryGrid() {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((v) => (v === null ? v : (v + d + ITEMS.length) % ITEMS.length)), []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, close, step]);

  const current = open !== null ? ITEMS[open] : null;

  return (
    <section className="site bg-ivory py-16 md:py-24">
      <div className="wrap columns-1 gap-4 sm:columns-2 lg:columns-3 [column-fill:_balance]">
        {ITEMS.map((it, i) => (
          <motion.button
            key={it.src}
            layoutId={`photo-${i}`}
            onClick={() => setOpen(i)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-5% 0px' }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group relative mb-4 block w-full overflow-hidden rounded-3xl bg-dum text-left break-inside-avoid"
            aria-label={`Open photo: ${it.caption}`}
          >
            {it.video ? (
              <div className="relative aspect-video">
                <video src={SITE.heroVideo} poster={SITE.heroPoster} muted loop playsInline autoPlay className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-dum-deep/70 px-3 py-1 text-xs font-semibold text-ivory"><Play size={12} /> Video</span>
              </div>
            ) : (
              <Image src={it.src} alt={it.alt} width={it.w} height={it.h} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="h-auto w-full transition-transform duration-700 group-hover:scale-105" />
            )}
            <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-dum-deep/90 to-transparent p-4 pt-12 font-semibold text-ivory opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
              {it.caption}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {current && open !== null && (
          <motion.div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={current.caption}>
            <button className="absolute inset-0 bg-dum-deep/95" onClick={close} aria-label="Close" />
            <motion.figure layoutId={`photo-${open}`} className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl bg-dum-deep" transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
              {current.video ? (
                <video src={SITE.heroVideo} poster={SITE.heroPoster} controls autoPlay muted loop playsInline className="max-h-[80vh] w-full object-contain" />
              ) : (
                <Image key={current.src} src={current.src} alt={current.alt} width={current.w} height={current.h} sizes="90vw" className="max-h-[80vh] w-full object-contain" priority />
              )}
              <figcaption className="flex items-center justify-between p-4 text-ivory">
                <span className="font-display text-2xl">{current.caption}</span>
                <span className="text-sm text-ivory/60">{open + 1} / {ITEMS.length}</span>
              </figcaption>
            </motion.figure>
            <button onClick={close} aria-label="Close" className="absolute right-4 top-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-ivory/10 text-ivory hover:bg-ivory/20"><X /></button>
            <button onClick={() => step(-1)} aria-label="Previous photo" className="absolute left-2 md:left-6 z-20 grid h-12 w-12 place-items-center rounded-full bg-ivory/10 text-ivory hover:bg-ivory/20"><ChevronLeft /></button>
            <button onClick={() => step(1)} aria-label="Next photo" className="absolute right-2 md:right-6 z-20 grid h-12 w-12 place-items-center rounded-full bg-ivory/10 text-ivory hover:bg-ivory/20"><ChevronRight /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
