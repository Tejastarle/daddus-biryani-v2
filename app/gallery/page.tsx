import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import GalleryGrid from '@/components/GalleryGrid';
import { PHOTOS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    "Real photos of the biryani, pulao and kebabs we serve at Daddu's Biryani, Malad East. Every picture was taken in our own kitchen — no stock photography.",
  alternates: { canonical: '/gallery' },
};

export default function GalleryPage() {
  return (
    <main className="site min-h-screen">
      <Header />
      <PageHero
        hindi="तस्वीरें"
        title="What you see is what we serve."
        intro="Real food, real portions, photographed in our own kitchen. No stock pictures anywhere on this site. Tap any photo to see it larger."
        image={PHOTOS.shami.src}
        imageAlt={PHOTOS.shami.alt}
      />
      <GalleryGrid />
      <Footer />
    </main>
  );
}
