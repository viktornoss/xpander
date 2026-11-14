'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Ensures that on any route change, client navigation, or browser back/forward step (popstate),
 * the window is immediately and reliably scrolled to the very top of the page.
 */
export default function ScrollToTopOnNavigation() {
  const pathname = usePathname();

  useEffect(() => {
    // If not an in-page anchor hash link, force scroll to top
    if (typeof window !== 'undefined' && !window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname]);

  useEffect(() => {
    const handlePopState = () => {
      // Browser back/forward button pressed
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return null;
}

