import { loadAndCompile, loadLiteRt, Tensor, isWebGPUSupported, supportsFeature } from '@litertjs/core';

export type UpscalerAccelerator = 'wasm' | 'webgpu';
export interface LiteRtRuntime { loadAndCompile: typeof loadAndCompile; Tensor: typeof Tensor; isWebGPUSupported: typeof isWebGPUSupported }
let runtimePromise: Promise<LiteRtRuntime> | null = null;

/** Initialize LiteRT once; WASM artifacts are served locally for offline/cache-safe startup. */
export function loadLiteRT(): Promise<LiteRtRuntime> {
  if (typeof window !== 'undefined') {
    const g = window as any;
    g.HF_COMPACT_INTERNAL = process.env.HF_COMPACT_INTERNAL || process.env.NEXT_PUBLIC_HF_COMPACT_INTERNAL;
    g.HF_COMPAT_INTERNAL = process.env.HF_COMPAT_INTERNAL || process.env.NEXT_PUBLIC_HF_COMPAT_INTERNAL || g.HF_COMPACT_INTERNAL;
    g.HF_INTERNAL = process.env.HF_INTERNAL || process.env.NEXT_PUBLIC_HF_INTERNAL;
    g.HF_JSPI_INTERNAL = process.env.HF_JSPI_INTERNAL || process.env.NEXT_PUBLIC_HF_JSPI_INTERNAL;
    g.HF_THREADED_INTERNAL = process.env.HF_THREADED_INTERNAL || process.env.NEXT_PUBLIC_HF_THREADED_INTERNAL;
  }
  if (!runtimePromise) {
    runtimePromise = supportsFeature('jspi')
      .catch(() => false)
      .then((jspi) => loadLiteRt('/litert/wasm/', { jspi }).then(() => ({ loadAndCompile, Tensor, isWebGPUSupported })));
    runtimePromise.catch(() => { runtimePromise = null; });
  }
  return runtimePromise;
}
