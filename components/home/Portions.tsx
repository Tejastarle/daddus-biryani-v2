'use client';

import { motion } from 'framer-motion';
import { Drumstick, Scale, Utensils } from 'lucide-react';
import { SplitReveal, fadeUp } from '@/components/Motion';
import { BRAND } from '@/lib/brand';

const ICONS = [Utensils, Drumstick, Scale];

/** Portion transparency. Every number here was supplied by the owner. */
export default function Portions() {
  return (
    <section className="site bg-ivory py-24 md:py-32" aria-labelledby="portions-title">
      <div className="wrap">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SplitReveal as="h2" id="portions-title" text={BRAND.portions.title} className="display-lg max-w-[12ch] text-dum" />
          <motion.p {...fadeUp} className="max-w-sm text-ink/70 md:text-right">{BRAND.portions.body}</motion.p>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {BRAND.portions.sizes.map((s, i) => {
            const Icon = ICONS[i];
            const headline = i === 2;
            return (
              <motion.li
                key={s.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5% 0px' }}
                transition={{ duration: 0.65, delay: i * 0.08 }}
                className={`rounded-3xl p-7 ${headline ? 'bg-dum text-ivory' : 'bg-ivory-dim text-ink'}`}
              >
                <Icon size={26} className={headline ? 'text-brass' : 'text-kesar'} />
                <h3 className={`mt-4 font-display text-3xl ${headline ? 'text-ivory' : 'text-dum'}`}>{s.name}</h3>
                <ul className={`mt-4 space-y-2 ${headline ? 'text-ivory/85' : 'text-ink/80'}`}>
                  {s.lines.map((l) => (
                    <li key={l} className="flex gap-2.5">
                      <span aria-hidden className={headline ? 'text-brass' : 'text-kesar'}>—</span>
                      {l}
                    </li>
                  ))}
                </ul>
                {s.note && <p className={`mt-4 text-sm ${headline ? 'text-ivory/55' : 'text-ink/55'}`}>{s.note}</p>}
              </motion.li>
            );
          })}
        </ul>

        <motion.p {...fadeUp} className="mt-6 rounded-2xl bg-ivory-dim px-6 py-4 text-ink/80">
          {BRAND.portions.curryCut}
        </motion.p>
      </div>
    </section>
  );
}
