'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { animate, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MessageCircle, PhoneCall } from 'lucide-react';
import { useLead } from '@/components/LeadProvider';
import { SplitReveal, fadeUp } from '@/components/Motion';
import { BRAND } from '@/lib/brand';
import { BULK, bulkLabel, inr, type MenuEntry } from '@/lib/menu';
import { WA, waLink } from '@/lib/site';
import { track } from '@/lib/analytics';

/**
 * SERVING BASIS — from the owner: 1 kg Lucknowi serves about 5–7 people.
 * Main meal uses the lower end (more food per head), with other dishes the
 * higher end. These are the only two assumptions in this calculator; change
 * them here once the final figure is confirmed.
 */
const PER_KG = { main: 5, side: 7 };

const SERVING = [
  { key: 'main', label: 'Biryani is the main dish' },
  { key: 'side', label: 'Served with other dishes' },
] as const;

const DIET = [
  { key: 'nonveg', label: 'Non-veg' },
  { key: 'mixed', label: 'Mixed' },
  { key: 'veg', label: 'Veg' },
] as const;

const NON_VEG = BULK.filter((b) => b.veg === false);
const VEG = BULK.filter((b) => b.veg === true);

/** Roughly how a mixed crowd usually splits. The customer can change it. */
const SPLITS = [
  { key: '70', label: 'Mostly non-veg', nonVeg: 0.7 },
  { key: '50', label: 'About even', nonVeg: 0.5 },
  { key: '30', label: 'Mostly veg', nonVeg: 0.3 },
] as const;

const roundKg = (n: number) => Math.max(1, Math.ceil(n * 2) / 2);

function Counter({ value, format }: { value: number; format: (n: number) => string }) {
  const mv = useMotionValue(value);
  const [text, setText] = useState(format(value));
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.55, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setText(format(v)) });
    return c.stop;
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span>{text}</span>;
}

