'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, MessageCircle, Send } from 'lucide-react';
import { isValidIndianPhone, submitLead } from '@/lib/leads';
import { track } from '@/lib/analytics';
import { waLink } from '@/lib/site';

const TYPES = [
  'Order for today',
  'Tasting / Discovery Challenge',
  'Office lunch or corporate event',
  'Society event or family gathering',
  'Birthday or celebration',
  'Feedback',
  'Something else',
];

/** These are the enquiry types that need a headcount and a date. */
const BULK_TYPES = [
  'Office lunch or corporate event',
  'Society event or family gathering',
  'Birthday or celebration',
];

export default function ContactForm() {
  const [f, setF] = useState({ name: '', phone: '', email: '', service: TYPES[0], guests: '', date: '', message: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');
  const isBulk = BULK_TYPES.includes(f.service);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const summary = [f.message, isBulk && f.guests && `Guests: ${f.guests}`, isBulk && f.date && `Date: ${f.date}`].filter(Boolean).join('\n');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (f.name.trim().length < 2) return setError('Enter your name.');
    if (!isValidIndianPhone(f.phone)) return setError('Enter a 10-digit mobile number, for example 98765 43210.');
    setError('');
    setState('sending');
    try {
      await submitLead({ name: f.name, phone: f.phone, email: f.email, service: f.service, message: summary });
      track('lead_submitted', { service: f.service });
      if (isBulk) track('bulk_enquiry', { channel: 'form' });
      if (f.service.startsWith('Tasting')) track('tasting_enquiry', { from: 'contact_form' });
      setState('done');
    } catch (err) {
      console.error(err);
      setState('idle');
      setError('Could not send your message. Check your connection, or reach us on WhatsApp.');
    }
  }

  return (
    <div className="relative rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_-40px_rgba(8,42,33,.35)] ring-1 ring-dum/10 md:p-10">
      <AnimatePresence mode="wait">
        {state !== 'done' ? (
          <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -10 }} className="grid gap-4 sm:grid-cols-2">
            <h2 className="display-md text-dum sm:col-span-2">Send an enquiry</h2>
            <p className="-mt-2 text-ink/60 sm:col-span-2">We usually call back within the hour during opening times.</p>

            <label className="block"><span className="mb-1 block text-sm font-semibold">Name</span>
              <input className="field" autoComplete="name" value={f.name} onChange={set('name')} /></label>
            <label className="block"><span className="mb-1 block text-sm font-semibold">Mobile number</span>
              <input className="field" type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" value={f.phone} onChange={set('phone')} /></label>
            <label className="block"><span className="mb-1 block text-sm font-semibold">Email <span className="font-normal text-ink/50">(optional)</span></span>
              <input className="field" type="email" autoComplete="email" value={f.email} onChange={set('email')} /></label>
            <label className="block"><span className="mb-1 block text-sm font-semibold">What do you need?</span>
              <select className="field" value={f.service} onChange={set('service')}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>

            <AnimatePresence initial={false}>
              {isBulk && (
                <motion.div key="bulk" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid gap-4 overflow-hidden sm:col-span-2 sm:grid-cols-2">
                  <label className="block"><span className="mb-1 block text-sm font-semibold">Number of guests</span>
                    <input className="field" type="number" min={1} inputMode="numeric" value={f.guests} onChange={set('guests')} /></label>
                  <label className="block"><span className="mb-1 block text-sm font-semibold">Date</span>
                    <input className="field" type="date" value={f.date} onChange={set('date')} /></label>
                </motion.div>
              )}
            </AnimatePresence>

            <label className="block sm:col-span-2"><span className="mb-1 block text-sm font-semibold">Message <span className="font-normal text-ink/50">(optional)</span></span>
              <textarea className="field min-h-[7rem]" value={f.message} onChange={set('message')} placeholder={isBulk ? 'Which biryani, veg or non-veg split, delivery address…' : 'Tell us what you need'} /></label>

            {error && <p role="alert" className="text-sm font-medium text-chilli sm:col-span-2">{error}</p>}

            <button type="submit" disabled={state === 'sending'} className="btn-dum sm:col-span-2">
              {state === 'sending' ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {state === 'sending' ? 'Sending…' : 'Send enquiry'}
            </button>
          </motion.form>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }} className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-dum text-brass">
              <Check size={32} strokeWidth={3} />
            </motion.div>
            <h2 className="display-md mt-5 text-dum">Enquiry sent</h2>
            <p className="mx-auto mt-2 max-w-sm text-ink/65">Thanks, {f.name.split(' ')[0]}. We&apos;ll call {f.phone} shortly.</p>
            <a href={waLink(`Hi Daddu's Biryani, I just sent an enquiry (${f.service}). ${summary}`)} target="_blank" rel="noopener noreferrer" className="btn-brass mt-6">
              <MessageCircle size={18} /> Continue on WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
