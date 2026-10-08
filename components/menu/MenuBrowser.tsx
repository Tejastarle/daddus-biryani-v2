'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Download, Info, MessageCircle, Search, X } from 'lucide-react';
import { useLead } from '@/components/LeadProvider';
import SpiceLevel from '@/components/SpiceLevel';
import { MENU, MENU_SECTIONS, inr, sectionOf, variantLabels, type MenuEntry, type SectionKey } from '@/lib/menu';
import { BRAND } from '@/lib/brand';
import { WA, waLink } from '@/lib/site';
import { track } from '@/lib/analytics';

const SIZES = [
  { key: 'half', label: 'Half' },
  { key: 'full', label: 'Full' },
  { key: 'perKg', label: '1 kg' },
] as const;

type SizeKey = (typeof SIZES)[number]['key'];
type Group = { name: string; variants: MenuEntry[] };

/** The green / red square used on Indian menus. */
function FoodMark({ veg }: { veg?: boolean }) {
  if (veg === undefined) return null;
  return (
    <span
      className={`food-mark mt-[0.4em] shrink-0 ${veg ? 'text-leaf' : 'text-chilli'}`}
      role="img"
      aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'}
    />
  );
}

/** Dish name with the dotted rule that runs out to the prices, as on a printed menu. */
function Leader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`flex items-baseline gap-2 ${className}`}>
      <span>{children}</span>
      <span aria-hidden className="mb-[0.3em] min-w-6 flex-1 border-b border-dotted border-dum/30" />
    </span>
  );
}

function Price({ value, span }: { value?: number; span?: number }) {
  return (
    <span
      style={span && span > 1 ? { gridColumn: `span ${span}` } : undefined}
      className={value ? 'text-right font-semibold tabular-nums text-dum' : 'text-right text-sm text-ink/35'}
    >
      {value ? inr(value) : 'NA'}
    </span>
  );
}

/** "Half ₹180 · Full ₹320 · 1 kg ₹1,600" — used on narrow screens. */
function PriceInline({ e, cols }: { e: MenuEntry; cols: readonly { key: SizeKey; label: string }[] }) {
  if (e.prices.price) return <span className="font-semibold tabular-nums text-dum">{inr(e.prices.price)}</span>;
  return (
    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-[.95rem]">
      {cols.map((c) => (
        <span key={c.key} className="whitespace-nowrap">
          <span className="text-ink/45">{c.label} </span>
          {e.prices[c.key] ? (
            <span className="font-semibold tabular-nums text-dum">{inr(e.prices[c.key])}</span>
          ) : (
            <span className="text-ink/35">NA</span>
          )}
        </span>
      ))}
    </span>
  );
}

