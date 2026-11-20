'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, Cpu, Download, ExternalLink, Gauge, Pencil, Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import { StudioDemo } from './StudioDemo';
import { CutoutDemo } from './CutoutDemo';
import { StudioRange } from './StudioRange';
import { useTranslation } from '@/locales';

/**
 * The studio window that opens the section. Every control in it is real: the
 * top tabs and the page rail drive the inspector, the canvas tools zoom the
 * frame, and the inspector's scale, model and sliders re-run the pass.
 */

const MODELS = [
  { name: 'Vitality', meta: 'Fastest model, crisp clean edges.', tag: 'Popular', cutout: false },
  { name: 'Pixel-Dance', meta: 'Max detail, up to 8K output.', tag: '8K', cutout: false },
  { name: 'Alpha-Satoru', meta: 'Natural detail for portraits.', tag: 'Portraits', cutout: false },
  { name: 'Chopper', meta: 'Fast subject segmentation.', tag: 'Fast', cutout: true },
  { name: 'Diablo', meta: 'Studio-grade edge matting.', tag: 'Studio', cutout: true },
];

type PageKey = 'home' | 'upscaler' | 'bg' | 'models' | 'gallery';

const PAGES: { key: PageKey; label: string; count?: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'upscaler', label: 'Upscaler', count: '4×' },
  { key: 'bg', label: 'BG Remover', count: 'Cut' },
  { key: 'models', label: 'Models', count: '5' },
  { key: 'gallery', label: 'Gallery' },
];
type TabKey = 'canvas' | 'models' | 'export';
type ToolKey = 'fit' | 'zoom';

const ZOOMS = [100, 125, 150, 200];
const FORMATS = ['PNG', 'WebP', 'JPG'] as const;
type FormatKey = (typeof FORMATS)[number];

const GALLERY = [
  { src: '/home/gallery/virat_cutout-small.webp', label: 'Athlete cutout', checker: true },
  { src: '/home/gallery/car_japan-small.webp', label: 'Night drive upscale' },
  { src: '/home/gallery/meme_cat-small.webp', label: 'Fine animal texture' },
  { src: '/home/gallery/rajini_small.webp', label: 'Cinema superstar upscale' },
];

const DEFAULTS = {
  model: 'Vitality',
  scale: 4,
  sharp: 62,
  denoise: 48,
  feather: 18,
  contrast: 45,
  zoom: 100,
};

/** Output pixels for the loaded frame at each scale factor. */
function outputSize(scale: number) {
  const w = 512 * scale;
  const h = 410 * scale;
  return `${w} × ${h}`;
}

