'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { FileText, MessageCircle, Phone } from 'lucide-react';
import { useLead } from '@/components/LeadProvider';
import { SITE, waLink } from '@/lib/site';
import { track } from '@/lib/analytics';

/** Scroll progress, floating WhatsApp button (desktop) and a thumb-reach action bar (mobile). */
export default function SiteChrome() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const { openMenu } = useLead();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <div className="site contents">
      <motion.div aria-hidden style={{ scaleX }} className="fixed left-0 right-0 top-0 z-[70] h-[3px] origin-left bg-kesar" />

      <motion.a
        href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="Order on WhatsApp"
        onClick={() => track('whatsapp_click', { from: 'floating' })}
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.8, type: 'spring' }}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
        className="group fixed bottom-6 right-6 z-[80] hidden md:flex items-center gap-2 rounded-full bg-[#1FA855] pl-4 pr-5 py-3 text-white shadow-xl"
      >
        <span className="absolute inset-0 rounded-full bg-[#1FA855] animate-ping opacity-20" />
        <MessageCircle size={22} className="relative" />
        <span className="relative font-semibold">Order on WhatsApp</span>
      </motion.a>

      <nav aria-label="Quick actions" className="fixed inset-x-0 bottom-0 z-[80] grid grid-cols-3 border-t border-brass/25 bg-dum-deep/95 backdrop-blur md:hidden pb-[env(safe-area-inset-bottom)]">
        <a href={`tel:${SITE.phoneTel}`} onClick={() => track('call_click', { from: 'mobile_bar' })} className="flex flex-col items-center gap-0.5 py-2.5 text-ivory text-xs font-semibold"><Phone size={20} className="text-brass" />Call</a>
        <a href={waLink()} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_click', { from: 'mobile_bar' })} className="flex flex-col items-center gap-0.5 py-2.5 bg-[#1FA855] text-white text-xs font-semibold"><MessageCircle size={20} />WhatsApp</a>
        <button onClick={openMenu} className="flex flex-col items-center gap-0.5 py-2.5 text-ivory text-xs font-semibold"><FileText size={20} className="text-brass" />Menu PDF</button>
      </nav>
    </div>
  );
}
