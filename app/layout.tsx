import type { Metadata } from 'next';
import { Cormorant_Garamond, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { getSiteUrl } from '@/lib/site-url';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
  title: 'Yamin Mastoi — Entrepreneur, AI Specialist & Full-Stack Developer',
  description:
    'The portfolio and journal of Yamin Mastoi, an entrepreneur, AI specialist and full-stack developer building intelligent digital ventures.',
  openGraph: {
    title: 'Yamin Mastoi — Entrepreneur, AI Specialist & Full-Stack Developer',
    description: 'Building intelligent products, digital ventures and meaningful experiences.',
    type: 'website',
    images: [{ url: '/og.png', width: 1730, height: 909, alt: 'Yamin Mastoi portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yamin Mastoi — Entrepreneur, AI Specialist & Full-Stack Developer',
    description: 'Building intelligent products, digital ventures and meaningful experiences.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
