import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import SpiceLevel from '@/components/SpiceLevel';
import StyleActions from '@/components/menu/StyleActions';
import { BRAND } from '@/lib/brand';
import { byRegion, inr, type MenuEntry, type RegionKey } from '@/lib/menu';
import { PHOTOS, SITE, type PhotoKey } from '@/lib/site';

type Params = { params: Promise<{ style: string }> };

export function generateStaticParams() {
  return BRAND.regions.map((r) => ({ style: r.key }));
}

const find = (style: string) => BRAND.regions.find((r) => r.key === style);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { style } = await params;
  const r = find(style);
  if (!r) return {};
  return {
    title: `${r.style} Biryani in Malad East`,
    description: `${r.taste}. ${r.body} Order ${r.style} biryani from Daddu's Biryani, Express Zone, Malad East, Mumbai — by the plate or by the kilo.`,
    alternates: { canonical: `/biryani/${r.key}` },
    openGraph: {
      title: `${r.style} Biryani | Daddu's Biryani`,
      description: r.body,
      images: [{ url: PHOTOS[r.photo as PhotoKey].src }],
    },
  };
}

const SIZES = [
  { key: 'half', label: 'Half' },
  { key: 'full', label: 'Full' },
  { key: 'perKg', label: '1 kg' },
] as const;

function PriceTable({ name, variants }: { name: string; variants: MenuEntry[] }) {
  const sizes = SIZES.filter((s) => variants.some((v) => v.prices[s.key]));
  const hasCuts = variants.some((v) => v.cut);
  return (
    <article className="border-t border-dum/12 py-6 first:border-t-0">
      <h3 className="text-2xl text-dum">{name}</h3>
      {variants[0].note && <p className="mt-1 text-[.95rem] text-ink/65">{variants[0].note}</p>}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[19rem] text-left text-[.95rem]">
          <caption className="sr-only">Prices for {name}</caption>
          <thead>
            <tr className="text-xs font-semibold text-brass-dark">
              <th scope="col" className="pb-1.5 pr-3">{hasCuts ? 'Cut' : ''}</th>
              {sizes.map((s) => <th key={s.key} scope="col" className="pb-1.5 pr-5">{s.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v.id} className="border-t border-dashed border-dum/15">
                <th scope="row" className="py-2 pr-3 font-semibold text-ink/80">{v.cut ?? '—'}</th>
                {sizes.map((s) => (
                  <td key={s.key} className="py-2 pr-5 font-bold text-dum">
                    {v.prices[s.key] ? inr(v.prices[s.key]) : <span className="font-normal text-ink/35">NA</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export default async function StylePage({ params }: Params) {
  const { style } = await params;
  const r = find(style);
  if (!r) notFound();

  const dishes = byRegion(r.key as RegionKey);
  const groups: { name: string; variants: MenuEntry[] }[] = [];
  dishes.forEach((e) => {
    const g = groups.find((x) => x.name === e.name);
    if (g) g.variants.push(e);
    else groups.push({ name: e.name, variants: [e] });
  });

  const photo = PHOTOS[r.photo as PhotoKey];
  const others = BRAND.regions.filter((x) => x.key !== r.key);
  const portion = dishes.find((d) => d.portion)?.portion;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MenuSection',
    name: `${r.style} Biryani`,
    description: r.body,
    hasMenuItem: groups.map((g) => ({
      '@type': 'MenuItem',
      name: `${g.name} (${r.style})`,
      offers: g.variants
        .filter((v) => v.prices.half || v.prices.full || v.prices.perKg)
        .map((v) => ({
          '@type': 'Offer',
          price: v.prices.half ?? v.prices.full ?? v.prices.perKg,
          priceCurrency: 'INR',
        })),
    })),
  };

  return (
    <main className="site min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />

      <PageHero
        hindi={r.hindi}
        title={`${r.style} Biryani in Malad East`}
        intro={r.body}
        image={photo.src}
        imageAlt={photo.alt}
      >
        <StyleActions style={r.style} />
      </PageHero>

      <section className="bg-ivory py-16 md:py-20">
        <div className="wrap">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Taste', r.taste],
              ['Spice level', r.spice],
              ['Character', r.character],
              ['Ideal for', r.idealFor],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-ivory-dim p-5">
                <dt className="text-xs font-semibold text-brass-dark">{k}</dt>
                <dd className="mt-1 text-ink/85">
                  {k === 'Spice level' ? <SpiceLevel level={r.spiceLevel} label={r.spice} size={14} /> : v}
                </dd>
              </div>
            ))}
          </dl>

          <h2 className="display-md mt-14 text-dum">On the menu</h2>
          <div className="mt-6">
            {groups.map((g) => <PriceTable key={g.name} name={g.name} variants={g.variants} />)}
          </div>

          {portion && (
            <div className="mt-10 rounded-[2rem] bg-dum p-7 text-ivory md:p-10">
              <h2 className="display-md">{BRAND.portions.title}</h2>
              <dl className="mt-6 grid gap-5 sm:grid-cols-3">
                {SIZES.filter((s) => portion[s.key]).map((s) => (
                  <div key={s.key}>
                    <dt className="text-xs font-semibold text-brass">{s.label}</dt>
                    <dd className="mt-1 text-ivory/85">{portion[s.key]}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-sm text-ivory/55">{BRAND.portions.curryCut}</p>
            </div>
          )}

          <div className="mt-14 rounded-[2rem] bg-ivory-dim p-7 md:p-10">
            <h2 className="display-md text-dum">{BRAND.undecided.title}</h2>
            <p className="mt-2 text-ink/70">{BRAND.undecided.line}</p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {others.map((o) => (
                <li key={o.key}>
                  <Link href={`/biryani/${o.key}`} className="inline-flex rounded-full bg-white px-4 py-2 font-semibold text-dum ring-1 ring-dum/12 hover:bg-ivory">
                    Compare {o.style}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-10 text-ink/60">
            Served at {SITE.addressLines.join(', ')}. {SITE.hours}.{' '}
            <Link href="/menu" className="font-semibold text-dum underline underline-offset-4">See the full menu</Link>.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
