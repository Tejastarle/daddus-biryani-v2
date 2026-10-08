import type { Metadata } from 'next';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import ContactForm from '@/components/ContactForm';
import { PHOTOS, SITE, waLink } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact & Bulk Orders',
  description:
    "Call, WhatsApp or send an enquiry to Daddu's Biryani, Express Zone, Malad East, Mumbai. Office lunches, corporate events, society gatherings and family orders welcome.",
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <main className="site min-h-screen">
      <Header />
      <PageHero
        hindi="संपर्क करें"
        title="Order, ask, or plan for a crowd."
        intro="The fastest way to reach us is WhatsApp. For office lunches, society events and bulk orders, leave your details and we will call you back."
        image={PHOTOS.hyderabadi.src}
        imageAlt={PHOTOS.hyderabadi.alt}
      />

      <section className="bg-ivory py-16 md:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-3xl bg-[#1FA855] p-6 text-white transition hover:-translate-y-1">
              <MessageCircle size={32} />
              <span><span className="block font-display text-2xl">WhatsApp us</span><span className="text-white/85">Usually the quickest reply</span></span>
            </a>
            <a href={`tel:${SITE.phoneTel}`} className="flex items-center gap-4 rounded-3xl bg-dum p-6 text-ivory transition hover:-translate-y-1">
              <Phone size={30} className="text-brass" />
              <span><span className="block font-display text-2xl">{SITE.phoneDisplay}</span><span className="text-ivory/70">Tap to call</span></span>
            </a>
            <ul className="space-y-4 rounded-3xl bg-ivory-dim p-6">
              <li className="flex gap-3"><MapPin className="mt-1 flex-none text-kesar" size={20} /><a href={SITE.mapsLink} target="_blank" rel="noopener noreferrer" className="hover:underline">{SITE.addressLines[0]}<br />{SITE.addressLines[1]}</a></li>
              <li className="flex gap-3"><Clock className="mt-1 flex-none text-kesar" size={20} />{SITE.hours}</li>
              <li className="flex gap-3"><Mail className="mt-1 flex-none text-kesar" size={20} /><a href={`mailto:${SITE.email}`} className="hover:underline">{SITE.email}</a></li>
            </ul>
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="bg-ivory pb-24">
        <div className="wrap">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] ring-1 ring-dum/10 md:aspect-[21/9]">
            <iframe title="Map to Daddu's Biryani" src={SITE.mapsEmbed} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
