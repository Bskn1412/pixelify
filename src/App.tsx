import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import BGRemoveWorkspace from './components/BGRemoveWorkspace';
import UploadArea from './components/UploadArea';
// ImageComparison and ControlPanel replaced by UpscaleWorkspace
import UpscaleWorkspace from './components/UpscaleWorkspace';
// ProcessingOverlay and StatsBar are no longer used here
import ErrorMessage from './components/ErrorMessage';
import HistoryDrawer from './components/HistoryDrawer';

import UpscaleShowcase from './components/upscaler/UpscaleShowcase';
import UpscaleShowreel from './components/upscaler/UpscaleShowreel';
import UpscaleCapabilities from './components/upscaler/UpscaleCapabilities';
import UpscaleJourney from './components/upscaler/UpscaleJourney';
import UpscaleFaq from './components/upscaler/UpscaleFaq';

import { BgSampleGallery, BgShowcase, BgPipeline, BgPrecision, BgFaq } from './components/bgremove/BgSections';

import Footer from './components/Footer';

import { useONNX } from './hooks/useONNX';
import { useUpscale } from './hooks/useUpscale';
import { makeId } from './lib/bgUtils';

import Bgmarquee from './components/bgremove/Bgmarquee';

import TruckBg from './components/TruckBg';

import {
  playSuccessChime,
  primeAudio,
  requestNotificationPermission,
  sendDesktopNotification,
} from './utils/notifications';

import CardDeck from './components/CardsTest';

import PixelifyStory from './components/PixelifyStory';
import { MODELS } from './constants';

import type {
  Step,
  ModelKey,
  ProcessResult,
  ProgressState,
  EnhancementOptions,
  ViewTab,
  ThemeMode,
  HistoryItem,
  BGJob,
  ToastMessage,
  UpscaleItem,
} from './types';
import NotFound from './components/NotFound';