function DishSelect({ id, label, list, value, onChange }: {
  id: string; label: string; list: MenuEntry[]; value: string; onChange: (v: string) => void;
}) {
  const grouped = useMemo(() => {
    const g: Record<string, MenuEntry[]> = {};
    list.forEach((b) => {
      const k = b.protein === 'mutton' ? 'Mutton'
        : b.protein === 'chicken' ? 'Chicken'
        : b.protein === 'egg' ? 'Egg'
        : b.protein === 'prawns' ? 'Prawns'
        : b.protein === 'paneer' ? 'Paneer'
        : b.protein === 'soya' ? 'Soya' : 'Veg';
      (g[k] ||= []).push(b);
    });
    return g;
  }, [list]);

  return (
    <div>
      <label htmlFor={id} className="font-semibold">{label}</label>
      <select id={id} className="field field-dark mt-2" value={value} onChange={(e) => onChange(e.target.value)}>
        {Object.entries(grouped).map(([g, items]) => (
          <optgroup key={g} label={g}>
            {items.map((b) => (
              <option key={b.id} value={b.id}>{bulkLabel(b)} · {inr(b.prices.perKg)}/kg</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

export default function PartyEstimator() {
  const { openEnquiry } = useLead();
  const ids = { guests: useId(), date: useId(), nv: useId(), v: useId() };

  const [guests, setGuests] = useState(40);
  const [date, setDate] = useState('');
  const [serving, setServing] = useState<(typeof SERVING)[number]['key']>('main');
  const [diet, setDiet] = useState<(typeof DIET)[number]['key']>('nonveg');
  const [split, setSplit] = useState<(typeof SPLITS)[number]['key']>('70');
  const [nvId, setNvId] = useState(
    NON_VEG.find((b) => b.region === 'hyderabadi' && b.cut === 'Drumstick')?.id ?? NON_VEG[0]?.id ?? '',
  );
  const [vId, setVId] = useState(VEG.find((b) => b.protein === 'veg')?.id ?? VEG[0]?.id ?? '');

  const perKg = PER_KG[serving];
  const totalKg = guests / perKg;
  const nvShare = diet === 'nonveg' ? 1 : diet === 'veg' ? 0 : SPLITS.find((s) => s.key === split)!.nonVeg;

  // The "how does the group split" step only appears for a mixed group, so the
  // visible steps are numbered on the fly rather than hard-coded.
  const stepNo = (n: number) => (diet === 'mixed' || n <= 2 ? n : n - 1);

  const nvDish = BULK.find((b) => b.id === nvId);
  const vDish = BULK.find((b) => b.id === vId);
  const nvKg = nvShare > 0 ? roundKg(totalKg * nvShare) : 0;
  const vKg = nvShare < 1 ? roundKg(totalKg * (1 - nvShare)) : 0;
  const cost = nvKg * (nvDish?.prices.perKg ?? 0) + vKg * (vDish?.prices.perKg ?? 0);
  const kg = nvKg + vKg;

  const fill = useSpring(0, { stiffness: 80, damping: 18 });
  useEffect(() => { fill.set(Math.min(1, kg / 50)); }, [kg, fill]);
  const riceY = useTransform(fill, [0, 1], [150, 48]);

  const lines = [
    nvKg ? `${nvKg} kg ${bulkLabel(nvDish!)}` : '',
    vKg ? `${vKg} kg ${bulkLabel(vDish!)}` : '',
  ].filter(Boolean);
  const summary = `${guests} guests${date ? `, ${date}` : ''} — ${lines.join(' + ')} (about ${kg} kg, estimate ${inr(Math.round(cost))})`;

  return (
    <section id="bulk" className="site relative overflow-hidden bg-dum-deep py-24 text-ivory md:py-32" aria-labelledby="party-title">
      <div className="absolute inset-0 jaali-bg opacity-60" aria-hidden />

      <div className="wrap relative grid items-start gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <SplitReveal as="h2" id="party-title" text={BRAND.bulk.title} className="display-lg max-w-[13ch]" />
          <p className="mt-4 max-w-lg text-ivory/70">{BRAND.bulk.body}</p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {BRAND.bulk.events.map((e) => (
              <li key={e} className="rounded-full bg-ivory/8 px-3.5 py-1.5 text-sm text-ivory/80 ring-1 ring-brass/20">{e}</li>
            ))}
          </ul>

          <div className="mt-10 space-y-7">
            <fieldset>
              <legend className="font-semibold"><span className="text-brass">{stepNo(1)}.</span> Veg or non-veg?</legend>
              <div className="mt-2 grid grid-cols-3 gap-2 rounded-full bg-ivory/5 p-1 ring-1 ring-brass/25">
                {DIET.map((d) => (
                  <button key={d.key} type="button" onClick={() => setDiet(d.key)} aria-pressed={diet === d.key}
                    className="relative rounded-full px-3 py-2.5 text-sm font-semibold">
                    {diet === d.key && <motion.span layoutId="diet" className="absolute inset-0 rounded-full bg-brass" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                    <span className={`relative ${diet === d.key ? 'text-dum-deep' : 'text-ivory/80'}`}>{d.label}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            {diet === 'mixed' && (
              <motion.fieldset initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                <legend className="font-semibold"><span className="text-brass">2.</span> Roughly how does the group split?</legend>
                <div className="mt-2 grid grid-cols-3 gap-2 rounded-full bg-ivory/5 p-1 ring-1 ring-brass/25">
                  {SPLITS.map((s) => (
                    <button key={s.key} type="button" onClick={() => setSplit(s.key)} aria-pressed={split === s.key}
                      className="relative rounded-full px-2 py-2.5 text-sm font-semibold">
                      {split === s.key && <motion.span layoutId="split" className="absolute inset-0 rounded-full bg-brass" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                      <span className={`relative ${split === s.key ? 'text-dum-deep' : 'text-ivory/80'}`}>{s.label}</span>
                    </button>
                  ))}
                </div>
              </motion.fieldset>
            )}

            {diet !== 'veg' && <DishSelect id={ids.nv} label={`${stepNo(3)}. Which non-veg biryani?`} list={NON_VEG} value={nvId} onChange={setNvId} />}
            {diet !== 'nonveg' && <DishSelect id={ids.v} label={`${stepNo(3)}. Which veg biryani?`} list={VEG} value={vId} onChange={setVId} />}

            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor={ids.guests} className="font-semibold"><span className="text-brass">{stepNo(4)}.</span> How many guests?</label>
                <span className="font-display text-4xl text-brass-light">
                  <Counter value={guests} format={(n) => String(Math.round(n))} />
                </span>
              </div>
              <input
                id={ids.guests} type="range" min={10} max={300} step={5} value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="mt-3 h-2 w-full cursor-pointer accent-[#C9A24B]"
                aria-valuetext={`${guests} guests`}
              />
              <div className="mt-1 flex justify-between text-xs text-ivory/45"><span>10</span><span>300</span></div>
            </div>

            <fieldset>
              <legend className="font-semibold"><span className="text-brass">{stepNo(5)}.</span> How is it being served?</legend>
              <div className="mt-2 grid grid-cols-2 gap-2 rounded-full bg-ivory/5 p-1 ring-1 ring-brass/25">
                {SERVING.map((s) => (
                  <button key={s.key} type="button" onClick={() => setServing(s.key)} aria-pressed={serving === s.key}
                    className="relative rounded-full px-3 py-2.5 text-sm font-semibold">
                    {serving === s.key && <motion.span layoutId="serving" className="absolute inset-0 rounded-full bg-brass" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                    <span className={`relative ${serving === s.key ? 'text-dum-deep' : 'text-ivory/80'}`}>{s.label}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor={ids.date} className="font-semibold"><span className="text-brass">{stepNo(6)}.</span> Date <span className="font-normal text-ivory/50">(optional)</span></label>
              <input id={ids.date} type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field field-dark mt-2" />
            </div>
          </div>
        </div>

        <motion.div {...fadeUp} className="rounded-[2rem] bg-ivory p-7 text-ink shadow-2xl md:p-9 lg:sticky lg:top-28">
          <svg viewBox="0 0 240 190" className="mx-auto h-40 w-auto" aria-hidden>
            <defs>
              <clipPath id="handi-clip"><path d="M40 60 Q30 150 120 172 Q210 150 200 60 Z" /></clipPath>
              <linearGradient id="rice" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#F3C46B" /><stop offset="1" stopColor="#E8912D" />
              </linearGradient>
            </defs>
            {[70, 120, 170].map((cx, i) => (
              <motion.path key={cx} d={`M${cx} 46 q-8 -14 0 -26 q8 -12 0 -22`} stroke="#C9A24B" strokeWidth="3" fill="none" strokeLinecap="round"
                animate={{ opacity: [0, 0.8, 0], y: [6, -8, -18] }} transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.7 }} />
            ))}
            <g clipPath="url(#handi-clip)">
              <rect x="0" y="0" width="240" height="190" fill="#F1E7D2" />
              <motion.rect x="0" width="240" height="190" fill="url(#rice)" style={{ y: riceY }} />
            </g>
            <path d="M40 60 Q30 150 120 172 Q210 150 200 60" fill="none" stroke="#0E3B2F" strokeWidth="5" />
            <rect x="28" y="50" width="184" height="14" rx="7" fill="#0E3B2F" />
            <path d="M28 64 q-22 6 -12 26" stroke="#C9A24B" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M212 64 q22 6 12 26" stroke="#C9A24B" strokeWidth="5" fill="none" strokeLinecap="round" />
          </svg>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-2xl bg-ivory-dim p-4">
              <dt className="text-sm text-ink/60">Roughly</dt>
              <dd className="font-display text-4xl text-dum"><Counter value={kg} format={(n) => (Math.round(n * 2) / 2).toString()} /> kg</dd>
            </div>
            <div className="rounded-2xl bg-ivory-dim p-4">
              <dt className="text-sm text-ink/60">Estimate</dt>
              <dd className="font-display text-4xl text-dum"><Counter value={cost} format={(n) => inr(Math.round(n))} /></dd>
            </div>
          </dl>

          <ul className="mt-4 space-y-1.5 text-sm text-ink/75">
            {lines.map((l) => (
              <li key={l} className="flex gap-2"><span aria-hidden className="text-kesar">—</span>{l}</li>
            ))}
          </ul>

          <p className="mt-4 text-xs leading-relaxed text-ink/55">
            Worked out from 1 kg serving about {perKg} people {serving === 'main' ? 'when biryani is the main dish' : 'when there are other dishes too'}.
            It is a starting point, not a quote — we will confirm the quantity with you.
          </p>

          <div className="mt-6 grid gap-3">
            <a
              href={waLink(`${WA.bulk(String(guests), date || undefined)} ${summary}`)}
              target="_blank" rel="noopener noreferrer"
              onClick={() => track('bulk_enquiry', { channel: 'whatsapp', guests })}
              className="btn-brass w-full"
            >
              <MessageCircle size={18} /> Get a confirmed quote on WhatsApp
            </a>
            <button
              onClick={() => {
                track('bulk_enquiry', { channel: 'form', guests });
                openEnquiry({ service: 'Bulk order', title: 'Get a confirmed quote', message: summary });
              }}
              className="btn-dum w-full"
            >
              <PhoneCall size={18} /> Ask us to call back
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
