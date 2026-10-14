import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';
import type { BGJob } from '../types';

interface CanvasEditorProps {
  job: BGJob;
  updateJob: (id: string, changes: Partial<BGJob>) => void;
  toast: (type: 'success' | 'error' | 'info', text: string) => void;
  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void;
}

export default function CanvasEditor({ job, updateJob, toast, onHistoryChange }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [tool, setTool] = useState<'erase' | 'restore'>('erase');
  const [brush, setBrush] = useState(42);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);
  const [dirty, setDirty] = useState(false);
  const [cursor, setCursor] = useState({ visible: false, x: 0, y: 0 });

  useEffect(() => {
    if (onHistoryChange) {
      onHistoryChange(undoStack.length > 0, redoStack.length > 0);
    }
  }, [undoStack.length, redoStack.length, onHistoryChange]);

  useEffect(() => {
    if (!job?.resultUrl || !canvasRef.current) return;
    let cancelled = false;
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      if (cancelled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const max = 900;
      const scale = Math.min(1, max / Math.max(image.width, image.height));
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const original = new Image();
      original.crossOrigin = 'anonymous';
      original.onload = () => {
        if (cancelled) return;
        const base = document.createElement('canvas');
        base.width = canvas.width;
        base.height = canvas.height;
        const baseCtx = base.getContext('2d');
        if (baseCtx) {
          baseCtx.drawImage(original, 0, 0, base.width, base.height);
          baseRef.current = base;
        }
      };
      original.src = job.sourceUrl;
      setUndoStack([]);
      setRedoStack([]);
      setDirty(false);
    };
    image.src = job.resultUrl;
    return () => {
      cancelled = true;
    };
  }, [job?.id, job?.resultUrl, job?.sourceUrl]);

  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const bounds = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - bounds.left) * (canvas.width / bounds.width),
      y: (event.clientY - bounds.top) * (canvas.height / bounds.height),
    };
  }

  function updateCursor(event: React.PointerEvent<HTMLCanvasElement>) {
    setCursor({ visible: true, x: event.clientX, y: event.clientY });
  }

  function paint(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const { x, y } = point(event);
    const radius = (brush * (canvas.width / canvas.getBoundingClientRect().width)) / 2;
    context.save();
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.clip();

    if (tool === 'erase') {
      context.globalCompositeOperation = 'destination-out';
      context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    } else if (baseRef.current) {
      context.drawImage(baseRef.current, 0, 0);
    }
    context.restore();
  }

  function start(event: React.PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    updateCursor(event);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return;
    setUndoStack((stack) => [...stack.slice(-14), context.getImageData(0, 0, canvas.width, canvas.height)]);
    setRedoStack([]);
    drawingRef.current = true;
    paint(event);
  }

  function finish() {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    setDirty(true);
  }

  function saveEdits() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const oldUrl = job.resultUrl;
      updateJob(job.id, { resultBlob: blob, resultUrl: url });
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      setDirty(false);
      toast('success', 'Edits saved.');
    }, 'image/png');
  }

  function snapshot(): ImageData | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d', { willReadFrequently: true })?.getImageData(0, 0, canvas.width, canvas.height) ?? null;
  }

  function undo() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const previous = undoStack[undoStack.length - 1];
    if (!previous) return;
    setUndoStack((stack) => stack.slice(0, -1));
    const snap = snapshot();
    if (snap) setRedoStack((stack) => [...stack, snap]);
    canvas.getContext('2d')?.putImageData(previous, 0, 0);
    setDirty(true);
  }

  function redo() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const next = redoStack[redoStack.length - 1];
    if (!next) return;
    setRedoStack((stack) => stack.slice(0, -1));
    const snap = snapshot();
    if (snap) setUndoStack((stack) => [...stack, snap]);
    canvas.getContext('2d')?.putImageData(next, 0, 0);
    setDirty(true);
  }

  return (
    <>
      <section className="bg-[#0A0A0E]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00FF85] bg-[#00FF85]/10 px-2.5 py-0.5 rounded-full border border-[#00FF85]/30">
              Refinement Studio
            </span>
            <h3 className="text-xl font-black text-white tracking-tight mt-1">
              Interactive Erase & Restore Brush
            </h3>
          </div>

          <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/10 shadow-inner">
            <button
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                tool === 'erase'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                  : 'text-muted hover:text-white'
              }`}
              onClick={() => setTool('erase')}
            >
              <span>✂</span> Erase Area
            </button>
            <button
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                tool === 'restore'
                  ? 'bg-[#00FF85] text-black shadow-[0_0_15px_rgba(0,255,133,0.3)]'
                  : 'text-muted hover:text-white'
              }`}
              onClick={() => setTool('restore')}
            >
              <span>✦</span> Restore Subject
            </button>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 flex items-center justify-center p-4 min-h-[360px]">
          <canvas
            ref={canvasRef}
            className="cursor-crosshair max-w-full max-h-[600px] rounded-xl shadow-2xl object-contain"
            onPointerDown={start}
            onPointerEnter={updateCursor}
            onPointerMove={(event) => {
              updateCursor(event);
              if (drawingRef.current) paint(event);
            }}
            onPointerUp={finish}
            onPointerCancel={finish}
            onPointerLeave={() => !drawingRef.current && setCursor((val) => ({ ...val, visible: false }))}
          />
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-white/10">
          <label className="flex items-center gap-3 text-xs text-neutral-300 font-semibold">
            <span>Brush Size</span>
            <input
              type="range"
              min="10"
              max="140"
              value={brush}
              onChange={(e) => setBrush(Number(e.target.value))}
              className="accent-[#00FF85] cursor-pointer w-32 sm:w-48"
            />
            <span className="px-2.5 py-0.5 rounded bg-black/60 border border-white/10 font-mono text-[#00FF85] text-xs">
              {brush}px
            </span>
          </label>

          <div className="flex items-center gap-3">
            <button
              className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold transition flex items-center gap-1.5"
              disabled={!undoStack.length}
              onClick={undo}
              title="Undo Brush Stroke"
            >
              <Icon name="undo" size={15} /> Undo
            </button>

            <button
              className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold transition flex items-center gap-1.5"
              disabled={!redoStack.length}
              onClick={redo}
              title="Redo Brush Stroke"
            >
              <Icon name="redo" size={15} /> Redo
            </button>

            <button
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#00FF85] to-emerald-400 hover:from-[#00FF85]/90 hover:to-emerald-400/90 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(0,255,133,0.3)] disabled:opacity-40 disabled:pointer-events-none transition"
              disabled={!dirty}
              onClick={saveEdits}
            >
              Save Edits
            </button>
          </div>
        </div>
      </section>

      {createPortal(
        <span
          className={`fixed pointer-events-none rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity z-50 ${
            tool === 'erase'
              ? 'border-rose-400 bg-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
              : 'border-[#00FF85] bg-[#00FF85]/20 shadow-[0_0_10px_rgba(0,255,133,0.4)]'
          } ${cursor.visible ? 'opacity-100' : 'opacity-0'}`}
          style={{ width: brush, height: brush, left: cursor.x, top: cursor.y }}
        />,
        document.body
      )}
    </>
  );
}
