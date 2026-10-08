'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PHOTOS } from '@/lib/site';

const ROW_A = [PHOTOS.kolkata, PHOTOS.shami, PHOTOS.vegLucknowi, PHOTOS.hyderabadi, PHOTOS.seekh, PHOTOS.muttonYakhni, PHOTOS.lucknowi];
const ROW_B = [PHOTOS.muttonAwadhi, PHOTOS.soya, PHOTOS.mumbai, PHOTOS.shamiTall, PHOTOS.vegHyderabadi, PHOTOS.kolkataTall, PHOTOS.lucknowiTall];

/** Two rows of photos that drift in opposite directions as you scroll. */
export default function KitchenStrip() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xa = useTransform(scrollYProgress, [0, 1], ['0%', '-28%']);
  const xb = useTransform(scrollYProgress, [0, 1], ['-28%', '0%']);

  return (
    <section ref={ref} className="site overflow-hidden bg-ivory pb-24 md:pb-32" aria-label="Photos from our kitchen">
      <div className="wrap mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="display-md max-w-[16ch] text-dum">Straight from our kitchen</h2>
          <p className="mt-2 text-lg text-ink/70">
            What you see is what we serve. Real food, real portions, photographed here — no stock pictures anywhere on this site.
          </p>
        </div>
        <Link href="/gallery" className="group inline-flex flex-none items-center gap-2 font-semibold text-dum">
          Open gallery <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
      {[{ row: ROW_A, x: xa }, { row: ROW_B, x: xb }].map(({ row, x }, r) => (
        <motion.div key={r} style={{ x }} className={`flex w-max gap-4 ${r ? 'mt-4 pl-24' : ''}`}>
          {row.map((p) => (
            <Link key={p.src} href="/gallery" className="group relative h-48 w-72 md:h-64 md:w-[26rem] flex-none overflow-hidden rounded-2xl">
              <Image src={p.src} alt={p.alt} fill sizes="420px" className="object-cover transition duration-700 group-hover:scale-105" />
            </Link>
          ))}
        </motion.div>
      ))}
    </section>
  );
}
