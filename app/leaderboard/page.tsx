'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { CalendarDays, Crown, RefreshCw, Trophy, UsersRound } from 'lucide-react';
import LeaderboardSkeleton from '@/components/LeaderboardSkeleton';
import { Skeleton } from '@/components/ui/Skeleton';
import { getVisitorId } from '@/lib/visitor';
import { VISITOR_PROFILE_UPDATED_EVENT } from '@/lib/visitor-profile';

type Player = { id: string; username: string | null; display_name: string; avatar_url: string | null; created_at: string; score: number; rank: number };
type Stats = { uniqueVisitors: number; pageViews: number; todayVisitors: number; participants: number };
type BoardData = { top: Player[]; position: Player | null; stats: Stats };

function shortId(value: string) { return `${value.slice(0, 8)}…${value.slice(-4)}`; }

function memberSince(value: string) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return 'Join date unavailable';

  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));
  if (minutes < 1) return 'Joined just now';
  if (minutes < 60) return `Joined ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Joined ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `Joined ${days} ${days === 1 ? 'day' : 'days'} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `Joined ${months} ${months === 1 ? 'month' : 'months'} ago`;

  const years = Math.floor(days / 365);
  return `Joined ${years} ${years === 1 ? 'year' : 'years'} ago`;
}

function Rank({ rank }: { rank: number }) {
  const color = rank === 1 ? 'text-amber-300' : rank === 2 ? 'text-slate-200' : rank === 3 ? 'text-orange-300' : rank <= 10 ? 'text-blue-300' : rank <= 25 ? 'text-violet-300' : rank <= 45 ? 'text-cyan-300' : rank <= 75 ? 'text-emerald-300' : rank <= 100 ? 'text-orange-300' : 'text-neutral-500';
  if (rank <= 3) {
    const podium = {
      1: { color: 'text-amber-300', number: 'from-yellow-100 via-amber-300 to-amber-600', glow: 'drop-shadow-[0_0_12px_rgba(251,191,36,0.75)]' },
      2: { color: 'text-slate-200', number: 'from-white via-slate-200 to-slate-400', glow: 'drop-shadow-[0_0_10px_rgba(203,213,225,0.65)]' },
      3: { color: 'text-orange-300', number: 'from-orange-200 via-orange-400 to-amber-700', glow: 'drop-shadow-[0_0_10px_rgba(251,146,60,0.65)]' },
    }[rank as 1 | 2 | 3];
    const ordinal = rank === 1 ? '1st' : rank === 2 ? '2nd' : '3rd';
    return (
      <span aria-label={`${ordinal} place`} className={`flex w-10 shrink-0 flex-col items-center justify-center gap-1 font-mono ${podium.glow}`}>
        <Crown size={14} strokeWidth={2.5} className={`${podium.color} fill-current`} aria-hidden="true" />
        <span className={`bg-gradient-to-b ${podium.number} bg-clip-text text-lg font-black leading-none text-transparent`}>{rank}</span>
      </span>
    );
  }
  return <span className={`w-10 shrink-0 text-center font-mono text-lg font-black ${color}`}>{rank}</span>;
}

