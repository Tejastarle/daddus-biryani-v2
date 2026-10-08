import { supabase } from '@/lib/supabase';

export type LeadInput = {
  name: string;
  phone: string;
  email?: string;
  service: string;
  message?: string;
};

/**
 * Saves a lead into the existing `leads` table so it shows up in /admin/leads.
 * `service` records where the lead came from (Menu download, Bulk order, ...).
 */
export async function submitLead(input: LeadInput) {
  const page = typeof window !== 'undefined' ? window.location.pathname : '';
  const { error } = await supabase.from('leads').insert([
    {
      name: input.name.trim(),
      email: (input.email || '').trim(),
      phone: input.phone.trim(),
      service: input.service,
      message: [input.message?.trim(), page && `Page: ${page}`].filter(Boolean).join('\n'),
      status: 'new',
    },
  ]);
  if (error) throw error;
  try {
    localStorage.setItem('db_lead', JSON.stringify({ name: input.name, phone: input.phone }));
  } catch {
    /* storage unavailable */
  }
}

export function knownLead(): { name: string; phone: string } | null {
  try {
    const v = localStorage.getItem('db_lead');
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}

export const isValidIndianPhone = (p: string) => /^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(p.trim());
