'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * YouTube-style top progress bar with Pixelify neon emerald glow.
 * Triggers when clicking any internal navigation link or route change,
 * runs across the top of the browser viewport, and completes when the
 * target page renders.
 */
function TopProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const completeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    if (completeTimerRef.current) {
      clearTimeout(completeTimerRef.current);
      completeTimerRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setVisible(true);
    setProgress(15);

    // Trickle progress forward realistically (like YouTube / NProgress)
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 30) return prev + 12;
        if (prev < 60) return prev + 6;
        if (prev < 80) return prev + 2.5;
        if (prev < 92) return prev + 0.8;
        return prev;
      });
    }, 180);
  };

  const completeProgress = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setProgress(100);

    completeTimerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
      completeTimerRef.current = null;
    }, 280);
  };

  // Complete progress whenever the pathname or searchParams finish updating
  useEffect(() => {
    completeProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Intercept navigation link clicks globally
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Don't intercept modified clicks (Cmd/Ctrl/Shift/Alt) or secondary buttons
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      // Ignore empty, anchor-only, external, download, or new-tab links
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        target.hasAttribute('download') ||
        targetAttr === '_blank'
      ) {
        return;
      }

      // Check if URL is same origin
      const currentUrl = new URL(window.location.href);
      const targetUrl = new URL(href, window.location.href);

      if (targetUrl.origin !== currentUrl.origin) return;

      // Ignore click if clicking link to current exact URL
      if (
        targetUrl.pathname === currentUrl.pathname &&
        targetUrl.search === currentUrl.search &&
        targetUrl.hash !== currentUrl.hash
      ) {
        return;
      }

      // If actually navigating to a new path or search query, start progress bar
      if (targetUrl.pathname !== currentUrl.pathname || targetUrl.search !== currentUrl.search) {
        startProgress();
      }
    };

    // Custom events for programmatic navigation
    const handleCustomStart = () => startProgress();
    const handleCustomEnd = () => completeProgress();

    document.addEventListener('click', handleDocumentClick, { capture: true });
    window.addEventListener('pixelify:navigation-start', handleCustomStart);
    window.addEventListener('pixelify:navigation-end', handleCustomEnd);

    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      window.removeEventListener('pixelify:navigation-start', handleCustomStart);
      window.removeEventListener('pixelify:navigation-end', handleCustomEnd);
      if (timerRef.current) clearInterval(timerRef.current);
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none h-[2.5px] sm:h-[3px] overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 250ms ease-in-out',
      }}
    >
      <div
        className="h-full relative"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #00FF85 0%, #72FFB4 100%)',
          boxShadow: '0 0 12px #00FF85, 0 0 6px #72FFB4',
          transition: progress === 100 ? 'width 180ms ease-out' : 'width 240ms cubic-bezier(0.1, 0.05, 0.25, 1)',
        }}
      >
        {/* Glowing leading head tip (YouTube style) */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 -mr-1"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 80%, #ffffff 100%)',
            boxShadow: '0 0 16px #00FF85, 0 0 8px #ffffff',
            opacity: progress > 0 && progress < 100 ? 1 : 0,
            transition: 'opacity 150ms ease',
          }}
        />
      </div>
    </div>
  );
}

export default function TopProgressBar() {
  return (
    <Suspense fallback={null}>
      <TopProgressBarInner />
    </Suspense>
  );
}
