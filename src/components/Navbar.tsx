import React, { useState, useRef, useEffect } from 'react';
import type { ViewTab, ThemeMode } from '../types';
import Icon from './Icon';
import Logo from './Logo';

type Engine = 'webgpu' | 'wasm' | null;

interface NavbarProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  /** Live engine of the upscaler's ONNX session (from session EPs) */
  upscalerEngine: Engine;
  /** Live engine reported by the BG remover worker pipeline */
  bgEngine: Engine;
  historyCount?: number;
}

/** Small dynamic engine pill used in the settings dropdown */
function EngineRow({ label, engine }: { label: string; engine: Engine }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="font-semibold text-neutral-400">{label}</span>
      {engine === null ? (
        <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] font-bold text-neutral-500 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
          <span className="h-1 w-1 rounded-full bg-neutral-500 animate-pulse" />
          DETECTING…
        </span>
      ) : engine === 'webgpu' ? (
        <span
          className="font-mono text-[9.5px] font-bold text-[#00FF85] bg-[#00FF85]/10 border border-[#00FF85]/20 px-1.5 py-0.5 rounded"
          title="Hardware-accelerated GPU inference"
        >
          WEBGPU
        </span>
      ) : (
        <span
          className="font-mono text-[9.5px] font-bold text-sky-300 bg-sky-400/10 border border-sky-400/20 px-1.5 py-0.5 rounded"
          title="WebAssembly (CPU) inference — WebGPU was unavailable or failed"
        >
          WASM (CPU)
        </span>
      )}
    </div>
  );
}

export default function Navbar({
  activeTab,
  onTabChange,
  upscalerEngine,
  bgEngine,
  historyCount = 0,
}: NavbarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track scroll position to adjust header elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="sticky top-0 inset-x-0 z-[60] w-full select-none py-3.5 bg-transparent border-none pointer-events-none transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4 relative">

          {/* LOGO (LEFT SIDE: Frosted Glass Capsule with Blur) */}
          <div
            onClick={() => onTabChange('home')}
            className="pointer-events-auto
              h-11
              cursor-pointer
              group
              shrink-0
              flex
              items-center
              bg-transparent
              border-0
              p-0
              shadow-none
              transition-transform
              duration-300
              active:scale-95"
          >
            {/* LOGO — LEFT */}
            <button
              type="button"
              onClick={() => onTabChange("home")}
              className="
                  pointer-events-auto
                  shrink-0
                  h-11
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  bg-transparent
                  border-0
                  outline-none
                  p-0
                  transition-transform
                  duration-200
                  hover:scale-[1.025]
                  active:scale-[0.97]
                "
              aria-label="Go to home"
            >
              <Logo
                size="sm"
                className="
                    origin-left
                    scale-[0.72]
                    sm:scale-[0.78]
                  "
              />
            </button>

          </div>

          {/* DESKTOP CENTERED FLOATING PILL NAV BAR (HIDDEN ON MOBILE < md) */}
          <nav
            aria-label="Desktop Navigation"
            className="pointer-events-auto hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-11 bg-white/10 border border-white/20 rounded-full p-1 items-center gap-1 backdrop-blur-xl shadow-xl"
          >
            <button
              onClick={() => onTabChange('home')}
              className={`h-full px-5 rounded-full text-sm font-bold transition-all duration-300 flex items-center justify-center whitespace-nowrap ${
                activeTab === 'home'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-300 hover:text-white font-medium'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onTabChange('bg_remove')}
              className={`h-full px-5 rounded-full text-sm font-bold transition-all duration-300 flex items-center justify-center whitespace-nowrap ${
                activeTab === 'bg_remove'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-300 hover:text-white font-medium'
              }`}
            >
              BG Remover
            </button>

            <button
              onClick={() => onTabChange('upscaler')}
              className={`h-full px-5 rounded-full text-sm font-bold transition-all duration-300 flex items-center justify-center whitespace-nowrap ${
                activeTab === 'upscaler'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-300 hover:text-white font-medium'
              }`}
            >
              AI Upscaler
            </button>
          </nav>

          {/* SETTINGS GEAR ICON BUTTON (RIGHT SIDE) */}
          <div className="pointer-events-auto relative ml-auto" ref={settingsRef}>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xl text-white flex items-center justify-center transition-all shadow-xl active:scale-95"
              title="Settings & Preferences"
              aria-label="Settings and Preferences"
            >
              <Icon name="settings" size={19} />
            </button>

            {/* SETTINGS DROPDOWN MENU */}
            {isSettingsOpen && (
              <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-[#121218] border border-white/15 p-3.5 shadow-2xl z-50 animate-fade-in flex flex-col gap-3">
                <div className="px-1 py-0.5 border-b border-white/10 flex flex-col gap-1.5 text-xs font-bold text-white pb-2">
                  <span>Settings & Preferences</span>
                  <EngineRow label="AI Upscaler engine" engine={upscalerEngine} />
                  <EngineRow label="BG Remover engine" engine={bgEngine} />
                </div>

                {/* LOCAL HISTORY */}
                <button
                  onClick={() => {
                    onTabChange('history');
                    setIsSettingsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Icon name="history" size={16} className="text-[#00FF85]" />
                    <span>History</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#00FF85]/20 text-[#00FF85] text-[10px] font-bold font-mono">
                    {historyCount} items
                  </span>
                </button>

              </div>
            )}
          </div>

        </div>
      </header>

      {/* MOBILE FLOATING BOTTOM NAV BAR (STICKY/FIXED, VISIBLE ON < md ONLY) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden pointer-events-auto fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] h-12 bg-[#121218]/90 border border-white/20 rounded-full p-1.5 flex items-center gap-1 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.75)] max-w-[calc(100vw-24px)] transition-all duration-300"
      >
        <button
          onClick={() => onTabChange('home')}
          className={`h-full px-3.5 sm:px-4 rounded-full text-xs font-bold transition-all duration-300 flex items-center justify-center whitespace-nowrap active:scale-95 ${
            activeTab === 'home'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-300 hover:text-white font-medium'
          }`}
        >
          Home
        </button>

        <button
          onClick={() => onTabChange('bg_remove')}
          className={`h-full px-3.5 sm:px-4 rounded-full text-xs font-bold transition-all duration-300 flex items-center justify-center whitespace-nowrap active:scale-95 ${
            activeTab === 'bg_remove'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-300 hover:text-white font-medium'
          }`}
        >
          BG Remover
        </button>

        <button
          onClick={() => onTabChange('upscaler')}
          className={`h-full px-3.5 sm:px-4 rounded-full text-xs font-bold transition-all duration-300 flex items-center justify-center whitespace-nowrap active:scale-95 ${
            activeTab === 'upscaler'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-300 hover:text-white font-medium'
          }`}
        >
          AI Upscaler
        </button>
      </nav>
    </>
  );
}
