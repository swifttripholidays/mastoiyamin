'use client';

import { useEffect } from 'react';

export function InteractiveAtmosphere() {
  useEffect(() => {
    const root = document.documentElement;
    const pointer = (event: PointerEvent) => {
      root.style.setProperty('--pointer-x', `${event.clientX}px`);
      root.style.setProperty('--pointer-y', `${event.clientY}px`);
      root.style.setProperty('--orbit-x', `${(event.clientX / innerWidth - 0.5) * 16}deg`);
      root.style.setProperty('--orbit-y', `${(event.clientY / innerHeight - 0.5) * -12}deg`);
    };
    const scroll = () => root.style.setProperty('--page-scroll', `${scrollY}px`);
    const reveal = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 },
    );
    document.querySelectorAll('[data-reveal]').forEach((node) => reveal.observe(node));
    addEventListener('pointermove', pointer, { passive: true });
    addEventListener('scroll', scroll, { passive: true });
    return () => {
      removeEventListener('pointermove', pointer);
      removeEventListener('scroll', scroll);
      reveal.disconnect();
    };
  }, []);

  return <div className="cursor-aura" aria-hidden="true" />;
}
