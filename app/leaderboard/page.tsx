'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, CalendarDays, CircleHelp, Crown, RefreshCw, Star, Target, Trophy, UserRound, UsersRound } from 'lucide-react';
import { BorderBeam } from 'border-beam';
import { syncVisitorIdentity } from '@/lib/visitor';
import '@/styles/leaderboard.css';

type Player = { id: string; username: string | null; display_name: string; avatar_url: string | null; country_code?: string | null; created_at?: string | null; score: number; rank: number };
type Board = { top: Player[]; position: Player | null; stats: { participants: number } };
type Period = 'all' | 'week' | 'month';
const medal = ['/images/leaderboard/rank-1.webp', '/images/leaderboard/rank-2.webp', '/images/leaderboard/rank-3.webp'];
const periodName: Record<Period, string> = { all: 'All time', week: 'This week', month: 'This month' };
const shortId = (id: string) => `${id.slice(0, 8)}…${id.slice(-4)}`;
const visibleName = (player: Player) => player.display_name && player.display_name !== 'Pixelify User' ? player.display_name : shortId(player.id);
const flag = (code?: string | null) => code && /^[A-Z]{2}$/.test(code) && code !== 'XX' ? String.fromCodePoint(...Array.from(code, c => 127397 + c.charCodeAt(0))) : '';
function joinedDate(value?: string | null) {
  if (!value) return 'Join date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Join date unavailable' : new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(date);
}

function PlayerRow({ player, mine, index, reduced }: { player: Player; mine: boolean; index?: number; reduced?: boolean | null }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const rankClass = player.rank <= 3 ? ` lb-rank-${player.rank}` : '';

  const row = (
    <motion.article
      layout
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .32, delay: reduced ? 0 : Math.min((index ?? 0) * .012, .24) }}
      className={`lb-player${rankClass}`}
      data-open={profileOpen}
      style={{ zIndex: profileOpen ? 50 : undefined }}
      onMouseEnter={() => setProfileOpen(true)}
      onMouseLeave={() => setProfileOpen(false)}
    >
      <div className="lb-player-rank">{player.rank <= 3 ? <Image src={medal[player.rank - 1]} width={46} height={26} alt={`${player.rank} place medal`} /> : <span>{player.rank}</span>}</div>
      <div className="lb-profile" data-open={profileOpen}>
        <button type="button" className="lb-profile-trigger" aria-label={`Show ${visibleName(player)} profile`} aria-expanded={profileOpen} aria-controls={`lb-profile-${player.id}`} onFocus={() => setProfileOpen(true)} onBlur={() => setProfileOpen(false)} onClick={() => setProfileOpen(true)} onKeyDown={(event) => { if (event.key === 'Escape') { setProfileOpen(false); event.currentTarget.blur(); } }}>
          <span className="lb-avatar">{player.avatar_url ? <img src={player.avatar_url} alt="" /> : <UserRound aria-hidden="true" />}</span>
          <span className="lb-player-name"><strong>{visibleName(player)}{mine && <span className="lb-you">You</span>}</strong>{player.username && <small>@{player.username}</small>}</span>
        </button>
        <div className="lb-profile-card" id={`lb-profile-${player.id}`} role="tooltip" aria-hidden={!profileOpen}>
          <strong>{visibleName(player)}{mine && <span className="lb-you">You</span>}</strong>
          {player.username && <small>@{player.username}</small>}
          <span className="lb-profile-since"><CalendarDays size={14} aria-hidden="true" /> Member since {joinedDate(player.created_at)}</span>
        </div>
      </div>
      <div className="lb-player-score"><b>{player.score.toLocaleString()}</b><span>PTS</span></div>
      {flag(player.country_code) && <span className="lb-country" title={`Country ${player.country_code}`} aria-label={`Country ${player.country_code}`}>{flag(player.country_code)}</span>}
      {player.rank === 1 && <Image className="lb-row-crown" src="/images/leaderboard/crown.svg" width={42} height={32} alt="" />}
    </motion.article>
  );

  if (player.rank === 1) return <BorderBeam className="lb-player-beam" data-open={profileOpen} style={{ zIndex: profileOpen ? 50 : undefined }} size="md" colorVariant="gold" duration={2.4} borderRadius={12} strength={1} brightness={2} saturation={1.8} glowSize={1}>{row}</BorderBeam>;
  if (player.rank === 2) return <BorderBeam className="lb-player-beam" data-open={profileOpen} style={{ zIndex: profileOpen ? 50 : undefined }} size="md" colorVariant="ice" duration={2.8} borderRadius={12} strength={1} brightness={2} saturation={1.8} glowSize={1}>{row}</BorderBeam>;
  if (player.rank === 3) return <BorderBeam className="lb-player-beam" data-open={profileOpen} style={{ zIndex: profileOpen ? 50 : undefined }} size="md" colorVariant="sunset" duration={3.0} borderRadius={12} strength={1} brightness={2} saturation={1.8} glowSize={1}>{row}</BorderBeam>;
  return row;
}

