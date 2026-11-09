import { Skeleton } from '@/components/ui/Skeleton';

type LeaderboardSkeletonProps = { rows?: number };

/** Loading state for the board and Your Position section. */
export default function LeaderboardSkeleton({ rows = 8 }: LeaderboardSkeletonProps) {
  return (
    <section aria-label="Loading leaderboard" aria-busy="true" className="mx-auto w-full">
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-4 sm:px-6">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="divide-y divide-white/[0.06]">
          {Array.from({ length: Math.max(1, rows) }, (_, index) => (
            <div key={index} className="grid grid-cols-[34px_minmax(0,1fr)_58px] items-center gap-3 px-4 py-4 sm:grid-cols-[48px_minmax(0,1fr)_120px] sm:gap-4 sm:px-6">
              <Skeleton className="h-5 w-7" />
              <div className="flex min-w-0 items-center gap-3">
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1"><Skeleton className="h-4 w-36 max-w-[80%]" /><Skeleton className="mt-2 h-3 w-24" /></div>
              </div>
              <Skeleton className="ml-auto h-5 w-12 sm:w-16" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 rounded-2xl border border-sky-300/10 bg-sky-300/[0.035] p-5 sm:p-6">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-2 h-6 w-56 max-w-full" />
        <div className="mt-5 flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <Skeleton className="h-4 w-40 max-w-[50%]" />
          <Skeleton className="ml-auto h-5 w-14" />
        </div>
      </div>
      <span className="sr-only" role="status">Loading leaderboard data…</span>
    </section>
  );
}
