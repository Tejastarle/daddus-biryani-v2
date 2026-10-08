'use client';

import { motion } from 'framer-motion';
import { Ear, Eye, Hand, Soup, Wind } from 'lucide-react';
import { Magnetic, SplitReveal, fadeUp } from '@/components/Motion';
import { BRAND } from '@/lib/brand';
import { WA, waLink } from '@/lib/site';
import { track } from '@/lib/analytics';

const ICONS = { eye: Eye, wind: Wind, ear: Ear, hand: Hand, taste: Soup };

/**
 * The commercial idea of the site: four senses set the biryani up, the fifth
 * one decides — so taste first, then order.
 */
export default function TasteFirst() {
  return (
    <section className="site bg-ivory py-24 md:py-32" aria-labelledby="taste-first">
      <div className="wrap">
        <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
          <div>
            <SplitReveal as="h2" id="taste-first" text={BRAND.senses.title} className="display-lg text-dum" />
            <motion.p {...fadeUp} className="mt-5 font-display text-2xl text-brass-dark md:text-3xl">
              {BRAND.tasteFirst.question}
            </motion.p>
          </div>

          <div className="md:pt-3">
            <motion.p {...fadeUp} className="text-xl leading-relaxed text-ink/80 md:text-2xl">
              {BRAND.senses.intro}
            </motion.p>
          </div>
        </div>

        {/* The five senses, with taste as the one that settles it */}
        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {BRAND.senses.items.map((s, i) => {
            const Icon = ICONS[s.icon as keyof typeof ICONS];
            const decider = i === BRAND.senses.items.length - 1;
            return (
              <motion.li
                key={s.label}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5% 0px' }}
                transition={{ duration: 0.6, delay: i * 0.09 }}
                className={`relative rounded-3xl p-6 ${
                  decider ? 'bg-dum text-ivory ring-1 ring-brass/30' : 'bg-ivory-dim'
                }`}
              >
                <Icon size={26} className={decider ? 'text-brass' : 'text-kesar'} />
                <h3 className={`mt-4 text-2xl ${decider ? 'text-ivory' : 'text-dum'}`}>{s.label}</h3>
                <p className={`mt-1.5 text-[.95rem] ${decider ? 'text-ivory/75' : 'text-ink/70'}`}>{s.body}</p>
                {decider && (
                  <span className="mt-4 inline-block rounded-full bg-brass px-3 py-1 text-xs font-bold text-dum-deep">
                    The decider
                  </span>
                )}
              </motion.li>
            );
          })}
        </ol>

        {/* Why a picture cannot decide for you */}
        <div className="mt-16 grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
          <motion.div {...fadeUp} className="space-y-4 text-lg leading-relaxed text-ink/80">
            <p>{BRAND.senses.character}</p>
            <p>{BRAND.senses.cannotTell}</p>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.12 }}
            className="rounded-[2rem] bg-dum p-7 text-ivory md:p-9"
          >
            <p className="font-display text-2xl leading-snug text-brass-light md:text-3xl">
              {BRAND.senses.offer}
            </p>
            <p className="mt-4 text-ivory/80">{BRAND.senses.invitation}</p>
            <p className="mt-5 font-display text-3xl text-ivory" lang="hi">
              {BRAND.senses.hindi}
            </p>
            <Magnetic>
              <a
                href={waLink(WA.tasting)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('tasting_enquiry', { from: 'taste_first' })}
                className="btn-brass mt-7"
              >
                Ask about the tasting
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
