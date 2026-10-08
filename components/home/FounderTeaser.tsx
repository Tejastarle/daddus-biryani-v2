'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SplitReveal, fadeUp } from '@/components/Motion';
import { BRAND } from '@/lib/brand';

export default function FounderTeaser() {
  return (
    <section className="site bg-ivory-dim py-24 md:py-32" aria-labelledby="founder-title">
      <div className="wrap grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="font-semibold text-brass-dark">The story behind it</p>
          <SplitReveal as="h2" id="founder-title" text={BRAND.founder.headline} className="display-md mt-3 max-w-[16ch] text-dum" />
        </div>

        <div>
          <motion.p {...fadeUp} className="text-xl leading-relaxed text-ink/80">
            {BRAND.founder.story[1].body}
          </motion.p>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.12 }} className="mt-5 text-lg leading-relaxed text-ink/70">
            {BRAND.founder.story[2].body}
          </motion.p>

          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <p className="leading-tight">
              <span className="block font-display text-2xl text-dum">{BRAND.founder.name}</span>
              <span className="text-ink/60">{BRAND.founder.role}</span>
            </p>
            <Link href="/about" className="group inline-flex items-center gap-2 font-semibold text-dum">
              Read the full story
              <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
