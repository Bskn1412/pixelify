import { useState, useCallback, useRef } from 'react';
import { MODELS } from '../lib/constants';
import { loadLiteRT, createSession, isUpscalerModelCached } from '../utils/upscale';
import type { ModelKey } from '../types';

interface UseLiteRTReturn {
  runtimeRef: React.MutableRefObject<any>;
  /** LiteRT accelerator selected for the loaded model. */
  execEngine: 'wasm' | 'webgpu' | null;
  sessionRef: React.MutableRefObject<any>;
  /**
   * True only while a load the user is waiting on is in flight (an enhancement
   * run asking for its model). Background prefetches never set this, so the
   * UI cannot show a blocking "Loading AI model" state for work nobody asked for.
   */
  isLoading: boolean;
  /** True while any background prefetch/transfer is in flight (navbar badge). */
  isPrefetching: boolean;
  /** 0–100 real progress of the in-flight model transfer; null when idle. */
  modelProgress: number | null;
  initLiteRT: () => Promise<void>;
  loadModel: (
    key: ModelKey,
    opts?: { silentIfCached?: boolean; background?: boolean }
  ) => Promise<boolean>;
  unloadModel: () => Promise<void>;
}

export function useLiteRT(): UseLiteRTReturn {
  const runtimeRef = useRef<any>(null);
  const sessionRef = useRef<any>(null);
  const [execEngine, setExecEngine] = useState<'wasm' | 'webgpu' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [modelProgress, setModelProgress] = useState<number | null>(null);
  const initPromiseRef = useRef<Promise<void> | null>(null);
  const modelLoadsRef = useRef(new Map<ModelKey, { promise: Promise<boolean>; controller: AbortController }>());
  const sessionGenerationRef = useRef(0);
  // Concurrent transfers are counted so one finishing early cannot clear the
  // flags/progress of another that is still running.
  const blockingLoadsRef = useRef(0);
  const backgroundLoadsRef = useRef(0);

  const syncLoadingFlags = useCallback(() => {
    const blocking = blockingLoadsRef.current > 0;
    const background = backgroundLoadsRef.current > 0;
    setIsLoading(blocking);
    setIsPrefetching(background);
    if (!blocking && !background) setModelProgress(null);
  }, []);

  const beginTransfer = useCallback((background: boolean) => {
    if (background) backgroundLoadsRef.current += 1;
    else blockingLoadsRef.current += 1;
    syncLoadingFlags();
  }, [syncLoadingFlags]);

  const endTransfer = useCallback((background: boolean) => {
    if (background) backgroundLoadsRef.current = Math.max(0, backgroundLoadsRef.current - 1);
    else blockingLoadsRef.current = Math.max(0, blockingLoadsRef.current - 1);
    syncLoadingFlags();
  }, [syncLoadingFlags]);

  const initLiteRT = useCallback(async () => {
    if (runtimeRef.current) return;
    if (!initPromiseRef.current) {
      // Runtime download is never something the user is waiting on directly,
      // so it belongs to the background bucket.
      beginTransfer(true);
      const initPromise = (async () => {
        try {
          const runtime = await loadLiteRT();
          runtimeRef.current = runtime;
        } finally {
          endTransfer(true);
        }
      })();
      initPromiseRef.current = initPromise;
      const clearInitPromise = () => {
        if (initPromiseRef.current === initPromise) initPromiseRef.current = null;
      };
      void initPromise.then(clearInitPromise, clearInitPromise);
    }
    await initPromiseRef.current;
  }, [beginTransfer, endTransfer]);

  const loadModel = useCallback(async (
    key: ModelKey,
    opts?: { silentIfCached?: boolean; background?: boolean }
  ): Promise<boolean> => {
    const existingLoad = modelLoadsRef.current.get(key);
    if (existingLoad) {
      // A background prefetch may already be transferring this model. The
      // caller is now blocked on it, so surface the transfer as blocking UI
      // (with its real progress) for as long as they wait.
      if (opts?.background) return existingLoad.promise;
      beginTransfer(false);
      try {
        return await existingLoad.promise;
      } finally {
        endTransfer(false);
      }
    }

    const generation = sessionGenerationRef.current;
    const controller = new AbortController();
    const background = !!opts?.background;

    // Cached model + silent mode → session compiles with zero download UI,
    // so the navbar badge never appears for already-available models.
    let cached = false;
    if (opts?.silentIfCached) {
      try { cached = await isUpscalerModelCached(key); } catch { cached = false; }
    }
    const showProgressUI = !opts?.silentIfCached || !cached;

    const loadPromise = (async () => {
      try {
        if (!runtimeRef.current) await initLiteRT();
        if (showProgressUI) {
          beginTransfer(background);
          setModelProgress(0);
        }
        const session = await createSession(
          runtimeRef.current,
          key,
          undefined,
          showProgressUI ? setModelProgress : undefined,
          controller.signal
        );
        if (generation !== sessionGenerationRef.current) {
          await (session as any).release?.();
          return false;
        }
        sessionRef.current = session;
        setExecEngine((session as any).__engine);
        return true;
      } catch (e) {
        if (!controller.signal.aborted) console.error('Failed to load model:', e);
        return false;
      } finally {
        if (showProgressUI) endTransfer(background);
      }
    })();
    const load = { promise: loadPromise, controller };
    modelLoadsRef.current.set(key, load);
    try {
      return await loadPromise;
    } finally {
      if (modelLoadsRef.current.get(key) === load) {
        modelLoadsRef.current.delete(key);
      }
    }
  }, [initLiteRT, beginTransfer, endTransfer]);

  const unloadModel = useCallback(async () => {
    sessionGenerationRef.current += 1;
    const pendingLoads = [...modelLoadsRef.current.values()];
    pendingLoads.forEach(({ controller }) => controller.abort());
    modelLoadsRef.current.clear();
    await Promise.allSettled(pendingLoads.map(({ promise }) => promise));
    const session = sessionRef.current;
    sessionRef.current = null;
    setExecEngine(null);
    blockingLoadsRef.current = 0;
    backgroundLoadsRef.current = 0;
    setIsLoading(false);
    setIsPrefetching(false);
    setModelProgress(null);
    if (session?.release) await session.release();
  }, []);

  return {
    runtimeRef,
    execEngine,
    sessionRef,
    isLoading,
    isPrefetching,
    modelProgress,
    initLiteRT,
    loadModel,
    unloadModel,
  };
}