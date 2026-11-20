'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from './Reveal';
import { useApp } from '../AppProvider';
import { useTranslation } from '@/locales';

interface DemoSample {
  id: string;
  key: 'sports' | 'anime' | 'ocean' | 'vintage';
  name: string;
  tag: string;
  src: string;
  type: 'bg_remove' | 'upscaler';
  model: string;
  description: string;
  href: string;
}

const DEMO_SAMPLES: DemoSample[] = [
  {
    id: 's1',
    key: 'sports',
    name: 'Sports Cutout',
    tag: 'Cutout',
    src: '/home/demo/ronaldo.jpg',
    type: 'bg_remove',
    model: 'Chopper',
    description: 'Sub-pixel edge matting and background removal with zero upload latency.',
    href: '/bg_remove/',
  },
  {
    id: 's2',
    key: 'anime',
    name: 'Anime Arts',
    tag: 'Cutout',
    src: '/home/demo/one-piece.jpg',
    type: 'bg_remove',
    model: 'Chopper',
    description: 'Anime background removal with high precision and natural hair matting.',
    href: '/bg_remove/',
  },
  {
    id: 's3',
    key: 'ocean',
    name: 'Ocean Life',
    tag: 'Upscale',
    src: '/home/demo/turtle.jpg',
    type: 'upscaler',
    model: 'Vitality',
    description: 'High-frequency micro-texture reconstruction for fine organic details.',
    href: '/upscaler/',
  },
  {
    id: 's4',
    key: 'vintage',
    name: 'Vintage Archive',
    tag: 'Upscale',
    src: '/home/demo/mt-king.jpg',
    type: 'upscaler',
    model: 'Vitality',
    description: 'Natural portrait restoration, cleaning film grain and compression artifacts.',
    href: '/upscaler/',
  },
];

export function InstantDemos() {
  const { onSelectSample } = useApp();
  const { t } = useTranslation();
  const idSection = t.instantDemos;
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleTryDemo = async (sample: DemoSample) => {
    if (loadingId) return;
    setLoadingId(sample.id);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('pixelify:navigation-start'));
    }
    try {
      await onSelectSample(sample.src, sample.type === 'bg_remove' ? 'bg_remove' : 'upscale');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="fh-section fh-demos" id="instant-demos">
      <div className="fh-container">
        <Reveal className="fh-section-header">
          <div className="fh-section-header-copy">
            <p className="fh-eyebrow">{idSection?.eyebrow || 'Instant Demos'}</p>
            <h2 className="fh-h2">{idSection?.title || 'Try sample assets with a single click'}</h2>
            <p className="fh-section-lede">
              {idSection?.lede ||
                'Test on-device AI models on real pre-loaded images. Nothing uploaded, no waitlist, zero account required.'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/upscaler/" className="fh-pill fh-pill-secondary">
              {idSection?.openStudio || 'Open studio'}
            </Link>
          </div>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" stagger={0.06}>
          {DEMO_SAMPLES.map((sample) => {
            const sampleTrans = idSection?.samples?.[sample.key];
            const sampleName = sampleTrans?.name || sample.name;
            const sampleTag = sampleTrans?.tag || sample.tag;
            const sampleDesc = sampleTrans?.description || sample.description;

            return (
              <RevealItem
                key={sample.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#262626] bg-[#141414] hover:border-white/20 hover:bg-[#181818] transition-all duration-300 min-h-[340px]"
              >
                <div className="relative h-48 w-full overflow-hidden bg-black/60">
                  <img
                    src={sample.src}
                    alt={sampleName}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30 pointer-events-none" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white/90">
                    {sampleTag}
                  </span>
                </div>

                <div className="p-5 flex flex-col justify-start flex-1">
                  <h3 className="text-base font-semibold text-white tracking-tight">
                    {sampleName}
                  </h3>
                  <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed font-normal">
                    {sampleDesc}
                  </p>
                </div>

                <div className="w-full border-t border-white/[0.08] px-5 py-3.5 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-400">{sample.model}</span>
                  <button
                    type="button"
                    onClick={() => handleTryDemo(sample)}
                    disabled={loadingId !== null}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-[#0099ff] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {loadingId === sample.id ? (
                      <>
                        <Loader2 size={12} className="animate-spin text-[#0099ff]" />
                        <span>{idSection?.loading || 'Loading...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{idSection?.tryDemo || 'Try demo'}</span>
                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
