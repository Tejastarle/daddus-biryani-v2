'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { BRAND, NEEDS_OWNER_INPUT } from '@/lib/brand';

/** The founder's story as a timeline. A line draws down the page as you read. */
export default function FounderStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const grow = useSpring(scrollYProgress, { stiffness: 90, damping: 28, restDelta: 0.001 });

  const chapters = [
    ...BRAND.founder.story,
    ...(NEEDS_OWNER_INPUT.nameStory.ready
      ? [{ heading: NEEDS_OWNER_INPUT.nameStory.heading, body: NEEDS_OWNER_INPUT.nameStory.body }]
      : []),
  ];

  return (
    <section className="site bg-ivory py-20 md:py-28" aria-label="Founder's story">
      <div ref={ref} className="wrap relative max-w-3xl">
        {/* the thread running through the story */}
        <div className="absolute bottom-0 left-[7px] top-2 w-px bg-dum/12 md:left-[9px]" aria-hidden />
        <motion.div
          className="absolute left-[7px] top-2 w-px origin-top bg-brass md:left-[9px]"
          style={{ height: '100%', scaleY: grow }}
          aria-hidden
        />

        <ol className="space-y-14">
          {chapters.map((c, i) => (
            <motion.li
              key={c.heading}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="relative pl-10 md:pl-14"
            >
              <span className="absolute left-0 top-2 grid h-[15px] w-[15px] place-items-center rounded-full bg-dum md:h-[19px] md:w-[19px]">
                <span className="h-1.5 w-1.5 rounded-full bg-brass" />
              </span>
              <h2 className="font-display text-3xl leading-tight text-dum md:text-4xl">{c.heading}</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink/80">{c.body}</p>
              {i === chapters.length - 1 && (
                <p className="mt-8 leading-tight">
                  <span className="block font-display text-2xl text-dum">{BRAND.founder.name}</span>
                  <span className="text-ink/60">{BRAND.founder.role}</span>
                </p>
              )}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
