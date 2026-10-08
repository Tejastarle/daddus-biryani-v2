'use client';

import { motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';
import { SplitReveal, fadeUp } from '@/components/Motion';
import { BRAND } from '@/lib/brand';
import { WA, waLink } from '@/lib/site';
import { track } from '@/lib/analytics';

/**
 * The tasting, framed as curiosity rather than a freebie.
 * Terms are deliberately not stated here — the conversation happens on WhatsApp.
 */
export default function DiscoveryChallenge() {
  return (
    <section className="site bg-ivory-dim py-24 md:py-32" aria-labelledby="challenge-title">
      <div className="wrap">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <SplitReveal as="h2" id="challenge-title" text={BRAND.challenge.title} className="display-lg max-w-[15ch] text-dum" />
          <motion.p {...fadeUp} className="text-lg text-ink/75">{BRAND.challenge.body}</motion.p>
        </div>

        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {BRAND.challenge.steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative border-t-2 border-dum/15 pt-6"
            >
              <span className="absolute -top-[13px] left-0 grid h-6 w-6 place-items-center rounded-full bg-dum text-xs font-bold text-ivory">
                {i + 1}
              </span>
              <h3 className="text-2xl text-dum">{s.title}</h3>
              <p className="mt-2 text-ink/70">{s.body}</p>
            </motion.li>
          ))}
        </ol>

        <motion.div {...fadeUp} className="mt-12">
          <a
            href={waLink(WA.tasting)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('tasting_enquiry', { from: 'challenge' })}
            className="btn-dum"
          >
            <UtensilsCrossed size={18} /> {BRAND.challenge.cta}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
