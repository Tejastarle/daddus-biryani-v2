import { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import MenuBrowser from '@/components/menu/MenuBrowser';
import MenuDownloadButtons from '@/components/menu/MenuDownloadButtons';
import { MENU } from '@/lib/menu';
import { PHOTOS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Menu & Prices',
  description: `The full Daddu's Biryani menu: Lucknowi, Hyderabadi, Kolkata and Mumbai dum biryani, pulao, kebabs, rolls and combos — ${MENU.length}+ dishes with half, full and per-kg prices. Download the PDF or Excel menu.`,
  alternates: { canonical: '/menu' },
};

export default function MenuPage() {
  return (
    <main className="site min-h-screen">
      <Header />
      <PageHero
        hindi="मेन्यू"
        title="Four traditions, every price."
        intro="Grouped by style, so you can compare like with like. Half, full and per-kg prices are all shown, with NA where we don't offer a size."
        image={PHOTOS.muttonYakhni.src}
        imageAlt={PHOTOS.muttonYakhni.alt}
      >
        <MenuDownloadButtons />
      </PageHero>
      <Suspense>
        <MenuBrowser />
      </Suspense>
      <Footer />
    </main>
  );
}
