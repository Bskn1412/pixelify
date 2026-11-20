'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Clock3, ImageMinus, RefreshCw, Sparkles, Trophy, WandSparkles } from 'lucide-react';
import { syncVisitorIdentity } from '@/lib/visitor';
import { getSavedDisplayName } from '@/lib/visitor-profile';
import { useTranslation } from '@/locales';

type ActivityType = 'all' | 'background_removal' | 'upscale';
type Period = 'all' | 'today' | 'week' | 'month';
type Activity = { id: number; action: Exclude<ActivityType, 'all'>; points: number; created_at: string };
type Data = { activities: Activity[]; totalFiltered: number; summary: { points: number; total: number; backgrounds: number; upscales: number }; position: { rank: number; score: number } | null };
const perPage = 12;

function formatDate(value: string) { return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); }

const achievements = [
  { key: 'first-image', title: 'First image', description: 'Complete your first image operation.', earned: (d: Data) => d.summary.total >= 1 },
  { key: 'bg-removal-expert', title: 'Background expert', description: 'Remove 10 backgrounds.', earned: (d: Data) => d.summary.backgrounds >= 10 },
  { key: 'upscaling-expert', title: 'Upscaling expert', description: 'Upscale 10 images.', earned: (d: Data) => d.summary.upscales >= 10 },
  { key: 'creative-explorer', title: 'Creative explorer', description: 'Use both Pixelify tools.', earned: (d: Data) => d.summary.backgrounds > 0 && d.summary.upscales > 0 },
  { key: 'rising-star', title: 'Rising star', description: 'Complete 25 image operations.', earned: (d: Data) => d.summary.total >= 25 },
  { key: 'champion', title: 'Pixelify champion', description: 'Complete 100 image operations.', earned: (d: Data) => d.summary.total >= 100 },
];

