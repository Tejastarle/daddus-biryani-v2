'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Check, Download, FileSpreadsheet, Loader2, MessageCircle, X } from 'lucide-react';
import { isValidIndianPhone, knownLead, submitLead } from '@/lib/leads';
import { PHOTOS, SITE, waLink } from '@/lib/site';
import { track } from '@/lib/analytics';

type Mode = { kind: 'menu' } | { kind: 'enquiry'; service: string; message?: string; title?: string };
type Ctx = { openMenu: () => void; openEnquiry: (o: { service: string; message?: string; title?: string }) => void };

const LeadCtx = createContext<Ctx>({ openMenu: () => {}, openEnquiry: () => {} });
export const useLead = () => useContext(LeadCtx);

function triggerDownload(href: string) {
  const a = document.createElement('a');
  a.href = href;
  a.download = href.split('/').pop() || 'menu';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function LeadProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode | null>(null);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  const openMenu = useCallback(() => setMode({ kind: 'menu' }), []);
  const openEnquiry = useCallback((o: { service: string; message?: string; title?: string }) => setMode({ kind: 'enquiry', ...o }), []);

  return (
    <LeadCtx.Provider value={{ openMenu, openEnquiry }}>
      {children}
      {!isAdmin && (
        <>
          <AnimatePresence>{mode && <LeadModal key="lead" mode={mode} onClose={() => setMode(null)} />}</AnimatePresence>
          <PartyNudge onOpen={openMenu} suppressed={!!mode || pathname === '/contact'} />
        </>
      )}
    </LeadCtx.Provider>
  );
}

