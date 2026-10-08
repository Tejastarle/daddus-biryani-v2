'use client';

import { MessageCircle, UtensilsCrossed } from 'lucide-react';
import { WA, waLink } from '@/lib/site';
import { track } from '@/lib/analytics';

export default function StyleActions({ style }: { style: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={waLink(WA.style(style))}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('whatsapp_click', { from: 'style_page', style })}
        className="btn-brass"
      >
        <MessageCircle size={18} /> Order {style} on WhatsApp
      </a>
      <a
        href={waLink(WA.tasting)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('tasting_enquiry', { from: 'style_page', style })}
        className="btn-ghost"
      >
        <UtensilsCrossed size={18} /> Ask about the tasting
      </a>
    </div>
  );
}
