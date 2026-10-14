/// <reference lib="webworker" />

import { pipeline, env } from '@huggingface/transformers';

type Engine = 'webgpu' | 'wasm';
type WorkerMessage = {
  type?: string;
  id?: string | number;
  url?: string;
  forceWasm?: boolean;
};

const MODEL_ID = 'studioludens/birefnet-lite-512';
const GPU_PROBE_TIMEOUT_MS = 3500;

// Model weights are fetched from the model repository; no local-model lookup.
env.allowLocalModels = false;

const worker = self as DedicatedWorkerGlobalScope;
const post = (message: Record<string, unknown>) => worker.postMessage(message);

let removerPromise: Promise<any> | null = null;
let chosenEngine: Engine | null = null;
let preferredEngine: Engine | null = null;
let webgpuAvailable = false;
let lastWebgpuError: string | null = null;
let initStartedAt = 0;

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return typeof error === 'string' ? error : 'Unknown error';
}

function status(stage: string, extra: Record<string, unknown> = {}) {
  post({ type: 'STATUS', stage, engine: chosenEngine, ...extra });
}

function progressCallback(event: any) {
  // Transformers.js emits progress events while downloading model files. Keep
  // this distinct from model compilation/initialization, which has no % callback.
  if (event?.status === 'progress') {
    const total = Number(event.total || 0);
    const loaded = Number(event.loaded || 0);
    const progress = total > 0 ? Math.max(0, Math.min(100, Math.round((loaded / total) * 100))) : null;
    post({
      type: 'PROGRESS',
      stage: 'model-download',
      ...(progress === null ? {} : { progress }),
      file: event.file,
      loaded,
      total: total || null,
    });
  } else if (event?.status) {
    post({ type: 'STATUS', stage: String(event.status), detail: event.file });
  }
}

/**
 * A time-bounded WebGPU probe. requestAdapter() alone can report an adapter
 * even when device creation is not possible, so also try requestDevice().
 * This is only a capability probe; pipeline initialization is the real test.
 */
async function detectWebGPU(timeoutMs = GPU_PROBE_TIMEOUT_MS): Promise<boolean> {
  const gpu = (worker.navigator as any)?.gpu;
  if (!gpu || typeof gpu.requestAdapter !== 'function') return false;

  let adapter: any = null;
  try {
    let adapterTimeoutId: ReturnType<typeof setTimeout> | undefined;
    try {
      adapter = await Promise.race([
        gpu.requestAdapter(),
        new Promise<null>((resolve) => {
          adapterTimeoutId = setTimeout(() => resolve(null), timeoutMs);
        }),
      ]);
    } finally {
      if (adapterTimeoutId !== undefined) clearTimeout(adapterTimeoutId);
    }
    if (!adapter) return false;

    let timedOut = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const devicePromise: Promise<any> = adapter.requestDevice();
    // If requestDevice resolves after the timeout, destroy the late probe device.
    void devicePromise.then((device) => {
      if (timedOut) {
        try { device?.destroy?.(); } catch { /* best effort */ }
      }
    }).catch(() => undefined);

    const device = await Promise.race([
      devicePromise,
      new Promise<null>((resolve) => {
        timeoutId = setTimeout(() => {
          timedOut = true;
          resolve(null);
        }, timeoutMs);
      }),
    ]);
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    if (!device) return false;
    try { device.destroy?.(); } catch { /* probe cleanup is best effort */ }
    return true;
  } catch {
    return false;
  }
}

function createPipeline(engine: Engine): Promise<any> {
  status('loading-model', { requestedEngine: engine, model: MODEL_ID });
  return pipeline('background-removal', MODEL_ID, {
    device: engine,
    dtype: 'fp32',
    progress_callback: progressCallback,
  } as any);
}

/** Best-effort release. Transformers.js versions differ in which object exposes dispose(). */
async function disposePipeline(remover: any): Promise<void> {
  if (!remover) return;
  try {
    if (typeof remover.dispose === 'function') {
      await remover.dispose();
      return;
    }
  } catch { /* continue with model-level cleanup */ }
  try {
    if (typeof remover.model?.dispose === 'function') await remover.model.dispose();
  } catch { /* some backends own their resource lifecycle */ }
}

/**
 * Create WebGPU first, but never treat the probe as proof that this model works.
 * A failed WebGPU pipeline initialization is retried on WASM before giving up.
 */
async function createResilientPipeline(preferred: Engine): Promise<any> {
  preferredEngine = preferred;
  if (preferred === 'webgpu') {
    status('initializing-webgpu', { requestedEngine: 'webgpu' });
    try {
      const remover = await createPipeline('webgpu');
      chosenEngine = 'webgpu';
      lastWebgpuError = null;
      status('ready', { engine: 'webgpu' });
      return remover;
    } catch (error) {
      lastWebgpuError = errorMessage(error);
      post({
        type: 'ENGINE_FALLBACK',
        from: 'webgpu',
        to: 'wasm',
        stage: 'initialization',
        reason: lastWebgpuError,
      });
      status('initializing-wasm', { reason: lastWebgpuError });
    }
  } else {
    status('initializing-wasm', { requestedEngine: 'wasm' });
  }

  const remover = await createPipeline('wasm');
  chosenEngine = 'wasm';
  status('ready', { engine: 'wasm' });
  return remover;
}

