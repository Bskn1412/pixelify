// components/ControlPanel.tsx
import React from 'react';
import { MODELS } from '../constants';
import type { ModelKey, Step, EnhancementOptions } from '../types';
import EnhancementCards from './EnhancementCards';

interface ControlPanelProps {
  modelKey: ModelKey;
  step: Step;
  isProcessing: boolean;
  isLoading: boolean;
  hasResult: boolean;
  options: EnhancementOptions;
  onOptionsChange: (newOptions: EnhancementOptions) => void;
  onModelChange: (key: ModelKey) => void;
  onUpscale: () => void;
  onDownload: (format?: 'png' | 'webp' | 'jpeg') => void;
}

export default function ControlPanel({
  modelKey,
  step,
  isProcessing,
  isLoading,
  hasResult,
  options,
  onOptionsChange,
  onModelChange,
  onUpscale,
  onDownload,
}: ControlPanelProps) {
  const m = MODELS[modelKey];
  const showControls = step === 'config' || step === 'processing' || step === 'result';

  if (!showControls) return null;
  const busy = isProcessing || isLoading;

  return (
    <section className="mb-8 animate-slide-up">
      <div className="glass-card rounded-2xl p-6 border border-white/10 shadow-2xl space-y-6">
        {/* Model Engine Picker */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">AI Model Engine:</span>
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 flex-wrap">
              <button
                type="button"
                onClick={() => onModelChange('vitality')}
                disabled={busy}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  modelKey === 'vitality'
                    ? 'bg-primary text-white shadow'
                    : 'text-muted hover:text-white'
                }`}
              >
                Vitality (Fast)
              </button>
              <button
                type="button"
                onClick={() => onModelChange('pixel-dance')}
                disabled={busy}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  modelKey === 'pixel-dance'
                    ? 'bg-primary text-white shadow'
                    : 'text-muted hover:text-white'
                }`}
              >
                Pixel-Dance (8K Extreme)
              </button>
              <button
                type="button"
                onClick={() => onModelChange('alpha-satoru')}
                disabled={busy}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  modelKey === 'alpha-satoru'
                    ? 'bg-primary text-white shadow'
                    : 'text-muted hover:text-white'
                }`}
              >
                Alpha-Satoru (Studio)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent font-bold border border-accent/20">
              {m.badges.quality}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 text-muted font-mono border border-white/10">
              {m.badges.time}
            </span>
          </div>
        </div>

        {/* AI Enhancement Cards Selector */}
        <EnhancementCards
          options={options}
          onChange={onOptionsChange}
          disabled={busy}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10 flex-wrap">
          <button
            onClick={onUpscale}
            disabled={busy}
            type="button"
            className="group relative px-10 py-4 rounded-xl text-base font-extrabold text-white
              bg-gradient-to-r from-primary via-indigo-500 to-accent
              shadow-xl shadow-primary/30
              hover:shadow-2xl hover:shadow-accent/40 hover:-translate-y-0.5
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0
              transition-all duration-200 active:translate-y-0 flex items-center gap-3"
          >
            <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{isProcessing ? 'Processing AI Tensor...' : hasResult ? 'Re-Enhance 8K Image' : 'Start 8K AI Upscale (Enter)'}</span>
          </button>

          {hasResult && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDownload('png')}
                type="button"
                className="px-6 py-4 rounded-xl font-bold text-sm text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download 8K PNG</span>
              </button>

              <button
                onClick={() => onDownload('webp')}
                type="button"
                className="px-4 py-4 rounded-xl font-bold text-xs text-muted hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                title="Download WebP format"
              >
                WebP
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
