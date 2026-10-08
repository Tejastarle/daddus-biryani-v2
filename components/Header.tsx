'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Download, Menu, MessageCircle, Phone, X } from 'lucide-react';
import { useLead } from '@/components/LeadProvider';
import { SITE, waLink } from '@/lib/site';
import { track } from '@/lib/analytics';

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Our Story', href: '/about' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Stories', href: '/blogs' },
  { label: 'Contact', href: '/contact' },
];

/** `transparent` floats the header over a full-bleed hero until the visitor scrolls. */
export default function Header({ transparent = false }: { transparent?: boolean }) {
  const pathname = usePathname();
  const { openMenu } = useLead();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(!transparent);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(!transparent || y > 60);
    setHidden(transparent && y > 500 && y > prev && !open);
  });

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname?.startsWith(href));

  return (
    <>
      <motion.header
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`site ${transparent ? 'fixed' : 'sticky'} inset-x-0 top-0 z-[60] transition-[background-color,box-shadow] duration-500 ${
          solid ? 'backdrop-blur-md shadow-[0_1px_0_rgba(201,162,75,.25)]' : ''
        }`}
        style={{ background: solid ? 'rgba(8,42,33,.92)' : 'transparent' }}
      >
        <div className="wrap flex h-[72px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3" aria-label={`${SITE.name} home`}>
            <Image src="/logo.png" alt="" width={48} height={48} priority className="h-12 w-12 object-contain" />
            <span className="leading-none">
              <span className="block font-display text-[1.45rem] text-ivory">Daddu&apos;s Biryani</span>
              <span className="block text-[.8rem] text-brass-light">{SITE.taglineHindi}</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            {NAV.map((l) => (
              <Link key={l.href} href={l.href} className="relative px-3.5 py-2 text-[.98rem] font-semibold text-ivory/85 hover:text-ivory">
                {isActive(l.href) && (
                  <motion.span layoutId="nav-pill" className="absolute inset-x-2 -bottom-0.5 h-[2px] rounded bg-brass" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={openMenu} className="hidden md:inline-flex btn-ghost !min-h-[2.6rem] !px-4 text-sm">
              <Download size={16} /> Menu PDF
            </button>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('whatsapp_click', { from: 'header' })}
              className="hidden sm:inline-flex btn-brass !min-h-[2.6rem] !px-4 text-sm"
            >
              <MessageCircle size={16} /> Order now
            </a>
            <button onClick={() => setOpen(true)} className="lg:hidden grid h-11 w-11 place-items-center rounded-full text-ivory hover:bg-ivory/10" aria-label="Open menu">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="site jaali-bg fixed inset-0 z-[95] flex flex-col text-ivory lg:hidden"
            initial={{ clipPath: 'circle(0% at calc(100% - 44px) 36px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 44px) 36px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 44px) 36px)' }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          >
            <div className="wrap flex h-[72px] items-center justify-between">
              <span className="font-display text-2xl">Daddu&apos;s Biryani</span>
              <button onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-ivory/10" aria-label="Close menu">
                <X size={26} />
              </button>
            </div>
            <nav className="wrap mt-6 flex flex-col" aria-label="Mobile">
              {NAV.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 + i * 0.06 }}>
                  <Link href={l.href} onClick={() => setOpen(false)} className={`block py-2.5 font-display text-4xl ${isActive(l.href) ? 'text-brass' : ''}`}>
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div className="wrap mt-auto grid gap-3 pb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
              <button onClick={() => { setOpen(false); openMenu(); }} className="btn-ghost"><Download size={18} /> Download menu</button>
              <a href={`tel:${SITE.phoneTel}`} onClick={() => track('call_click', { from: 'mobile_menu' })} className="btn-brass">
                <Phone size={18} /> Call {SITE.phoneDisplay}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
