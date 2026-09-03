import type { Metadata } from 'next';
import { PostReader } from '@/components/post-reader';
import { getPostBySlug } from '@/lib/content-db';
import { starterPosts } from '@/lib/site-data';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null) ?? starterPosts.find((item) => item.slug === slug);
  if (!post) return { title: 'Journal — Yamin Mastoi' };
  const images = post.coverUrl ? [{ url: post.coverUrl, alt: post.title }] : [];
  return {
    title: `${post.title} — Yamin Mastoi`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article', images },
    twitter: { card: images.length ? 'summary_large_image' : 'summary', title: post.title, description: post.excerpt, images },
  };
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PostReader slug={slug} />;
}
