import { MODELS } from '../constants';
import type { ModelKey } from '../types';

interface OrtModule {
  InferenceSession: {
    create: (path: string | Uint8Array, options?: any) => Promise<InferenceSession>;
  };
  Tensor: new (type: string, data: Float32Array, shape: number[]) => Tensor;
  env: {
    wasm: {
      wasmPaths: string;
      proxy: boolean;
      numThreads?: number;
    };
  };
}

interface InferenceSession {
  inputNames: string[];
  outputNames: string[];
  run: (inputs: Record<string, Tensor>) => Promise<Record<string, Tensor>>;
  /** ORT internals: lets us read back the EP the session ACTUALLY created with */
  handler?: { executionProviders?: string[] };
}

interface Tensor {
  data: Float32Array;
}

export async function loadONNX(): Promise<OrtModule> {
  // ort-web 1.19.2 all-in-one ESM bundle: contains BOTH webgpu (jsep) and wasm
  // execution providers, and — unlike 1.17.x — the webgpu EP actually works
  // with env.wasm.proxy (ORT's worker). wasmPaths resolve the matching
  // ort-wasm-simd-threaded.jsep.{mjs,wasm} artifacts from the same dist.
  const ort: OrtModule = await import(
    'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/dist/ort.all.bundle.min.mjs'
  ) as any;
  ort.env.wasm.wasmPaths =
    'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/dist/';
  ort.env.wasm.proxy = true;
  if (!crossOriginIsolated) {
    ort.env.wasm.numThreads = 1;
  }
  return ort;
}

async function fetchModelWithCache(path: string): Promise<Uint8Array> {
  try {
    const cache = await caches.open('onnx-models');
    const cached = await cache.match(path);
    if (cached) {
      const buf = new Uint8Array(await cached.arrayBuffer());
      // Valid ONNX models in our app are at least 1.5MB. If a 404 or corrupted stub was cached, invalidate it!
      if (buf.byteLength > 100000) {
        return buf;
      }
      await cache.delete(path);
    }
    const res = await fetch(path);
    if (!res.ok) {
      throw new Error(`Failed to load model file ${path}: HTTP ${res.status}`);
    }
    const data = new Uint8Array(await res.arrayBuffer());
    if (data.byteLength > 100000) {
      cache.put(path, new Response(data));
    }
    return data;
  } catch (err) {
    // Direct network fallback if Cache API fails or throws
    const res = await fetch(path);
    if (!res.ok) {
      throw new Error(`Failed to load model file ${path}: HTTP ${res.status}`);
    }
    return new Uint8Array(await res.arrayBuffer());
  }
}

export async function createSession(
  ort: OrtModule, 
  modelKey: ModelKey, 
  forceEngine?: 'wasm' | 'webgpu'
): Promise<InferenceSession> {
  const m = MODELS[modelKey];
  const data = await fetchModelWithCache(m.file);

  // ClearReality uses DepthToSpace / PixelShuffle. In ORT Web 1.19.2+, WebGPU JSEP kernel for DepthToSpace
  // has a known dimension mismatch bug with 4D output tensors [1, 512, 512, 3].
  // Running ClearReality on WASM SIMD is ultra-fast (~100ms for 1.9MB model) and 100% stable.
  const targetEngine = modelKey === 'clearreality' ? 'wasm' : forceEngine;

  if (targetEngine === 'wasm') {
    const session = await ort.InferenceSession.create(data, { executionProviders: ['wasm'] });
    (session as any).__engine = 'wasm';
    (session as any).__modelKey = modelKey;
    return session;
  }

  // WebGPU FIRST for heavy generative models (UltraSharp 67MB, Real-ESRGAN 65MB): probe GPU adapter
  let adapterOk = false;
  try {
    const gpu = (navigator as any).gpu;
    if (gpu) adapterOk = !!(await gpu.requestAdapter());
  } catch {
    adapterOk = false;
  }

  if (adapterOk) {
    try {
      const session = await ort.InferenceSession.create(data, { executionProviders: ['webgpu'] });
      (session as any).__engine = 'webgpu';
      (session as any).__modelKey = modelKey;
      return session;
    } catch (e) {
      console.warn(`WebGPU session creation failed for ${modelKey}, falling back to WASM:`, e);
    }
  }

  const session = await ort.InferenceSession.create(data, { executionProviders: ['wasm'] });
  (session as any).__engine = 'wasm';
  (session as any).__modelKey = modelKey;
  return session;
}

