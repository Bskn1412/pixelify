'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md w-full rounded-3xl bg-white/[0.04] border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-5">
          Notice
        </div>
        <h2 className="text-2xl font-black tracking-tight mb-3">Something interrupted the page</h2>
        <p className="text-sm text-neutral-400 leading-relaxed mb-6">
          If you recently switched networks or went offline, some live page assets may have been interrupted.
          Pixelify tools run fully on-device.
        </p>
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-3 px-5 rounded-xl bg-[#00FF85] hover:bg-[#00E575] text-black font-extrabold text-sm shadow-[0_0_25px_rgba(0,255,133,0.3)] transition-all cursor-pointer"
          >
            Retry Loading
          </button>
          <Link
            href="/upscaler"
            className="w-full py-2.5 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition-colors text-center"
          >
            Go to AI Upscaler
          </Link>
          <Link
            href="/"
            className="w-full py-2 px-5 text-neutral-500 hover:text-neutral-300 font-medium text-xs transition-colors text-center"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

