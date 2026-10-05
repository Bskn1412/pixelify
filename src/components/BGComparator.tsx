import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crop as CropIcon } from 'lucide-react';
import Icon from './Icon';
import FabricImageEditor, { FabricEditMode, FabricCropRatio } from './bgremove/FabricImageEditor';
import type { BGJob } from '../types';
import type { TextLayer, ElementLayer } from './bgremove/DesignAssets';
import { ELEMENT_PRESETS } from './bgremove/DesignAssets';

export interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
}

export interface ImageEffects {
  shadow: boolean;
  shadowBlur: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
  shadowColor?: string;
  stroke: boolean;
  strokeColor: string;
  strokeWidth: number;
  glow?: boolean;
  glowColor?: string;
}

export interface BGComparatorProps {
  job: BGJob;
  activeTab?: 'cutout' | 'background' | 'effects' | 'adjust' | 'design';
  cutoutTool?: 'erase' | 'restore' | 'move';
  brushSize?: number;
  backgroundStyle?: string;
  customBgColor?: string;
  customBgImage?: string;
  subjectBgBlur?: number;
  bgBlur?: number;
  bgDarken?: number;
  adjustments?: ImageAdjustments;
  effects?: ImageEffects;
  isCompareMode?: boolean;
  scale?: number;
  rotation?: number;
  cropRatio?: FabricCropRatio;
  fabricEditMode?: FabricEditMode | null;
  onFabricCropRatioChange?: (ratio: FabricCropRatio) => void;
  onFabricEditApply?: (blob: Blob) => void;
  onFabricEditCancel?: () => void;
  viewportZoom?: number;
  onViewportZoomChange?: (zoom: number) => void;
  onResetView?: () => void;
  onScaleChange?: (scale: number) => void;
  // Brush callback & history
  onBrushStroke?: (newBlob: Blob, newUrl: string) => void;
  undoTrigger?: number;
  redoTrigger?: number;
  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void;
  // Design layers
  textLayers?: TextLayer[];
  elementLayers?: ElementLayer[];
  selectedLayerId?: string | null;
  onSelectLayer?: (id: string | null) => void;
  onUpdateTextLayerPosition?: (id: string, x: number, y: number) => void;
  onUpdateElementLayerPosition?: (id: string, x: number, y: number) => void;
  onDeleteLayer?: (id: string) => void;
  onResetSubjectPosition?: () => void;
}