export default function LeaderboardPage() {
  const [board, setBoard] = useState<Board | null>(null);
  const [visitorId, setVisitorId] = useState('');
  const [period, setPeriod] = useState<Period>('all');
  const [activityCount, setActivityCount] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [howOpen, setHowOpen] = useState(false);
  const reduced = useReducedMotion();

  const load = useCallback(async (range = period) => {
    setError('');
    try {
      const id = await syncVisitorIdentity();
      setVisitorId(id);
      const response = await fetch(`/api/leaderboard?period=${range}`, { cache: 'no-store' });
      if (!response.ok) {
        const issue = await response.json().catch(() => null);
        throw new Error(issue?.error || 'Leaderboard data could not be loaded right now.');
      }
      setBoard(await response.json());
      const activityResponse = await fetch('/api/activity?type=all&period=all&page=1', { cache: 'no-store' });
      if (activityResponse.ok) {
        const data = await activityResponse.json();
        setActivityCount(data.summary?.total ?? 0);
      }
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Leaderboard data could not be loaded right now.'); }
  }, [period]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const refresh = () => { void load(); };
    window.addEventListener('pixelify:reward-update', refresh);
    return () => window.removeEventListener('pixelify:reward-update', refresh);
  }, [load]);

  return <main className="leaderboard-page">
    <div className="lb-atmosphere" aria-hidden="true"><div className="lb-grid" /><Image className="lb-waves" src="/images/leaderboard/neon-waves.svg" width={1600} height={480} alt="" /></div>
    <div className="lb-shell">
      <section className="lb-hero">
        <motion.div className="lb-hero-copy" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
          <p className="lb-eyebrow"><UsersRound size={16} /> Community</p>
          <h1>Leaderboard<span>.</span></h1>
          <p className="lb-hero-text">A little recognition for every image made better. Process with Pixelify to earn points, climb the ranks, and unlock badges.</p>
          <div className="lb-hero-actions"><button className="lb-button lb-button-primary" onClick={() => setHowOpen((open) => !open)}><CircleHelp size={16} /> How it works</button><Link className="lb-button lb-button-secondary" href="/leaderboard/activity/">My activity <ArrowRight size={15} /></Link></div>
          {howOpen && <div className="lb-how-card" id="how-it-works"><strong>Make something better, earn a point.</strong><p>Finish a background removal or AI upscale. Each successful operation earns one point and appears in your activity history.</p></div>}
        </motion.div>
        <motion.div className="lb-hero-art" initial={reduced ? false : { opacity: 0, scale: .88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, delay: .12 }}>
          <span className="lb-orbit lb-orbit-one" /><span className="lb-orbit lb-orbit-two" />
          <Image src="/images/leaderboard/trophy-hero.webp" width={560} height={560} priority alt="A luminous championship trophy on a circular podium" />
          <span className="lb-pixel lb-pixel-a" /><span className="lb-pixel lb-pixel-b" /><span className="lb-pixel lb-pixel-c" />
        </motion.div>
        <div className="lb-participants glass-panel"><span className="lb-participant-icon"><UsersRound size={21} /></span><div><small>Total participants</small><strong>{board ? board.stats.participants.toLocaleString() : error ? 'Unavailable' : '…'}</strong></div><span className="lb-participant-label">All time<br />community</span></div>
      </section>

      <section className="lb-board glass-panel" aria-labelledby="top-players">
        <header className="lb-board-heading"><Image src="/images/leaderboard/crown.svg" width={52} height={40} alt="" /><div><h2 id="top-players">Top Users</h2><p>Community leaders ranked by points</p></div><div className="lb-periods" role="group" aria-label="Ranking period">{(['all', 'week', 'month'] as Period[]).map((value) => <button key={value} className={period === value ? 'selected' : ''} onClick={() => setPeriod(value)}>{periodName[value]}</button>)}</div></header>
        {error ? <div className="lb-state" role="alert"><p>{error}</p><button onClick={() => void load()}><RefreshCw size={15} /> Try again</button></div> : !board ? <div className="lb-loading">{Array.from({ length: 5 }, (_, i) => <span key={i} />)}</div> : board.top.length ? <div className="lb-player-list">{board.top.map((player, index) => <PlayerRow key={player.id} player={player} mine={player.id === visitorId} index={index} reduced={reduced} />)}</div> : <div className="lb-state"><Crown /><strong>The board is ready for its first champion.</strong><p>Process an image to earn the first point.</p></div>}
      </section>

      <section className="lb-position" aria-labelledby="your-position">
        <div className="lb-position-rank glass-panel"><div className="lb-position-title"><Target size={20} /><div><small>Your position</small><h2 id="your-position">Your place in the community</h2></div></div>
          {board?.position ? <><div className="lb-big-rank"><span>#{board.position.rank}</span><Image src="/images/leaderboard/crown.svg" width={86} height={64} alt="" /></div><p>{board.position.rank === 1 ? 'You are leading the community.' : `Ranked ${board.position.rank.toLocaleString()} in the community.`}</p></> : <><div className="lb-big-rank"><span>—</span></div><p>{board ? 'Complete an image operation to earn your first point.' : 'Your rank will appear here.'}</p></>}
        </div>
        <div className="lb-position-card glass-panel">{flag(board?.position?.country_code) && <span className="lb-position-flag">{flag(board?.position?.country_code)}</span>}<div className="lb-avatar lb-avatar-large">{board?.position?.avatar_url ? <img src={board.position.avatar_url} alt="" /> : <UserRound aria-hidden="true" />}</div><div className="lb-position-details"><strong>{board?.position ? visibleName(board.position) : 'Your Pixelify profile'}</strong><span>{visitorId ? `${shortId(visitorId)} · You` : 'Anonymous player'}</span><div className="lb-position-pills"><span><Trophy size={14} /> {board?.position ? `Rank #${board.position.rank}` : 'Unranked'}</span><span><Star size={14} /> {board?.position?.score ?? 0} points</span><span><UsersRound size={14} /> {activityCount ?? '—'} operations</span></div></div></div>
      </section>
      <div className="lb-bottom-link"><Link href="/leaderboard/activity/">See your activity history <ArrowRight size={15} /></Link><a href="#top-players">Back to top users <ArrowDown size={14} /></a></div>
    </div>
  </main>;
}