export async function runPass(
  ort: OrtModule,
  session: InferenceSession,
  data: Float32Array,
  srcW: number,
  srcH: number,
  passIdx: number,
  totalPasses: number,
  modelKey: ModelKey,
  onProgress: (pct: number, text: string) => void,
  onSessionUpdated?: (newSession: InferenceSession) => void,
): Promise<Float32Array> {
  const m = MODELS[modelKey];
  const tileSize = m.tileSize;
  const scale = m.scale;
  const ch = m.color === 'rgb' ? 3 : 1;
  const dstW = srcW * scale;
  const dstH = srcH * scale;
  const numHTiles = Math.ceil(dstW / (tileSize * scale));
  const numVTiles = Math.ceil(dstH / (tileSize * scale));
  const totalTiles = numHTiles * numVTiles;
  const outData = new Float32Array(dstW * dstH * ch);
  let done = 0;

  await new Promise((r) => setTimeout(r, 0));

  for (let ty = 0; ty < numVTiles; ty++) {
    for (let tx = 0; tx < numHTiles; tx++) {
      done++;
      const pct =
        (passIdx * 100) / totalPasses +
        (done / totalTiles) * 100 / totalPasses;
      // Progress text stays human (no tile/pass bookkeeping — the ring + % show momentum)
      const label = `Reconstructing details… ${Math.round(pct)}%`;
      onProgress(Math.round(pct), label);
      await new Promise((r) => setTimeout(r, 0));

      const inX = tx * tileSize;
      const inY = ty * tileSize;
      const tileHWC = new Float32Array(tileSize * tileSize * ch);

      for (let y = 0; y < tileSize; y++) {
        const sy = Math.min(inY + y, srcH - 1);
        for (let x = 0; x < tileSize; x++) {
          const sx = Math.min(inX + x, srcW - 1);
          const srcOff = (sy * srcW + sx) * ch;
          const dstOff = (y * tileSize + x) * ch;
          for (let c = 0; c < ch; c++) tileHWC[dstOff + c] = data[srcOff + c];
        }
      }

      let tensorData = tileHWC;
      if (ch === 3) {
        tensorData = new Float32Array(tileSize * tileSize * 3);
        for (let c = 0; c < 3; c++)
          for (let y = 0; y < tileSize; y++)
            for (let x = 0; x < tileSize; x++)
              tensorData[c * tileSize * tileSize + y * tileSize + x] =
                tileHWC[(y * tileSize + x) * 3 + c];
        await new Promise((r) => setTimeout(r, 0));
      }

      const shape = [1, ch, tileSize, tileSize];
      // Always pass a fresh Float32Array copy to guarantee underlying ArrayBuffer is never shared or detached
      const inputTensor = new ort.Tensor('float32', new Float32Array(tensorData), shape);
      let rawOut: Float32Array;
      try {
        const r = await session.run({ [session.inputNames[0]]: inputTensor });
        rawOut = r[session.outputNames[0]].data;
      } catch (runErr: any) {
        if ((session as any)?.__engine === 'webgpu') {
          console.warn(`WebGPU execution error during tile run for ${modelKey}. Switching to WASM engine fallback:`, runErr);
          session = await createSession(ort, modelKey, 'wasm');
          (session as any).__engine = 'wasm';
          if (onSessionUpdated) onSessionUpdated(session);

          // Re-create a fresh tensor with a new Float32Array to guarantee buffer is never detached
          const freshTensor = new ort.Tensor('float32', new Float32Array(tensorData), shape);
          const r = await session.run({ [session.inputNames[0]]: freshTensor });
          rawOut = r[session.outputNames[0]].data;
        } else {
          throw runErr;
        }
      }
      await new Promise((r) => setTimeout(r, 0));

      const tw = Math.min(tileSize * scale, dstW - tx * tileSize * scale);
      const th = Math.min(tileSize * scale, dstH - ty * tileSize * scale);
      const outX = tx * tileSize * scale;
      const outY = ty * tileSize * scale;

      if (ch === 3) {
        const tileFull = tileSize * scale;
        for (let y = 0; y < th; y++) {
          const hwcRow = (outY + y) * dstW + outX;
          for (let x = 0; x < tw; x++) {
            const hwcOff = (hwcRow + x) * 3;
            const chwBase = y * tileFull + x;
            outData[hwcOff] = rawOut[chwBase];
            outData[hwcOff + 1] = rawOut[1 * tileFull * tileFull + chwBase];
            outData[hwcOff + 2] = rawOut[2 * tileFull * tileFull + chwBase];
          }
        }
      } else {
        for (let y = 0; y < th; y++) {
          const row = (outY + y) * dstW + outX;
          const srcRow = y * tileSize * scale;
          for (let x = 0; x < tw; x++) outData[row + x] = rawOut[srcRow + x];
        }
      }

      if (done % 3 === 0) await new Promise((r) => setTimeout(r, 0));
    }
  }
  return outData;
}
