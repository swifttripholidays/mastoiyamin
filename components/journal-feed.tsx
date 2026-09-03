'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { starterPosts, type JournalPost } from '@/lib/site-data';

export function JournalFeed({ limit }: { limit?: number }) {
  const [posts, setPosts] = useState<JournalPost[]>(starterPosts);

  useEffect(() => {
    fetch('/api/posts')
      .then((response) => response.ok ? response.json() : [])
      .then((data: JournalPost[]) => data.length && setPosts(data))
      .catch(() => undefined);
  }, []);

  const visible = limit ? posts.slice(0, limit) : posts;

  return (
    <div className="journal-grid">
      {visible.map((post, index) => (
        <article className={index === 0 ? 'journal-card featured-post' : 'journal-card'} key={post.id}>
          {post.coverUrl && <img className="journal-cover" src={post.coverUrl} alt="" />}
          <div className="journal-meta">
            <span>{post.category}</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en', { month: 'short', day: '2-digit', year: 'numeric' })}
            </time>
          </div>
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <a href={`/journal/${post.slug}`} aria-label={`Read ${post.title}`}>
            Read note <ArrowUpRight aria-hidden="true" />
          </a>
        </article>
      ))}
    </div>
  );
}
