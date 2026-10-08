import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BRAND } from '@/lib/brand';

export default function NotFound() {
  return (
    <main className="site flex min-h-screen flex-col">
      <Header />
      <section className="wrap flex flex-1 flex-col justify-center py-24 text-center">
        <p className="font-display text-7xl text-brass">404</p>
        <h1 className="display-lg mx-auto mt-4 max-w-[16ch] text-dum">This page has gone cold.</h1>
        <p className="mx-auto mt-3 max-w-md text-ink/70">
          The page you were after is not here. The biryani, happily, still is.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/menu" className="btn-dum">See the menu</Link>
          <Link href="/" className="btn-dum !bg-transparent !text-dum border-[1.5px] border-dum">Back home</Link>
        </div>
        <ul className="mx-auto mt-12 flex flex-wrap justify-center gap-3">
          {BRAND.regions.map((r) => (
            <li key={r.key}>
              <Link href={`/biryani/${r.key}`} className="inline-flex rounded-full bg-ivory-dim px-4 py-2 font-semibold text-dum hover:bg-white">
                {r.style}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <Footer />
    </main>
  );
}
