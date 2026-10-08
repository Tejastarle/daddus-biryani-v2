'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SpiceLevel from '@/components/SpiceLevel';
import { SplitReveal, fadeUp } from '@/components/Motion';
import { BRAND } from '@/lib/brand';
import { inr, regionFromPrice } from '@/lib/menu';
import { track } from '@/lib/analytics';

const ROWS = [
  { key: 'taste', label: 'Taste' },
  { key: 'spice', label: 'Spice level' },
  { key: 'character', label: 'Character' },
  { key: 'idealFor', label: 'Ideal for' },
] as const;

/**
 * A plain comparison so a first-time customer can pick a style without
 * knowing anything about regional biryani. Table on desktop, cards on phones.
 */
export default function BiryaniComparison() {
  return (
    <section className="site bg-ivory-dim py-24 md:py-32" aria-labelledby="compare-title">
      <div className="wrap">
        <SplitReveal as="h2" id="compare-title" text="Which one is yours?" className="display-lg max-w-[14ch] text-dum" />
        <motion.p {...fadeUp} className="mt-3 max-w-xl text-ink/70">
          The four styles are genuinely different dishes, not the same biryani with different names. Here is the short version.
        </motion.p>

        {/* Desktop: one table, easy to scan down a column */}
        <motion.div {...fadeUp} className="mt-12 hidden md:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Comparison of the four regional biryani styles</caption>
            <thead>
              <tr>
                <th scope="col" className="w-32 pb-5 align-bottom" />
                {BRAND.regions.map((r) => (
                  <th key={r.key} scope="col" className="pb-5 pl-6 align-bottom">
                    <span className="block font-display text-3xl font-normal text-dum lg:text-4xl">{r.style}</span>
                    {regionFromPrice(r.key as 'lucknowi') && (
                      <span className="mt-1 block text-sm font-normal text-brass-dark">
                        From {inr(regionFromPrice(r.key as 'lucknowi'))}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.key} className="border-t border-dum/15">
                  <th scope="row" className="py-5 pr-4 align-top text-sm font-semibold text-brass-dark">{row.label}</th>
                  {BRAND.regions.map((r) => (
                    <td key={r.key} className="py-5 pl-6 align-top text-ink/85">
                      {row.key === 'spice' ? <SpiceLevel level={r.spiceLevel} label={r.spice} /> : r[row.key]}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-dum/15">
                <th scope="row" className="sr-only">Menu</th>
                {BRAND.regions.map((r) => (
                  <td key={r.key} className="pl-6 pt-5" colSpan={1}>
                    <Link
                      href={`/biryani/${r.key}`}
                      onClick={() => track('style_view', { style: r.key, from: 'comparison' })}
                      className="group inline-flex items-center gap-1.5 font-semibold text-dum"
                    >
                      See {r.style}
                      <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>

        {/* Phones: one card per style, stacked */}
        <div className="mt-10 grid gap-4 md:hidden">
          {BRAND.regions.map((r, i) => (
            <motion.article
              key={r.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="rounded-3xl bg-white p-5 ring-1 ring-dum/10"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-3xl text-dum">{r.style}</h3>
                {regionFromPrice(r.key as 'lucknowi') && (
                  <span className="text-sm font-semibold text-brass-dark">From {inr(regionFromPrice(r.key as 'lucknowi'))}</span>
                )}
              </div>
              <dl className="mt-4 space-y-2.5 text-[.95rem]">
                {ROWS.map((row) => (
                  <div key={row.key} className="grid grid-cols-[5.5rem_1fr] gap-3">
                    <dt className="font-semibold text-brass-dark">{row.label}</dt>
                    <dd className="text-ink/85">
                      {row.key === 'spice' ? <SpiceLevel level={r.spiceLevel} label={r.spice} /> : r[row.key]}
                    </dd>
                  </div>
                ))}
              </dl>
              <Link
                href={`/biryani/${r.key}`}
                onClick={() => track('style_view', { style: r.key, from: 'comparison_mobile' })}
                className="mt-4 inline-flex items-center gap-1.5 font-semibold text-dum"
              >
                See {r.style} <ArrowUpRight size={16} />
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div {...fadeUp} className="mt-14 rounded-3xl bg-dum px-7 py-9 text-center text-ivory md:px-10">
          <h3 className="font-display text-3xl md:text-4xl">{BRAND.undecided.title}</h3>
          <p className="mt-2 font-display text-xl text-brass-light md:text-2xl">{BRAND.undecided.line}</p>
        </motion.div>
      </div>
    </section>
  );
}
