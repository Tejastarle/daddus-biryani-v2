'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mic } from 'lucide-react';
import { SplitReveal, fadeUp } from '@/components/Motion';
import { BRAND } from '@/lib/brand';

/** Questions people actually ask at the counter, pointing into the blog. */
export default function StoriesTeaser() {
  return (
    <section className="site bg-ivory py-24 md:py-28" aria-labelledby="stories-title">
      <div className="wrap grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SplitReveal as="h2" id="stories-title" text={BRAND.stories.title} className="display-lg text-dum" />
          <motion.p {...fadeUp} className="mt-3 text-ink/70">{BRAND.stories.sub}</motion.p>

          <ul className="mt-8 divide-y divide-dum/12 border-y border-dum/12">
            {BRAND.stories.ideas.slice(0, 5).map((q, i) => (
              <motion.li
                key={q}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Link href="/blogs" className="group flex items-center justify-between gap-4 py-4 text-lg text-ink/85 hover:text-dum">
                  {q}
                  <ArrowUpRight size={18} className="flex-none text-brass-dark transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </motion.li>
            ))}
          </ul>

          <motion.div {...fadeUp} className="mt-8">
            <Link href="/blogs" className="btn-dum">Read Biryani Stories</Link>
          </motion.div>
        </div>

        <motion.aside {...fadeUp} className="self-start rounded-[2rem] bg-dum p-8 text-ivory md:p-10">
          <Mic size={26} className="text-brass" />
          <h3 className="mt-4 font-display text-3xl">{BRAND.podcast.title}</h3>
          <p className="mt-1 text-brass-light">{BRAND.podcast.sub}</p>
          <p className="mt-5 text-ivory/70">{BRAND.podcast.body}</p>
        </motion.aside>
      </div>
    </section>
  );
}
