'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Flame, MessageCircle } from 'lucide-react';
import { SplitReveal, fadeUp } from '@/components/Motion';
import { BRAND } from '@/lib/brand';
import { PHOTOS, WA, waLink } from '@/lib/site';
import { track } from '@/lib/analytics';

/** Keep each regional style honest, and let the customer set their own heat. */
export default function SalanCustomisation() {
  return (
    <section className="site bg-dum py-24 text-ivory md:py-32" aria-labelledby="salan-title">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ clipPath: 'inset(0 0 100% 0 round 32px)' }}
          whileInView={{ clipPath: 'inset(0 0 0% 0 round 32px)' }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="relative order-2 aspect-[5/4] overflow-hidden rounded-[2rem] ring-1 ring-brass/25 lg:order-1"
        >
          <Image src={PHOTOS.lucknowi.src} alt={PHOTOS.lucknowi.alt} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
        </motion.div>

        <div className="order-1 lg:order-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-chilli/20 px-4 py-1.5 text-sm font-semibold text-ivory">
            <Flame size={15} className="fill-chilli text-chilli" /> Set your own heat
          </span>
          <SplitReveal as="h2" id="salan-title" text={BRAND.salan.title} className="display-md mt-4 max-w-[18ch]" />
          <motion.p {...fadeUp} className="mt-5 text-lg text-ivory/80">{BRAND.salan.body}</motion.p>
          <motion.p {...fadeUp} className="mt-4 border-l-2 border-brass pl-4 font-display text-2xl text-brass-light">
            {BRAND.salan.principle}
          </motion.p>

          <dl className="mt-8 space-y-4">
            {BRAND.salan.points.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="border-t border-brass/20 pt-4"
              >
                <dt className="font-semibold text-ivory">{p.title}</dt>
                <dd className="mt-0.5 text-ivory/70">{p.body}</dd>
              </motion.div>
            ))}
          </dl>

          <motion.a
            {...fadeUp}
            href={waLink(WA.salan)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('whatsapp_click', { from: 'salan' })}
            className="btn-brass mt-8"
          >
            <MessageCircle size={18} /> Ask about add-ons
          </motion.a>
        </div>
      </div>
    </section>
  );
}