export default function BGComparator({
  job,
  activeTab = 'cutout',
  cutoutTool = 'move',
  brushSize = 40,
  backgroundStyle = 'bg-[radial-gradient(#ddd_1px,transparent_1px)] [background-size:16px_16px] bg-slate-100 dark:bg-[radial-gradient(#333_1px,transparent_1px)] dark:bg-neutral-950',
  customBgColor,
  customBgImage,
  subjectBgBlur = 0,
  bgBlur = 0,
  bgDarken = 0,
  adjustments = { brightness: 100, contrast: 100, saturation: 100, blur: 0 },
  effects = { shadow: false, shadowBlur: 15, shadowOffsetY: 15, shadowOpacity: 50, shadowColor: '#000000', stroke: false, strokeColor: '#00FF85', strokeWidth: 4 },
  isCompareMode = false,
  scale = 1,
  rotation = 0,
  cropRatio = 'free',
  fabricEditMode = null,
  onFabricCropRatioChange,
  onFabricEditApply,
  onFabricEditCancel,
  viewportZoom = 1,
  onViewportZoomChange,
  onResetView,
  onScaleChange,
  onBrushStroke,
  undoTrigger = 0,
  redoTrigger = 0,
  onHistoryChange,
  textLayers = [],
  elementLayers = [],
  selectedLayerId = null,
  onSelectLayer,
  onUpdateTextLayerPosition,
  onUpdateElementLayerPosition,
  onDeleteLayer,
  onResetSubjectPosition,
}: BGComparatorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [split, setSplit] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [subjectPos, setSubjectPos] = useState({ x: 0, y: 0 });
  const [resultAspectRatio, setResultAspectRatio] = useState<number | null>(null);

  // Reset subject position when requested or when job changes
  useEffect(() => {
    setSubjectPos({ x: 0, y: 0 });
  }, [job?.id]);

  useEffect(() => {
    if (!job.resultUrl) {
      setResultAspectRatio(null);
      return;
    }
    const image = new Image();
    image.onload = () => {
      if (image.naturalHeight > 0) setResultAspectRatio(image.naturalWidth / image.naturalHeight);
    };
    image.src = job.resultUrl;
  }, [job.id, job.resultUrl]);

  const isProcessing = job.status === 'loading' || job.status === 'processing';
  const isBrushMode = activeTab === 'cutout' && (cutoutTool === 'erase' || cutoutTool === 'restore') && !!job.resultUrl && !isProcessing && !isCompareMode;
  const isCropMode = fabricEditMode === 'crop';
  const isMoveMode = activeTab === 'adjust' && cutoutTool === 'move' && !fabricEditMode && !!job.resultUrl && !isProcessing && !isCompareMode;

  // -------------------------------------------------------------
  // INTERACTIVE BRUSH CANVAS (SINGLE IMAGE STAGE FOR CUTOUT REFINEMENT)
  // -------------------------------------------------------------
  const brushCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseImgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPaintingRef = useRef(false);
  const [brushCursor, setBrushCursor] = useState<{ visible: boolean; x: number; y: number }>({
    visible: false,
    x: 0,
    y: 0,
  });
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);

  // Notify parent of undo/redo availability
  useEffect(() => {
    onHistoryChange?.(undoStack.length > 0, redoStack.length > 0);
  }, [undoStack.length, redoStack.length, onHistoryChange]);

  // Sync cutout image to brush canvas when image loads or changes
  useEffect(() => {
    if (!job?.resultUrl || !brushCanvasRef.current) return;
    let cancelled = false;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      const canvas = brushCanvasRef.current;
      if (!canvas) return;

      const maxDim = 900;
      const s = Math.min(1, maxDim / Math.max(img.width, img.height));
      canvas.width = Math.round(img.width * s);
      canvas.height = Math.round(img.height * s);

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Reset history stacks on new image
      setUndoStack([]);
      setRedoStack([]);

      // Load original image to base canvas for restore brush
      const orig = new Image();
      orig.crossOrigin = 'anonymous';
      orig.onload = () => {
        if (cancelled) return;
        const base = document.createElement('canvas');
        base.width = canvas.width;
        base.height = canvas.height;
        const bCtx = base.getContext('2d');
        if (bCtx) {
          bCtx.drawImage(orig, 0, 0, base.width, base.height);
          baseImgCanvasRef.current = base;
        }
      };
      orig.src = job.sourceUrl;
    };
    img.src = job.resultUrl;

    return () => {
      cancelled = true;
    };
  }, [job?.id, job?.resultUrl, job?.sourceUrl, isBrushMode]);

  // Handle Undo trigger
  const prevUndoTrigger = useRef(undoTrigger);
  useEffect(() => {
    if (undoTrigger > 0 && undoTrigger !== prevUndoTrigger.current) {
      prevUndoTrigger.current = undoTrigger;
      const canvas = brushCanvasRef.current;
      if (!canvas || undoStack.length === 0) return;
      const prev = undoStack[undoStack.length - 1];
      setUndoStack((s) => s.slice(0, -1));
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx && prev) {
        const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setRedoStack((s) => [...s, snap]);
        ctx.putImageData(prev, 0, 0);
        canvas.toBlob((blob) => {
          if (blob && onBrushStroke) {
            const url = URL.createObjectURL(blob);
            onBrushStroke(blob, url);
          }
        }, 'image/png');
      }
    }
  }, [undoTrigger, undoStack, onBrushStroke]);

  // Handle Redo trigger
  const prevRedoTrigger = useRef(redoTrigger);
  useEffect(() => {
    if (redoTrigger > 0 && redoTrigger !== prevRedoTrigger.current) {
      prevRedoTrigger.current = redoTrigger;
      const canvas = brushCanvasRef.current;
      if (!canvas || redoStack.length === 0) return;
      const next = redoStack[redoStack.length - 1];
      setRedoStack((s) => s.slice(0, -1));
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx && next) {
        const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setUndoStack((s) => [...s, snap]);
        ctx.putImageData(next, 0, 0);
        canvas.toBlob((blob) => {
          if (blob && onBrushStroke) {
            const url = URL.createObjectURL(blob);
            onBrushStroke(blob, url);
          }
        }, 'image/png');
      }
    }
  }, [redoTrigger, redoStack, onBrushStroke]);

  // Paint onto brush canvas
  const paintBrush = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = brushCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      const radius = (brushSize * (canvas.width / rect.width)) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.clip();

      if (cutoutTool === 'erase') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      } else if (cutoutTool === 'restore' && baseImgCanvasRef.current) {
        ctx.drawImage(baseImgCanvasRef.current, 0, 0);
      }
      ctx.restore();
    },
    [brushSize, cutoutTool]
  );

  const startBrush = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isPaintingRef.current = true;
    setBrushCursor({ visible: true, x: e.clientX, y: e.clientY });

    // Save snapshot before stroke
    const canvas = brushCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        setUndoStack((s) => [...s.slice(-15), ctx.getImageData(0, 0, canvas.width, canvas.height)]);
        setRedoStack([]);
      }
    }

    paintBrush(e);
  };

  const moveBrush = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setBrushCursor({ visible: true, x: e.clientX, y: e.clientY });
    if (isPaintingRef.current) {
      paintBrush(e);
    }
  };

  const endBrush = () => {
    if (!isPaintingRef.current) return;
    isPaintingRef.current = false;

    const canvas = brushCanvasRef.current;
    if (!canvas || !onBrushStroke) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      onBrushStroke(blob, url);
    }, 'image/png');
  };

  // -------------------------------------------------------------
  // CSS STYLES FOR FILTERS AND EFFECTS
  // -------------------------------------------------------------
  const filterCSS = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%) blur(${adjustments.blur}px)`;

  const shadowAlpha = (effects.shadowOpacity ?? 50) / 100;
  const shadowCol = effects.shadowColor || '#000000';
  const shadowOffsetY = effects.shadowOffsetY ?? 15;
  const shadowCSS = effects.shadow
    ? `drop-shadow(0 ${shadowOffsetY}px ${effects.shadowBlur}px ${shadowCol}${Math.round(shadowAlpha * 255)
        .toString(16)
        .padStart(2, '0')})`
    : 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.2))';

  const strokeCSS = effects.stroke
    ? `drop-shadow(0 0 ${effects.strokeWidth}px ${effects.strokeColor}) drop-shadow(0 0 1px ${effects.strokeColor})`
    : '';

  const combinedFilter = `${filterCSS} ${shadowCSS} ${strokeCSS}`.trim();
  const cropClipPath = (() => {
    if (!resultAspectRatio || cropRatio === 'free') return undefined;
    const [ratioWidth, ratioHeight] = cropRatio.split(':').map(Number);
    const targetRatio = ratioWidth / ratioHeight;
    if (resultAspectRatio > targetRatio) {
      const horizontalInset = ((1 - targetRatio / resultAspectRatio) * 50).toFixed(3);
      return `inset(0 ${horizontalInset}% 0 ${horizontalInset}%)`;
    }
    const verticalInset = ((1 - resultAspectRatio / targetRatio) * 50).toFixed(3);
    return `inset(${verticalInset}% 0 ${verticalInset}% 0)`;
  })();

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none">
      {/* =========================================================
          STAGE CONTAINER (EDGE-TO-EDGE IN COLUMN, ADAPTIVE HEIGHT)
         ========================================================= */}
      <div
        ref={containerRef}
        onClick={() => onSelectLayer?.(null)}
        className={`relative h-[460px] w-full rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl flex items-center justify-center p-4 sm:h-[540px] sm:p-8 lg:h-[640px] transition-all duration-300 isolate ${
          customBgImage || customBgColor ? '' : backgroundStyle
        }`}
        style={customBgColor ? { backgroundColor: customBgColor } : undefined}
      >
        {/* Subtle stage grid pattern for transparent backgrounds */}
        {!customBgImage && !customBgColor && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        )}

        {subjectBgBlur > 0 && !isProcessing && !isCompareMode && !fabricEditMode && (
          <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-hidden">
            <img
              src={job.sourceUrl}
              alt="Blurred original background"
              className="max-h-[500px] w-auto max-w-full object-contain"
              style={{
                filter: `blur(${subjectBgBlur}px)`,
              }}
            />
          </div>
        )}

        {/* CUSTOM BACKGROUND IMAGE LAYER */}
        {customBgImage && !isProcessing && (
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <img
              src={customBgImage}
              alt="Custom Background"
              className="w-full h-full object-cover transition-all"
              style={{
                filter: bgBlur > 0 ? `blur(${bgBlur}px)` : undefined,
                transform: bgBlur > 0 ? 'scale(1.08)' : undefined,
              }}
            />
            {bgDarken > 0 && (
              <div
                className="absolute inset-0 bg-black transition-opacity"
                style={{ opacity: bgDarken / 100 }}
              />
            )}
          </div>
        )}

        {/* =========================================================
            STAGE FLOATING STATUS & CONTROLS PILL
           ========================================================= */}
        <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
          {/* Active Mode Pill Indicator */}
          <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-xs font-semibold text-white shadow-lg">
            {isBrushMode ? (
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                {cutoutTool === 'erase' ? '✂️ Erase Brush Active' : '✦ Restore Brush Active'}
              </span>
            ) : isCompareMode ? (
              <span className="flex items-center gap-1.5 text-blue-400">
                <span>[|]</span> Split Compare Active
              </span>
            ) : selectedLayerId ? (
              <span className="flex items-center gap-1.5 text-[#00FF85]">
                <span>✨</span> Design Element Selected
              </span>
            ) : isCropMode ? (
              <span className="flex items-center gap-1.5 text-[#00FF85]">
                <span><CropIcon /></span> Crop frame active · {cropRatio}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-neutral-300">
                <span>✋</span> Move & Canvas Active
              </span>
            )}
          </div>

          {/* Quick Stage Controls */}
          <div className="pointer-events-auto flex items-center gap-2">
            {job.resultUrl && !isProcessing && (
              <button
                type="button"
                onClick={() => {
                  setSubjectPos({ x: 0, y: 0 });
                  onScaleChange?.(1);
                  onResetSubjectPosition?.();
                }}
                className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/10 text-[11px] font-bold text-neutral-300 hover:text-white transition shadow-lg flex items-center gap-1.5 cursor-pointer"
                title="Reset Subject Position & Scale"
              >
                <span>↺</span> Reset Center
              </button>
            )}
          </div>
        </div>

        {/* =========================================================
            LOADING / PROCESSING STATE
           ========================================================= */}
        {isProcessing || !job.resultUrl ? (
          <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center gap-5">
            <img
              src={job.sourceUrl}
              alt="Source preview"
              className="absolute inset-0 w-full h-full object-cover opacity-15 filter blur-2xl scale-110 pointer-events-none"
            />

            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#00FF85]/20 border-t-[#00FF85] border-r-cyan-400 animate-spin shadow-[0_0_25px_rgba(0,255,133,0.4)]" />
              <div className="h-10 w-10 rounded-full bg-white/5 backdrop-blur flex items-center justify-center text-xl">
                🪄
              </div>
            </div>

            <div className="relative z-10 max-w-sm">
              <h4 className="text-xl font-black text-white mb-1 tracking-tight">Extracting Subject...</h4>
              <p className="text-xs text-neutral-400 font-mono">
                {job.message || 'BiRefNet vision transformers segmenting edges...'}
              </p>
            </div>

            <div className="relative z-10 w-full max-w-xs h-2 rounded-full bg-white/10 overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-[#00FF85] transition-all duration-300 shadow-[0_0_12px_#00FF85]"
                style={{ width: `${job.progress || 15}%` }}
              />
            </div>
            <span className="relative z-10 text-[11px] font-mono text-[#00FF85] font-bold">
              {job.progress || 15}% Complete
            </span>
          </div>
        ) : fabricEditMode && !isProcessing && job.resultUrl ? (
          <div className="relative z-10 flex h-full w-full items-center justify-center overflow-auto">
            <FabricImageEditor
              key={`${job.id}-${fabricEditMode}`}
              imageUrl={job.resultUrl}
              mode={fabricEditMode}
              cropRatio={cropRatio as FabricCropRatio}
              initialScale={scale}
              initialRotation={rotation}
              initialPosition={subjectPos}
              onCropRatioChange={(ratio) => onFabricCropRatioChange?.(ratio)}
              onApply={(blob) => {
                setSubjectPos({ x: 0, y: 0 });
                onFabricEditApply?.(blob);
              }}
              onCancel={() => onFabricEditCancel?.()}
            />
          </div>
        ) : isCompareMode ? (
          /* =========================================================
              BEFORE / AFTER SPLIT COMPARISON SLIDER
             ========================================================= */
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden z-10">
            <img
              src={job.resultUrl}
              alt="Result cutout"
              className="max-h-[500px] w-auto max-w-full object-contain transition-all"
              style={{ filter: combinedFilter }}
            />

            <div
              className="absolute inset-0 overflow-hidden flex items-center justify-center pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
            >
              <img
                src={job.sourceUrl}
                alt="Original photo"
                className="max-h-[500px] w-auto max-w-full object-contain"
              />
            </div>

            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#00FF85] shadow-[0_0_15px_#00FF85] pointer-events-none z-20 flex items-center justify-center"
              style={{ left: `${split}%` }}
            >
              <div className="w-9 h-9 rounded-full bg-slate-900 text-[#00FF85] border-2 border-[#00FF85] shadow-2xl flex items-center justify-center text-xs font-bold">
                <Icon name="arrows" size={16} />
              </div>
            </div>

            <input
              aria-label="Compare original and cutout"
              type="range"
              min="0"
              max="100"
              value={split}
              onChange={(e) => setSplit(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
          </div>
        ) : isBrushMode ? (
          /* =========================================================
              INTERACTIVE ERASER / RESTORE BRUSH CANVAS (SINGLE IMAGE)
             ========================================================= */
          <div className="relative flex items-center justify-center w-full h-full z-10 overflow-hidden">
            <canvas
              ref={brushCanvasRef}
              className="cursor-crosshair max-w-full max-h-[500px] object-contain rounded-xl shadow-2xl touch-none"
              style={{
                transform: `scale(${scale * viewportZoom}) rotate(${rotation}deg) translate(${subjectPos.x}px, ${subjectPos.y}px)`,
                filter: combinedFilter,
              }}
              onPointerDown={startBrush}
              onPointerEnter={(e) => setBrushCursor({ visible: true, x: e.clientX, y: e.clientY })}
              onPointerMove={moveBrush}
              onPointerUp={endBrush}
              onPointerCancel={endBrush}
              onPointerLeave={() => {
                if (!isPaintingRef.current) setBrushCursor((v) => ({ ...v, visible: false }));
              }}
            />
          </div>
        ) : (
          /* =========================================================
              DRAGGABLE & SCALABLE CUTOUT SUBJECT (MOVE MODE / OTHER TABS)
             ========================================================= */
          <div className="relative flex items-center justify-center w-full h-full z-10 overflow-hidden">
            <motion.div
              dragConstraints={containerRef}
              dragElastic={0.05}
              dragMomentum={false}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(_e, info) => {
                setIsDragging(false);
                setSubjectPos((p) => ({ x: p.x + info.offset.x, y: p.y + info.offset.y }));
              }}
              drag={isMoveMode}
              className={`${isMoveMode ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'} relative p-1 rounded-2xl transition-shadow ${
                isMoveMode && isDragging ? 'ring-2 ring-[#00FF85]/80 shadow-2xl scale-[1.01]' : isMoveMode ? 'hover:ring-1 hover:ring-white/20' : ''
              }`}
              style={{ scale: scale * viewportZoom, rotate: `${rotation}deg` }}
            >
              <img
                src={job.resultUrl}
                alt={job.name}
                className="max-h-[500px] w-auto max-w-full object-contain pointer-events-none select-none"
                style={{ filter: combinedFilter, clipPath: cropClipPath }}
              />
            </motion.div>
          </div>
        )}

        {/* =========================================================
            DESIGN OVERLAY LAYERS (TEXT & SHAPES / BADGES / STICKERS)
           ========================================================= */}
        {!isProcessing && !isCompareMode && !fabricEditMode && (
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            {/* 1. RENDER ELEMENT LAYERS */}
            {elementLayers.map((el) => {
              const isSelected = selectedLayerId === el.id;
              const preset = ELEMENT_PRESETS.find((p) => p.key === el.key);

              return (
                <motion.div
                  key={el.id}
                  drag
                  dragConstraints={containerRef}
                  dragMomentum={false}
                  onDragEnd={(_e, info) => {
                    const rect = containerRef.current?.getBoundingClientRect();
                    if (!rect) return;
                    const deltaX = (info.offset.x / rect.width) * 100;
                    const deltaY = (info.offset.y / rect.height) * 100;
                    onUpdateElementLayerPosition?.(el.id, el.x + deltaX, el.y + deltaY);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLayer?.(el.id);
                  }}
                  className={`absolute pointer-events-auto cursor-move select-none p-1 rounded-xl transition-all ${
                    isSelected ? 'ring-2 ring-[#00FF85] shadow-2xl' : 'hover:ring-1 hover:ring-white/40'
                  }`}
                  style={{
                    left: `${el.x}%`,
                    top: `${el.y}%`,
                    transform: `translate(-50%, -50%) rotate(${el.rotation || 0}deg)`,
                    opacity: el.opacity ?? 1,
                  }}
                >
                  {el.type === 'badge' ? (
                    <div
                      className="px-4 py-2 rounded-full font-black text-sm border-2 shadow-2xl whitespace-nowrap bg-[#09090D] flex items-center justify-center"
                      style={{
                        borderColor: el.color,
                        color: el.color,
                        fontSize: `${Math.round(el.size * 0.22)}px`,
                        boxShadow: `0 0 20px ${el.color}40`,
                      }}
                    >
                      {el.badgeText || el.name}
                    </div>
                  ) : preset?.path ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill={el.color}
                      style={{
                        width: `${el.size}px`,
                        height: `${el.size}px`,
                        filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
                      }}
                    >
                      <path d={preset.path} />
                    </svg>
                  ) : null}

                  {isSelected && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteLayer?.(el.id);
                      }}
                      className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shadow-lg hover:bg-rose-700 transition"
                      title="Delete Layer"
                    >
                      ✕
                    </button>
                  )}
                </motion.div>
              );
            })}

            {/* 2. RENDER TEXT LAYERS */}
            {textLayers.map((tl) => {
              const isSelected = selectedLayerId === tl.id;
              let pillBg = 'transparent';
              if (tl.bgPill === 'black') pillBg = 'rgba(9, 9, 13, 0.85)';
              if (tl.bgPill === 'mint') pillBg = '#00FF85';
              if (tl.bgPill === 'white') pillBg = '#FFFFFF';
              if (tl.bgPill === 'crimson') pillBg = '#F43F5E';

              return (
                <motion.div
                  key={tl.id}
                  drag
                  dragConstraints={containerRef}
                  dragMomentum={false}
                  onDragEnd={(_e, info) => {
                    const rect = containerRef.current?.getBoundingClientRect();
                    if (!rect) return;
                    const deltaX = (info.offset.x / rect.width) * 100;
                    const deltaY = (info.offset.y / rect.height) * 100;
                    onUpdateTextLayerPosition?.(tl.id, tl.x + deltaX, tl.y + deltaY);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLayer?.(tl.id);
                  }}
                  className={`absolute pointer-events-auto cursor-move select-none p-1.5 rounded-xl transition-all ${
                    isSelected ? 'ring-2 ring-[#00FF85] shadow-2xl' : 'hover:ring-1 hover:ring-white/40'
                  }`}
                  style={{
                    left: `${tl.x}%`,
                    top: `${tl.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div
                    className="px-3 py-1 rounded-xl whitespace-pre-wrap transition-colors leading-tight"
                    style={{
                      fontFamily: tl.fontFamily,
                      fontSize: `${tl.fontSize}px`,
                      fontWeight: tl.fontWeight,
                      color: tl.color,
                      textAlign: tl.align,
                      backgroundColor: pillBg,
                      textShadow: tl.shadow ? '0 4px 14px rgba(0,0,0,0.8)' : undefined,
                    }}
                  >
                    {tl.text}
                  </div>

                  {isSelected && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteLayer?.(tl.id);
                      }}
                      className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shadow-lg hover:bg-rose-700 transition"
                      title="Delete Text"
                    >
                      ✕
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* =========================================================
          BRUSH CURSOR INDICATOR (PORTAL / FIXED)
         ========================================================= */}
      {isBrushMode && brushCursor.visible && (
        <span
          className={`fixed pointer-events-none rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity z-50 ${
            cutoutTool === 'erase'
              ? 'border-rose-400 bg-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.5)]'
              : 'border-[#00FF85] bg-[#00FF85]/20 shadow-[0_0_12px_rgba(0,255,133,0.5)]'
          }`}
          style={{
            width: brushSize * scale,
            height: brushSize * scale,
            left: brushCursor.x,
            top: brushCursor.y,
          }}
        />
      )}
    </div>
  );
}

