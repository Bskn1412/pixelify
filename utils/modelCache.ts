import { RUNTIME_CACHE } from './runtime';

// 'litert-upscaler-models' → upscaler LiteRT weights (Vitality/Pixel-Dance/Alpha-Satoru)
// 'transformers-cache' → BG remover weights (Chopper) + transformers.js artifacts
// 'ort-runtime' → legacy runtime blobs; cleared during model reset
const MODEL_CACHE_NAMES = ['litert-upscaler-models-v2', 'litert-upscaler-models', 'onnx-models', 'transformers-cache', RUNTIME_CACHE] as const;
const MODEL_CACHE_CHANNEL = 'pixelify-model-cache';
const CACHE_CLIENT_ID = `${Date.now()}-${Math.random()}`;
const modelCacheSubscribers = new Set<() => void>();
const modelCacheChannel = typeof BroadcastChannel === 'undefined'
  ? null
  : new BroadcastChannel(MODEL_CACHE_CHANNEL);

modelCacheChannel?.addEventListener('message', (event: MessageEvent) => {
  if (event.data?.type !== 'cleared' || event.data?.source === CACHE_CLIENT_ID) return;
  modelCacheSubscribers.forEach((subscriber) => subscriber());
});

export function subscribeToModelCacheCleared(subscriber: () => void): () => void {
  modelCacheSubscribers.add(subscriber);
  return () => modelCacheSubscribers.delete(subscriber);
}

export async function clearDownloadedModelCaches(): Promise<void> {
  if (typeof caches === 'undefined') {
    throw new Error('This browser does not support clearing model storage.');
  }

  const allCacheNames = await caches.keys().catch(() => []);
  const toDelete = new Set<string>([
    ...MODEL_CACHE_NAMES,
    ...allCacheNames.filter((name) => /model|transformer|onnx|litert|runtime/i.test(name)),
  ]);

  await Promise.all(Array.from(toDelete).map((name) => caches.delete(name).catch(() => false)));
  console.log('[Pixelify Model Cache] 🧹 Purged model caches:', Array.from(toDelete).join(', '));
  modelCacheChannel?.postMessage({ type: 'cleared', source: CACHE_CLIENT_ID });
}

export async function isDiabloModelCached(): Promise<boolean> {
  if (typeof window === 'undefined' || typeof caches === 'undefined') return false;
  try {
    const cache = await caches.open('onnx-models');
    const localMatch = (await cache.match('https://huggingface.co/Joker5800/pixelify/resolve/main/Diablo.onnx')) ||
      (await cache.match('/models/Diablo.onnx')) ||
      (await cache.match(new URL('/models/Diablo.onnx', window.location.origin).toString()));
    if (localMatch) return true;

    const keys = await cache.keys();
    for (const req of keys) {
      if (req.url.toLowerCase().includes('diablo')) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

export async function requestPersistentModelStorage(): Promise<boolean> {
  try {
    return (await navigator.storage?.persist?.()) ?? false;
  } catch {
    return false;
  }
}