const STORAGE_KEY = 'pixelify_upscaler_history_2026';
const THEME_KEY = 'pixelify_theme_pref';
const MAX_FILE_SIZE = 15 * 1024 * 1024;

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = useCallback((): ViewTab => {
    const path = location.pathname.replace(/^\//, '');
    if (path === 'upscaler' || path === 'bg_remove' || path === 'history') {
      return path as ViewTab;
    }
    return 'home';
  }, [location.pathname]);

  const activeTab = getActiveTab();

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Theme state management
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
    return 'dark';
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state with URL navigation via React Router
  const navigateTo = useCallback(
    (tab: ViewTab) => {
      if (tab === 'history') {
        setIsHistoryOpen(true);
        return;
      }
      const targetPath = tab === 'home' ? '/' : `/${tab}`;
      navigate(targetPath);
    },
    [navigate]
  );

  useEffect(() => {
    if (location.pathname === '/history') {
      setIsHistoryOpen(true);
    }
  }, [location.pathname]);

  // Theme effect application
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    const root = document.documentElement;

    if (theme === 'light') {
      root.classList.add('light');
    } else if (theme === 'dark') {
      root.classList.remove('light');
    } else {
      // System mode
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      if (prefersLight) root.classList.add('light');
      else root.classList.remove('light');
    }
  }, [theme]);

  // Background Remover Jobs State
  const [bgJobs, setBgJobs] = useState<BGJob[]>([]);

  // Upscaler State Hooks
  const { ortRef, backend, execEngine, sessionRef, isLoading: modelLoading, initONNX, loadModel } = useONNX();
  const { upscale } = useUpscale({ ortRef, sessionRef });

  // LIVE ENGINE STATE — what each tool's pipeline is ACTUALLY running on right now.
  // Upscaler: read back from the ONNX session's execution providers.
  // BG remover: reported by the worker hosting the BiRefNet pipeline.
  const [bgEngine, setBgEngine] = useState<'wasm' | 'webgpu' | null>(null);
  const [bgWebgpuAvailable, setBgWebgpuAvailable] = useState<boolean>(false);

  const [step, setStep] = useState<Step>('upload');
  const [items, setItems] = useState<UpscaleItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // AI Enhancement options defaults
  const DEFAULT_OPTIONS: EnhancementOptions = {
    scale: 4,
    faceRestore: true,
    removeNoise: true,
    sharpen: true,
    colorEnhance: false,
    hdrBoost: false,
    sharpenLevel: 60,
    removeNoiseLevel: 50,
    faceRestoreLevel: 60,
    sharpness: 50,
    denoise: 50,
    faceEnhancement: 50,
    colorLevel: 50,
    hdrLevel: 50,
    brightness: 50,
    contrast: 50,
  };

  // Local Dual History State (Upscale & Cutouts)
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addToast = useCallback((type: 'success' | 'error' | 'info', text: string) => {
    const id = makeId();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const addHistoryRecord = useCallback((item: HistoryItem) => {
    setHistory((prev) => [item, ...prev.filter((i) => i.id !== item.id).slice(0, 24)]);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [history]);

  useEffect(() => {
    initONNX();
  }, [initONNX]);

  // Pre-warm the upscaler model when visiting /upscaler so the engine badge
  // reports LIVE immediately (and first upscale starts faster). ClearReality V1 is only 1.9MB.
  const engineWarmupTried = useRef(false);
  useEffect(() => {
    if (activeTab === 'upscaler' && !engineWarmupTried.current && !execEngine && !modelLoading) {
      engineWarmupTried.current = true;
      loadModel('clearreality').catch(() => { /* badge stays DETECTING; retried on first upload */ });
    }
  }, [activeTab, execEngine, modelLoading, loadModel]);

  /* ----------------------------------------------------------
     ADD UPSCALE FILE (Creates individual UpscaleItem)
     ---------------------------------------------------------- */
  const addUpscaleFile = useCallback((file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      addToast('error', 'Please choose an image under 15 MB.');
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const newItem: UpscaleItem = {
        id: makeId(),
        file,
        name: file.name,
        url,
        img,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        size: file.size,
        status: 'idle',
        progress: { percent: 0, text: '' },
        result: null,
        error: null,
        options: { ...DEFAULT_OPTIONS },
        modelKey: 'clearreality',
      };
      setItems((prev) => [...prev, newItem]);
      setSelectedId(newItem.id);
      setStep('config');
      loadModel('clearreality');
    };
    img.onerror = () => {
      addToast('error', 'Failed to load image file.');
    };
    img.src = url;
  }, [addToast, loadModel]);

  /* ----------------------------------------------------------
     HANDLE MODEL CHANGE (Per image)
     ---------------------------------------------------------- */
  const handleItemModelChange = useCallback(
    async (id: string, key: ModelKey) => {
      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, modelKey: key, result: null, error: null } : i
        )
      );
      const ok = await loadModel(key);
      if (!ok) {
        addToast('error', `Failed to load ${MODELS[key]?.name || key} model.`);
      }
    },
    [loadModel, addToast]
  );

  /* ----------------------------------------------------------
     HANDLE OPTIONS CHANGE (Per image)
     ---------------------------------------------------------- */
  const handleItemOptionsChange = useCallback((id: string, newOptions: EnhancementOptions) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, options: newOptions } : i))
    );
  }, []);

  /* ----------------------------------------------------------
     RESET SETTINGS (Per image)
     ---------------------------------------------------------- */
  const handleResetItemSettings = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, options: { ...DEFAULT_OPTIONS } } : i))
    );
    addToast('info', 'Settings reset to defaults.');
  }, [addToast]);

  /* ----------------------------------------------------------
     HANDLE UPSCALE (Runs strictly per image in background)
     ---------------------------------------------------------- */
  const handleUpscaleItem = useCallback(
    async (id: string) => {
      const item = items.find((i) => i.id === id);
      if (!item || item.status === 'processing' || modelLoading) return;

      // Prime audio context and ask for browser notification permission on user gesture
      primeAudio();
      requestNotificationPermission().catch(() => { });

      // Mark ONLY this specific item as processing
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
              ...i,
              status: 'processing',
              error: null,
              progress: { percent: 5, text: 'Preparing neural model...' },
            }
            : i
        )
      );

      try {
        const res = await upscale(
          item.img,
          item.modelKey,
          item.options,
          (p: ProgressState) => {
            setItems((prev) =>
              prev.map((i) => (i.id === id ? { ...i, progress: p } : i))
            );
          }
        );

        setItems((prev) =>
          prev.map((i) =>
            i.id === id
              ? {
                ...i,
                status: 'completed',
                result: res,
                progress: { percent: 100, text: 'Complete!' },
              }
              : i
          )
        );

        const historyRecord: HistoryItem = {
          id: makeId(),
          type: 'upscale',
          name: item.name,
          originalWidth: item.width,
          originalHeight: item.height,
          upscaledWidth: res.width,
          upscaledHeight: res.height,
          scale: item.options.scale,
          timestamp: Date.now(),
          thumbnailUrl: item.url,
          resultUrl: res.dataUrl || item.url,
          timeMs: res.time,
          enhancements: res.enhancementsApplied || [],
        };
        addHistoryRecord(historyRecord);

        // Play pleasant completion chime & send desktop notification
        playSuccessChime();
        sendDesktopNotification(
          '✨ Image Upscaled!',
          `${item.name} (${item.options.scale}×) is ready.`,
          item.url
        );
        addToast(
          'success',
          `✨ ${item.name} upscaled successfully! (${item.options.scale}×, ${(res.time / 1000).toFixed(1)}s)`
        );
      } catch (err: any) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === id
              ? {
                ...i,
                status: 'error',
                error: err.message || 'Upscaling failed.',
                progress: { percent: 0, text: '' },
              }
              : i
          )
        );
        addToast('error', `Failed to upscale ${item.name}: ${err.message || 'Error occurred'}`);
      }
    },
    [items, modelLoading, upscale, addToast, addHistoryRecord]
  );

  /* ----------------------------------------------------------
     REMOVE / CLEAR ITEMS
     ---------------------------------------------------------- */
  const handleRemoveItem = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.id !== id);
        if (next.length === 0) {
          setSelectedId(null);
          setStep('upload');
        } else if (selectedId === id) {
          setSelectedId(next[0].id);
        }
        return next;
      });
    },
    [selectedId]
  );

  const handleClearAll = useCallback(() => {
    setItems([]);
    setSelectedId(null);
    setStep('upload');
  }, []);

  /* ----------------------------------------------------------
     DOWNLOAD RESULT (Per image)
     ---------------------------------------------------------- */
  const handleDownloadItem = useCallback(
    (id: string, format: 'png' | 'webp' | 'jpeg' = 'png') => {
      const item = items.find((i) => i.id === id);
      if (!item || !item.result) return;
      const res = item.result;
      const canvas = document.createElement('canvas');
      canvas.width = res.width;
      canvas.height = res.height;
      const ctx = canvas.getContext('2d')!;
      const rgbaClone = new Uint8ClampedArray(res.rgba);
      ctx.putImageData(new ImageData(rgbaClone, res.width, res.height), 0, 0);

      const mime = format === 'webp' ? 'image/webp' : format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const ext = format === 'webp' ? 'webp' : format === 'jpeg' ? 'jpg' : 'png';

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const baseName = item.name.replace(/\.[^/.]+$/, '');
          a.download = `${baseName}_upscaled_${item.options.scale}x.${ext}`;
          a.click();
          URL.revokeObjectURL(url);
        },
        mime,
        0.95
      );
    },
    [items]
  );

  // Load a BG-remover sample image from the landing sections onto the canvas
  const loadBgSample = useCallback(async (sampleUrl: string, name: string) => {
    try {
      const res = await fetch(sampleUrl);
      const blob = await res.blob();
      const file = new File([blob], `${name.toLowerCase().replace(/\s+/g, '_')}.png`, { type: blob.type || 'image/png' });
      handleBGFiles([file]);
    } catch {
      addToast('error', 'Could not load sample.');
    }
  }, []);

  // Global File Picker Handler for BG Remove
  const handleBGFiles = (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    const valid = files.filter((f) => f.type.startsWith('image/') && f.size <= MAX_FILE_SIZE);
    if (!valid.length) {
      addToast('error', 'Please choose images under 15 MB.');
      return;
    }
    const additions: BGJob[] = valid.map((file) => ({
      id: makeId(),
      file,
      name: file.name,
      sourceUrl: URL.createObjectURL(file),
      resultUrl: null,
      resultBlob: null,
      status: 'ready',
      progress: 0,
      message: 'Queued for cutout processing',
    }));
    setBgJobs((prev) => [...prev, ...additions]);
    navigateTo('bg_remove');
    addToast('success', `${additions.length} image(s) added to Cutout Canvas.`);
  };

  // Escape Listener for History Drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsHistoryOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const activeItem = items.find((i) => i.id === selectedId) || items[0];
  const visibleError = error || activeItem?.error || null;

  return (
    <div className="app-shell min-h-screen font-sans bg-grid-pattern relative flex flex-col">
      {/* TOAST MESSAGES */}
      <div className="toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type === 'error' ? 'error' : ''}`}>
            <span>{t.type === 'error' ? '!' : '✓'}</span>
            <p className="m-0 font-medium">{t.text}</p>
          </div>
        ))}
      </div>

      {/* HIDDEN FILE INPUT FOR BG REMOVE */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => {
          if (e.target.files?.length) handleBGFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {/* STICKY GLASSMORPHIC NAVBAR (REQUIRED TASK 1 & 5) */}
      <Navbar
        activeTab={activeTab}
        onTabChange={navigateTo}
        upscalerEngine={execEngine}
        bgEngine={bgEngine}
        historyCount={history.length}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full mx-auto transition-all duration-300 w-full max-w-none p-0">
        <Routes>
          {/* ROUTE 1: HOME PAGE (/) */}

          <Route
            path="/cards"
            element={
              <CardDeck />
            }
          />

          <Route
            path="/"
            element={
              <HomePage
                onLaunchUpscaler={() => navigateTo('upscaler')}
                onLaunchBGRemove={() => navigateTo('bg_remove')}
                onSelectSample={async (sampleUrl, type) => {
                  try {
                    const res = await fetch(sampleUrl);
                    const blob = await res.blob();
                    const file = new File([blob], 'sample.jpg', { type: blob.type || 'image/jpeg' });
                    if (type === 'upscale') {
                      addUpscaleFile(file);
                      navigateTo('upscaler');
                    } else {
                      handleBGFiles([file]);
                    }
                  } catch {
                    addToast('error', 'Could not load sample.');
                  }
                }}
                onTabChange={navigateTo}
              />
            }
          />


          {/* ROUTE 2: AI UPSCALER STUDIO (/upscaler) */}
          <Route
            path="/upscaler"
            element={
              <div className="flex flex-col gap-8 w-full px-2">

                {step === 'upload' && (
                  <UploadArea
                    onFile={addUpscaleFile}
                    isLoading={items.some((i) => i.status === 'processing')}
                    fileName={items[0]?.name}
                    fileSize={items[0]?.size}
                    onClear={handleClearAll}
                    beforeImage="/upscaler/shoes.jpeg"
                    afterImage="/upscaler/shoes.png"
                  />
                )}

                <ErrorMessage message={visibleError} onDismiss={() => setError(null)} />

                {step === 'upload' && (
                  <>
                    <UpscaleShowcase />
                    <UpscaleShowreel />
                    <UpscaleCapabilities />
                    <UpscaleJourney />
                    <UpscaleFaq />
                  </>
                )}

                {step !== 'upload' && (
                  <UpscaleWorkspace
                    items={items}
                    selectedId={selectedId || (items[0]?.id ?? '')}
                    onSelectId={setSelectedId}
                    onRemoveId={handleRemoveItem}
                    onAddFile={addUpscaleFile}
                    isLoading={modelLoading}
                    onModelChange={handleItemModelChange}
                    onOptionsChange={handleItemOptionsChange}
                    onResetSettings={handleResetItemSettings}
                    onUpscale={handleUpscaleItem}
                    onDownload={handleDownloadItem}
                    onReset={handleClearAll}
                  />
                )}

                <Footer onTabChange={navigateTo} />
              </div>
            }
          />
          <Route
            path="/bg_remove"
            element={
              <div className="w-full flex flex-col gap-8">
                <BGRemoveWorkspace
                  jobs={bgJobs}
                  setJobs={setBgJobs}
                  addToast={addToast}
                  onOpenPicker={() => fileInputRef.current?.click()}
                  onAddHistoryRecord={addHistoryRecord}
                  onEngineReport={(engine, webgpuAvailable) => {
                    setBgEngine(engine);
                    setBgWebgpuAvailable(webgpuAvailable);
                  }}
                />
                {bgJobs.length === 0 && (
                  <>
                    <BgShowcase />
                    <Bgmarquee />
                    <BgSampleGallery onLoadSample={loadBgSample} />
                    <BgPipeline />
                    <BgPrecision />
                    <BgFaq />
                  </>
                )}
                <Footer onTabChange={navigateTo} />
              </div>
            }
          />

          <Route path="/story" element={
            <PixelifyStory />
          } />

          <Route path="truckbg" element={
            <TruckBg />
          }>
          </Route>

          {/* FALLBACK ROUTE: Redirect to / */}
          <Route path="*" element={<Navigate to="/" replace />} />
        
          <Route path="/404" element={<NotFound />} />

        </Routes>
      </main>

      {/* HISTORY DRAWER */}
      {isHistoryOpen && (
        <HistoryDrawer
          history={history}
          onClose={() => setIsHistoryOpen(false)}
          onClear={() => setHistory([])}
          onSelect={(item) => {
            setIsHistoryOpen(false);
            if (item.type === 'bg_remove') {
              navigateTo('bg_remove');
            } else {
              navigateTo('upscaler');
            }
          }}
        />
      )}

    </div>
  );
}
