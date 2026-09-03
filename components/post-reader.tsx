'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { starterPosts, type JournalPost } from '@/lib/site-data';

export function PostReader({ slug }: { slug: string }) {
  const [post, setPost] = useState<JournalPost | undefined>(() => starterPosts.find((item) => item.slug === slug));

  useEffect(() => {
    fetch('/api/posts')
      .then((response) => response.ok ? response.json() : [])
      .then((data: JournalPost[]) => setPost(data.find((item) => item.slug === slug) ?? post))
      .catch(() => undefined);
  }, [slug]);

  if (!post) {
    return <main className="post-page"><a href="/journal"><ArrowLeft /> Journal</a><h1>That note is not available.</h1></main>;
  }

  return (
    <main className="post-page">
      <a className="post-back" href="/journal"><ArrowLeft /> Journal</a>
      <article>
        <div className="journal-meta"><span>{post.category}</span><time>{new Date(post.publishedAt).toLocaleDateString()}</time></div>
        <h1>{post.title}</h1>
        <p className="post-deck">{post.excerpt}</p>
        {post.coverUrl && <img className="post-cover" src={post.coverUrl} alt="" />}
        {post.content.split('\n').filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </article>
    </main>
  );
}
