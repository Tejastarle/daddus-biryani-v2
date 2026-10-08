'use client';

import { Download, MessageCircle } from 'lucide-react';
import { useLead } from '@/components/LeadProvider';
import { waLink } from '@/lib/site';
import { track } from '@/lib/analytics';

export default function MenuDownloadButtons() {
  const { openMenu } = useLead();
  return (
    <div className="flex flex-wrap gap-3">
      <button onClick={openMenu} className="btn-brass">
        <Download size={18} /> Download menu (PDF & Excel)
      </button>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('whatsapp_click', { from: 'menu_hero' })}
        className="btn-ghost"
      >
        <MessageCircle size={18} /> Order on WhatsApp
      </a>
    </div>
  );
}
