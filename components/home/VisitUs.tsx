'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, Navigation, Phone } from 'lucide-react';
import { SplitReveal, fadeUp } from '@/components/Motion';
import { SITE } from '@/lib/site';

export default function VisitUs() {
  return (
    <section className="site bg-ivory py-24 md:py-32" aria-labelledby="visit-title">
      <div className="wrap grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <SplitReveal as="h2" text="Come hungry. Second floor, Express Zone." className="display-lg text-dum max-w-[14ch]" />
          <motion.ul {...fadeUp} id="visit-title" className="mt-8 space-y-5 text-lg">
            <li className="flex gap-4"><MapPin className="mt-1 flex-none text-kesar" /><span>{SITE.addressLines[0]}<br />{SITE.addressLines[1]}</span></li>
            <li className="flex gap-4"><Clock className="mt-1 flex-none text-kesar" /><span>{SITE.hours}</span></li>
            <li className="flex gap-4"><Phone className="mt-1 flex-none text-kesar" /><a href={`tel:${SITE.phoneTel}`} className="hover:underline">{SITE.phoneDisplay}</a></li>
          </motion.ul>
          <motion.div {...fadeUp} className="mt-8 flex flex-wrap gap-3">
            <a href={SITE.mapsLink} target="_blank" rel="noopener noreferrer" className="btn-dum"><Navigation size={18} /> Get directions</a>
            <a href={`tel:${SITE.phoneTel}`} className="btn-dum !bg-transparent !text-dum border-[1.5px] border-dum">Call to reserve</a>
          </motion.div>
        </div>
        <motion.div
          initial={{ clipPath: 'inset(12% 12% 12% 12% round 32px)', opacity: 0.4 }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 32px)', opacity: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-ivory-dim ring-1 ring-dum/10"
        >
          <iframe title="Map to Daddu's Biryani" src={SITE.mapsEmbed} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </motion.div>
      </div>
    </section>
  );
}
