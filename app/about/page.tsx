import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import FounderStory from '@/components/FounderStory';
import { BRAND } from '@/lib/brand';
import { PHOTOS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    "How Daddu's Biryani began: a Kanpur childhood, a flavour that went missing in Mumbai, and an engineer who set out to understand why biryani tastes different in every region.",
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <main className="site min-h-screen">
      <Header />
      <PageHero
        hindi="हमारी कहानी"
        title={BRAND.founder.headline}
        intro={`${BRAND.founder.name} · ${BRAND.founder.role}`}
        image={PHOTOS.lucknowi.src}
        imageAlt={PHOTOS.lucknowi.alt}
      />

      <FounderStory />

      {/* BIRYANIEGINEERING — the philosophy the story leads to */}
      <section className="jaali-bg py-20 text-ivory md:py-28" aria-labelledby="be-about">
        <div className="wrap">
          <p className="font-display text-[clamp(2rem,5.5vw,4rem)] leading-none text-brass">{BRAND.engineering.name}</p>
          <h2 id="be-about" className="display-md mt-4 max-w-[22ch]">
            Right ingredients. Right process. Right proportion. Consistent results.
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-ivory/75">{BRAND.engineering.body}</p>

          <dl className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-brass/25 sm:grid-cols-2 lg:grid-cols-4">
            {BRAND.engineering.pillars.map((p) => (
              <div key={p.title} className="bg-dum p-7">
                <dt className="text-2xl">{p.title}</dt>
                <dd className="mt-2 text-ivory/70">{p.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* What that means on the plate */}
      <section className="bg-ivory py-20 md:py-28" aria-labelledby="grain-about">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
            <Image src={PHOTOS.kolkata.src} alt={PHOTOS.kolkata.alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div lang="hi">
            <h2 id="grain-about" className="display-md max-w-[22ch] text-dum">{BRAND.everyGrain.title}</h2>
            <div className="mt-5 space-y-4 leading-relaxed text-ink/80">
              {BRAND.everyGrain.paragraphs.slice(0, 3).map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
            <p className="mt-4 font-display text-xl text-brass-dark">{BRAND.everyGrain.close}</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
