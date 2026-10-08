import raw from '@/data/menu.json';

export type Category = 'biryani' | 'pulao' | 'tawa' | 'kebabs' | 'rolls' | 'combos' | 'drinks';
export type RegionKey = 'lucknowi' | 'hyderabadi' | 'kolkata' | 'mumbai';

export type MenuEntry = {
  id: string;
  name: string;
  category: Category;
  group: string;
  region?: RegionKey;
  /** Drumstick | Curry Cut | Boneless */
  cut?: string;
  protein?: string;
  veg?: boolean;
  prices: { half?: number; full?: number; perKg?: number; price?: number };
  note?: string;
  includes?: string[];
  serves?: string;
  /** Portion facts confirmed by the owner. */
  portion?: Record<string, string>;
  image?: string;
};

/** Generated from the owner's pricing workbook by scripts/extract_menu.py */
export const MENU = raw as MenuEntry[];

export const inr = (n?: number) => (n ? `₹${n.toLocaleString('en-IN')}` : '');

/** The menu sections, in the order the owner asked for. */
export const MENU_SECTIONS: readonly { key: SectionKey; title: string; blurb?: string }[] = [
  { key: 'kolkata', title: 'Kolkata', blurb: 'Delicate, with the aloo and egg tradition.' },
  { key: 'lucknowi', title: 'Lucknowi', blurb: 'Subtle, aromatic, yakhni-led.' },
  { key: 'hyderabadi', title: 'Hyderabadi', blurb: 'Bold, spicy, masala-led.' },
  { key: 'mumbai', title: 'Mumbai', blurb: 'Masaledar and familiar.' },
  { key: 'other-biryani', title: 'More biryani', blurb: 'Dishes that sit outside the four regional styles.' },
  { key: 'tawa', title: 'Tawa Pulao & Anda Rice', blurb: 'Tossed to order on the tawa. Its own thing, not a biryani.' },
  { key: 'kebabs', title: 'Kebabs & Starters' },
  { key: 'rolls', title: 'Rolls' },
  { key: 'combos', title: 'Combos', blurb: 'Biryani, kebabs, gulab jamun and a drink in one order.' },
  { key: 'drinks', title: 'Drinks' },
];

export type SectionKey =
  | 'lucknowi' | 'hyderabadi' | 'kolkata' | 'mumbai' | 'other-biryani'
  | 'tawa' | 'kebabs' | 'rolls' | 'combos' | 'drinks';

/** Which section does this dish belong to on the menu page? */
export function sectionOf(e: MenuEntry): SectionKey {
  if (e.category === 'biryani' || e.category === 'pulao') {
    return (e.region as SectionKey) ?? 'other-biryani';
  }
  if (e.category === 'tawa') return 'tawa';
  return e.category as SectionKey;
}

/** Dishes of one regional style, biggest first. */
export function byRegion(region: RegionKey) {
  return MENU.filter((e) => e.region === region && (e.category === 'biryani' || e.category === 'pulao'));
}

/** Lowest price a dish is available at, used for "from ₹x" labels. */
export function fromPrice(e: MenuEntry) {
  const vals = [e.prices.half, e.prices.full, e.prices.price].filter(Boolean) as number[];
  return vals.length ? Math.min(...vals) : e.prices.perKg;
}

/** Cheapest half/full portion within a regional style. */
export function regionFromPrice(region: RegionKey) {
  const vals = byRegion(region)
    .map((e) => fromPrice(e))
    .filter(Boolean) as number[];
  return vals.length ? Math.min(...vals) : undefined;
}

/** Everything sold by the kilo, for the bulk order planner. */
export const BULK = MENU.filter((e) => e.prices.perKg).sort((a, b) => a.name.localeCompare(b.name));

/** A readable label for a bulk dish, including its style and cut. */
export function bulkLabel(e: MenuEntry) {
  const bits = [e.name];
  if (e.region) bits.push(MENU_SECTIONS.find((s) => s.key === e.region)!.title);
  if (e.cut) bits.push(e.cut);
  return bits.join(' · ');
}

/**
 * Labels for the rows under a dish that has more than one version.
 *
 * What distinguishes them differs by dish: a biryani varies by cut
 * (Drumstick / Curry Cut / Boneless), while a Tawa Pulao varies by the
 * regional flavour it is built on. Use whichever actually differs, so we never
 * print the same label three times.
 *
 * Returns null when there is only one version, or when nothing distinguishes
 * them (in which case only the first is shown).
 */
export function variantLabels(variants: MenuEntry[]): string[] | null {
  // One version only: the cut (when there is one) is already part of the dish
  // name, e.g. "Zesty Tawa Blast (Boneless)". Labelling it again would print an
  // empty row and hide the price.
  if (variants.length < 2) return null;
  const cuts = variants.map((v) => v.cut ?? '');
  if (new Set(cuts).size > 1) return cuts.map((c) => c || 'Standard');

  const regions = variants.map((v) => v.region ?? '');
  if (new Set(regions).size > 1) {
    return regions.map((r) => MENU_SECTIONS.find((s) => s.key === r)?.title ?? 'Standard');
  }
  return cuts[0] ? cuts : null;
}
