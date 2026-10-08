'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SplitReveal, fadeUp } from '@/components/Motion';
import { BRAND } from '@/lib/brand';

/** The reason to believe behind the promise: consistency by design, not by luck. */
export default function Biryanieering() {
  return (
    <section className="site relative overflow-hidden bg-dum-deep py-24 text-ivory md:py-32" aria-labelledby="be-title">
      <div className="absolute inset-0 jaali-bg opacity-70" aria-hidden />

      <div className="wrap relative">
        <p className="font-display text-[clamp(2.4rem,6.5vw,5rem)] leading-none tracking-tight text-brass">
          {BRAND.engineering.name}
        </p>
        <SplitReveal
          as="h2"
          id="be-title"
          text={BRAND.engineering.question}
          className="display-md mt-4 max-w-[20ch] text-ivory"
        />

        <motion.p {...fadeUp} className="mt-6 max-w-2xl text-lg text-ivory/75">
          {BRAND.engineering.body}
        </motion.p>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-brass/25 sm:grid-cols-2 lg:grid-cols-4">
          {BRAND.engineering.pillars.map((p, i) => (
            <motion.li
              key={p.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{ duration: 0.65, delay: i * 0.08 }}
              className="bg-dum p-7"
            >
              <span className="font-display text-4xl text-brass/50" aria-hidden>{i + 1}</span>
              <h3 className="mt-3 text-2xl">{p.title}</h3>
              <p className="mt-2 text-ivory/70">{p.body}</p>
            </motion.li>
          ))}
        </ol>

        <motion.div {...fadeUp} className="mt-10">
          <Link href="/about" className="group inline-flex items-center gap-2 font-semibold text-brass-light">
            Read the founder&apos;s story
            <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
