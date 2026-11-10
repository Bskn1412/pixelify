const VISITOR_KEY = 'pixelify_visitor_id_v1';
const PENDING_REWARDS_KEY = 'pixelify_pending_rewards_v1';
const REWARD_EVENT = 'pixelify:reward-update';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type RewardAction = 'background_removal' | 'upscale';
type PendingReward = { visitorId: string; operationId: string; action: RewardAction };
export type RewardUpdate =
  | { type: 'earned'; operationId: string; amount: number; pendingCount: number }
  | { type: 'pending'; pendingCount: number }
  | { type: 'synced'; amount: number; pendingCount: number };

let syncPromise: Promise<void> | null = null;
let syncRequested = false;

export function getVisitorId(): string {
  let visitorId = window.localStorage.getItem(VISITOR_KEY);
  if (!visitorId || !UUID.test(visitorId)) {
    visitorId = window.crypto.randomUUID();
    window.localStorage.setItem(VISITOR_KEY, visitorId);
  }
  return visitorId;
}

export function setVisitorId(visitorId: string) {
  if (!UUID.test(visitorId)) return;
  try { window.localStorage.setItem(VISITOR_KEY, visitorId); } catch { /* The signed cookie remains authoritative. */ }
}

export async function syncVisitorIdentity(): Promise<string> {
  const response = await fetch('/api/identity', { cache: 'no-store' });
  if (!response.ok) throw new Error('Could not initialize visitor identity.');
  const result = await response.json() as { visitorId: string };
  setVisitorId(result.visitorId);
  try {
    const pending: unknown = JSON.parse(window.localStorage.getItem(PENDING_REWARDS_KEY) || '[]');
    if (Array.isArray(pending)) {
      const migrated = pending.filter((item) => item && typeof item === 'object').map((item) => ({ ...(item as PendingReward), visitorId: result.visitorId }));
      writePendingRewards(migrated);
    }
  } catch { /* Pending work is optional if local storage is unavailable. */ }
  return result.visitorId;
}

function readPendingRewards(): PendingReward[] {
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(PENDING_REWARDS_KEY) || '[]');
    if (!Array.isArray(stored)) return [];
    return stored.filter((item): item is PendingReward =>
      item && typeof item === 'object' &&
      UUID.test(item.visitorId || '') && UUID.test(item.operationId || '') &&
      (item.action === 'background_removal' || item.action === 'upscale')
    );
  } catch {
    return [];
  }
}

function writePendingRewards(rewards: PendingReward[]) {
  try {
    window.localStorage.setItem(PENDING_REWARDS_KEY, JSON.stringify(rewards));
  } catch {
    // The visible reward still works if the browser has disabled local storage.
  }
}

function emitRewardUpdate(detail: RewardUpdate) {
  window.dispatchEvent(new CustomEvent<RewardUpdate>(REWARD_EVENT, { detail }));
}

export function getPendingRewardCount(): number {
  if (typeof window === 'undefined') return 0;
  return readPendingRewards().length;
}

async function drainPendingRewards() {
  let addedPoints = 0;
  let acknowledged = 0;

  while (typeof navigator === 'undefined' || navigator.onLine) {
    const [next] = readPendingRewards();
    if (!next) break;

    let response: Response;
    try {
      response = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(next),
        keepalive: true,
      });
    } catch {
      break;
    }
    if (!response.ok) break;

    let awarded = false;
    try {
      const result = await response.json() as { awarded?: boolean };
      awarded = result.awarded === true;
    } catch {
      // Keep the operation queued if the server did not return an acknowledgement.
      break;
    }

    const remaining = readPendingRewards().filter((item) => item.operationId !== next.operationId);
    writePendingRewards(remaining);
    acknowledged += 1;
    if (awarded) addedPoints += 1;
    emitRewardUpdate({ type: 'pending', pendingCount: remaining.length });
  }

  const pendingCount = getPendingRewardCount();
  if (acknowledged > 0) emitRewardUpdate({ type: 'synced', amount: addedPoints, pendingCount });
  return pendingCount;
}

/** Save each successful operation locally before attempting the server write. */
export async function awardPoint(action: RewardAction, operationId: string): Promise<void> {
  try {
    const visitorId = await syncVisitorIdentity();
    const pending = readPendingRewards();
    if (pending.some((item) => item.operationId === operationId)) {
      await syncPendingRewards();
      return;
    }

    const updated = [...pending, { visitorId, operationId, action }];
    writePendingRewards(updated);
    emitRewardUpdate({ type: 'earned', operationId, amount: 1, pendingCount: updated.length });
    await syncPendingRewards();
  } catch {
    // Reward feedback must never interrupt image processing.
  }
}

/** Retry queued rewards on reconnect, on app startup, and after transient failures. */
export function syncPendingRewards(): Promise<void> {
  if (typeof window === 'undefined' || typeof navigator !== 'undefined' && !navigator.onLine) {
    return Promise.resolve();
  }
  if (syncPromise) {
    syncRequested = true;
    return syncPromise;
  }

  syncPromise = (async () => {
    do {
      syncRequested = false;
      await drainPendingRewards();
    } while (syncRequested && (typeof navigator === 'undefined' || navigator.onLine));
  })().finally(() => {
    syncPromise = null;
  });
  return syncPromise;
}

export function addRewardUpdateListener(listener: (update: RewardUpdate) => void) {
  const handleEvent = (event: Event) => listener((event as CustomEvent<RewardUpdate>).detail);
  window.addEventListener(REWARD_EVENT, handleEvent);
  return () => window.removeEventListener(REWARD_EVENT, handleEvent);
}
