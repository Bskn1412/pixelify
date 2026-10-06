import React, { useEffect } from 'react';
import { X, Home, Eraser, Sparkles } from 'lucide-react';
import type { ViewTab } from '../types';
import Logo from './Logo';
import { EngineRow } from './Navbar';

type Engine = 'webgpu' | 'wasm' | null;

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  /** Live engine of the upscaler's ONNX session (from session EPs) */
  upscalerEngine: Engine;
  /** Live engine reported by the BG remover worker pipeline */
  bgEngine: Engine;
}

const NAV_ITEMS: { tab: ViewTab; label: string; Icon: React.ElementType }[] = [
  { tab: 'home', label: 'Home', Icon: Home },
  { tab: 'bg_remove', label: 'BG Remover', Icon: Eraser },
  { tab: 'upscaler', label: 'AI Upscaler', Icon: Sparkles },
];

/**
 * MOBILE NAVIGATION SIDEBAR (replaces the old floating bottom nav on < md).
 * Slides in from the left over a dimmed backdrop; closes on backdrop tap,
 * X button, Escape key or after navigating to a tab.
 */
export default function MobileSidebar({
  open,
  onClose,
  activeTab,
  onTabChange,
  upscalerEngine,
  bgEngine,
}: MobileSidebarProps) {
  // Close on Escape while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] md:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
      {/* DIMMED BACKDROP */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* SLIDING PANEL */}
      <aside className="animate-slide-in-left absolute left-0 top-0 flex h-full w-[290px] max-w-[85vw] flex-col gap-7 overflow-y-auto border-r border-white/10 bg-[#101014]/95 p-5 shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        {/* HEADER: LOGO + CLOSE */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onTabChange('home')}
            className="flex cursor-pointer items-center bg-transparent p-0 transition-transform duration-200 active:scale-95"
            aria-label="Go to home"
          >
            <Logo size="sm" className="origin-left scale-[0.78]" />
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all active:scale-95 hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* NAV LINKS */}
        <nav className="flex flex-col gap-2" aria-label="Mobile sidebar navigation">
          {NAV_ITEMS.map(({ tab, label, Icon }) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-bold transition-all active:scale-[0.98] ${
                  isActive
                    ? 'border-[#00FF85]/30 bg-[#00FF85]/10 text-white shadow-[0_0_18px_rgba(0,255,133,0.12)]'
                    : 'border-white/[0.06] bg-white/[0.03] text-neutral-300 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <Icon size={17} className={isActive ? 'text-[#00FF85]' : 'text-neutral-400'} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* ENGINE STATUS (same info as the desktop settings dropdown) */}
        <div className="mt-auto flex flex-col gap-2 border-t border-white/10 px-1 pt-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Engines
          </span>
          <EngineRow label="AI Upscaler engine" engine={upscalerEngine} />
          <EngineRow label="BG Remover engine" engine={bgEngine} />
        </div>
      </aside>
    </div>
  );
}
