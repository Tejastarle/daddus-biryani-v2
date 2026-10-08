'use client';

import { motion } from 'framer-motion';
import { MapPin, MessageCircle } from 'lucide-react';
import { Magnetic, SplitReveal, fadeUp } from '@/components/Motion';
import { BRAND } from '@/lib/brand';
import { SITE, waLink } from '@/lib/site';
import { track } from '@/lib/analytics';

export default function FinalCta() {
  return (
    <section className="site jaali-bg py-24 text-center text-ivory md:py-32" aria-labelledby="final-cta">
      <div className="wrap">
        <SplitReveal as="h2" id="final-cta" text={BRAND.finalCta.title} className="display-lg mx-auto max-w-[16ch]" />
        <motion.p {...fadeUp} className="mt-4 font-display text-2xl text-brass-light md:text-3xl">
          {BRAND.finalCta.line}
        </motion.p>

        <motion.div {...fadeUp} className="mt-10 flex flex-wrap justify-center gap-3">
          <Magnetic>
            <a
              href={SITE.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('directions_click', { from: 'final_cta' })}
              className="btn-brass"
            >
              <MapPin size={18} /> Visit us
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('whatsapp_click', { from: 'final_cta' })}
              className="btn-ghost"
            >
              <MessageCircle size={18} /> WhatsApp us
            </a>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