export default function MyActivityPage() {
  const { t } = useTranslation();
  const act = t.leaderboardActivity;

  const [data, setData] = useState<Data | null>(null);
  const [type, setType] = useState<ActivityType>('all');
  const [period, setPeriod] = useState<Period>('all');
  const [page, setPage] = useState(1);
  const [visitorId, setVisitorId] = useState('');
  const [displayName, setDisplayName] = useState('Pixelify member');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reduced = useReducedMotion();

  const typeLabels: Record<ActivityType, string> = {
    all: act?.types?.all || 'All activities',
    background_removal: act?.types?.bg || 'Background removal',
    upscale: act?.types?.upscale || 'AI upscaling',
  };

  const periodLabels: Record<Period, string> = {
    all: act?.periods?.all || 'All time',
    today: act?.periods?.today || 'Today',
    week: act?.periods?.week || 'This week',
    month: act?.periods?.month || 'This month',
  };

  const badgeKeyMap: Record<string, keyof NonNullable<typeof act>['badges']> = {
    'first-image': 'firstImage',
    'bg-removal-expert': 'bgExpert',
    'upscaling-expert': 'upscaleExpert',
    'creative-explorer': 'creativeExplorer',
    'rising-star': 'risingStar',
    'champion': 'champion',
  };

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const id = await syncVisitorIdentity();
      setVisitorId(id);
      const response = await fetch(`/api/activity?type=${type}&period=${period}&page=${page}`, { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || act?.errorTitle || 'Your activity history could not be loaded.');
      setData(result);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : (act?.errorTitle || 'Your activity history could not be loaded.'));
    } finally { setLoading(false); }
  }, [type, period, page, act?.errorTitle]);

  useEffect(() => { setDisplayName(getSavedDisplayName() || 'Pixelify member'); void load(); }, [load]);
  useEffect(() => {
    const refresh = () => { void load(); };
    window.addEventListener('pixelify:reward-update', refresh);
    return () => window.removeEventListener('pixelify:reward-update', refresh);
  }, [load]);

  const totalPages = Math.max(1, Math.ceil((data?.totalFiltered ?? 0) / perPage));
  const noHistory = data?.summary.total === 0;

  return <main className="activity-page">
    <div className="activity-glow" aria-hidden="true" />
    <div className="activity-shell">
      <nav className="activity-nav" aria-label="Activity navigation"><span className="activity-page-label">{act?.navLabel || 'Private dashboard'}</span><Link href="/leaderboard/" className="activity-back"><ArrowLeft size={15} /> {act?.backToLeaderboard || 'Public leaderboard'}</Link></nav>
      <header className="activity-hero">
        <div className="activity-avatar">{displayName.slice(0, 1).toUpperCase()}</div>
        <div className="activity-hero-copy"><p className="activity-eyebrow"><Trophy size={14} /> {act?.personalDashboard || 'Personal dashboard'}</p><h1>{act?.title || 'My Activity'}<span>.</span></h1><p>{act?.subtitle || 'Every image improved, every point earned. Your Pixelify journey in one place.'}</p></div>
        <div className="activity-hero-meta"><span>{displayName}</span><span>{visitorId ? `${visitorId.slice(0, 8)}…${visitorId.slice(-4)}` : (act?.anonymousProfile || 'Anonymous profile')}</span><b>{data?.position ? (act?.rankNumber?.replace('{rank}', String(data.position.rank)) || `Rank #${data.position.rank}`) : (act?.unranked || 'Unranked')}</b></div>
      </header>

      <section className="activity-stats" aria-label="Your activity statistics">
        {[
          { title: act?.stats?.totalPoints || 'Total points', value: data?.summary.points, icon: <Trophy size={19} />, tone: 'gold' },
          { title: act?.stats?.backgroundsRemoved || 'Backgrounds removed', value: data?.summary.backgrounds, icon: <ImageMinus size={19} />, tone: 'cyan' },
          { title: act?.stats?.imagesUpscaled || 'Images upscaled', value: data?.summary.upscales, icon: <ArrowUpRight size={19} />, tone: 'purple' },
          { title: act?.stats?.totalActivities || 'Total activities', value: data?.summary.total, icon: <WandSparkles size={19} />, tone: 'pink' },
        ].map((item) => <motion.article key={item.title} className={`activity-stat ${item.tone}`} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}><span>{item.icon}</span><small>{item.title}</small><strong>{loading && !data ? '—' : (item.value ?? 0).toLocaleString()}</strong></motion.article>)}
      </section>

      <section className="achievement-section" aria-labelledby="achievement-heading"><div className="section-heading"><div><p className="activity-eyebrow"><Trophy size={14} /> {act?.milestones || 'Milestones'}</p><h2 id="achievement-heading">{act?.achievementsTitle || 'Your achievements'}</h2></div><span>{data ? (act?.unlockedCount?.replace('{unlocked}', String(achievements.filter((a) => a.earned(data)).length)).replace('{total}', String(achievements.length)) || `${achievements.filter((a) => a.earned(data)).length} / ${achievements.length} unlocked`) : (act?.basedOnActivity || 'Based on your activity')}</span></div>
        <div className="achievement-grid">{achievements.map((badge) => {
          const unlocked = Boolean(data && badge.earned(data));
          const badgeKey = badgeKeyMap[badge.key];
          const bTrans = badgeKey && act?.badges ? act.badges[badgeKey] : undefined;
          const bTitle = bTrans?.title || badge.title;
          const bDesc = bTrans?.description || badge.description;
          return <article key={badge.key} className={`achievement-card${unlocked ? ' unlocked' : ''}`} aria-label={`${bTitle}, ${unlocked ? 'unlocked' : 'locked'}`}><Image src={`/leaderboard/badges/${badge.key}.svg`} alt="" width={54} height={54} /><div><strong>{bTitle}</strong><span>{bDesc}</span></div><i>{unlocked ? (act?.statusEarned || 'Earned') : (act?.statusLocked || 'Locked')}</i></article>;
        })}</div>
      </section>

      <section className="activity-history" aria-labelledby="history-heading">
        <div className="section-heading history-heading"><div><p className="activity-eyebrow"><Clock3 size={14} /> {act?.history || 'Your history'}</p><h2 id="history-heading">{act?.recentActivity || 'Recent activity'}</h2></div><span>{data ? (act?.matchingRecords?.replace('{count}', data.totalFiltered.toLocaleString()) || `${data.totalFiltered.toLocaleString()} matching records`) : (act?.privateToYou || 'Private to you')}</span></div>
        <div className="activity-filters">
          <label>{act?.activityType || 'Activity type'}<select value={type} onChange={(event) => { setPage(1); setType(event.target.value as ActivityType); }}>{(Object.keys(typeLabels) as ActivityType[]).map((key) => <option value={key} key={key}>{typeLabels[key]}</option>)}</select></label>
          <label>{act?.timePeriod || 'Time period'}<select value={period} onChange={(event) => { setPage(1); setPeriod(event.target.value as Period); }}>{(Object.keys(periodLabels) as Period[]).map((key) => <option value={key} key={key}>{periodLabels[key]}</option>)}</select></label>
          <span className="private-note"><span /> {act?.onlyYouNotice || 'Only you can see this activity'}</span>
        </div>

        {error ? <div className="activity-message error" role="alert"><strong>{act?.errorTitle || 'Could not load your activity.'}</strong><p>{error}</p><button onClick={() => void load()}><RefreshCw size={15} /> {act?.retry || 'Retry'}</button></div> : loading && !data ? <div className="activity-skeleton" aria-label="Loading your activity">{Array.from({ length: 4 }, (_, i) => <div key={i}><i /><span /><b /></div>)}</div> : noHistory ? <div className="activity-empty"><div className="empty-art"><span /><span /><Sparkles /></div><h3>{act?.emptyTitle || 'Your journey starts here.'}</h3><p>{act?.emptyText || 'Improve your first image with Pixelify and earn your first points.'}</p><div><Link href="/bg_remove/" className="activity-cta">{act?.tryBg || 'Try BG Remover'} <ArrowRight size={15} /></Link><Link href="/upscaler/" className="activity-cta secondary">{act?.tryUpscaler || 'Try AI Upscaler'} <ArrowRight size={15} /></Link></div></div> : data && data.activities.length === 0 ? <div className="activity-message"><strong>{act?.noMatchTitle || 'No activity matches these filters.'}</strong><p>{act?.noMatchText || 'Choose another activity type or time period to see your history.'}</p></div> : <>
          <div className="activity-timeline">{data?.activities.map((item, index) => {
            const isBg = item.action === 'background_removal';
            return <motion.article key={item.id} className="activity-item" initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .38, delay: reduced ? 0 : Math.min(index * .035, .3) }}><div className={`activity-icon ${isBg ? 'bg' : 'up'}`}>{isBg ? <ImageMinus size={17} /> : <ArrowUpRight size={18} />}</div><div className="activity-item-copy"><strong>{isBg ? (act?.itemBgTitle || 'Background removed') : (act?.itemUpTitle || 'AI image upscaled')}</strong><p>{isBg ? (act?.itemBgText || 'Successfully removed an image background.') : (act?.itemUpText || 'Successfully enhanced an image with AI upscaling.')}</p><time dateTime={item.created_at}>{formatDate(item.created_at)}</time></div><div className="activity-item-status"><span><CheckCircle2 size={14} /> {act?.success || 'Success'}</span><b>+{item.points} PT</b></div></motion.article>;
          })}</div>
          <div className="activity-pagination"><span>{act?.pageIndicator?.replace('{page}', String(page)).replace('{total}', String(totalPages)) || `Page ${page} of ${totalPages}`}</span><div><button disabled={page <= 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))}><ArrowLeft size={14} /> {act?.prev || 'Previous'}</button><button disabled={page >= totalPages || loading} onClick={() => setPage((value) => value + 1)}>{act?.next || 'Next'} <ArrowRight size={14} /></button></div></div>
        </>}
      </section>
      <footer className="activity-footer"><Link href="/leaderboard/"><ArrowLeft size={14} /> {act?.returnLeaderboard || 'Return to public leaderboard'}</Link><span>{act?.footerNote || 'Private activity · Visible only to this browser profile'}</span></footer>
    </div>
  </main>;
}