export function StudioCanvas() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabKey>('canvas');
  const [page, setPage] = useState<PageKey>('home');
  const [model, setModel] = useState(DEFAULTS.model);
  const [scale, setScale] = useState(DEFAULTS.scale);
  const [sharp, setSharp] = useState(DEFAULTS.sharp);
  const [denoise, setDenoise] = useState(DEFAULTS.denoise);
  const [feather, setFeather] = useState(DEFAULTS.feather);
  const [contrast, setContrast] = useState(DEFAULTS.contrast);
  const [zoom, setZoom] = useState(DEFAULTS.zoom);
  const [tool, setTool] = useState<ToolKey>('fit');
  const [format, setFormat] = useState<FormatKey>('PNG');
  const [status, setStatus] = useState('');
  const [saved, setSaved] = useState<string | null>(null);
  const [webgpuDemo, setWebgpuDemo] = useState(true);
  const [cacheDemo, setCacheDemo] = useState(true);
  const [precisionDemo, setPrecisionDemo] = useState(true);
  const [engineDemo, setEngineDemo] = useState<'WebGPU' | 'WASM'>('WebGPU');
  const [privacyDemo, setPrivacyDemo] = useState(true);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const pages: { key: PageKey; label: string; count?: string }[] = [
    { key: 'home', label: t.studioCanvas?.pages?.home || 'Home' },
    { key: 'upscaler', label: t.studioCanvas?.pages?.upscaler || 'Upscaler', count: '4×' },
    { key: 'bg', label: t.studioCanvas?.pages?.bg || 'BG Remover', count: 'Cut' },
    { key: 'models', label: t.studioCanvas?.pages?.models || 'Models', count: '5' },
    { key: 'gallery', label: t.studioCanvas?.pages?.gallery || 'Gallery' },
  ];

  const active = MODELS.find((entry) => entry.name === model) ?? MODELS[0];
  const isCutout = active.cutout;

  // The confirmation on the download button clears itself.
  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(null), 1900);
    return () => window.clearTimeout(timer);
  }, [saved]);

  const pickModel = (name: string) => {
    const next = MODELS.find((entry) => entry.name === name);
    if (!next) return;
    setModel(name);
    setPage(next.cutout ? 'bg' : 'upscaler');
    setStatus(`${name} loaded${next.cutout ? ' — cutout tools ready' : ` at ${scale}×`}`);
  };

  const pickPage = (key: PageKey) => {
    setPage(key);
    setTab('canvas');
    if (key === 'home') {
      setStatus('Studio Home — Preferences and demo options ready');
      return;
    }
    if (key === 'bg') {
      const chopper = MODELS.find((entry) => entry.cutout)!;
      setModel(chopper.name);
      setStatus('BG Remover, Chopper loaded, alpha matte ready');
      return;
    }
    if (!isCutout) return;
    setModel(DEFAULTS.model);
    setStatus('Upscaler, Vitality loaded');
  };

  const setZoomTo = (next: number) => {
    setZoom(next);
    setStatus(`Canvas zoom ${next}%`);
  };

  const reset = () => {
    setModel(DEFAULTS.model);
    setScale(DEFAULTS.scale);
    setSharp(DEFAULTS.sharp);
    setDenoise(DEFAULTS.denoise);
    setFeather(DEFAULTS.feather);
    setContrast(DEFAULTS.contrast);
    setZoom(DEFAULTS.zoom);
    setTool('fit');
    setFormat('PNG');
    setTab('canvas');
    setPage('upscaler');
    setSaved(null);
    setWebgpuDemo(true);
    setCacheDemo(true);
    setPrecisionDemo(true);
    setEngineDemo('WebGPU');
    setPrivacyDemo(true);
    setStatus('Inspector reset to defaults');
  };

  // Inspector body depends on the tab first, then the page it sits on.
  const panel =
    tab === 'export'
      ? 'export'
      : tab === 'models'
        ? 'models'
        : page === 'gallery'
          ? 'gallery'
          : page === 'models'
            ? 'models'
            : page === 'home'
              ? 'home'
              : isCutout
                ? 'cutout'
                : 'upscale';

  const file = isCutout
    ? `${model.toLowerCase()}-cutout.${format.toLowerCase()}`
    : `${model.toLowerCase()}-${scale}x.${format.toLowerCase()}`;

  const download = () => {
    setSaved(file);
    setStatus(
      isCutout
        ? `Downloaded ${file} — ${format} cutout from ${model}`
        : `Downloaded ${file} — ${format} at ${scale}×, ${outputSize(scale)}`,
    );
  };

  const heading =
    panel === 'export'
      ? { title: t.studioCanvas?.panelHeadings?.export?.title || 'Export', sub: `${format} · ${scale}×` }
      : panel === 'models'
        ? { title: t.studioCanvas?.panelHeadings?.models?.title || 'Models', sub: t.studioCanvas?.panelHeadings?.models?.sub || '5 models, on device' }
        : panel === 'gallery'
          ? { title: t.studioCanvas?.panelHeadings?.gallery?.title || 'Gallery', sub: t.studioCanvas?.panelHeadings?.gallery?.sub || 'Recent results' }
          : panel === 'home'
            ? { title: t.studioCanvas?.panelHeadings?.home?.title || 'Settings', sub: t.studioCanvas?.panelHeadings?.home?.sub || 'Studio & engine preferences' }
            : panel === 'cutout'
              ? { title: t.studioCanvas?.panelHeadings?.cutout?.title || 'Cutout', sub: t.studioCanvas?.panelHeadings?.cutout?.sub || 'Alpha matte & edges' }
              : { title: t.studioCanvas?.panelHeadings?.upscale?.title || 'Upscale', sub: t.studioCanvas?.panelHeadings?.upscale?.sub || 'AI resolution & details' };

  const zoomIn = () => {
    const index = ZOOMS.indexOf(zoom);
    setZoomTo(ZOOMS[(index + 1) % ZOOMS.length]);
  };

  return (
    <div className="fh-studio">
      <div className="fh-studio-chrome">
        <div className="fh-studio-brand">
          <span className="fh-studio-brand-mark">P</span>
          {t.studioCanvas?.brand || 'Pixelify Studio'}
        </div>

        <div className="fh-studio-tabs" role="tablist" aria-label="Studio views">
          {(['canvas', 'models', 'export'] as TabKey[]).map((key, index) => (
            <button
              key={key}
              type="button"
              role="tab"
              id={`fh-studio-tab-${key}`}
              aria-selected={tab === key}
              aria-controls="fh-studio-panel"
              tabIndex={tab === key ? 0 : -1}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              className={`fh-ui fh-studio-tab${tab === key ? ' is-active' : ''}`}
              onClick={() => {
                setTab(key);
                setStatus(`${key === 'canvas' ? 'Canvas' : key === 'models' ? 'Models' : 'Export'} view`);
              }}
              onKeyDown={(event) => {
                const keys: TabKey[] = ['canvas', 'models', 'export'];
                const at = keys.indexOf(tab);
                let next: number | null = null;
                if (event.key === 'ArrowRight') next = (at + 1) % keys.length;
                if (event.key === 'ArrowLeft') next = (at - 1 + keys.length) % keys.length;
                if (event.key === 'Home') next = 0;
                if (event.key === 'End') next = keys.length - 1;
                if (next === null) return;
                event.preventDefault();
                setTab(keys[next]);
                tabs.current[next]?.focus();
              }}
            >
              {key === 'canvas' ? (t.studioCanvas?.tabs?.canvas || 'Canvas') : key === 'models' ? (t.studioCanvas?.tabs?.models || 'Models') : (t.studioCanvas?.tabs?.export || 'Export')}
            </button>
          ))}
        </div>

        <div className="fh-studio-chrome-right">
          <span className="fh-studio-avatar" aria-hidden="true" />
          <button
            type="button"
            className="fh-ui fh-studio-export"
            onClick={() => {
              setTab('export');
              setStatus(`Export panel open — ${format} at ${scale}×`);
            }}
          >
            <Download size={11} strokeWidth={2.2} aria-hidden="true" />
            {t.studioCanvas?.tabs?.export || 'Export'}
          </button>
        </div>
      </div>

      <div className="fh-studio-body">
        <aside className="fh-studio-rail">
          <span className="fh-studio-rail-label">{t.studioCanvas?.pages?.home ? t.studioCanvas?.pages?.home : 'Pages'}</span>
          <ul className="fh-studio-rail-list">
            {pages.map((entry) => (
              <li key={entry.key} className={page === entry.key ? 'is-active' : ''}>
                <button
                  type="button"
                  className="fh-ui"
                  aria-current={page === entry.key ? 'page' : undefined}
                  onClick={() => pickPage(entry.key)}
                >
                  <span>{entry.label}</span>
                  {entry.count ? <span className="fh-rail-count">{entry.count}</span> : null}
                </button>
              </li>
            ))}
          </ul>
          <div className="fh-studio-rail-note">
            <strong>{t.studioCanvas?.railNote?.title || 'On-device'}</strong>
            <span>{t.studioCanvas?.railNote?.copy || 'Nothing leaves this tab. No upload queue, no account.'}</span>
          </div>
        </aside>

        <div className="fh-studio-stage">
          <span className="fh-studio-stage-head">
            {t.studioCanvas?.stageHead || 'See the difference'}
          </span>

          {isCutout ? (
            <div className="fh-studio-demo">
              <CutoutDemo model={model} zoom={zoom} />
            </div>
          ) : (
            <StudioDemo scale={scale} model={model} zoom={zoom} />
          )}

          <div className="fh-studio-tools" role="group" aria-label="Canvas tools">
            <button
              type="button"
              className={`fh-ui fh-studio-tool${tool === 'fit' ? ' is-active' : ''}`}
              aria-pressed={tool === 'fit'}
              aria-label={t.studioCanvas?.tools?.fit || 'Fit canvas'}
              title={t.studioCanvas?.tools?.fit || 'Fit canvas'}
              onClick={() => {
                setTool('fit');
                setZoomTo(100);
              }}
            >
              <SlidersHorizontal size={12} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`fh-ui fh-studio-tool${tool === 'zoom' ? ' is-active' : ''}`}
              aria-pressed={tool === 'zoom'}
              aria-label={t.studioCanvas?.tools?.zoomIn || 'Zoom in'}
              title={t.studioCanvas?.tools?.zoomIn || 'Zoom in'}
              onClick={() => {
                setTool('zoom');
                zoomIn();
              }}
            >
              <Search size={14} strokeWidth={2} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="fh-ui fh-studio-zoom"
              aria-label={`Canvas zoom ${zoom} percent. Activate to reset to 100 percent`}
              title={t.studioCanvas?.tools?.resetZoom || 'Reset zoom'}
              onClick={() => setZoomTo(100)}
            >
              {zoom}%
            </button>
          </div>
        </div>

        <aside
          className="fh-studio-panel"
          id="fh-studio-panel"
          role="tabpanel"
          aria-labelledby={`fh-studio-tab-${tab}`}
        >
          <div className="fh-studio-panel-head">
            <div>
              <div className="fh-studio-panel-title">
                <span className="fh-studio-panel-title-icon">
                  <SlidersHorizontal size={13} aria-hidden="true" />
                </span>
                {heading.title}
              </div>
              <span className="fh-studio-panel-sub">{heading.sub}</span>
            </div>
            <button type="button" className="fh-ui fh-chip-sm" onClick={reset}>
              {t.studioCanvas?.reset || 'Reset'}
            </button>
          </div>

          {panel === 'models' ? (
            <div style={{ display: 'grid', gap: 6 }}>
              {MODELS.map((entry) => (
                <button
                  key={entry.name}
                  type="button"
                  className={`fh-ui fh-model-row${entry.name === model ? ' is-active' : ''}`}
                  aria-pressed={entry.name === model}
                  onClick={() => pickModel(entry.name)}
                >
                  <span>
                    {entry.name}
                    <small>{entry.meta}</small>
                  </span>
                  <b>{entry.name === model ? 'Loaded' : entry.tag}</b>
                </button>
              ))}
            </div>
          ) : null}

          {panel === 'gallery' ? (
            <>
              <div className="fh-gallery-panel">
                {GALLERY.map((shot) => (
                  <Link
                    key={shot.src}
                    href="#gallery"
                    aria-label={`Open ${shot.label} in the results gallery`}
                    className={shot.checker ? 'fh-gallery-checker' : undefined}
                  >
                    <img src={shot.src} alt="" loading="lazy" />
                  </Link>
                ))}
              </div>
              <p className="fh-studio-panel-note">
                {t.studioCanvas?.galleryNote || 'Upscales and cutouts land side by side, so the before-and-after is always one glance away.'}
              </p>
              <Link href="#gallery" className="fh-ui fh-studio-download">
                {t.studioCanvas?.openGallery || 'Open the gallery'}
              </Link>
            </>
          ) : null}

          {panel === 'home' ? (
            <div style={{ display: 'grid', gap: 10 }}>
              {/* Profile Card Demo */}
              <div className="flex items-center gap-2 p-2 rounded-xl border border-white/10 bg-white/[0.04]">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-sky-300/30 bg-sky-400/10 text-[11px] font-bold text-sky-200">
                  P
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-[11px] font-semibold text-white/90">{t.studioCanvas?.anonymousCreator || 'Anonymous Creator'}</span>
                  <span className="block text-[9.5px] text-white/40">{t.studioCanvas?.studioProfile || 'Studio profile · Local'}</span>
                </div>
                <button
                  type="button"
                  className="p-1 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-colors cursor-pointer shrink-0"
                  aria-label="Edit profile demo"
                  onClick={() => setStatus('Demo: Edit profile dialog')}
                >
                  <Pencil size={11} />
                </button>
              </div>

              {/* Processing Engines Demo */}
              <div>
                <div className="mb-1.5 flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-violet-200/70">
                  <Cpu size={11} /> {t.studioCanvas?.processingEngines || 'Processing Engines'}
                </div>
                <div className="space-y-1.5 rounded-xl border border-white/[0.07] bg-black/25 p-2">
                  <div className="flex items-center justify-between gap-1 text-[10.5px]">
                    <span className="text-white/80">{t.studioCanvas?.aiUpscaler || 'AI Upscaler'}</span>
                    <button
                      type="button"
                      className="px-2 py-0.5 rounded text-[9.5px] font-medium bg-[#0099ff]/15 border border-[#0099ff]/30 text-[#00ff85] shrink-0 cursor-pointer"
                      onClick={() => setStatus('Demo: Upscaler engine set to WebGPU')}
                    >
                      FAST
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-1 text-[10.5px] pt-1.5 border-t border-white/5">
                    <span className="text-white/80">{t.studioCanvas?.bgRemover || 'BG Remover'}</span>
                    <button
                      type="button"
                      className="px-2 py-0.5 rounded text-[9.5px] font-medium bg-[#0099ff]/15 border border-[#0099ff]/30 text-[#0099ff] shrink-0 cursor-pointer"
                      onClick={() => setStatus('Demo: BG Remover engine set to WebGPU')}
                    >
                      STANDARD
                    </button>
                  </div>
                </div>

                <div className="mt-1.5 flex items-center justify-between rounded-xl border border-violet-200/[0.13] bg-gradient-to-r from-violet-300/[0.08] via-white/[0.035] to-teal-200/[0.06] px-2 py-1.5">
                  <span className="flex items-center gap-1.5 text-[10px] font-medium text-white/80 truncate">
                    <Gauge size={11} className="text-violet-200/70 shrink-0" /> {t.studioCanvas?.webgpuSupport || 'WebGPU Support'}
                  </span>
                  <span className="text-[9.5px] font-semibold text-emerald-300 shrink-0">{t.studioCanvas?.available || 'Available'}</span>
                </div>
                <p className="mt-1.5 px-0.5 text-[9px] leading-relaxed text-white/35">
                  {t.studioCanvas?.cacheNote || 'Models cache locally on your machine in IndexedDB.'}
                </p>
              </div>

              {/* Action Buttons Demo (No redirects!) */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setStatus('Demo: Downloaded models cache cleared (0 B)')}
                  className="flex items-center justify-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-2 py-1.5 text-center text-[10px] font-medium text-white/70 hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 size={11} className="shrink-0 text-white/50" />
                  <span>{t.studioCanvas?.clearModels || 'Clear models'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('Demo: WebGPU acceleration info')}
                  className="flex items-center justify-center gap-1 rounded-xl border border-violet-400/20 bg-violet-400/[0.07] px-2 py-1.5 text-center text-[10px] font-medium text-violet-200 hover:bg-violet-400/[0.14] transition-colors cursor-pointer"
                >
                  <ExternalLink size={11} className="shrink-0 text-violet-300" />
                  <span>{t.studioCanvas?.learnWebgpu || 'Learn WebGPU'}</span>
                </button>
              </div>
            </div>
          ) : null}

          {panel === 'export' ? (
            <>
              <div>
                <span className="fh-studio-row-label">{t.studioCanvas?.format || 'Format'}</span>
                <div className="fh-studio-format" role="group" aria-label="Export format">
                  {FORMATS.map((entry) => (
                    <button
                      key={entry}
                      type="button"
                      className={`fh-ui${format === entry ? ' is-active' : ''}`}
                      aria-pressed={format === entry}
                      onClick={() => {
                        setFormat(entry);
                        setStatus(`Export format ${entry}`);
                      }}
                    >
                      {entry}
                    </button>
                  ))}
                </div>
              </div>
              <div className="fh-studio-summary">
                <span>
                  {t.studioCanvas?.summaryModel || 'Model'} <b>{model}</b>
                </span>
                <span>
                  {t.studioCanvas?.summaryOutput || 'Output'} <b>{isCutout ? '512 × 410 mask' : outputSize(scale)}</b>
                </span>
                <span>
                  {t.studioCanvas?.summaryFile || 'File'} <b>{file}</b>
                </span>
              </div>
              <button type="button" className="fh-ui fh-studio-download" onClick={download}>
                {saved ? <Check size={12} strokeWidth={2.6} aria-hidden="true" /> : <Download size={12} strokeWidth={2.2} aria-hidden="true" />}
                {saved ? (t.studioCanvas?.saved || 'Saved') : (t.studioCanvas?.download || 'Download')}
              </button>
            </>
          ) : null}

          {panel === 'upscale' || panel === 'cutout' ? (
            <>
              <div>
                <span className="fh-studio-row-label">{panel === 'cutout' ? (t.studioCanvas?.cutoutModelLabel || 'Cutout model') : (t.studioCanvas?.modelLabel || 'Model')}</span>
                <button
                  type="button"
                  className="fh-ui fh-studio-select"
                  onClick={() => {
                    setTab('models');
                    setStatus('Model picker open');
                  }}
                >
                  <span>
                    {model}
                    <small>{active.meta}</small>
                  </span>
                  <span className="fh-model-pill">{active.tag}</span>
                </button>
              </div>

              {panel === 'cutout' ? (
                <StudioRange label={t.studioCanvas?.edgeFeather || 'Edge feather'} value={feather} onChange={setFeather} />
              ) : (
                <div>
                  <span className="fh-studio-row-label">{t.studioCanvas?.scaleFactor || 'Scale factor'}</span>
                  <div className="fh-studio-scale" role="group" aria-label="Scale factor">
                    {[2, 4, 8].map((entry) => (
                      <button
                        key={entry}
                        type="button"
                        className={`fh-ui${scale === entry ? ' is-active' : ''}`}
                        aria-pressed={scale === entry}
                        onClick={() => {
                          setScale(entry);
                          setStatus(`Scale ${entry}× — ${outputSize(entry)}`);
                        }}
                      >
                        {entry}×
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {panel === 'upscale' ? (
                <>
                  <StudioRange label={t.studioCanvas?.sharpness || 'Sharpness'} value={sharp} onChange={setSharp} />
                  <StudioRange label={t.studioCanvas?.denoise || 'Denoise'} value={denoise} onChange={setDenoise} />
                </>
              ) : (
                <StudioRange label={t.studioCanvas?.matteContrast || 'Matte contrast'} value={contrast} onChange={setContrast} />
              )}

              <button type="button" className="fh-ui fh-studio-download" onClick={download}>
                {saved ? <Check size={12} strokeWidth={2.6} aria-hidden="true" /> : <Download size={12} strokeWidth={2.2} aria-hidden="true" />}
                {saved ? (t.studioCanvas?.saved || 'Saved') : (t.studioCanvas?.download || 'Download')}
              </button>
            </>
          ) : null}

          <p className="fh-sr" role="status">
            {status}
          </p>
        </aside>
      </div>
    </div>
  );
}
