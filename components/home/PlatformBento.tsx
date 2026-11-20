'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, Clock, Infinity as InfinityIcon, Lock, ShieldCheck, WifiOff, Zap } from 'lucide-react';
import { Reveal } from './Reveal';
import { ImageCompare } from './ImageCompare';
import { useTranslation } from '@/locales';

interface MiniRow {
  label: string;
  status: string;
  meta: string;
}

interface MiniTab {
  key: string;
  label: string;
  rows: MiniRow[];
}

/** The model card's three panes: the list, the record shape, and the run log. */
const MODEL_TABS: MiniTab[] = [
  {
    key: 'models',
    label: 'Models',
    rows: [
      { label: 'Vitality', status: 'Loaded', meta: '1.9 MB' },
      { label: 'Pixel-Dance', status: 'Ready', meta: '66.9 MB' },
      { label: 'Alpha-Satoru', status: 'Ready', meta: '67.1 MB' },
      { label: 'Chopper', status: 'Ready', meta: '40 MB' },
      { label: 'Diablo', status: 'Ready', meta: 'On demand' },
    ],
  },
  {
    key: 'fields',
    label: 'Fields',
    rows: [
      { label: 'model', status: 'text', meta: 'required' },
      { label: 'scale', status: 'int', meta: '2 · 4 · 8' },
      { label: 'sharpness', status: 'int', meta: '0 – 100' },
      { label: 'denoise', status: 'int', meta: '0 – 100' },
      { label: 'seed', status: 'int', meta: 'random' },
    ],
  },
  {
    key: 'runs',
    label: 'Runs',
    rows: [
      { label: 'Run 4821', status: 'Done', meta: '1.2 s' },
      { label: 'Run 4820', status: 'Done', meta: '8× · tiled' },
      { label: 'Run 4819', status: 'Cached', meta: '0.0 s' },
      { label: 'Run 4818', status: 'Done', meta: '2× · instant' },
      { label: 'Run 4817', status: 'Done', meta: 'Cutout' },
    ],
  },
];

/** The design card's panes: the layer stack, the type scale and the effects. */
const DESIGN_TABS: MiniTab[] = [
  {
    key: 'design',
    label: 'Design',
    rows: [
      { label: 'Heading · 44 px', status: 'Text', meta: 'visible' },
      { label: 'Badge · sticker', status: 'Element', meta: 'visible' },
      { label: 'Drop shadow', status: 'Effect', meta: 'on' },
    ],
  },
  {
    key: 'text',
    label: 'Text',
    rows: [
      { label: 'Display · 44 px', status: 'Inter', meta: 'tracking −2%' },
      { label: 'Body · 14 px', status: 'Inter', meta: 'leading 1.6' },
      { label: 'Caption · 11 px', status: 'Mono', meta: 'uppercase' },
    ],
  },
  {
    key: 'elements',
    label: 'Elements',
    rows: [
      { label: 'Badge · sticker', status: 'Element', meta: 'linked' },
      { label: 'Arrow · 12 px', status: 'Icon', meta: 'stroke 2' },
      { label: 'Frame · 4:5', status: 'Group', meta: 'auto layout' },
    ],
  },
  {
    key: 'layers',
    label: 'Layers',
    rows: [
      { label: 'Cutout · subject', status: 'Mask', meta: 'top' },
      { label: 'Backdrop · solid', status: 'Fill', meta: 'middle' },
      { label: 'Shadow · soft', status: 'Effect', meta: 'below' },
    ],
  },
];