function PlayerRow({ player, isCurrentUser = false }: { player: Player; isCurrentUser?: boolean }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileCardId = useId();
  const isDefaultName = !player.display_name || player.display_name === 'Pixelify User';
  const avatarInitial = (isDefaultName ? player.id : player.display_name).slice(0, 1).toUpperCase();
  const name = isDefaultName ? shortId(player.id) : player.display_name;
  const profileName = isDefaultName ? 'Anonymous User' : player.display_name;
  return (
    <div className={`relative z-0 grid grid-cols-[34px_minmax(0,1fr)_70px] items-center gap-3 px-3 py-4 hover:z-20 focus-within:z-20 first:rounded-t-2xl last:rounded-b-2xl sm:grid-cols-[48px_minmax(0,1fr)_100px] sm:gap-4 sm:px-6 ${player.rank === 1 ? 'bg-amber-300/[0.045]' : player.rank === 2 ? 'bg-slate-200/[0.025]' : player.rank === 3 ? 'bg-orange-300/[0.03]' : ''}`}>
      <Rank rank={player.rank} />
      <div className="leaderboard-profile relative flex min-w-0 items-center gap-3" data-open={profileOpen} onMouseLeave={() => setProfileOpen(false)}>
        <button
          type="button"
          aria-label={`Show profile for ${profileName}`}
          aria-expanded={profileOpen}
          aria-describedby={profileCardId}
          onClick={() => setProfileOpen((open) => !open)}
          onBlur={() => setProfileOpen(false)}
          onKeyDown={(event) => { if (event.key === 'Escape') { setProfileOpen(false); event.currentTarget.blur(); } }}
          className="leaderboard-profile-trigger flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-sky-400/20 to-violet-400/20 text-sm font-bold text-white/75"
        >
          {player.avatar_url ? <img src={player.avatar_url} alt="" className="h-full w-full object-cover" /> : avatarInitial}
        </button>
        <div className="min-w-0">
          <p className={`${isDefaultName ? 'truncate font-mono text-xs' : 'truncate text-sm'} font-semibold ${player.rank === 1 ? 'text-amber-100' : player.rank === 2 ? 'text-slate-100' : player.rank === 3 ? 'text-orange-100' : 'text-white'}`}>
            {name}{isDefaultName && isCurrentUser && <span className="ml-1.5 whitespace-nowrap font-sans text-sky-300">(You)</span>}
          </p>
          {!isDefaultName && <p className="mt-1 truncate font-mono text-[10px] text-white/40">{shortId(player.id)}{isCurrentUser && <span className="ml-1 whitespace-nowrap font-sans text-sky-300">(You)</span>}</p>}
          {player.username && <p className="mt-1 truncate text-xs text-white/40">@{player.username}</p>}
        </div>
        <div id={profileCardId} role="tooltip" className="leaderboard-profile-card absolute left-0 top-[calc(100%+0.5rem)] z-50 w-72 max-w-[calc(100vw-5rem)] rounded-2xl p-4 shadow-[0_18px_55px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/[0.06] text-sm font-bold text-white/80">
              {player.avatar_url ? <img src={player.avatar_url} alt="" className="h-full w-full object-cover" /> : avatarInitial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{profileName}{isCurrentUser && <span className="ml-1.5 text-sky-200">(You)</span>}</p>
              {player.username && <p className="mt-0.5 truncate text-xs text-white/50">@{player.username}</p>}
            </div>
          </div>
          <div className="mt-3 space-y-2 border-t border-white/10 pt-3 text-xs">
            <p className="font-mono text-white/70">{shortId(player.id)}</p>
            <p className="flex items-center gap-1.5 text-white/55"><CalendarDays size={13} className="shrink-0 text-sky-200/80" aria-hidden="true" />{memberSince(player.created_at)}</p>
          </div>
        </div>
      </div>
      <span className="text-right font-mono text-sm font-bold tabular-nums text-white">{player.score.toLocaleString()}<span className="ml-1 hidden text-[10px] font-medium text-white/40 sm:inline">PTS</span></span>
    </div>
  );
}

export default function LeaderboardPage() {
  const [data, setData] = useState<BoardData | null>(null);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setError(false);
    try {
      let id: string | null = null;
      try { id = getVisitorId(); } catch { /* Keep public rankings available if browser storage is blocked. */ }
      setVisitorId(id);
      const response = await fetch(`/api/leaderboard${id ? `?visitorId=${encodeURIComponent(id)}` : ''}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Could not load leaderboard');
      setData(await response.json());
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    window.addEventListener(VISITOR_PROFILE_UPDATED_EVENT, load);
    return () => window.removeEventListener(VISITOR_PROFILE_UPDATED_EVENT, load);
  }, [load]);

  return (
    <main className="min-h-screen bg-[#050507] px-4 pb-20 pt-0 text-white sm:px-6 sm:pt-0">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-sky-300"><Trophy size={14} /> Community</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">Leaderboard<span className="text-sky-300">.</span></h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/50 sm:text-base">A little recognition for every image made better. Process with Pixelify to earn points.</p>
          </div>
          <div aria-label="Total leaderboard participants" className="flex w-fit items-center gap-3 rounded-2xl border border-sky-300/15 bg-sky-300/[0.04] px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-200/10 bg-sky-200/[0.06] text-sky-200"><UsersRound size={17} /></span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Total participants</p>
              {data ? <p className="mt-0.5 text-xl font-bold tabular-nums">{data.stats.participants.toLocaleString()}</p> : error ? <p className="mt-1 text-sm text-white/45">Unavailable</p> : <Skeleton className="mt-1 h-5 w-12" />}
            </div>
          </div>
        </header>

        {error ? (
          <div role="alert" className="rounded-2xl border border-rose-300/15 bg-rose-300/[0.04] p-8 text-center">
            <p className="text-sm text-white/65">Leaderboard data could not be loaded right now.</p>
            <button type="button" onClick={() => void load()} className="leaderboard-retry-button mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm hover:bg-white/5"><RefreshCw size={14} /> Try again</button>
          </div>
        ) : !data ? (
          <LeaderboardSkeleton rows={9} />
        ) : (
          <div className="leaderboard-content-enter">
            <section aria-label="Top 101 players" className="rounded-2xl border border-white/[0.09] bg-white/[0.02]">
              <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-4 sm:px-6"><h2 className="text-sm font-bold tracking-wide">TOP PLAYERS</h2><span className="text-xs text-white/35">Ranked by points</span></div>
              {data.top.length ? <div className="divide-y divide-white/[0.06]">{data.top.map((player) => <PlayerRow key={player.id} player={player} isCurrentUser={player.id === visitorId} />)}</div> : <div className="p-10 text-center"><Crown className="mx-auto text-sky-200/50" /><p className="mt-3 font-semibold">The board is ready for its first champion.</p><p className="mt-1 text-sm text-white/45">Process an image to earn the first point.</p></div>}
            </section>

            <section aria-labelledby="your-position" className="mt-8 rounded-2xl border border-sky-300/20 bg-sky-300/[0.035] p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-200/65">Your Position</p><h2 id="your-position" className="mt-1 text-xl font-bold">Your place in the community</h2></div>{data.position && <span className="rounded-full border border-sky-200/15 bg-sky-200/[0.08] px-3 py-1.5 font-mono text-sm font-bold text-sky-100">Rank #{data.position.rank}</span>}</div>
              {!visitorId ? <p className="mt-5 text-sm text-white/55">Your anonymous visitor identity is unavailable in this browser.</p> : data.position ? <div className="mt-5"><PlayerRow player={data.position} isCurrentUser /></div> : <div className="mt-5 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-bold">P</div><div><p className="text-sm font-semibold">Not ranked yet</p><p className="mt-1 text-xs text-white/45">Process an image to earn your first point!</p></div></div>}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
