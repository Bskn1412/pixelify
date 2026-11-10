'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UsersRound } from 'lucide-react';
import { syncVisitorIdentity } from '@/lib/visitor';
import { SITE_LANGUAGES } from '@/lib/i18n';

type Stats = { uniqueVisitors: number; pageViews: number };

export default function VisitorTracker() {
  const pathname = usePathname();
  const normalizedPath = (pathname || '/').replace(/\/+$/, '') || '/';
  const isHomePage = normalizedPath === '/' || SITE_LANGUAGES.some(({ code }) => normalizedPath === `/${code}`);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;
    const path = pathname || '/';
    const sessionKey = 'pixelify_last_tracked_path_v1';
    let shouldTrack = true;
    let referrer = document.referrer;
    try {
      const previousPath = window.sessionStorage.getItem(sessionKey);
      shouldTrack = previousPath !== path;
      if (previousPath && shouldTrack) referrer = `${window.location.origin}${previousPath}`;
      if (shouldTrack) window.sessionStorage.setItem(sessionKey, path);
    } catch { /* Continue tracking when session storage is unavailable. */ }

    const loadStats = () => fetch('/api/stats', { cache: 'no-store' }).then((r) => r.ok ? r.json() : null).then((value) => value && setStats(value)).catch(() => {});
    void syncVisitorIdentity().then((visitorId) => {
      if (cancelled) return;
      const tracked = shouldTrack
        ? fetch('/api/track', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ visitorId, path, referrer }), keepalive: true }).catch(() => {})
        : Promise.resolve();
      void tracked.then(loadStats);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [pathname]);

  if (!isHomePage) return null;

  return (
    <aside className="fixed right-0 top-1/2 z-[80] -translate-y-1/2">
      <Link href="/leaderboard/" title={`${stats?.uniqueVisitors.toLocaleString() ?? 'Loading'} unique visitors · ${stats?.pageViews.toLocaleString() ?? '—'} page views · Open leaderboard`} aria-label="Open community leaderboard" className="flex min-h-[122px] w-[46px] flex-col items-center justify-center gap-2 rounded-l-2xl border border-r-0 border-sky-300/20 bg-[#0b0e0d]/95 px-2.5 py-3 text-sky-100 shadow-[0_12px_36px_rgba(0,0,0,0.45)] backdrop-blur-xl transition hover:border-sky-200/45 hover:bg-[#101815]">
        <UsersRound size={16} aria-hidden="true" />
        <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-semibold tracking-[0.14em]">{stats ? `${stats.uniqueVisitors.toLocaleString()} VISITORS` : 'VISITORS'}</span>
      </Link>
    </aside>
  );
}
