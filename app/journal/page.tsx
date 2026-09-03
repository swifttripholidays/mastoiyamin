import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { JournalFeed } from '@/components/journal-feed';

export const metadata: Metadata = {
  title: 'Journal — Yamin Mastoi',
  description: 'Ideas, build logs and lessons from Yamin Mastoi.',
};

export default function JournalPage() {
  return (
    <main className="journal-page">
      <header><a href="/"><ArrowLeft /> Portfolio</a><span>@mastoi_yamin10</span></header>
      <div className="journal-page-title"><span>Field notes / 2026</span><h1>Thinking<br /><em>in public.</em></h1><p>Ideas about intelligent products, digital ventures, culture and the practice of building.</p></div>
      <JournalFeed />
      <footer><a href="/">Yamin Mastoi</a><span>Entrepreneur · AI specialist · Full-stack developer</span></footer>
    </main>
  );
}
