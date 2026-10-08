'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useLead } from '@/components/LeadProvider';
import { BRAND } from '@/lib/brand';
import { SITE, waLink } from '@/lib/site';
import { track } from '@/lib/analytics';

export default function Footer() {
  const { openMenu } = useLead();
  return (
    <footer className="site jaali-bg relative overflow-hidden text-ivory pb-20 md:pb-0">
      <div className="wrap pt-20 pb-10">
        <div className="grid gap-10 border-b border-brass/25 pb-14 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="font-display text-brass-light text-3xl">{SITE.taglineHindi}</p>
            <h2 className="display-lg mt-2 max-w-xl">{BRAND.finalCta.title}</h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_click', { from: 'footer' })} className="btn-brass">Order on WhatsApp</a>
              <button onClick={openMenu} className="btn-ghost">Download menu</button>
            </div>
          </div>
          <ul className="grid gap-4 self-end text-ivory/85">
            <li className="flex gap-3"><MapPin className="mt-1 flex-none text-brass" size={18} />
              <a href={SITE.mapsLink} target="_blank" rel="noopener noreferrer" onClick={() => track('directions_click', { from: 'footer' })} className="hover:text-ivory">{SITE.addressLines.join(', ')}</a></li>
            <li className="flex gap-3"><Phone className="mt-1 flex-none text-brass" size={18} /><a href={`tel:${SITE.phoneTel}`} onClick={() => track('call_click', { from: 'footer' })} className="hover:text-ivory">{SITE.phoneDisplay}</a></li>
            <li className="flex gap-3"><Mail className="mt-1 flex-none text-brass" size={18} /><a href={`mailto:${SITE.email}`} className="hover:text-ivory">{SITE.email}</a></li>
            <li className="flex gap-3"><Clock className="mt-1 flex-none text-brass" size={18} />{SITE.hours}</li>
          </ul>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 border-b border-brass/15 py-6 text-sm text-ivory/70" aria-label="Biryani styles">
          <span className="font-semibold text-brass-light">Biryani styles</span>
          {BRAND.regions.map((r) => (
            <Link key={r.key} href={`/biryani/${r.key}`} className="hover:text-ivory">{r.style}</Link>
          ))}
        </nav>

        <div className="flex flex-col gap-6 pt-8 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={40} height={40} className="h-10 w-10" />
            <span className="font-display text-xl">Daddu&apos;s Biryani</span>
          </Link>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ivory/70" aria-label="Footer">
            <Link href="/menu" className="hover:text-ivory">Menu</Link>
            <Link href="/gallery" className="hover:text-ivory">Gallery</Link>
            <Link href="/about" className="hover:text-ivory">Our Story</Link>
            <Link href="/blogs" className="hover:text-ivory">Stories</Link>
            <Link href="/contact" className="hover:text-ivory">Contact</Link>
            <Link href="/admin" className="hover:text-ivory">Admin</Link>
          </nav>
          <p className="text-sm text-ivory/55">© {new Date().getFullYear()} Daddu&apos;s Biryani</p>
        </div>
      </div>
    </footer>
  );
}
