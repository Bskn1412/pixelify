import React, { useEffect, useRef, useState } from "react";
import { MODELS } from "../constants";
import type {
  ModelKey,
  Step,
  EnhancementOptions,
  ScaleFactor,
  UpscaleItem,
} from "../types";
import ParameterSlider from "./ParameterSlider";
import SolvingOrb from "./SolvingOrb";
import "./solving-orb.css";
import {
  Sparkles,
  RotateCcw,
  ChevronDown,
  Check,
  Download,
  SlidersHorizontal,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  isSoundEnabled,
  setSoundEnabled,
  playSuccessChime,
  primeAudio,
} from "../utils/notifications";
import UpscalerLoader from "./upscaling-loader";

/* ============================================================
   IMAGE CIRCLE ICON (Replacement for header star)
   Derived from public/image-circle.svg
   ============================================================ */
function ImageCircleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M22 12a9.966 9.966 0 0 1-.832 4M12 22a9.966 9.966 0 0 0 7.071-2.929M2 12a9.966 9.966 0 0 1 2.929-7.071M12 2a9.966 9.966 0 0 0-4 .832m0 18.336A10.02 10.02 0 0 1 2.832 16m13-13A10.02 10.02 0 0 1 21 8.168"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7.545 12.095a4.55 4.55 0 0 1 9.068-.54c-2.271.051-3.942.557-5.143 1.284 1.085.378 2.17 1.018 3.007 2.059a.75.75 0 0 1-1.169.94c-.79-.981-1.907-1.524-3.049-1.789a8.265 8.265 0 0 0-2.359-.19 4.535 4.535 0 0 1-.355-1.764zm4.55-6.36a6.36 6.36 0 1 0 0 12.72 6.36 6.36 0 0 0 0-12.72zm-1.909 3.087c-.224 0-.547.063-.83.267-.31.224-.534.592-.534 1.097s.223.873.534 1.097c.283.204.606.267.83.267.224 0 .547-.063.83-.267.311-.224.534-.592.534-1.097s-.223-.873-.534-1.097a1.459 1.459 0 0 0-.83-.267z"
        clipRule="evenodd"
      />
    </svg>
  );
}

interface UpscaleWorkspaceProps {
  items: UpscaleItem[];
  selectedId: string;
  onSelectId: (id: string) => void;
  onRemoveId: (id: string) => void;
  onAddFile: (file: File) => void;

  isLoading: boolean;

  onModelChange: (id: string, key: ModelKey) => void;
  onOptionsChange: (id: string, options: EnhancementOptions) => void;
  onResetSettings: (id: string) => void;

  onUpscale: (id: string) => void;
  onDownload: (id: string, format?: "png" | "webp" | "jpeg") => void;
  onReset?: () => void;
}

/* ============================================================
   DEFAULT ENHANCEMENT SETTINGS
   All advanced enhancement controls start at 50.
   ============================================================ */

const DEFAULT_ENHANCEMENT_SETTINGS = {
  sharpness: 50,
  denoise: 50,
  faceEnhancement: 50,
  colorLevel: 50,
  hdrLevel: 50,
  brightness: 50,
  contrast: 50,
};

/* ============================================================
   CUSTOM MODEL DROPDOWN COMPONENT (Requirement 2)
   Shows model name and below it a concise 1-line description
   ============================================================ */