function LeadModal({ mode, onClose }: { mode: Mode; onClose: () => void }) {
  const isMenu = mode.kind === 'menu';
  const [step, setStep] = useState<'form' | 'done'>('form');
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const lead = knownLead();
    if (lead && isMenu) setStep('done');
    else if (lead) setForm((f) => ({ ...f, name: lead.name, phone: lead.phone }));
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setTimeout(() => firstField.current?.focus(), 250);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isMenu, onClose]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (form.name.trim().length < 2) return setError('Enter your name so we know who to call back.');
    if (!isValidIndianPhone(form.phone)) return setError('Enter a 10-digit mobile number, for example 98765 43210.');
    setError('');
    setSending(true);
    try {
      await submitLead({
        ...form,
        service: isMenu ? 'Menu download' : mode.service,
        message: isMenu ? 'Downloaded the full menu' : mode.message,
      });
      setStep('done');
      track('lead_submitted', { service: isMenu ? 'Menu download' : mode.service });
      if (isMenu) {
        track('menu_download', { format: 'pdf' });
        triggerDownload(SITE.menuPdf);
      }
    } catch (err) {
      console.error(err);
      if (isMenu) {
        // Never block the menu because the database is unreachable
        setStep('done');
        track('menu_download', { format: 'pdf', saved: 'no' });
        triggerDownload(SITE.menuPdf);
      } else {
        setError('Could not save your details. Check your connection and try again, or message us on WhatsApp.');
      }
    } finally {
      setSending(false);
    }
  }

  const title = isMenu ? 'Get the full menu' : mode.title || 'Tell us about your order';
  const sub = isMenu
    ? 'All 140+ dishes with small, large and per-kg party prices, as a PDF and Excel sheet.'
    : 'Leave your number and we will call you back with a confirmed quote.';

  return (
    <motion.div
      className="site fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      role="dialog" aria-modal="true" aria-labelledby="lead-title"
    >
      <motion.button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-dum-deep/70 backdrop-blur-sm" />
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="relative w-full sm:max-w-3xl grid md:grid-cols-[1fr_1.15fr] overflow-hidden rounded-t-3xl sm:rounded-3xl bg-ivory shadow-2xl"
      >
        <div className="relative hidden md:block">
          <Image src={PHOTOS.kolkata.src} alt={PHOTOS.kolkata.alt} fill sizes="360px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dum-deep/85 via-dum-deep/10 to-transparent" />
          <p className="absolute bottom-6 left-6 right-6 text-ivory font-display text-2xl leading-tight">{SITE.taglineHindi}</p>
        </div>

        <div className="p-6 sm:p-9">
          <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full text-ink/70 hover:bg-ink/5">
            <X size={20} />
          </button>

          <AnimatePresence mode="wait">
            {step === 'form' ? (
              <motion.div key="form" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                <h2 id="lead-title" className="display-md text-dum pr-8">{title}</h2>
                <p className="mt-2 text-ink/70">{sub}</p>
                <form onSubmit={send} className="mt-6 space-y-3" noValidate>
                  <label className="block">
                    <span className="mb-1 block text-sm font-semibold">Name</span>
                    <input ref={firstField} className="field" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-semibold">Mobile number</span>
                    <input className="field" type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-semibold">Email <span className="font-normal text-ink/50">(optional)</span></span>
                    <input className="field" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </label>
                  <AnimatePresence>
                    {error && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-sm font-medium text-chilli" role="alert">
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <button type="submit" disabled={sending} className="btn-dum w-full mt-2">
                    {sending ? <Loader2 className="animate-spin" size={18} /> : isMenu ? <Download size={18} /> : <Check size={18} />}
                    {sending ? 'Saving…' : isMenu ? 'Download menu' : 'Request a call back'}
                  </button>
                  <p className="text-xs text-ink/55">We only use your number to reply about your order.</p>
                </form>
              </motion.div>
            ) : (
              <motion.div key="done" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
                <motion.div
                  initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.1 }}
                  className="grid h-14 w-14 place-items-center rounded-full bg-dum text-brass"
                >
                  <Check size={28} strokeWidth={3} />
                </motion.div>
                <h2 id="lead-title" className="display-md mt-5 text-dum">{isMenu ? 'Your menu is ready' : 'Request received'}</h2>
                <p className="mt-2 text-ink/70">
                  {isMenu
                    ? 'If the PDF did not open, use the buttons below.'
                    : 'We will call you shortly. For a faster reply, send the same details on WhatsApp.'}
                </p>
                <div className="mt-6 grid gap-3">
                  {isMenu && (
                    <>
                      <a href={SITE.menuPdf} download className="btn-dum"><Download size={18} /> Menu PDF</a>
                      <a href={SITE.menuXlsx} download onClick={() => track('menu_download', { format: 'xlsx' })} className="btn-dum !bg-transparent !text-dum border-[1.5px] border-dum"><FileSpreadsheet size={18} /> Excel sheet</a>
                    </>
                  )}
                  <a
                    href={waLink(isMenu ? "Hi Daddu's Biryani, I just saw your menu. I'd like to order." : `Hi Daddu's Biryani, ${mode.kind === 'enquiry' ? mode.message || '' : ''}`)}
                    target="_blank" rel="noopener noreferrer" className="btn-brass"
                  >
                    <MessageCircle size={18} /> Order on WhatsApp
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** A quiet corner card shown once per visit, after 35 s or when a desktop visitor heads for the tab bar. */
function PartyNudge({ onOpen, suppressed }: { onOpen: () => void; suppressed: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('db_nudge') || knownLead()) return;
    } catch {
      return;
    }
    const reveal = () => {
      setShow(true);
      try { sessionStorage.setItem('db_nudge', '1'); } catch { /* ignore */ }
      cleanup();
    };
    const t = window.setTimeout(reveal, 35000);
    const onLeave = (e: MouseEvent) => { if (e.clientY <= 0) reveal(); };
    document.addEventListener('mouseout', onLeave);
    const cleanup = () => { window.clearTimeout(t); document.removeEventListener('mouseout', onLeave); };
    return cleanup;
  }, []);

  return (
    <AnimatePresence>
      {show && !suppressed && (
        <motion.aside
          initial={{ opacity: 0, y: 30, x: -10 }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          className="site fixed bottom-24 left-4 right-4 z-[90] sm:right-auto sm:bottom-6 sm:w-[22rem] rounded-2xl bg-dum-deep text-ivory shadow-2xl ring-1 ring-brass/30 overflow-hidden"
        >
          <div className="flex gap-4 p-4">
            <div className="relative h-20 w-20 flex-none overflow-hidden rounded-xl">
              <Image src={PHOTOS.muttonYakhni.src} alt="" fill sizes="80px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl leading-tight">Ordering for a group?</p>
              <p className="mt-1 text-sm text-ivory/70">Planning for a crowd? Per-kg prices are all in the menu.</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => { setShow(false); onOpen(); }} className="rounded-full bg-brass px-4 py-2 text-sm font-semibold text-dum-deep hover:bg-brass-light">Get menu</button>
                <button onClick={() => setShow(false)} className="rounded-full px-3 py-2 text-sm text-ivory/70 hover:text-ivory">Not now</button>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
