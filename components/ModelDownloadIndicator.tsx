'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Download } from 'lucide-react';
import type { ModelDownloadItem } from '../types';
import { useTranslation } from '@/locales';

/**
 * Navbar download indicator. Rendered only while a model is actually
 * downloading (first-time automatic cache fill or a manual load); once every
 * model is available the icon is not rendered at all. The badge shows how
 * many model downloads remain; clicking opens:
 * - Desktop: the original right-aligned dropdown attached to the indicator button.
 * - Mobile: a centered responsive modal dialog so it doesn't get cut off.
 */
export default function ModelDownloadIndicator({ items }: { items: ModelDownloadItem[] }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Close on click outside (handles desktop dropdown dismissal)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Close on Escape key (desktop and mobile)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Every model just finished: drop the panel with it (icon disappears too).
  useEffect(() => {
    if (!items.length) setOpen(false);
  }, [items.length]);

  if (!items.length) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={`${items.length} AI model${items.length === 1 ? '' : 's'} downloading`}
        aria-label={`Model downloads in progress: ${items.length}`}
        className="relative flex w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xl text-white items-center justify-center transition-all shadow-xl active:scale-95"
      >
        <Download size={19} className="relative text-gray-300" />

        {/* COUNT BADGE: how many model downloads remain */}
        <span
          aria-hidden="true"
          className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full bg-[#00FF85] text-[#052012] text-[10.5px] font-black flex items-center justify-center border border-black/40 shadow-[0_0_10px_rgba(0,255,133,0.45)]"
        >
          {items.length}
        </span>
      </button>

      {open && items.length > 0 && (
        <>
          {/* DESKTOP VIEW (sm: and above): Original right-aligned dropdown */}
          <div
            role="dialog"
            aria-label="Model download progress"
            className="hidden sm:flex absolute right-0 top-full mt-3 w-72 rounded-2xl bg-[#121218] border border-white/15 p-3.5 shadow-2xl z-50 flex-col gap-3 animate-fade-in"
          >
            <div className="px-1 py-0.5 border-b border-white/10 flex items-center justify-between gap-2 text-xs font-bold text-white pb-2">
              <span>{t.modelLoading?.downloadingTitle || "Downloading AI models"}</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] font-bold text-[#00FF85]">
                  {items.length} {t.modelLoading?.leftBadge || "LEFT"}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="text-neutral-400 hover:text-white transition p-0.5 ml-0.5 cursor-pointer"
                >
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 max-h-[60vh] overflow-y-auto pr-0.5">
              {items.map((item) => (
                <div key={item.id} className="px-1 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-neutral-200 truncate pr-2">{item.name}</span>
                    <span className="font-mono text-[10px] font-bold text-[#00FF85]">
                      {item.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#00FF85] to-[#72FFB4]"
                      initial={false}
                      animate={{ width: `${Math.max(2, Math.min(100, item.progress))}%` }}
                      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="px-1 text-[9.5px] leading-relaxed text-neutral-400 border-t border-white/5 pt-2">
              Saved in your browser cache and reused automatically on your next visit.
            </p>
          </div>

          {/* MOBILE VIEW (< sm): Centered responsive modal to prevent cutting off UI */}
          <div className="sm:hidden fixed z-[100] flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop click to dismiss */}
            <div
              className="absolute inset-0"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            <div
              role="dialog"
              aria-modal="true"
              aria-label="Model download progress"
              className="relative w-full max-w-xs rounded-2xl bg-[#121218] border border-white/15 p-4 shadow-2xl z-10 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-1 py-0.5 border-b border-white/10 flex items-center justify-between gap-2 pb-2.5">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Download size={16} className="text-[#00FF85] shrink-0" />
                  <span>{t.modelLoading?.downloadingTitle || "Downloading AI models"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] font-bold text-[#00FF85] bg-[#00FF85]/10 px-2 py-0.5 rounded-full border border-[#00FF85]/20">
                    {items.length} {t.modelLoading?.leftBadge || "LEFT"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="rounded-lg p-1 text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  >
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 max-h-[50vh] overflow-y-auto pr-0.5">
                {items.map((item) => (
                  <div key={item.id} className="px-1 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-200 truncate pr-2">{item.name}</span>
                      <span className="font-mono text-[11px] font-bold text-[#00FF85] shrink-0">
                        {item.progress}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#00FF85] to-[#72FFB4]"
                        initial={false}
                        animate={{ width: `${Math.max(2, Math.min(100, item.progress))}%` }}
                        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="px-1 text-[11px] leading-relaxed text-neutral-400 border-t border-white/5 pt-2">
                Saved in your browser cache and reused automatically on your next visit.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
