export type JournalPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: 'draft' | 'published';
  featured: boolean;
  coverUrl?: string | null;
  publishedAt: string;
};

export const projects = [
  {
    number: '01',
    name: 'Heritage of Sindh',
    url: 'https://heritageofsindh.com',
    domain: 'heritageofsindh.com',
    kind: 'Culture · Digital archive',
    copy: 'A digital doorway into the stories, places and living heritage of Sindh.',
    accent: 'cream',
  },
  {
    number: '02',
    name: 'Sagarm',
    url: 'https://sagarm.shop',
    domain: 'sagarm.shop',
    kind: 'Commerce · Product experience',
    copy: 'A focused commerce experience shaped around clarity, discovery and action.',
    accent: 'maroon',
  },
  {
    number: '03',
    name: 'Swift Trip Holidays',
    url: 'https://swifttripholidays.co.uk',
    domain: 'swifttripholidays.co.uk',
    kind: 'Travel · Service platform',
    copy: 'A travel platform that turns a complex planning journey into a confident next step.',
    accent: 'navy',
  },
] as const;

export const experience = [
  'Syndigi Tech Solution',
  'Mastoi Tech Solution',
  'Sindhu Heritage of Sindh',
  'Busal OS',
  'Idraak',
] as const;

export const socials = [
  { label: 'TikTok', handle: '@mastoi_yamin10', url: 'https://www.tiktok.com/@mastoi_yamin10' },
  { label: 'X', handle: '@mastoi_yamin', url: 'https://x.com/mastoi_yamin' },
  { label: 'LinkedIn', handle: 'Yamin Mastoi', url: 'https://www.linkedin.com/in/yamin-mastoi-6b202741a' },
  { label: 'Instagram', handle: '@mastoi_yamin10', url: 'https://www.instagram.com/mastoi_yamin10' },
  { label: 'Facebook', handle: 'mastoiyamin10', url: 'https://www.facebook.com/mastoiyamin10' },
  { label: 'Snapchat', handle: 'i_yamin7', url: 'https://www.snapchat.com/add/i_yamin7' },
] as const;

export const starterPosts: JournalPost[] = [
  {
    id: 'launch-2026',
    title: 'I’m building where AI, business and culture meet',
    slug: 'building-ai-business-culture',
    excerpt: 'A first note on the kind of future I want to build—and why useful technology should still carry identity.',
    content: 'This portfolio is more than a collection of screens. It is a statement about the kind of work I want to keep doing: ambitious, intelligent and grounded in real human value.\nI have spent three years learning through study, experiments and live products. Every project—from Heritage of Sindh to Sagarm and Swift Trip Holidays—has taught me that technology becomes memorable when it understands the people it serves.\nMy direction is clear: combine entrepreneurship, AI and full-stack craft to build products that remove friction without removing character. I want systems to feel capable, interfaces to feel alive and ideas to become useful in the real world.\nThis is the beginning of that public journey. I’ll share what I build, what I learn and the questions that keep pushing the work forward.',
    category: 'Launch note',
    status: 'published',
    featured: true,
    publishedAt: '2026-09-02T12:00:00.000Z',
  },
  {
    id: 'starter-1',
    title: 'Building at the intersection of intelligence and identity',
    slug: 'intelligence-and-identity',
    excerpt: 'Why my best ideas begin where technology, entrepreneurship and cultural memory meet.',
    content: 'The most meaningful technology does more than work. It carries a point of view. I am exploring how intelligent systems, thoughtful product design and cultural context can come together to create digital experiences that feel useful and human.',
    category: 'Perspective',
    status: 'published',
    featured: true,
    publishedAt: '2026-08-28T09:00:00.000Z',
  },
  {
    id: 'starter-2',
    title: 'Three years of learning by building',
    slug: 'learning-by-building',
    excerpt: 'A short note on compounding skills through real projects and curious experimentation.',
    content: 'Every project has taught me a different lesson: how to listen, how to simplify, how to persist and how to turn an idea into something people can actually use. Three years of focused study have become a foundation for a much longer journey.',
    category: 'Journey',
    status: 'published',
    featured: false,
    publishedAt: '2026-08-16T09:00:00.000Z',
  },
  {
    id: 'starter-3',
    title: 'What global teamwork taught me',
    slug: 'global-teamwork',
    excerpt: 'Reflections from participating in the GNEC UN Hackathon 2026 with an international team.',
    content: 'Working across borders made one thing clear: ambitious ideas become stronger when different perspectives are given room. The experience sharpened how I communicate, collaborate and keep momentum inside a distributed team.',
    category: 'Field notes',
    status: 'published',
    featured: false,
    publishedAt: '2026-07-29T09:00:00.000Z',
  },
];
