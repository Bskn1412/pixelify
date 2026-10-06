import { useState, useCallback, useRef } from 'react';
import { detectBackend } from '../constants';
import { loadONNX, createSession } from '../utils/upscale';
import type { Backend, ModelKey } from '../types';

interface UseONNXReturn {
  ortRef: React.MutableRefObject<any>;
  backend: Backend | null;
  /** Execution provider the loaded session ACTUALLY runs on ('wasm' | 'webgpu') */
  execEngine: 'wasm' | 'webgpu' | null;
  sessionRef: React.MutableRefObject<any>;
  isLoading: boolean;
  /** 0–100 real progress of the in-flight model load; null when idle. */
  modelProgress: number | null;
  initONNX: () => Promise<void>;
  loadModel: (key: ModelKey) => Promise<boolean>;
}

export function useONNX(): UseONNXReturn {
  const ortRef = useRef<any>(null);
  const sessionRef = useRef<any>(null);
  const [backend, setBackend] = useState<Backend | null>(null);
  const [execEngine, setExecEngine] = useState<'wasm' | 'webgpu' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelProgress, setModelProgress] = useState<number | null>(null);

  const initONNX = useCallback(async () => {
    if (ortRef.current) return;
    setIsLoading(true);
    try {
      const back = detectBackend();
      setBackend(back);
      const ort = await loadONNX();
      ortRef.current = ort;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadModel = useCallback(async (key: ModelKey): Promise<boolean> => {
    if (!ortRef.current) {
      await initONNX();
    }
    setIsLoading(true);
    setModelProgress(0);
    try {
      const session = await createSession(ortRef.current, key, undefined, setModelProgress);
      sessionRef.current = session;
      // Truthful engine read: createSession tags the session with the EP that
      // actually won (webgpu first, wasm fallback). handler EPs as backup.
      const tagged: string | undefined = (session as any)?.__engine;
      const eps: string[] = (session as any)?.handler?.executionProviders ?? [];
      const engine: 'wasm' | 'webgpu' =
        tagged === 'webgpu' || eps.some((ep) => ep.toLowerCase().includes('webgpu'))
          ? 'webgpu'
          : 'wasm';
      setExecEngine(engine);
      return true;
    } catch (e) {
      console.error('Failed to load model:', e);
      return false;
    } finally {
      setIsLoading(false);
      setModelProgress(null);
    }
  }, [initONNX]);

  return { ortRef, backend, execEngine, sessionRef, isLoading, modelProgress, initONNX, loadModel };
}