/** A dish in a section that prices by size: one row, or one row per cut. */
function GridDish({ group, cols }: { group: Group; cols: readonly { key: SizeKey; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const lead = group.variants[0];
  const labels = variantLabels(group.variants);
  const hasVariants = labels !== null;
  const portion = group.variants.find((v) => v.portion)?.portion;

  return (
    <div className="border-t border-dum/10 py-4 first:border-t-0">
      <div
        className="hidden items-baseline gap-x-4 md:grid"
        style={{ gridTemplateColumns: `minmax(0,1fr) repeat(${cols.length}, 4.75rem)` }}
      >
        <span className="flex gap-2.5">
          <FoodMark veg={lead.veg} />
          <Leader className="min-w-0 flex-1 text-[1.0625rem] font-semibold leading-snug text-ink">
            {group.name}
          </Leader>
        </span>

        {!hasVariants &&
          (lead.prices.price ? (
            <Price value={lead.prices.price} span={cols.length} />
          ) : (
            cols.map((c) => <Price key={c.key} value={lead.prices[c.key]} />)
          ))}
        {hasVariants && <span style={{ gridColumn: `span ${cols.length}` }} />}

        {(lead.note || lead.includes) && (
          <span className="col-span-full -mt-0.5 pl-[1.55rem] text-sm text-ink/55">
            {lead.note ?? lead.includes?.join(' · ')}
          </span>
        )}

        {hasVariants &&
          group.variants.map((v, i) => (
            <span key={v.id} className="contents">
              <span className="pl-[1.55rem] pt-1.5 text-[.95rem] text-ink/70">
                <Leader>{labels[i]}</Leader>
              </span>
              {cols.map((c) => (
                <span key={c.key} className="pt-1.5">
                  <Price value={v.prices[c.key]} />
                </span>
              ))}
            </span>
          ))}
      </div>

      <div className="flex gap-2.5 md:hidden">
        <FoodMark veg={lead.veg} />
        <div className="min-w-0 flex-1">
          <p className="text-[1.0625rem] font-semibold leading-snug text-ink">{group.name}</p>
          {(lead.note || lead.includes) && (
            <p className="mt-0.5 text-sm text-ink/55">{lead.note ?? lead.includes?.join(' · ')}</p>
          )}
          {!hasVariants && <div className="mt-1.5"><PriceInline e={lead} cols={cols} /></div>}
          {hasVariants &&
            group.variants.map((v, i) => (
              <div key={v.id} className="mt-2">
                <p className="text-[.95rem] text-ink/70">{labels[i]}</p>
                <PriceInline e={v} cols={cols} />
              </div>
            ))}
        </div>
      </div>

      {portion && (
        <div className="pl-0 pt-2 md:pl-[1.55rem]">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brass-dark hover:text-dum"
          >
            <Info size={14} /> {open ? 'Hide portion detail' : 'What you get'}
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.dl
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 overflow-hidden rounded-xl bg-ivory-dim"
              >
                <div className="grid gap-3 p-4 sm:grid-cols-3">
                  {SIZES.filter((s) => portion[s.key]).map((s) => (
                    <div key={s.key}>
                      <dt className="text-xs font-semibold text-brass-dark">{s.label}</dt>
                      <dd className="mt-0.5 text-sm text-ink/75">{portion[s.key]}</dd>
                    </div>
                  ))}
                </div>
              </motion.dl>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/** A dish in a single-price section: name, dotted rule, price. Sits in two columns. */
function SimpleDish({ group }: { group: Group }) {
  const e = group.variants[0];
  return (
    <div className="mb-4 break-inside-avoid">
      <div className="flex items-baseline gap-2.5">
        <FoodMark veg={e.veg} />
        <Leader className="min-w-0 flex-1 text-[1.0625rem] font-semibold leading-snug text-ink">
          {group.name}
        </Leader>
        <span className="font-semibold tabular-nums text-dum">{inr(e.prices.price ?? e.prices.half)}</span>
      </div>
      {(e.includes || e.note) && (
        <p className="pl-[1.55rem] pr-14 text-sm leading-snug text-ink/55">
          {e.includes ? e.includes.join(' · ') : e.note}
          {e.serves && <span className="text-brass-dark"> · serves {e.serves}</span>}
        </p>
      )}
    </div>
  );
}

export default function MenuBrowser() {
  const params = useSearchParams();
  const { openMenu } = useLead();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [vegOnly, setVegOnly] = useState(false);
  const [active, setActive] = useState<SectionKey>('kolkata');
  const refs = useRef<Record<string, HTMLElement | null>>({});

  const needle = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      MENU.filter(
        (e) =>
          (!vegOnly || e.veg !== false) &&
          (!needle ||
            `${e.name} ${e.cut ?? ''} ${e.region ?? ''} ${e.note ?? ''} ${(e.includes ?? []).join(' ')}`
              .toLowerCase()
              .includes(needle)),
      ),
    [needle, vegOnly],
  );

  const sections = useMemo(
    () =>
      MENU_SECTIONS.map((s) => {
        const items = filtered.filter((e) => sectionOf(e) === s.key);
        const groups: Group[] = [];
        items.forEach((e) => {
          const g = groups.find((x) => x.name === e.name);
          if (g) g.variants.push(e);
          else groups.push({ name: e.name, variants: [e] });
        });
        const cols = SIZES.filter((c) => items.some((e) => e.prices[c.key]));
        return { ...s, groups, cols, bySize: cols.length > 0 };
      }).filter((s) => s.groups.length),
    [filtered],
  );

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActive(en.target.id as SectionKey)),
      { rootMargin: '-35% 0px -60% 0px' },
    );
    Object.values(refs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [sections.length]);

  const jump = (key: SectionKey) => {
    const el = refs.current[key];
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 150, behavior: 'smooth' });
  };

  return (
    <div className="site bg-ivory pb-24">
      {/* Search, sections, veg filter */}
      <div className="sticky top-[72px] z-40 border-b border-dum/10 bg-ivory/95 backdrop-blur">
        <div className="wrap flex flex-col gap-3 py-3 md:flex-row md:items-center">
          <div className="relative md:w-60">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes"
              aria-label="Search dishes"
              className="field !min-h-[2.75rem] !pl-10 !pr-10"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-ink/50 hover:bg-ink/5"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <LayoutGroup>
            <nav className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 md:mx-0 md:flex-1 md:px-0" aria-label="Menu sections">
              {sections.map((s) => (
                <button key={s.key} onClick={() => jump(s.key)} className="relative flex-none rounded-full px-4 py-2 text-sm font-semibold">
                  {active === s.key && (
                    <motion.span layoutId="menu-tab" className="absolute inset-0 rounded-full bg-dum" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />
                  )}
                  <span className={`relative ${active === s.key ? 'text-ivory' : 'text-ink/70'}`}>{s.title}</span>
                </button>
              ))}
            </nav>
          </LayoutGroup>

          <button
            role="switch"
            aria-checked={vegOnly}
            onClick={() => setVegOnly((v) => !v)}
            className="flex flex-none items-center gap-2.5 self-start py-1 text-sm font-semibold md:self-auto"
          >
            <span className={`relative h-6 w-11 rounded-full transition-colors ${vegOnly ? 'bg-leaf' : 'bg-ink/20'}`}>
              <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${vegOnly ? 'right-0.5' : 'left-0.5'}`} />
            </span>
            Veg only
          </button>
        </div>
      </div>

      <div className="wrap">
        {sections.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-display text-3xl text-dum">Nothing matches &ldquo;{query}&rdquo;</p>
            <p className="mt-2 text-ink/60">Try a shorter word, like &ldquo;mutton&rdquo; or &ldquo;paneer&rdquo;.</p>
            <button onClick={() => { setQuery(''); setVegOnly(false); }} className="btn-dum mt-6">Show the full menu</button>
          </div>
        )}

        {sections.map((s) => {
          const r = BRAND.regions.find((x) => x.key === s.key);
          const hero = s.groups.flatMap((g) => g.variants).find((v) => v.image);

          return (
            <section
              key={s.key}
              id={s.key}
              ref={(el) => { refs.current[s.key] = el; }}
              className="mx-auto max-w-4xl scroll-mt-40 pt-14"
            >
              {/* Section head */}
              <div className="grid items-end gap-6 border-t-2 border-dum pt-6 md:grid-cols-[1fr_auto]">
                <div>
                  <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-none text-dum">{s.title}</h2>
                  {r ? (
                    <dl className="mt-4 flex flex-wrap items-baseline gap-x-7 gap-y-2 text-[.95rem]">
                      <div className="flex items-baseline gap-2">
                        <dt className="whitespace-nowrap text-ink/45">Spice</dt>
                        <dd className="font-semibold text-ink/85"><SpiceLevel level={r.spiceLevel} label={r.spice} size={13} /></dd>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <dt className="whitespace-nowrap text-ink/45">Character</dt>
                        <dd className="font-semibold text-ink/85">{r.character}</dd>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <dt className="whitespace-nowrap text-ink/45">Ideal for</dt>
                        <dd className="font-semibold text-ink/85">{r.idealFor}</dd>
                      </div>
                    </dl>
                  ) : (
                    s.blurb && <p className="mt-3 max-w-xl text-ink/60">{s.blurb}</p>
                  )}
                </div>

                {hero?.image && (
                  <div className="relative hidden h-24 w-36 shrink-0 overflow-hidden rounded-xl ring-1 ring-dum/10 md:block">
                    <Image src={hero.image} alt={hero.name} fill sizes="144px" className="object-cover" />
                  </div>
                )}
              </div>

              {/* Dishes */}
              {s.bySize ? (
                <div className="mt-6">
                  <div
                    className="hidden gap-x-4 border-b border-dum/15 pb-1.5 md:grid"
                    style={{ gridTemplateColumns: `minmax(0,1fr) repeat(${s.cols.length}, 4.75rem)` }}
                  >
                    <span />
                    {s.cols.map((c) => (
                      <span key={c.key} className="text-right text-xs font-semibold text-brass-dark">{c.label}</span>
                    ))}
                  </div>
                  {s.groups.map((g) => <GridDish key={`${s.key}-${g.name}`} group={g} cols={s.cols} />)}
                </div>
              ) : (
                <div className="mt-6 gap-x-14 md:columns-2">
                  {s.groups.map((g) => <SimpleDish key={`${s.key}-${g.name}`} group={g} />)}
                </div>
              )}

              <a
                href={waLink(WA.style(s.title))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('whatsapp_click', { from: 'menu_section', section: s.key })}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#15803d]"
              >
                <MessageCircle size={15} /> Order {s.title} on WhatsApp
              </a>
            </section>
          );
        })}

        {/* Add-ons */}
        <section className="mx-auto max-w-4xl scroll-mt-40 pt-14">
          <div className="border-t-2 border-dum pt-6">
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-none text-dum">{BRAND.salan.title}</h2>
            <p className="mt-3 max-w-2xl text-ink/65">{BRAND.salan.body}</p>
          </div>
          <dl className="mt-6 grid gap-4 md:grid-cols-3">
            {BRAND.salan.points.map((p) => (
              <div key={p.title} className="rounded-2xl bg-ivory-dim p-5">
                <dt className="font-semibold text-dum">{p.title}</dt>
                <dd className="mt-1 text-[.95rem] text-ink/65">{p.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Download */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="jaali-bg relative mx-auto mt-16 max-w-4xl overflow-hidden rounded-[2rem] p-8 text-ivory md:flex md:items-center md:justify-between md:p-12"
        >
          <div>
            <h2 className="display-md">Take the menu with you</h2>
            <p className="mt-2 max-w-md text-ivory/70">Save the PDF to your phone, or open the Excel sheet to plan a party order.</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-0">
            <button onClick={openMenu} className="btn-brass"><Download size={18} /> Download the menu</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
