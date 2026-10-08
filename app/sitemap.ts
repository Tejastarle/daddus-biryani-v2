import type { MetadataRoute } from 'next';
import { BRAND } from '@/lib/brand';
import { SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ['', '/menu', '/gallery', '/about', '/blogs', '/contact'];
  return [
    ...pages.map((p) => ({
      url: `${SITE.url}${p}`,
      lastModified: now,
      changeFrequency: (p === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: p === '' ? 1 : p === '/menu' ? 0.9 : 0.7,
    })),
    ...BRAND.regions.map((r) => ({
      url: `${SITE.url}/biryani/${r.key}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