function ModelDropdown({
  selectedKey,
  onChange,
  disabled,
}: {
  selectedKey: ModelKey;
  onChange: (key: ModelKey) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const activeModel = MODELS[selectedKey];

  const MODEL_METADATA: Record<ModelKey, { label: string; desc: string; badge: string }> = {
    clearreality: {
      label: MODELS.clearreality?.name || "4x-ClearReality V1 (Fast / Clean)",
      desc: "Ultra-fast neural inference • Crisp edges, de-blurring & illustration clarity",
      badge: "Fast & Crisp",
    },
    ultrasharp: {
      label: MODELS.ultrasharp?.name || "4x-UltraSharp (Extreme Clarity & 8K)",
      desc: "Deep generative ESRGAN • Extreme micro-textures, photorealism & 8K clarity",
      badge: "8K UltraSharp",
    },
    realesrgan: {
      label: MODELS.realesrgan?.name || "Real-ESRGAN Studio (4× / 8×)",
      desc: "Deep residual network • Studio portrait restoration, artifact removal & precision",
      badge: "Studio 8K",
    },
  };

  const current = MODEL_METADATA[selectedKey] || {
    label: activeModel?.name || selectedKey,
    desc: activeModel?.description || "",
    badge: "AI Model",
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`
          flex w-full items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-all
          ${
            open
              ? "border-[#00FF85]/60 bg-[#16161c] shadow-[0_0_20px_rgba(0,255,133,0.15)]"
              : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
          }
          ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
        `}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white truncate">
              {current.label}
            </span>
            <span className="rounded-full bg-[#00FF85]/15 border border-[#00FF85]/30 px-2 py-0.5 text-[10px] font-bold text-[#00FF85]">
              {current.badge}
            </span>
          </div>
          <p className="mt-1 text-[11.5px] text-white/55 truncate">
            {current.desc}
          </p>
        </div>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-white/60 transition-transform duration-200 ${
            open ? "rotate-180 text-[#00FF85]" : ""
          }`}
        />
      </button>

      {/* Popover Menu */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 flex flex-col gap-1.5 rounded-2xl border border-white/15 bg-[#141418] p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          {(Object.keys(MODELS) as ModelKey[]).map((key) => {
            const isSelected = key === selectedKey;
            const meta = MODEL_METADATA[key] || {
              label: MODELS[key]?.name || key,
              desc: MODELS[key]?.description || "",
              badge: "Model",
            };

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onChange(key);
                  setOpen(false);
                }}
                className={`
                  group flex w-full items-start justify-between gap-3 rounded-xl p-3 text-left transition-all
                  ${
                    isSelected
                      ? "bg-[#00FF85]/10 border border-[#00FF85]/30 text-white"
                      : "hover:bg-white/[0.06] border border-transparent text-white/80 hover:text-white"
                  }
                `}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {meta.label}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9.5px] font-semibold ${
                        isSelected
                          ? "bg-[#00FF85] text-black font-bold"
                          : "bg-white/10 text-white/70"
                      }`}
                    >
                      {meta.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/55 group-hover:text-white/75">
                    {meta.desc}
                  </p>
                </div>

                {isSelected && (
                  <Check className="h-4 w-4 shrink-0 text-[#00FF85] mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MAIN UPSCALE WORKSPACE
   ============================================================ */

export default function UpscaleWorkspace({
  items,
  selectedId,
  onSelectId,
  onRemoveId,
  onAddFile,
  isLoading,
  onModelChange,
  onOptionsChange,
  onResetSettings,
  onUpscale,
  onDownload,
  onReset,
}: UpscaleWorkspaceProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  const handleToggleSound = () => {
    primeAudio();
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) {
      playSuccessChime();
    }
  };

  const activeItem = items.find((i) => i.id === selectedId) || items[0];
  if (!activeItem) return null;

  const isProcessing = activeItem.status === "processing";
  const hasResult = activeItem.status === "completed" && !!activeItem.result;
  const resultUrl = activeItem.result?.dataUrl || "";
  const imageUrl = activeItem.url;
  const modelKey = activeItem.modelKey;
  const options = activeItem.options;
  const busy = isProcessing || isLoading;
  const model = MODELS[modelKey];

  /* ----------------------------------------------------------
     RESET ADVANCED SETTINGS
     ---------------------------------------------------------- */
  const resetEnhancementSettings = () => {
    if (busy) return;
    onResetSettings(activeItem.id);
  };

  /* ----------------------------------------------------------
     SCALE SELECTION
     ---------------------------------------------------------- */
  const selectScale = (scale: ScaleFactor) => {
    if (busy) return;

    onOptionsChange(activeItem.id, {
      ...options,
      scale,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row w-full gap-6 items-start">
      {/* ======================================================
          LEFT SECTION: IMAGE CANVAS + INDIVIDUAL ADD/THUMB STRIP BELOW (Req 5 & 6)
         ====================================================== */}
      <div className="flex-1 min-w-0 flex flex-col gap-4 w-full">
        
        {/* 5. IMAGE SHOWCASE DIV (Big, properly fits uploaded image in view) */}
        <div className="relative w-full h-[540px] lg:h-[690px] max-h-[80vh] rounded-2xl border border-white/[0.08] bg-[#070709] flex items-center justify-center overflow-hidden p-3 sm:p-6 shadow-2xl isolate">
          {/* Subtle canvas grid pattern */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />

          {hasResult && resultUrl ? (
            <BeforeAfterSlider before={imageUrl} after={resultUrl} />
          ) : (
            <div className="relative flex h-full w-full items-center justify-center">
              <img
                src={imageUrl}
                alt={activeItem.name || "Uploaded preview"}
                className="
                  block
                  h-full
                  w-full
                  object-contain
                  select-none
                "
                draggable={false}
              />
            </div>
          )}

          {/* SOLVING ORB PROCESSING OVERLAY — progress ring + solving orb + % (no tiles/steps) */}
          {isProcessing && (
            <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-hidden rounded-2xl bg-black/45 backdrop-blur-[3px]">
              <div className="relative z-20 flex flex-col items-center gap-4 rounded-3x px-10 py-8 text-center">
                {/* Determinate ring: real % from the inference pipeline, mint variant.
                    state="connecting": we don't use SolvingOrb's locked 'solving' —
                    we render OrbProgressRing directly via the exported component's
                    state override below (connecting = pulsing handshake). */}
                {/* <SolvingOrb
                  size={160}
                  variant="mint"
                  loop={false}
                  progress={Math.min(1, Math.max(0.03, (activeItem.progress?.percent ?? 0) / 100))}
                  stateOverride="connecting"
                /> */}

                <UpscalerLoader/>

                {/* LIVE PERCENTAGE */}
                <div className="font-mono text-4xl font-black tabular-nums tracking-tight text-white">
                  {Math.min(100, Math.max(0, Math.round(activeItem.progress?.percent ?? 0)))}
                  <span className="text-xl font-bold text-[#00FF85]">%</span>
                </div>

                <div className="max-w-[280px] truncate text-base font-bold tracking-wide text-white">
                  Enhancing {activeItem.name}
                </div>

                <div className="flex items-center gap-2 rounded-full border border-[#00FF85]/30 bg-[#00FF85]/10 px-3.5 py-1 text-[10px] font-semibold text-[#00FF85]">
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#00FF85]" />
                  <span>Neural Super-Resolution Active</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6. INDIVIDUAL '+ ADD' SECTION (Stays still & in middle of image below section) */}
        <div className="w-full flex items-center justify-center py-1">
          <UploadStrip
            items={items}
            selectedId={activeItem.id}
            onSelectId={onSelectId}
            onRemoveId={onRemoveId}
            onAddFile={onAddFile}
          />
        </div>
      </div>

      {/* ======================================================
          4. RIGHT CONTROL PANEL (Separate container on right)
         ====================================================== */}
      <aside
        className="
          w-full
          lg:w-[410px]
          shrink-0
          rounded-2xl
          border
          border-white/[0.08]
          bg-[#121216]
          p-5
          sm:p-6
          shadow-2xl
          flex
          flex-col
          gap-6
          sticky
          top-24
          max-h-[calc(100vh-120px)]
          overflow-y-auto
        "
      >
        {/* HEADER (With image-circle.svg icon to the left of Upscale) */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00FF85]/10 text-[#00FF85]">
              <ImageCircleIcon className="h-5 w-5 text-[#00FF85]" />
            </div>
            <div>
              <div className="text-base font-bold text-white tracking-wide">
                Upscale
              </div>
              <div className="text-[11px] text-white/45">
                AI Resolution & Details
              </div>
            </div>
          </div>

          {/* ACTIONS: SOUND TOGGLE + RESET */}
          <div className="flex items-center gap-1.5">
            {/* SOUND EFFECT TOGGLE */}
            <button
              type="button"
              onClick={handleToggleSound}
              title={soundOn ? "Sound chime enabled (click to mute)" : "Sound chime muted (click to enable)"}
              className={`
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                border
                transition-all
                cursor-pointer
                ${
                  soundOn
                    ? "border-[#00FF85]/40 bg-[#00FF85]/10 text-[#00FF85] shadow-[0_0_10px_rgba(0,255,133,0.15)]"
                    : "border-white/10 bg-white/[0.03] text-white/40 hover:bg-white/[0.06] hover:text-white"
                }
              `}
              aria-label="Toggle sound effect"
            >
              {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>

            {/* RESET BUTTON */}
            <button
              type="button"
              onClick={resetEnhancementSettings}
              disabled={busy}
              title="Reset enhancement controls to 50"
              className="
                flex
                items-center
                gap-1.5
                rounded-lg
                border
                border-white/10
                bg-white/[0.03]
                px-2.5
                py-1.5
                text-xs
                font-medium
                text-white/60
                transition-colors
                hover:bg-white/[0.06]
                hover:text-white
                disabled:opacity-30
                cursor-pointer
              "
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 2. MODEL SELECTION (Custom Dropdown with 1-line description) */}
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">
            Model
          </div>

          <ModelDropdown
            selectedKey={modelKey}
            onChange={(key) => onModelChange(activeItem.id, key)}
            disabled={busy}
          />
        </div>

        {/* SCALE FACTOR */}
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">
            Scale factor
          </div>

          <div className="flex gap-2">
            {[2, 4, 8].map((s) => {
              if (s === 8 && model?.maxScale && model.maxScale < 8) {
                return null;
              }

              const active = options.scale === (s as ScaleFactor);

              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => selectScale(s as ScaleFactor)}
                  disabled={busy}
                  className={`
                    flex-1
                    rounded-xl
                    py-2.5
                    text-sm
                    font-bold
                    transition-all
                    ${
                      active
                        ? "bg-white text-black shadow-lg"
                        : "bg-white/[0.03] border border-white/10 text-white/70 hover:bg-white/[0.08] hover:text-white"
                    }
                    disabled:opacity-30
                  `}
                >
                  {s}x
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. ADVANCED SETTINGS (Disabled when busy, Requirement 7 & 9) */}
        <div>
          <button
            type="button"
            onClick={() => setAdvancedOpen((v) => !v)}
            disabled={busy}
            className="
              flex
              w-full
              items-center
              justify-between
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.02]
              p-3.5
              text-left
              text-sm
              font-semibold
              text-white/90
              transition-colors
              hover:bg-white/[0.05]
              disabled:opacity-40
            "
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-[#00FF85]" />
              <span>Advanced Settings</span>
            </div>

            <ChevronDown
              className={`
                h-4
                w-4
                text-white/50
                transition-transform
                duration-200
                ${advancedOpen ? "rotate-180 text-[#00FF85]" : ""}
              `}
            />
          </button>

          {advancedOpen && (
            <div className={`mt-4 space-y-5 rounded-xl border border-white/[0.06] bg-black/20 p-4 transition-opacity ${busy ? "opacity-50 pointer-events-none" : ""}`}>
              {/* Presets */}
              {model?.presets && (
                <div>
                  <div className="text-xs font-medium text-white/50 mb-2">
                    Preset
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {model.presets.map((p: string) => (
                      <button
                        key={p}
                        type="button"
                        disabled={busy}
                        onClick={() => onOptionsChange(activeItem.id, { ...options, preset: p })}
                        className="
                          rounded-lg
                          border border-white/10
                          bg-white/[0.03]
                          px-3
                          py-1.5
                          text-xs
                          font-medium
                          text-white/80
                          transition-colors
                          hover:border-white/20
                          hover:bg-white/[0.08]
                          hover:text-white
                          disabled:opacity-30
                        "
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sliders with disabled={busy} and fixed tooltips */}
              <ParameterSlider
                label="Sharpness"
                value={options.sharpness ?? options.sharpenLevel ?? 50}
                min={0}
                max={100}
                disabled={busy}
                onChange={(value) => onOptionsChange(activeItem.id, { ...options, sharpness: value, sharpenLevel: value, sharpen: true })}
                info="Controls how strongly fine edges and details are enhanced."
              />

              <ParameterSlider
                label="Denoise"
                value={options.denoise ?? options.removeNoiseLevel ?? 50}
                min={0}
                max={100}
                disabled={busy}
                onChange={(value) => onOptionsChange(activeItem.id, { ...options, denoise: value, removeNoiseLevel: value, removeNoise: true })}
                info="Reduces noise, grain and compression artifacts."
              />

              {model?.features?.faceRestore && (
                <ParameterSlider
                  label="Face enhancement"
                  value={options.faceEnhancement ?? options.faceRestoreLevel ?? 50}
                  min={0}
                  max={100}
                  disabled={busy}
                  onChange={(value) => onOptionsChange(activeItem.id, { ...options, faceEnhancement: value, faceRestoreLevel: value, faceRestore: true } as EnhancementOptions)}
                  info="Controls the strength of facial detail restoration."
                />
              )}

              {model?.features?.colorEnhance && (
                <ParameterSlider
                  label="Color enhancement"
                  value={options.colorLevel ?? 50}
                  min={0}
                  max={100}
                  disabled={busy}
                  onChange={(value) => onOptionsChange(activeItem.id, { ...options, colorLevel: value, colorEnhance: value !== 50 } as EnhancementOptions)}
                  info="Enhances color richness, vibrancy and overall color balance."
                />
              )}

              {model?.features?.hdrBoost && (
                <ParameterSlider
                  label="HDR"
                  value={options.hdrLevel ?? 50}
                  min={0}
                  max={100}
                  disabled={busy}
                  onChange={(value) => onOptionsChange(activeItem.id, { ...options, hdrLevel: value, hdrBoost: value !== 50 } as EnhancementOptions)}
                  info="Enhances dynamic range, highlights and shadow details."
                />
              )}

              <ParameterSlider
                label="Brightness"
                value={options.brightness ?? 50}
                min={0}
                max={100}
                disabled={busy}
                onChange={(value) => onOptionsChange(activeItem.id, { ...options, brightness: value } as EnhancementOptions)}
                info="Adjusts the overall brightness of the image."
              />

              <ParameterSlider
                label="Contrast"
                value={options.contrast ?? 50}
                min={0}
                max={100}
                disabled={busy}
                onChange={(value) => onOptionsChange(activeItem.id, { ...options, contrast: value } as EnhancementOptions)}
                info="Controls the difference between light and dark areas."
              />
            </div>
          )}
        </div>

        {/* 3. ACTIONS (Upscale & Download Buttons with brand mint color) */}
        <div className="mt-auto pt-4 border-t border-white/[0.08]">
          {hasResult ? (
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => onDownload(activeItem.id, "png")}
                className="
                  flex-1
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#00FF85]
                  px-5
                  py-3.5
                  font-bold
                  text-black
                  text-sm
                  transition-all
                  duration-200
                  hover:bg-[#00E599]
                  hover:shadow-[0_0_28px_rgba(0,255,133,0.45)]
                  active:scale-[0.98]
                "
              >
                <Download className="h-4 w-4" />
                <span>Download Result</span>
              </button>

              <button
                type="button"
                onClick={() => onUpscale(activeItem.id)}
                disabled={busy}
                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.06]
                  px-4
                  py-3.5
                  text-sm
                  font-medium
                  text-white
                  transition-colors
                  hover:bg-white/[0.12]
                  disabled:opacity-30
                "
              >
                Re-enhance
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onUpscale(activeItem.id)}
              disabled={busy}
              className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#00FF85]
                px-5
                py-3.5
                font-bold
                text-black
                text-sm
                transition-all
                duration-200
                hover:bg-[#00E599]
                hover:shadow-[0_0_28px_rgba(0,255,133,0.45)]
                active:scale-[0.98]
                disabled:cursor-wait
                disabled:opacity-40
              "
            >
              <ImageCircleIcon className="h-4 w-4" />
              <span>{busy ? `Enhancing ${activeItem.name}…` : `Upscale ✦ ${options.scale}x`}</span>
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

/* ============================================================
   BEFORE / AFTER SLIDER

   LEFT  = ORIGINAL / OLD
   RIGHT = UPSCALED / NEW

   The images remain exactly the same size.
   Only the visible portion of the original changes.
   ============================================================ */

function BeforeAfterSlider({
  before,
  after,
}: {
  before: string;
  after: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const panStartRef = useRef<{ startX: number; startY: number; initPanX: number; initPanY: number } | null>(null);

  /* ----------------------------------------------------------
     Update slider position
     ---------------------------------------------------------- */
  const updatePosition = (clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    if (!rect.width) return;
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, percentage)));
  };

  /* ----------------------------------------------------------
     Global pointer movement
     ---------------------------------------------------------- */
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (panStartRef.current) {
        const dx = e.clientX - panStartRef.current.startX;
        const dy = e.clientY - panStartRef.current.startY;
        setPan({
          x: panStartRef.current.initPanX + dx,
          y: panStartRef.current.initPanY + dy,
        });
        return;
      }
      if (!draggingRef.current) return;
      updatePosition(e.clientX);
    };

    const handlePointerUp = () => {
      draggingRef.current = false;
      panStartRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  });

  /* ----------------------------------------------------------
     Start dragging / panning
     ---------------------------------------------------------- */
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.shiftKey || e.button === 1 || e.button === 2) {
      panStartRef.current = { startX: e.clientX, startY: e.clientY, initPanX: pan.x, initPanY: pan.y };
      return;
    }
    e.preventDefault();
    draggingRef.current = true;
    updatePosition(e.clientX);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.3 : -0.3;
    setZoom((z) => Math.min(4, Math.max(1, +(z + delta).toFixed(1))));
  };

  /* ----------------------------------------------------------
     Keyboard support
     ---------------------------------------------------------- */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let next = pos;
    switch (e.key) {
      case "ArrowLeft":
        next = Math.max(0, pos - 2);
        break;
      case "ArrowRight":
        next = Math.min(100, pos + 2);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = 100;
        break;
      default:
        return;
    }
    e.preventDefault();
    setPos(next);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onWheel={handleWheel}
      className={`
        relative
        h-full
        w-full
        overflow-hidden
        rounded-xl
        touch-none
        select-none
        ${zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-ew-resize"}
      `}
    >
      {/* =====================================================
          ZOOMABLE WRAPPER
         ===================================================== */}
      <div
        className="relative h-full w-full flex items-center justify-center transition-transform duration-100 ease-out"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          transformOrigin: "center center",
        }}
      >
        {/* NEW / UPSCALED IMAGE */}
        <img
          src={after}
          alt="Enhanced result"
          draggable={false}
          className="block h-full w-full object-contain select-none"
        />

        {/* OLD / ORIGINAL IMAGE */}
        <img
          src={before}
          alt="Original"
          draggable={false}
          className="absolute inset-0 block h-full w-full object-contain select-none"
          style={{
            clipPath: `inset(0 ${100 - pos}% 0 0)`,
          }}
        />

        {/* SLIDER LINE */}
        <div
          className="pointer-events-none absolute inset-y-0 z-20 w-[2px] -translate-x-1/2 bg-white shadow-[0_0_10px_rgba(0,0,0,.5)]"
          style={{
            left: `${pos}%`,
          }}
        >
          {/* HANDLE */}
          <div className="absolute left-1/2 top-1/2 flex h-[48px] w-[48px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[14px] bg-white shadow-[0_8px_30px_rgba(0,0,0,.4)] pointer-events-auto cursor-ew-resize">
            <div className="flex items-center gap-[5px] text-black">
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ORIGINAL LABEL */}
      <div className="pointer-events-none absolute left-3 top-3 z-30 rounded-md bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
        Original
      </div>

      {/* ENHANCED LABEL */}
      <div className="pointer-events-none absolute right-3 top-3 z-30 rounded-md bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
        Enhanced
      </div>

      {/* INTERACTIVE ZOOM CONTROLS (Fit, 2x, 4x) */}
      <div
        className="absolute bottom-3 right-3 z-30 flex items-center gap-1 rounded-xl border border-white/15 bg-black/75 p-1.5 backdrop-blur-md shadow-2xl"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
            zoom === 1 ? "bg-white/20 text-white shadow-sm" : "text-white/60 hover:text-white"
          }`}
          title="Fit to view"
        >
          Fit
        </button>
        <button
          type="button"
          onClick={() => { setZoom(2); }}
          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
            zoom === 2 ? "bg-[#00FF85] text-black font-bold shadow-sm" : "text-white/60 hover:text-white"
          }`}
          title="2× Zoom (Inspect edges)"
        >
          2× Zoom
        </button>
        <button
          type="button"
          onClick={() => { setZoom(4); }}
          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
            zoom === 4 ? "bg-[#00FF85] text-black font-bold shadow-sm" : "text-white/60 hover:text-white"
          }`}
          title="4× Zoom (Pixel-level detail)"
        >
          4× Zoom
        </button>
      </div>

      {/* =====================================================
          ACCESSIBLE SLIDER

          Invisible interaction layer over divider.
         ===================================================== */}

      <div
        role="slider"
        aria-label="Before and after comparison"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="
          absolute
          inset-y-0
          z-40
          w-4
          -translate-x-1/2
          outline-none
        "
        style={{
          left: `${pos}%`,
        }}
      />
    </div>
  );
}

/* ============================================================
   RANGE CONTROL

   Kept here for compatibility with the existing workspace.
   The advanced settings currently use ParameterSlider instead.
   ============================================================ */

function RangeControl({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-white/70">
        <div>{label}</div>

        <div className="font-semibold">
          {value}
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) =>
          onChange(
            Number(e.target.value)
          )
        }
        className="
          mt-2
          w-full
          accent-[#C7FF00]
        "
      />
    </div>
  );
}

/* ============================================================
   TOGGLE

   Kept for compatibility with existing code.
   ============================================================ */

function ToggleRow({
  label,
  enabled,
  onClick,
  disabled,
}: {
  label: string;
  enabled: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-white/80">
        {label}
      </div>

      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-pressed={enabled}
        className={`
          h-7
          w-12
          rounded-full
          p-1
          transition-all

          ${
            enabled
              ? "bg-[#C7FF00]"
              : "bg-white/[0.06]"
          }

          disabled:opacity-30
        `}
      >
        <div
          className={`
            h-5
            w-5
            rounded-full
            bg-black
            transition-transform
            duration-200

            ${
              enabled
                ? "translate-x-5"
                : "translate-x-0"
            }
          `}
        />
      </button>
    </div>
  );
}

/* ============================================================
   UPLOAD STRIP
   ============================================================ */

interface UploadStripProps {
  items: UpscaleItem[];
  selectedId: string;
  onSelectId: (id: string) => void;
  onRemoveId: (id: string) => void;
  onAddFile: (file: File) => void;
}

function UploadStrip({
  items,
  selectedId,
  onSelectId,
  onRemoveId,
  onAddFile,
}: UploadStripProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* ----------------------------------------------------------
     Open file picker
     ---------------------------------------------------------- */
  const handleClick = () => {
    inputRef.current?.click();
  };

  /* ----------------------------------------------------------
     New file(s)
     ---------------------------------------------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        onAddFile(files[i]);
      }
    }
    e.target.value = "";
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      {/* FILE INPUT */}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        onChange={handleChange}
        className="hidden"
      />

      <div className="flex items-center justify-center gap-3 px-4 py-1.5 max-w-full overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0c0c10]/70 backdrop-blur-xl shadow-lg">
        {/* ==================================================
            ADD BUTTON - Stays still in the middle / anchor
           ================================================== */}
        <button
          type="button"
          onClick={handleClick}
          title="Add another image"
          className="
            flex
            h-[68px]
            w-[68px]
            shrink-0
            flex-col
            items-center
            justify-center
            rounded-xl
            border
            border-dashed
            border-white/20
            bg-white/[0.03]
            text-white/70
            transition-all
            hover:border-[#00FF85]
            hover:bg-[#00FF85]/10
            hover:text-[#00FF85]
            hover:scale-[1.03]
            cursor-pointer
            group
          "
        >
          <span className="text-2xl leading-none font-light group-hover:scale-110 transition-transform">
            +
          </span>
          <span className="mt-1 text-[10.5px] font-bold tracking-wider uppercase">
            Add
          </span>
        </button>

        {/* ==================================================
            THUMBNAILS
           ================================================== */}
        {items.length > 0 && (
          <div className="flex items-center gap-2.5 py-1 overflow-x-auto px-2 ">
            {items.map((item) => {
              const isSelected = item.id === selectedId;
              const isProcessing = item.status === "processing";
              const isCompleted = item.status === "completed";
              const isError = item.status === "error";

              return (
                <div key={item.id} className="relative shrink-0 group">
                  <div
                    onClick={() => onSelectId(item.id)}
                    className={`
                      relative
                      h-[68px]
                      w-[68px]
                      cursor-pointer
                      rounded-xl
                      overflow-hidden
                      transition-all
                      ${
                        isSelected
                          ? "border-2 border-[#00FF85] shadow-[0_0_14px_rgba(0,255,133,0.35)] scale-[1.02]"
                          : "border border-white/10 opacity-70 hover:opacity-100 hover:border-white/30"
                      }
                    `}
                  >
                    <img
                      src={item.url}
                      className="h-full w-full object-cover select-none bg-[repeating-conic-gradient(#1a1a20_0%_25%,#121216_0%_50%)] [background-size:12px_12px]"
                      alt={item.name}
                      draggable={false}
                    />

                    {/* PROCESSING BADGE / SPINNER */}
                    {isProcessing && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 backdrop-blur-[1px]">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#00FF85]/30 border-t-[#00FF85]" />
                        <span className="mt-1 text-[8px] font-bold text-[#00FF85] tracking-wider uppercase">
                          AI
                        </span>
                      </div>
                    )}

                    {/* COMPLETED BADGE */}
                    {isCompleted && (
                      <div className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#00FF85] text-black shadow-md">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                    )}

                    {/* ERROR BADGE */}
                    {isError && (
                      <div className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white font-bold text-[9px] shadow-md">
                        !
                      </div>
                    )}
                  </div>

                  {/* REMOVE BUTTON */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveId(item.id);
                    }}
                    className="
                      absolute
                      -right-1.5
                      -top-1.5
                      flex
                      h-5
                      w-5
                      items-center
                      justify-center
                      rounded-full
                      bg-black/90
                      border border-white/20
                      text-xs
                      text-white/80
                      opacity-0
                      group-hover:opacity-100
                      transition-all
                      hover:bg-red-500
                      hover:text-white
                      z-10
                    "
                    aria-label={`Remove ${item.name}`}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}