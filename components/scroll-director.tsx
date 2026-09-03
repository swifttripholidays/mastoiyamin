'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function ScrollDirector() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    const pointer = (event: PointerEvent) => {
      root.style.setProperty('--pointer-x', `${event.clientX}px`);
      root.style.setProperty('--pointer-y', `${event.clientY}px`);
    };
    window.addEventListener('pointermove', pointer, { passive: true });

    if (reduced) return () => window.removeEventListener('pointermove', pointer);

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-3d-section]').forEach((section, index) => {
        const card = section.querySelector<HTMLElement>('[data-scene]') ?? section;
        gsap.fromTo(
          card,
          {
            autoAlpha: 0.28,
            y: 110,
            z: -180,
            rotationX: index % 2 ? -9 : 9,
            rotationY: index % 2 ? 7 : -7,
            transformPerspective: 1500,
          },
          {
            autoAlpha: 1,
            y: 0,
            z: 0,
            rotationX: 0,
            rotationY: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 92%',
              end: 'top 38%',
              scrub: 0.9,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-kinetic]').forEach((heading) => {
        gsap.fromTo(
          heading,
          { letterSpacing: '0.02em', xPercent: -4 },
          {
            letterSpacing: '-0.065em',
            xPercent: 0,
            ease: 'none',
            scrollTrigger: { trigger: heading, start: 'top 95%', end: 'top 48%', scrub: 1 },
          },
        );
      });

      const portrait = document.querySelector<HTMLElement>('.journey-portrait');
      if (portrait) {
        gsap.set(portrait, { xPercent: -50, yPercent: -50, transformPerspective: 1200 });
        const vw = () => window.innerWidth;
        const vh = () => window.innerHeight;
        gsap.timeline({
          scrollTrigger: {
            trigger: '.v3-shell',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.15,
            invalidateOnRefresh: true,
          },
        })
          .to(portrait, { x: () => vw() * 0.34, y: () => vh() * 0.26, scale: 0.31, rotationY: -18, rotationZ: 2, duration: 1.2, ease: 'none' })
          .to(portrait, { x: () => -vw() * 0.35, y: () => -vh() * 0.2, scale: 0.25, rotationY: 20, rotationZ: -3, duration: 1.1, ease: 'none' })
          .to(portrait, { x: () => vw() * 0.35, y: () => -vh() * 0.18, scale: 0.22, rotationY: -24, rotationZ: 1, duration: 1.1, ease: 'none' })
          .to(portrait, { x: () => -vw() * 0.34, y: () => vh() * 0.23, scale: 0.24, rotationY: 18, rotationZ: -2, duration: 1.1, ease: 'none' })
          .to(portrait, { x: () => vw() * 0.32, y: () => vh() * 0.18, scale: 0.28, rotationY: -14, rotationZ: 2, duration: 1.1, ease: 'none' })
          .to(portrait, { x: 0, y: 0, scale: 0.55, rotationY: 0, rotationZ: 0, duration: 1.25, ease: 'none' });
      }

      gsap.utils.toArray<HTMLElement>('[data-tilt]').forEach((card) => {
        const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.45, ease: 'power3.out' });
        const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.45, ease: 'power3.out' });
        const move = (event: PointerEvent) => {
          const bounds = card.getBoundingClientRect();
          rotateY(((event.clientX - bounds.left) / bounds.width - 0.5) * 10);
          rotateX(-((event.clientY - bounds.top) / bounds.height - 0.5) * 9);
        };
        const reset = () => { rotateX(0); rotateY(0); };
        card.addEventListener('pointermove', move);
        card.addEventListener('pointerleave', reset);
      });
    });

    return () => {
      window.removeEventListener('pointermove', pointer);
      context.revert();
    };
  }, []);

  return <div className="cursor-aura" aria-hidden="true" />;
}
