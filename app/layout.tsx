import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import LeadProvider from '@/components/LeadProvider';
import SiteChrome from '@/components/SiteChrome';
import { SITE } from '@/lib/site';
import { GA_ID } from '@/lib/analytics';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Daddu's Biryani | Not one biryani. Many traditions. Malad East, Mumbai",
    template: "%s | Daddu's Biryani",
  },
  description:
    'Lucknowi, Hyderabadi, Kolkata and Mumbai-style dum biryani in Malad East, Mumbai. Every palate is different — taste the styles before you choose. Kebabs, rolls, combos and party orders by the kilo.',
  keywords: [
    'biryani Malad East', 'biryani Mumbai', 'Lucknowi biryani Mumbai', 'Hyderabadi biryani Mumbai',
    'Kolkata biryani Mumbai', 'Mumbai biryani', 'bulk biryani order Mumbai', 'corporate biryani order',
    'party biryani per kg', 'mutton yakhni pulao', 'shami kebab Malad',
  ],
  authors: [{ name: "Daddu's Biryani" }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE.url,
    siteName: "Daddu's Biryani",
    title: "Daddu's Biryani | Not one biryani. Many traditions.",
    description: 'Four regional biryani traditions, cooked in one kitchen in Malad East. Taste before you choose.',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: "Chicken Lucknowi biryani at Daddu's Biryani" }],
  },
  twitter: { card: 'summary_large_image', title: "Daddu's Biryani", images: ['/images/og-image.jpg'] },
  robots: 'index, follow',
  icons: { icon: '/logo.png', apple: '/logo.png' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#082A21',
};

/**
 * Local business data. Deliberately no aggregateRating — we only publish a
 * rating once a verified, current figure is supplied by the owner.
 */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  '@id': `${SITE.url}/#restaurant`,
  name: SITE.name,
  url: SITE.url,
  image: `${SITE.url}/images/og-image.jpg`,
  servesCuisine: ['Biryani', 'Mughlai', 'North Indian', 'Indian'],
  telephone: SITE.phoneTel,
  priceRange: '₹₹',
  menu: `${SITE.url}/menu`,
  hasMenu: `${SITE.url}/menu`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.addressLines[0],
    addressLocality: 'Malad East, Mumbai',
    postalCode: '400097',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  openingHours: SITE.hoursSchema,
  acceptsReservations: 'False',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/rozha-one-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: "try{if(sessionStorage.getItem('db_intro'))document.documentElement.classList.add('intro-seen')}catch(e){}",
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="bg-background text-foreground">
        <LeadProvider>
          {children}
          <SiteChrome />
        </LeadProvider>

        {/* Analytics. Set NEXT_PUBLIC_GA_ID in .env.local to switch this on. */}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
