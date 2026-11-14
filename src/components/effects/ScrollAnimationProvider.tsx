'use client';

import React, { useEffect, useState, useCallback } from 'react';

export default function ScrollAnimationProvider({ children }: { children: React.ReactNode }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  const observeRevealElements = useCallback((observer: IntersectionObserver) => {
    const selectors = [
      '.scroll-reveal:not(.is-revealed)',
      '.scroll-reveal-scale:not(.is-revealed)',
      '.scroll-reveal-left:not(.is-revealed)',
      '.scroll-reveal-right:not(.is-revealed)',
    ].join(', ');
    const elements = document.querySelectorAll(selectors);
    elements.forEach((el) => observer.observe(el));
  }, []);

  useEffect(() => {
    // 1. Scroll Progress
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalScroll) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. IntersectionObserver for all scroll-reveal variants
    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.06,
    });

    observeRevealElements(observer);

    // 3. Mouse spotlight tracking for glass cards
    const handleMouseMove = (e: MouseEvent) => {
      const spotlightCards = document.querySelectorAll<HTMLElement>('.glass-spotlight, .service-card');
      spotlightCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (
          e.clientX >= rect.left - 100 &&
          e.clientX <= rect.right + 100 &&
          e.clientY >= rect.top - 100 &&
          e.clientY <= rect.bottom + 100
        ) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        }
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 4. MutationObserver for dynamic elements
    const mutationObserver = new MutationObserver(() => {
      observeRevealElements(observer);
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [observeRevealElements]);

  return (
    <>
      {/* Scroll Depth Progress Line with glow */}
      <div
        className="fixed top-0 left-0 right-0 h-[2px] z-[100] pointer-events-none origin-left"
        style={{
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.8) 50%, #ffffff 100%)',
          boxShadow: '0 0 12px rgba(255,255,255,0.7), 0 0 24px rgba(255,255,255,0.3)',
          transition: 'width 0.08s linear',
        }}
      />

      {/* Floating ambient orbs in hero background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-white/[0.02] to-transparent blur-[120px] animate-orb-1" />
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-white/[0.015] to-transparent blur-[100px] animate-orb-2" />
        <div className="absolute bottom-[20%] left-[30%] w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-white/[0.02] to-transparent blur-[100px] animate-orb-3" />
      </div>

      {children}
    </>
  );
}
