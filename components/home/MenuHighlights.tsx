'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Download } from 'lucide-react';
import { useLead } from '@/components/LeadProvider';
import { SplitReveal, Tilt, fadeUp } from '@/components/Motion';
import { MENU, fromPrice, inr } from '@/lib/menu';
import { PHOTOS } from '@/lib/site';
import { track } from '@/lib/analytics';

const PICKS = [
  { id: 'mutton-yakhni-pulao-lucknowi', photo: PHOTOS.muttonYakhni, line: 'Mutton cooked into its own stock — the yakhni — then cooked into the rice.', span: 'md:col-span-7 md:row-span-2', tall: true },
  { id: 'shami-kebab-chicken', photo: PHOTOS.shami, line: 'Pan-crisped outside, soft inside. Half is 3 pieces, full is 6.', span: 'md:col-span-5' },
  { id: 'mutton-awadhi-pulao-lucknowi', photo: PHOTOS.muttonAwadhi, line: 'Cooked in desi ghee, the Awadhi way.', span: 'md:col-span-5' },
  { id: 'soya-dum-biryani', photo: PHOTOS.soya, line: 'Soya chunks with the full dum treatment.', span: 'md:col-span-4' },
  { id: 'seekh-kebab-chicken', photo: PHOTOS.seekh, line: 'Minced chicken with green chilli, off the grill.', span: 'md:col-span-4' },
  { id: 'veg-dum-biryani-hyderabadi', photo: PHOTOS.vegHyderabadi, line: 'Peas, carrot, beans and cauliflower, cooked on dum.', span: 'md:col-span-4' },
];

export default function MenuHighlights() {
  const { openMenu } = useLead();

  return (
    <section className="site bg-ivory py-24 md:py-32" aria-labelledby="menu-title">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SplitReveal as="h2" id="menu-title" text="Beyond the four biryanis" className="display-lg max-w-[13ch] text-dum" />
          <motion.p {...fadeUp} className="max-w-sm text-ink/70">
            Pulao, kebabs, rolls and a proper veg biryani. Prices shown are for a half portion.
          </motion.p>
        </div>

        <div className="mt-12 grid auto-rows-[260px] gap-4 md:auto-rows-[230px] md:grid-cols-12">
          {PICKS.map((p, i) => {
            const item = MENU.find((m) => m.id === p.id);
            if (!item) return null;
            return (
              <motion.div
                key={p.id}
                className={p.span}
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-5% 0px' }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <Tilt className="h-full" max={p.tall ? 4 : 7}>
                  <Link href="/menu" className="group relative block h-full overflow-hidden rounded-[1.75rem] bg-dum">
                    <Image src={p.photo.src} alt={p.photo.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dum-deep/90 via-dum-deep/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-ivory md:p-6">
                      <div className="flex items-end justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className={`${p.tall ? 'text-4xl md:text-5xl' : 'text-2xl'} leading-tight`}>{item.name}</h3>
                          <p className={`mt-1 text-sm text-ivory/75 md:text-base ${p.tall ? '' : 'line-clamp-1'}`}>{p.line}</p>
                        </div>
                        <span className="flex-none rounded-full bg-brass px-3 py-1 text-sm font-bold text-dum-deep transition-transform group-hover:-translate-y-1">
                          {inr(fromPrice(item))}
                        </span>
                      </div>
                    </div>
                  </Link>
                </Tilt>
              </motion.div>
            );
          })}
        </div>

        <motion.div {...fadeUp} className="mt-10 flex flex-wrap gap-3">
          <Link href="/menu" onClick={() => track('menu_view', { from: 'highlights' })} className="btn-dum">
            See the full menu <ArrowUpRight size={18} />
          </Link>
          <button onClick={openMenu} className="btn-dum !bg-transparent !text-dum border-[1.5px] border-dum">
            <Download size={18} /> Download the menu
          </button>
        </motion.div>
      </div>
    </section>
  );
}