async function getRemover(forceWasm = false): Promise<any> {
  // A manual WASM override must not silently reuse a previously-created GPU pipeline.
  if (forceWasm && removerPromise && chosenEngine === 'webgpu') {
    const oldPromise = removerPromise;
    removerPromise = null;
    chosenEngine = null;
    try { await disposePipeline(await oldPromise); } catch { /* ignore failed old init */ }
  }

  if (!removerPromise) {
    const promise = (async () => {
      let engine: Engine = forceWasm ? 'wasm' : (await detectWebGPU() ? 'webgpu' : 'wasm');
      webgpuAvailable = engine === 'webgpu';
      post({ type: 'CAPABILITIES', engine, webgpuAvailable, forceWasm });
      return createResilientPipeline(engine);
    })();
    removerPromise = promise;
    try {
      return await promise;
    } catch (error) {
      // Do not cache rejected promises: a later INIT can retry.
      if (removerPromise === promise) removerPromise = null;
      chosenEngine = null;
      throw error;
    }
  }
  return removerPromise;
}

/**
 * If the GPU dies during inference (device lost, unsupported operator, driver
 * reset, memory pressure), replace the pipeline with WASM and retry this image
 * exactly once. WASM errors are surfaced rather than retried forever.
 */
async function runInference(inputBlob: Blob): Promise<any> {
  const remover = await getRemover();
  try {
    return await remover(inputBlob);
  } catch (error) {
    if (chosenEngine !== 'webgpu') throw error;

    lastWebgpuError = errorMessage(error);
    post({
      type: 'ENGINE_FALLBACK',
      from: 'webgpu',
      to: 'wasm',
      stage: 'inference',
      reason: lastWebgpuError,
    });
    status('recovering-with-wasm', { reason: lastWebgpuError });

    await disposePipeline(remover);
    removerPromise = null;
    chosenEngine = null;
    const wasmRemover = await createResilientPipeline('wasm');
    removerPromise = Promise.resolve(wasmRemover);
    return await wasmRemover(inputBlob);
  }
}

async function loadInputBlob(url: string): Promise<Blob> {
  if (typeof url !== 'string' || !url) throw new Error('REMOVE_BG requires a valid image URL.');
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not read input image (HTTP ${response.status}).`);
  const blob = await response.blob();
  if (!blob.size) throw new Error('The selected image is empty or could not be read.');
  return blob;
}

async function handleMessage(data: WorkerMessage): Promise<void> {
  const { type, id, url, forceWasm } = data || {};

  if (type === 'INIT') {
    initStartedAt = performance.now();
    status('checking-webgpu');
    try {
      const remover = await getRemover(forceWasm === true);
      // getRemover resolves only when a usable pipeline has actually initialized.
      post({
        type: 'READY',
        engine: chosenEngine || 'wasm',
        webgpuAvailable,
        model: MODEL_ID,
        elapsedMs: Math.round(performance.now() - initStartedAt),
      });
      void remover;
    } catch (error) {
      post({
        type: 'ERROR',
        id: id ?? null,
        stage: 'initialization',
        message: errorMessage(error),
        engineFailed: preferredEngine === 'webgpu' || !!lastWebgpuError,
        webgpuAvailable,
      });
    }
    return;
  }

  if (type === 'REMOVE_BG') {
    const startedAt = performance.now();
    try {
      status('reading-image', { id });
      const inputBlob = await loadInputBlob(url || '');
      status('running-inference', { id, engine: chosenEngine });
      const output = await runInference(inputBlob);
      status('encoding-output', { id });
      if (!output || typeof output.toBlob !== 'function') {
        throw new Error('The background-removal model returned an unsupported output.');
      }
      const blob: Blob = await output.toBlob('image/png');
      if (!blob || blob.size === 0) throw new Error('Background removal produced an empty image.');
      post({
        type: 'DONE',
        id,
        blob,
        engine: chosenEngine,
        elapsedMs: Math.round(performance.now() - startedAt),
      });
      status('idle');
    } catch (error) {
      post({
        type: 'ERROR',
        id: id ?? null,
        stage: 'remove-bg',
        message: errorMessage(error),
        engine: chosenEngine,
        engineFailed: preferredEngine === 'webgpu' && chosenEngine !== 'webgpu',
      });
    }
  }
}

// Serialize commands in this worker. This prevents simultaneous model loads,
// duplicate inference on one pipeline, and a WASM fallback racing another job.
let messageQueue: Promise<void> = Promise.resolve();
worker.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
  messageQueue = messageQueue
    .then(() => handleMessage(event.data || {}))
    .catch((error) => {
      // Keep the queue alive even if an unexpected error escapes a handler.
      post({ type: 'ERROR', id: event.data?.id ?? null, stage: 'worker', message: errorMessage(error) });
    });
});
