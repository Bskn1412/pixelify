'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Trophy, Wifi } from 'lucide-react';
import { addRewardUpdateListener, getPendingRewardCount, syncPendingRewards, type RewardUpdate } from '@/lib/visitor';

type Popup = { id: string; amount: number; status: 'pending' | 'saved' };

export default function LeaderboardRewardFeedback() {
  const [popup, setPopup] = useState<Popup | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const applyUpdate = (update: RewardUpdate) => {
      setPendingCount(update.pendingCount);
      if (update.type === 'earned') {
        setPopup((previous) => ({
          id: `earned-${update.operationId}`,
          amount: previous?.status === 'pending' ? previous.amount + update.amount : update.amount,
          status: 'pending',
        }));
      } else if (update.type === 'synced') {
        setPopup((previous) => {
          if (previous?.status === 'pending') {
            return { ...previous, amount: update.amount > 0 ? update.amount : previous.amount, status: 'saved' };
          }
          return update.amount > 0 ? { id: `synced-${Date.now()}`, amount: update.amount, status: 'saved' } : previous;
        });
      }
    };

    const removeListener = addRewardUpdateListener(applyUpdate);
    const retry = () => {
      setPendingCount(getPendingRewardCount());
      void syncPendingRewards();
    };

    setPendingCount(getPendingRewardCount());
    void syncPendingRewards();
    window.addEventListener('online', retry);
    document.addEventListener('visibilitychange', retry);
    return () => {
      removeListener();
      window.removeEventListener('online', retry);
      document.removeEventListener('visibilitychange', retry);
    };
  }, []);

  useEffect(() => {
    if (pendingCount === 0) return;
    const retryTimer = window.setInterval(() => void syncPendingRewards(), 15000);
    return () => window.clearInterval(retryTimer);
  }, [pendingCount]);

  useEffect(() => {
    if (!popup) return;
    const dismissTimer = window.setTimeout(() => setPopup(null), 3000);
    return () => window.clearTimeout(dismissTimer);
  }, [popup?.id]);

  return (
    <>
      {popup && (
        <div className="pointer-events-none fixed bottom-5 right-4 z-[120] sm:right-5" aria-live="polite">
          <div key={popup.id} role="status" className="reward-point-popup flex max-w-[min(18rem,calc(100vw-2rem))] items-center gap-2.5 rounded-xl border border-[#6c5ce7]/35 bg-[#12121e]/95 px-3 py-2.5 text-white shadow-[0_8px_28px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fdcb6e]/12 text-[#fdcb6e]">
              {popup.status === 'saved' ? <Trophy size={16} aria-hidden="true" /> : <Sparkles size={16} aria-hidden="true" />}
            </span>
            <div className="min-w-0">
              <p className="flex items-baseline gap-2 leading-none">
                <span className="font-mono text-lg font-bold text-[#fdcb6e]">+{popup.amount}</span>
                <span className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-white">{popup.amount === 1 ? 'Point earned' : 'Points earned'}</span>
              </p>
              <p className="mt-1 truncate text-[11px] leading-tight text-[#a4a4b8]">
                {popup.status === 'saved' ? 'Added to leaderboard' : 'Saved on this device'}
              </p>
            </div>
          </div>
        </div>
      )}
      {pendingCount > 0 && !popup && (
        <div role="status" className="leaderboard-pending-enter fixed bottom-5 right-5 z-[120] flex items-center gap-2 rounded-xl border border-[#2a2a3e] bg-[#12121e]/95 px-3 py-2 text-xs font-medium text-[#c6c6d5] shadow-xl backdrop-blur-xl">
          <Wifi size={14} className="text-[#fdcb6e]" aria-hidden="true" />
          {pendingCount} {pendingCount === 1 ? 'point' : 'points'} waiting to sync
        </div>
      )}
    </>
  );
}