/** Bars that fill to their value the first time the card is in view. */
function MetricBar({ width, delay }: { width: number; delay: number }) {
  return (
    <div className="fh-metric-bar">
      <motion.i
        initial={{ width: 0 }}
        whileInView={{ width: `${width}%` }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/** The card's switch is a real switch: it reports its state and moves the pill. */
function UrlToggle() {
  const [on, setOn] = useState(true);

  return (
    <div className="fh-url-toggle">
      <span>{on ? 'Open in browser' : 'Runs in this tab'}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="Open the studio in this browser"
        className="fh-toggle-switch"
        onClick={() => setOn((value) => !value)}
      >
        <i className={`fh-toggle-pill${on ? ' is-on' : ''}`} />
      </button>
    </div>
  );
}

/**
 * The bento's little app panel. The tabs are real buttons that swap the row
 * set, and the rows are buttons too: picking one pins it, so the automatic
 * cycle stops the moment a visitor touches the panel.
 */
function MiniDb({
  tabs,
  label,
  autoplay = false,
}: {
  tabs: MiniTab[];
  label: string;
  autoplay?: boolean;
}) {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState(0);
  const [picked, setPicked] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (reduce || pinned || !autoplay) return;
    const timer = window.setInterval(
      () => setPicked((index) => (index + 1) % tabs[0].rows.length),
      2600,
    );
    return () => window.clearInterval(timer);
  }, [reduce, pinned, autoplay, tabs]);

  const active = tabs[tab];
  const isModelPane = autoplay && tab === 0;

  return (
    <div className="fh-mini-db">
      <div className="fh-mini-db-tabs" role="group" aria-label={`${label} panes`}>
        {tabs.map((entry, index) => (
          <button
            key={entry.key}
            type="button"
            aria-pressed={index === tab}
            onClick={() => {
              setTab(index);
              setPicked(0);
            }}
          >
            {entry.label}
          </button>
        ))}
      </div>
      <div className="fh-mini-db-list" role="group" aria-label={`${active.label} rows`}>
        {active.rows.map((row, index) => (
          <button
            type="button"
            className={`fh-mini-db-row${index === picked ? ' is-active' : ''}`}
            key={`${active.key}-${row.label}`}
            aria-pressed={index === picked}
            onClick={() => {
              setPicked(index);
              setPinned(true);
            }}
          >
            <i className="fh-db-dot" />
            <span>{row.label}</span>
            <span>
              {isModelPane ? (index === picked ? 'Loaded' : 'Ready') : row.status}
            </span>
            <span>{row.meta}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function BentoCard({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <Reveal className={`fh-bento-card ${className}`}>{children}</Reveal>;
}

function CardFoot({ label, href, noBorder }: { label: string; href?: string; noBorder?: boolean }) {
  return (
    <div className={`fh-bento-foot relative z-10 ${noBorder ? '!border-t-0' : ''}`}>
      {href ? (
        <Link href={href} className="fh-bento-link text-white font-medium hover:text-[#0099ff] transition-colors">
          <span>{label}</span>
          <ArrowRight size={12} aria-hidden="true" />
        </Link>
      ) : (
        <span className="fh-bento-link text-white font-medium">{label}</span>
      )}
    </div>
  );
}

/** Framer's "not just vibes, a full platform" bento, rebuilt from real Pixelify features. */
export function PlatformBento() {
  const { t } = useTranslation();

  return (
    <section className="fh-section fh-platform" id="platform">
      <div className="fh-container">
        <Reveal className="fh-section-header">
          <div className="fh-section-header-copy">
            <h2 className="fh-h2">{t.platformBento?.headerTitle || 'One studio for the complete image workflow'}</h2>
            <p className="fh-section-lede">
              {t.platformBento?.headerLede || 'Everything you need from a photo editor upscaling, cutout, backdrops, formats and privacy built into one browser tab.'}
            </p>
          </div>
          <Link href="/products/" className="fh-pill fh-pill-secondary fh-section-action">
            {t.platformBento?.allFeatures || 'All features'}
          </Link>
        </Reveal>

        <div className="fh-bento">
          {/* Performance / upscale */}
          <BentoCard className="fh-bento-span-5 fh-bento-card--lg">
            <div className="fh-bento-demo">
              <div className="fh-metrics">
                <div className="fh-metrics-head">
                  <span>{t.platformBento?.speedCard?.metricsHead || 'Upscale speed'}</span>
                  <span className="fh-badge-good">{t.platformBento?.speedCard?.badge || 'WebGPU'}</span>
                </div>
                <div className="fh-metric-row">
                  <div className="fh-metric-label">
                    <span>{t.platformBento?.speedCard?.vitality || '4× · Vitality'}</span>
                    <b>{t.platformBento?.speedCard?.vitalityMeta || '1.9 MB model'}</b>
                  </div>
                  <MetricBar width={94} delay={0.05} />
                </div>
                <div className="fh-metric-row">
                  <div className="fh-metric-label">
                    <span>{t.platformBento?.speedCard?.tiled || '8× · tiled'}</span>
                    <b>{t.platformBento?.speedCard?.tiledMeta || 'In memory'}</b>
                  </div>
                  <MetricBar width={78} delay={0.18} />
                </div>
                <div className="fh-metric-row">
                  <div className="fh-metric-label">
                    <span>{t.platformBento?.speedCard?.instant || '2× · instant'}</span>
                    <b>{t.platformBento?.speedCard?.instantMeta || '1 pass'}</b>
                  </div>
                  <MetricBar width={56} delay={0.31} />
                </div>
              </div>
            </div>
            <div>
              <h3 className="fh-bento-title">{t.platformBento?.speedCard?.title || 'Preview edits without the wait'}</h3>
              <p className="fh-bento-copy">
                {t.platformBento?.speedCard?.copy || "Hardware acceleration when the browser has it, a WASM fallback when it doesn't."}
              </p>
            </div>
            <CardFoot label={t.platformBento?.speedCard?.foot || 'Upscale'} href="/upscaler/" />
          </BentoCard>

          {/* Unlimited Generations */}
          <BentoCard className="fh-bento-span-7 fh-bento-card--lg">
            <div className="fh-bento-demo">
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white/90">{t.platformBento?.unlimitedCard?.engine || 'Local Neural Engine'}</span>
                  </div>
                  <span className="fh-badge-good">{t.platformBento?.unlimitedCard?.badge || 'Zero Paywalls'}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-lg bg-white/[0.02]">
                    <span className="block text-[10px] text-white/40 uppercase tracking-wider">{t.platformBento?.unlimitedCard?.metricGen || 'Generations'}</span>
                    <span className="text-xl font-bold text-white flex items-center gap-1">
                      <InfinityIcon size={18} className="text-[#00FF85]" /> {t.platformBento?.unlimitedCard?.metricGenVal || 'Unlimited'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02]">
                    <span className="block text-[10px] text-white/40 uppercase tracking-wider">{t.platformBento?.unlimitedCard?.metricCredits || 'Credits & Tokens'}</span>
                    <span className="text-xl font-bold text-white">$0.00</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] col-span-2 sm:col-span-1">
                    <span className="block text-[10px] text-white/40 uppercase tracking-wider">{t.platformBento?.unlimitedCard?.metricWatermarks || 'Watermarks'}</span>
                    <span className="text-xl font-bold text-[#00FF85]">{t.platformBento?.unlimitedCard?.metricWatermarksVal || 'None'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-white/50 pt-1">
                  <span>{t.platformBento?.unlimitedCard?.subNote || 'No $40/mo subscription or token meters'}</span>
                  <span className="text-[#00FF85] font-medium">{t.platformBento?.unlimitedCard?.freeForever || 'Free forever'}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="fh-bento-title">{t.platformBento?.unlimitedCard?.title || 'Unlimited Generations'}</h3>
              <p className="fh-bento-copy">
                {t.platformBento?.unlimitedCard?.copy || 'No $40/month subscriptions, no credit tokens, and no forced downscaling. Generate as many cutouts and upscales as you need.'}
              </p>
            </div>
            <CardFoot label={t.platformBento?.unlimitedCard?.foot || 'Unlimited'} href="/upscaler/" />
          </BentoCard>

          {/* Cutout */}
          <BentoCard className="fh-bento-span-5">
            <div className="fh-bento-demo">
              <div className="fh-cutout-demo">
                <img
                  src="/home/gallery/cosmetic-cutout.webp"
                  alt="Cosmetic cutout"
                  loading="lazy"
                />
              </div>
              <div className="fh-cutout-chips">
                <span className="fh-chip-sm is-green">Chopper</span>
                <span className="fh-chip-sm">{t.platformBento?.cutoutCard?.chipMatte || 'Alpha matte'}</span>
                <span className="fh-chip-sm">PNG</span>
              </div>
            </div>
            <div style={{ marginTop: 18 }}>
              <h3 className="fh-bento-title">{t.platformBento?.cutoutCard?.title || 'Preserve fine edges and detail'}</h3>
              <p className="fh-bento-copy">
                {t.platformBento?.cutoutCard?.copy || 'A segmentation pass for the subject, then brushes for the edges you want to keep.'}
              </p>
            </div>
            <CardFoot label={t.platformBento?.cutoutCard?.foot || 'Cutout'} href="/bg_remove/" />
          </BentoCard>

          {/* Privacy */}
          <BentoCard className="fh-bento-span-3 relative overflow-hidden group flex flex-col justify-between">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center opacity-30 transition-transform duration-700 group-hover:scale-105 pointer-events-none"
              style={{
                backgroundImage: 'url(/home/shots/security.webp)',
              }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/85 to-[#0e0e0e]/50 pointer-events-none" />
            <div className="fh-bento-demo relative z-10 mb-2">
              <div className="fh-privacy-stat">
                <Lock size={20} strokeWidth={1.6} aria-hidden="true" />
                {t.platformBento?.privacyCard?.stat || '0 B'}
              </div>
              <p className="fh-privacy-sub" style={{ margin: '8px 0 12px' }}>
                {t.platformBento?.privacyCard?.sub || 'uploaded. Every file stays in this browser tab.'}
              </p>
              <div className="fh-privacy-list">
                <span className="fh-privacy-row" style={{ padding: '6px 0' }}>
                  <Check size={12} aria-hidden="true" />
                  {t.platformBento?.privacyCard?.row1 || 'Files stay on device'}
                </span>
                <span className="fh-privacy-row" style={{ padding: '6px 0' }}>
                  <Check size={12} aria-hidden="true" />
                  {t.platformBento?.privacyCard?.row2 || 'No account required'}
                </span>
                <span className="fh-privacy-row" style={{ padding: '6px 0' }}>
                  <Check size={12} aria-hidden="true" />
                  {t.platformBento?.privacyCard?.row3 || 'No tracking pixels'}
                </span>
              </div>
            </div>
            <CardFoot label={t.platformBento?.privacyCard?.foot || 'Privacy'} href="/privacy/" />
          </BentoCard>

          {/* 8× Resolution */}
          <BentoCard className="fh-bento-span-4 fh-bento-card--spotlight relative overflow-hidden group flex flex-col justify-between">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center opacity-40 transition-all duration-500 group-hover:opacity-85 group-hover:scale-105 pointer-events-none"
              style={{
                backgroundImage: 'url(/home/shots/8x.webp)',
                backgroundPosition: 'center 20%',
              }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#002a6b]/90 via-[#0059c9]/40 to-transparent transition-opacity duration-500 group-hover:opacity-75 pointer-events-none" />
            <div className="absolute top-4 right-4 z-20 inline-flex items-center px-2.5 py-1 rounded-full border border-white/20 bg-white/15 text-white text-[11px] font-medium backdrop-blur-md">
              {t.platformBento?.resolutionCard?.badge || 'Professional quality'}
            </div>
            <div className="fh-spotlight-content relative z-10 flex-1 flex flex-col justify-between">
              <div>
                <div className="fh-spotlight-stat">{t.platformBento?.resolutionCard?.stat || '8×'}</div>
                <p className="fh-spotlight-label" style={{ marginTop: 12 }}>
                  {t.platformBento?.resolutionCard?.label || 'resolution, rendered on your own machine.'}
                </p>
              </div>
            </div>
            <CardFoot label={t.platformBento?.resolutionCard?.foot || 'Resolution'} href="/upscaler/" noBorder />
          </BentoCard>

          {/* Anywhere, Even Airplane Mode */}
          <BentoCard className="fh-bento-span-3">
            <div className="fh-bento-demo">
              <div className="flex items-center justify-between mb-3.5">
                <span className="flex items-center gap-2 text-xs font-medium text-neutral-300">
                  <WifiOff size={14} className="text-neutral-400" />
                  <span>{t.platformBento?.offlineCard?.engine || 'Offline Engine'}</span>
                </span>
                <span className="fh-badge-good">{t.platformBento?.offlineCard?.badge || 'Cached'}</span>
              </div>
              <div className="flex flex-col gap-2 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">{t.platformBento?.offlineCard?.weights || 'Model Weights'}</span>
                  <span className="font-mono text-emerald-400 font-semibold text-[11px]">IndexedDB</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">{t.platformBento?.offlineCard?.traffic || 'Network Traffic'}</span>
                  <span className="font-mono text-neutral-400 text-[11px]">0 B / sec</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/[0.05]">
                  <span className="text-neutral-400">{t.platformBento?.offlineCard?.status || 'Status'}</span>
                  <span className="text-neutral-200 text-[11px] font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {t.platformBento?.offlineCard?.worksOffline || 'Works Offline'}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <h3 className="fh-bento-title">{t.platformBento?.offlineCard?.title || 'Anywhere, Even Airplane Mode'}</h3>
              <p className="fh-bento-copy">
                {t.platformBento?.offlineCard?.copy || 'Model weights cache automatically in your browser. Once loaded once, upscale and edit seamlessly without an active internet connection.'}
              </p>
            </div>
            <CardFoot label={t.platformBento?.offlineCard?.foot || 'Offline'} href="/bg_remove/" />
          </BentoCard>

          {/* Zero Queue */}
          <BentoCard className="fh-bento-span-3">
            <div className="fh-bento-demo">
              <div className="flex items-center justify-between mb-3.5">
                <span className="flex items-center gap-2 text-xs font-medium text-neutral-300">
                  <Zap size={14} className="text-[#0099ff]" />
                  <span>{t.platformBento?.instantCard?.engine || 'Queue Latency'}</span>
                </span>
                <span className="fh-badge-good">{t.platformBento?.instantCard?.badge || 'Instant'}</span>
              </div>
              <div className="flex flex-col gap-2 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">{t.platformBento?.instantCard?.pos || 'Queue Position'}</span>
                  <span className="font-mono text-emerald-400 font-semibold text-[11px]">{t.platformBento?.instantCard?.posVal || '#1 · Immediate'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">{t.platformBento?.instantCard?.delay || 'Waitlist Delay'}</span>
                  <span className="font-mono text-neutral-400 text-[11px]">{t.platformBento?.instantCard?.delayVal || '0.0s (None)'}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/[0.05]">
                  <span className="text-neutral-400">{t.platformBento?.instantCard?.compute || 'Compute'}</span>
                  <span className="text-neutral-200 text-[11px] font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0099ff]" /> {t.platformBento?.instantCard?.computeVal || 'Dedicated GPU'}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <h3 className="fh-bento-title">{t.platformBento?.instantCard?.title || 'Zero Queues, Zero Waiting'}</h3>
              <p className="fh-bento-copy">
                {t.platformBento?.instantCard?.copy || 'No waiting in cloud server queues behind other users. Processing begins immediately on your device the moment you drop an image.'}
              </p>
            </div>
            <CardFoot label={t.platformBento?.instantCard?.foot || 'Instant'} href="/upscaler/" />
          </BentoCard>

          {/* Speed chart */}
          <BentoCard className="fh-bento-span-6">
            <div className="fh-bento-demo">
              <svg
                className="fh-chart"
                viewBox="0 0 600 160"
                preserveAspectRatio="none"
                role="img"
                aria-label="Chart comparing WebGPU and WASM render time"
              >
                <defs>
                  <linearGradient id="fhChartFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#0099ff" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#0099ff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M0 126 C40 118 60 96 96 100 C134 104 150 72 190 80 C232 89 246 50 286 58 C326 66 344 42 384 48 C428 54 444 30 486 36 C526 42 556 24 600 20 L600 160 L0 160 Z"
                  fill="url(#fhChartFill)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 1.1, delay: 0.35, ease: 'easeOut' }}
                />
                <motion.path
                  d="M0 126 C40 118 60 96 96 100 C134 104 150 72 190 80 C232 89 246 50 286 58 C326 66 344 42 384 48 C428 54 444 30 486 36 C526 42 556 24 600 20"
                  fill="none"
                  stroke="#0099ff"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.path
                  d="M0 146 C44 140 66 132 104 136 C146 140 166 120 206 124 C246 128 270 108 306 114 C346 121 366 100 406 106 C446 112 470 94 510 100 C550 106 572 92 600 90"
                  fill="none"
                  stroke="#5f6b78"
                  strokeWidth="1.5"
                  strokeDasharray="4 5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 1.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <div className="fh-chart-legend">
                <span>
                  <i className="is-blue" /> WebGPU · ~9s
                </span>
                <span>
                  <i /> WASM · ~18s
                </span>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <h3 className="fh-bento-title">{t.platformBento?.speedChartCard?.title || 'Works across modern browsers'}</h3>
              <p className="fh-bento-copy">
                {t.platformBento?.speedChartCard?.copy || 'The runtime picks the best backend it can find, then reports the pass time right in the panel.'}
              </p>
            </div>
            <CardFoot label={t.platformBento?.speedChartCard?.foot || 'Speed'} href="/docs/" />
          </BentoCard>

          {/* Before / after */}
          <BentoCard className="fh-bento-span-6">
            <div className="fh-bento-demo">
              <ImageCompare
                before="/home/shots/live-compare-before.webp"
                after="/home/shots/live-compare-after.webp"
                alt="A car photograph upscaled 4× with Pixelify"
                beforeLabel={t.platformBento?.compareCard?.beforeLabel || 'Original'}
                afterLabel={t.platformBento?.compareCard?.afterLabel || '4× · Pixel-Dance'}
                aspect="16 / 9"
                start={50}
              />
            </div>
            <div style={{ marginTop: 18 }}>
              <h3 className="fh-bento-title">{t.platformBento?.compareCard?.title || 'Inspect every image before and after'}</h3>
              <p className="fh-bento-copy">
                {t.platformBento?.compareCard?.copy || 'Drag the slider on any result and inspect the pixels at 100%, 200% or 400%.'}
              </p>
            </div>
            <CardFoot label={t.platformBento?.compareCard?.foot || 'Compare'} href="/upscaler/" />
          </BentoCard>

          {/* Save time and money - Batch Ready */}
          <BentoCard className="fh-bento-span-6">
            <div className="fh-bento-demo">
              <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-[#0099ff]" />
                    <span className="text-xs font-semibold text-white">{t.platformBento?.batchCard?.engine || 'Batch Cutout Engine'}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0099ff]/15 border border-[#0099ff]/30 text-[#0099ff] text-[11px] font-semibold">
                    {t.platformBento?.batchCard?.badge || 'Batch Ready'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                  <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 p-2 flex flex-col items-center">
                    <div className="w-full h-20 sm:h-24 flex items-center justify-center p-1">
                      <img
                        src="/home/gallery/shoes2-cutout.webp"
                        alt="Footwear product cutout"
                        className="max-h-full max-w-full w-auto h-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                      />
                    </div>
                    <div className="w-full pt-1.5 border-t border-white/5 flex flex-col items-center gap-0.5 text-center">
                      <span className="text-[11px] text-white font-medium truncate w-full">{t.platformBento?.batchCard?.footwear || 'Footwear'}</span>
                      <span className="text-[9px] text-[#0099ff] font-mono tracking-wide uppercase">{t.platformBento?.batchCard?.footwearMeta || 'E-Commerce'}</span>
                    </div>
                  </div>

                  <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 p-2 flex flex-col items-center">
                    <div className="w-full h-20 sm:h-24 flex items-center justify-center p-1">
                      <img
                        src="/home/gallery/virat-cutout.webp"
                        alt="Athlete portrait cutout"
                        className="max-h-full max-w-full w-auto h-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                      />
                    </div>
                    <div className="w-full pt-1.5 border-t border-white/5 flex flex-col items-center gap-0.5 text-center">
                      <span className="text-[11px] text-white font-medium truncate w-full">{t.platformBento?.batchCard?.athlete || 'Athlete'}</span>
                      <span className="text-[9px] text-[#0099ff] font-mono tracking-wide uppercase">{t.platformBento?.batchCard?.athleteMeta || 'Editorial'}</span>
                    </div>
                  </div>

                  <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 p-2 flex flex-col items-center">
                    <div className="w-full h-20 sm:h-24 flex items-center justify-center p-1">
                      <img
                        src="/home/gallery/bd2-cutout.webp"
                        alt="Action cinematic cutout"
                        className="max-h-full max-w-full w-auto h-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                      />
                    </div>
                    <div className="w-full pt-1.5 border-t border-white/5 flex flex-col items-center gap-0.5 text-center">
                      <span className="text-[11px] text-white font-medium truncate w-full">{t.platformBento?.batchCard?.cinematic || 'Cinematic'}</span>
                      <span className="text-[9px] text-[#0099ff] font-mono tracking-wide uppercase">{t.platformBento?.batchCard?.cinematicMeta || 'Action Key'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-white/50 pt-1">
                  <span>{t.platformBento?.batchCard?.processed || '3 of 3 processed in parallel'}</span>
                  <span className="text-[#0099ff] font-medium">{t.platformBento?.batchCard?.telemetry || '100% On-Device · Zero Queue'}</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 18 }}>
              <h3 className="fh-bento-title">{t.platformBento?.batchCard?.title || 'Batch isolate across any subject'}</h3>
              <p className="fh-bento-copy">
                {t.platformBento?.batchCard?.copy || 'Remove backgrounds across commercial footwear, high-resolution athlete portraits, and multi-character film stills in a single automated pass. Processed simultaneously with zero cloud wait.'}
              </p>
            </div>
            <CardFoot label={t.platformBento?.batchCard?.foot || 'Batch Cutout'} href="/bg_remove/" />
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
