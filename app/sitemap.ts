import type { MetadataRoute } from 'next';
import { starterPosts } from '@/lib/site-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return [
    { url: origin, changeFrequency: 'monthly', priority: 1 },
    { url: `${origin}/journal`, changeFrequency: 'weekly', priority: 0.8 },
    ...starterPosts.map((post) => ({ url: `${origin}/journal/${post.slug}`, lastModified: post.publishedAt, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
