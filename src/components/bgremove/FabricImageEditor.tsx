import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, FabricImage, Line, Rect, controlsUtils } from 'fabric';
import { Check, FlipHorizontal, FlipVertical, RotateCcw, X } from 'lucide-react';

export type FabricEditMode = 'transform' | 'crop';
export type FabricCropRatio = 'free' | '1:1' | '4:5' | '16:9' | '9:16';

interface FabricImageEditorProps {
  imageUrl: string;
  mode: FabricEditMode;
  cropRatio: FabricCropRatio;
  initialScale: number;
  initialRotation: number;
  initialPosition: { x: number; y: number };
  onCropRatioChange: (ratio: FabricCropRatio) => void;
  onApply: (blob: Blob) => void;
  onCancel: () => void;
}

const STAGE_MAX_WIDTH = 760;
const STAGE_MAX_HEIGHT = 500;

export default function FabricImageEditor({
  imageUrl,
  mode,
  cropRatio,
  initialScale,
  initialRotation,
  initialPosition,
  onCropRatioChange,
  onApply,
  onCancel,
}: FabricImageEditorProps) {
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const imageRef = useRef<FabricImage | null>(null);
  const cropRef = useRef<Rect | null>(null);
  const cropMasksRef = useRef<Rect[]>([]);
  const verticalGuideRef = useRef<Line | null>(null);
  const horizontalGuideRef = useRef<Line | null>(null);
  const naturalSizeRef = useRef({ width: 0, height: 0 });
  const ratioRef = useRef(cropRatio);
  const onCancelRef = useRef(onCancel);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cropZoom, setCropZoom] = useState(100);
  const [guides, setGuides] = useState({ x: false, y: false });
  const [cropTarget, setCropTarget] = useState<'frame' | 'image'>('frame');
  const cropTargetRef = useRef<'frame' | 'image'>('frame');
  const cropPanRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    ratioRef.current = cropRatio;
  }, [cropRatio]);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    const canvasElement = canvasElementRef.current;
    if (!canvasElement) return;
    let disposed = false;
    setReady(false);

    const fabric = new FabricCanvas(canvasElement, {
      width: 1,
      height: 1,
      selection: false,
      preserveObjectStacking: true,
      enablePointerEvents: true,
      stopContextMenu: true,
      backgroundColor: 'transparent',
    });
    fabricRef.current = fabric;

    FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' }).then((image) => {
      if (disposed) {
        image.dispose();
        return;
      }

      const naturalWidth = image.width || 1;
      const naturalHeight = image.height || 1;
      const fit = Math.min(STAGE_MAX_WIDTH / naturalWidth, STAGE_MAX_HEIGHT / naturalHeight, 1);
      const width = Math.max(1, Math.round(naturalWidth * fit));
      const height = Math.max(1, Math.round(naturalHeight * fit));
      naturalSizeRef.current = { width: naturalWidth, height: naturalHeight };
      fabric.setDimensions({ width, height });
      fabric.set({ selection: false });
      image.set({
        originX: 'center',
        originY: 'center',
        left: width / 2 + initialPosition.x * fit,
        top: height / 2 + initialPosition.y * fit,
        scaleX: fit * initialScale,
        scaleY: fit * initialScale,
        angle: initialRotation,
        lockUniScaling: true,
        snapAngle: 45,
        snapThreshold: 6,
        cornerStyle: 'circle',
        cornerColor: '#00C86A',
        cornerStrokeColor: '#ffffff',
        transparentCorners: false,
        cornerSize: 14,
        touchCornerSize: 28,
        borderColor: '#00C86A',
        borderDashArray: [5, 4],
        padding: 8,
        objectCaching: false,
      });
      image.controls.mtr.offsetY = -30;
      image.controls.mtr.actionHandler = controlsUtils.rotationWithSnapping;
      fabric.add(image);
      imageRef.current = image;

      const guideOptions = {
        stroke: '#00C86A',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        excludeFromExport: true,
      };
      const verticalGuide = new Line([width / 2, 0, width / 2, height], { ...guideOptions, visible: false });
      const horizontalGuide = new Line([0, height / 2, width, height / 2], { ...guideOptions, visible: false });
      fabric.add(verticalGuide, horizontalGuide);
      verticalGuideRef.current = verticalGuide;
      horizontalGuideRef.current = horizontalGuide;

      if (mode === 'crop') {
        createCropFrame(fabric, width, height, ratioRef.current);
        fabric.on('mouse:down', ({ e }) => {
          if (cropTargetRef.current !== 'image') return;
          const pointer = fabric.getPointer(e);
          cropPanRef.current = { x: pointer.x, y: pointer.y };
        });
        fabric.on('mouse:move', ({ e }) => {
          if (cropTargetRef.current !== 'image' || !cropPanRef.current || !imageRef.current) return;
          const pointer = fabric.getPointer(e);
          const image = imageRef.current;
          image.set({ left: (image.left || 0) + pointer.x - cropPanRef.current.x, top: (image.top || 0) + pointer.y - cropPanRef.current.y });
          image.setCoords();
          cropPanRef.current = { x: pointer.x, y: pointer.y };
          fabric.requestRenderAll();
        });
        fabric.on('mouse:up', () => { cropPanRef.current = null; });
      } else {
        fabric.setActiveObject(image);
      }

      const updateGuides = () => {
        const activeImage = imageRef.current;
        if (!activeImage || mode !== 'transform') return;
        const center = activeImage.getCenterPoint();
        const rect = activeImage.getBoundingRect();
        const epsilon = 7;
        const xSnaps = [
          { delta: width / 2 - center.x, active: Math.abs(width / 2 - center.x) <= epsilon },
          { delta: -rect.left, active: Math.abs(rect.left) <= epsilon },
          { delta: width - (rect.left + rect.width), active: Math.abs(width - (rect.left + rect.width)) <= epsilon },
        ].filter((snap) => snap.active).sort((a, b) => Math.abs(a.delta) - Math.abs(b.delta));
        const ySnaps = [
          { delta: height / 2 - center.y, active: Math.abs(height / 2 - center.y) <= epsilon },
          { delta: -rect.top, active: Math.abs(rect.top) <= epsilon },
          { delta: height - (rect.top + rect.height), active: Math.abs(height - (rect.top + rect.height)) <= epsilon },
        ].filter((snap) => snap.active).sort((a, b) => Math.abs(a.delta) - Math.abs(b.delta));
        const deltaX = xSnaps[0]?.delta || 0;
        const deltaY = ySnaps[0]?.delta || 0;
        activeImage.set({ left: (activeImage.left || 0) + deltaX, top: (activeImage.top || 0) + deltaY });
        activeImage.setCoords();
        const showX = xSnaps.length > 0;
        const showY = ySnaps.length > 0;
        const snappedBounds = activeImage.getBoundingRect();
        const snappedCenter = activeImage.getCenterPoint();
        const xGuide = Math.abs(snappedCenter.x - width / 2) <= epsilon ? width / 2 : Math.abs(snappedBounds.left) <= epsilon ? 0 : width;
        const yGuide = Math.abs(snappedCenter.y - height / 2) <= epsilon ? height / 2 : Math.abs(snappedBounds.top) <= epsilon ? 0 : height;
        verticalGuideRef.current?.set({ x1: xGuide, x2: xGuide, visible: showX });
        horizontalGuideRef.current?.set({ y1: yGuide, y2: yGuide, visible: showY });
        setGuides({ x: showX, y: showY });
        fabric.requestRenderAll();
      };
      const hideGuides = () => {
        verticalGuideRef.current?.set({ visible: false });
        horizontalGuideRef.current?.set({ visible: false });
        setGuides({ x: false, y: false });
        fabric.requestRenderAll();
      };
      fabric.on('object:moving', updateGuides);
      fabric.on('object:modified', hideGuides);
      fabric.on('mouse:up', hideGuides);
      fabric.requestRenderAll();
      setReady(true);
      setCropTarget('frame');
    }).catch((error: unknown) => {
      console.error('Could not initialize Fabric editor:', error);
      onCancelRef.current();
    });

    const moveWithKeyboard = (event: KeyboardEvent) => {
      if (mode !== 'transform' || !imageRef.current || event.altKey || event.ctrlKey || event.metaKey) return;
        const target = event.target;
        if (target instanceof HTMLElement && target.closest('button, input, select, textarea, [contenteditable="true"]')) return;
      const deltas: Record<string, [number, number]> = {
        ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1],
      };
      const delta = deltas[event.key];
      if (!delta) return;
      event.preventDefault();
      const step = event.shiftKey ? 10 : 1;
      imageRef.current.set({
        left: (imageRef.current.left || 0) + delta[0] * step,
        top: (imageRef.current.top || 0) + delta[1] * step,
      });
      imageRef.current.setCoords();
      fabric.requestRenderAll();
    };
    window.addEventListener('keydown', moveWithKeyboard);

    return () => {
      disposed = true;
      window.removeEventListener('keydown', moveWithKeyboard);
      fabric.dispose();
      fabricRef.current = null;
      imageRef.current = null;
      cropRef.current = null;
      cropMasksRef.current = [];
      cropPanRef.current = null;
      verticalGuideRef.current = null;
      horizontalGuideRef.current = null;
    };
  }, [imageUrl, mode, initialScale, initialRotation, initialPosition]);

  useEffect(() => {
    const fabric = fabricRef.current;
    if (!fabric || !ready || mode !== 'crop') return;
    createCropFrame(fabric, fabric.getWidth(), fabric.getHeight(), cropRatio);
    if (cropTarget === 'image') selectCropImage();
  }, [cropRatio, mode, ready]);

  function createCropFrame(fabric: FabricCanvas, width: number, height: number, ratio: FabricCropRatio) {
    const frame = cropRef.current;
    if (frame) fabric.remove(frame);
    cropMasksRef.current.forEach((mask) => fabric.remove(mask));
    cropMasksRef.current = [];

    const targetRatio = ratio === 'free' ? width / height : ratioValue(ratio);
    let frameWidth = width * 0.84;
    let frameHeight = frameWidth / targetRatio;
    if (frameHeight > height * 0.84) {
      frameHeight = height * 0.84;
      frameWidth = frameHeight * targetRatio;
    }

    const crop = new Rect({
      left: (width - frameWidth) / 2,
      top: (height - frameHeight) / 2,
      width: frameWidth,
      height: frameHeight,
      fill: 'rgba(255,255,255,0.015)',
      stroke: '#ffffff',
      strokeWidth: 1.5,
      strokeDashArray: [7, 5],
      cornerStyle: 'rect',
      cornerColor: '#00C86A',
      cornerStrokeColor: '#ffffff',
      transparentCorners: false,
      cornerSize: 12,
      touchCornerSize: 28,
      borderColor: '#00C86A',
      padding: 0,
      lockRotation: true,
      lockUniScaling: ratio !== 'free',
      hasRotatingPoint: false,
      objectCaching: false,
      excludeFromExport: true,
      selectable: true,
      evented: true,
    });

    const verticalEdgeHandler = ratio === 'free' ? controlsUtils.scalingX : controlsUtils.scalingEqually;
    const horizontalEdgeHandler = ratio === 'free' ? controlsUtils.scalingY : controlsUtils.scalingEqually;
    crop.controls.ml.actionHandler = controlsUtils.wrapWithFixedAnchor(verticalEdgeHandler);
    crop.controls.mr.actionHandler = controlsUtils.wrapWithFixedAnchor(verticalEdgeHandler);
    crop.controls.mt.actionHandler = controlsUtils.wrapWithFixedAnchor(horizontalEdgeHandler);
    crop.controls.mb.actionHandler = controlsUtils.wrapWithFixedAnchor(horizontalEdgeHandler);

    fabric.add(crop);
    cropRef.current = crop;

    const maskOptions = {
      fill: 'rgba(0,0,0,0.56)',
      selectable: false,
      evented: false,
      excludeFromExport: true,
      objectCaching: false,
    };
    cropMasksRef.current = Array.from({ length: 4 }, () => new Rect({ ...maskOptions, width: 0, height: 0 }));
    cropMasksRef.current.forEach((mask) => fabric.add(mask));
    const updateCropMasks = () => {
      const bounds = crop.getBoundingRect();
      const maskRects = [
        { left: 0, top: 0, width, height: Math.max(0, bounds.top) },
        { left: 0, top: bounds.top + bounds.height, width, height: Math.max(0, height - bounds.top - bounds.height) },
        { left: 0, top: bounds.top, width: Math.max(0, bounds.left), height: bounds.height },
        { left: bounds.left + bounds.width, top: bounds.top, width: Math.max(0, width - bounds.left - bounds.width), height: bounds.height },
      ];
      cropMasksRef.current.forEach((mask, index) => {
        mask.set(maskRects[index]);
        mask.setCoords();
      });
      cropMasksRef.current.forEach((mask) => fabric.sendObjectToBack(mask));
      if (imageRef.current) fabric.sendObjectToBack(imageRef.current);
      fabric.bringObjectToFront(crop);
      cropMasksRef.current.forEach((mask) => fabric.bringObjectToFront(mask));
      fabric.bringObjectToFront(crop);
    };
    crop.on('moving', updateCropMasks);
    crop.on('scaling', updateCropMasks);
    updateCropMasks();
    setCropTarget('frame');
    cropTargetRef.current = 'frame';
    fabric.setActiveObject(crop);
    fabric.requestRenderAll();
  }

  function selectCropImage() {
    const fabric = fabricRef.current;
    const image = imageRef.current;
    if (!fabric || !image) return;
    cropRef.current?.set({ selectable: false, evented: false });
    image.set({ selectable: false, evented: false, hasControls: false, lockScalingX: true, lockScalingY: true });
    cropMasksRef.current.forEach((mask) => mask.set({ evented: false }));
    fabric.setActiveObject(image);
    setCropTarget('image');
    cropTargetRef.current = 'image';
    fabric.requestRenderAll();
  }

  function selectCropFrame() {
    const fabric = fabricRef.current;
    const frame = cropRef.current;
    const image = imageRef.current;
    if (!fabric || !frame || !image) return;
    image.set({ selectable: false, evented: false, hasControls: false });
    frame.set({ selectable: true, evented: true });
    cropMasksRef.current.forEach((mask) => mask.set({ selectable: false, evented: false }));
    cropMasksRef.current.forEach((mask) => fabric.sendObjectToBack(mask));
    fabric.sendObjectToBack(image);
    fabric.bringObjectToFront(frame);
    fabric.setActiveObject(frame);
    setCropTarget('frame');
    cropTargetRef.current = 'frame';
    fabric.requestRenderAll();
  }

  function ratioValue(ratio: FabricCropRatio) {
    if (ratio === 'free') return 1;
    const [width, height] = ratio.split(':').map(Number);
    return width / height;
  }

  function applyCropZoom(zoom: number) {
    const image = imageRef.current;
    const fabric = fabricRef.current;
    if (!image || !fabric) return;
    const center = image.getCenterPoint();
    const scale = image.scaleX || 1;
    const multiplier = zoom / cropZoom;
    const cropBounds = cropRef.current?.getBoundingRect();
    const anchor = cropBounds
      ? { x: cropBounds.left + cropBounds.width / 2, y: cropBounds.top + cropBounds.height / 2 }
      : { x: fabric.getWidth() / 2, y: fabric.getHeight() / 2 };
    image.set({
      left: anchor.x + (center.x - anchor.x) * multiplier,
      top: anchor.y + (center.y - anchor.y) * multiplier,
      scaleX: scale * multiplier,
      scaleY: scale * multiplier,
    });
    image.setCoords();
    fabric.requestRenderAll();
    setCropZoom(zoom);
  }

  async function apply() {
    const fabric = fabricRef.current;
    const image = imageRef.current;
    if (!fabric || !image) return;
    setBusy(true);

    try {
      let output: HTMLCanvasElement;
      if (mode === 'crop' && cropRef.current) {
        const bounds = cropRef.current.getBoundingRect();
        const multiplier = naturalSizeRef.current.width / fabric.getWidth();
        output = fabric.toCanvasElement(multiplier, {
          left: bounds.left,
          top: bounds.top,
          width: bounds.width,
          height: bounds.height,
          filter: (object) => object === image,
        });
        fabric.setActiveObject(cropRef.current);
        fabric.requestRenderAll();
      } else {
        const { width } = naturalSizeRef.current;
        output = fabric.toCanvasElement(width / fabric.getWidth(), { filter: (object) => object === image });
        cropMasksRef.current = [];
      }

      const blob = await new Promise<Blob>((resolve, reject) => {
        output.toBlob((value) => value ? resolve(value) : reject(new Error('Could not render image edit')), 'image/png');
      });
      onApply(blob);
    } catch (error) {
      console.error('Could not apply Fabric edit:', error);
    } finally {
      setBusy(false);
    }
  }

  function flip(axis: 'x' | 'y') {
    const image = imageRef.current;
    const fabric = fabricRef.current;
    if (!image || !fabric) return;
    image.set(axis === 'x' ? 'flipX' : 'flipY', !(axis === 'x' ? image.flipX : image.flipY));
    image.setCoords();
    fabric.requestRenderAll();
  }

  function resetTransform() {
    const fabric = fabricRef.current;
    const image = imageRef.current;
    if (!fabric || !image) return;
    const { width, height } = naturalSizeRef.current;
    const fit = Math.min(fabric.getWidth() / width, fabric.getHeight() / height);
    image.set({
      left: fabric.getWidth() / 2,
      top: fabric.getHeight() / 2,
      scaleX: fit,
      scaleY: fit,
      angle: 0,
      flipX: false,
      flipY: false,
    });
    image.setCoords();
    fabric.requestRenderAll();
  }

  const canvasWidth = fabricRef.current?.getWidth() || STAGE_MAX_WIDTH;
  const canvasHeight = fabricRef.current?.getHeight() || STAGE_MAX_HEIGHT;

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="relative flex min-h-[320px] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#101218] p-3 sm:min-h-[400px]">
        <canvas
          ref={canvasElementRef}
          className="max-h-[500px] max-w-full touch-none"
          style={{ width: `min(100%, ${canvasWidth}px)`, height: 'auto' }}
          aria-label={mode === 'crop' ? 'Crop image with Fabric controls' : 'Transform image with Fabric controls'}
        />
        {mode === 'transform' && ready && (guides.x || guides.y) && <span className="pointer-events-none absolute right-3 top-3 z-10 rounded bg-black/70 px-2 py-1 text-[10px] font-bold text-[#00C86A]">Aligned</span>}
        {!ready && <span className="absolute text-xs font-semibold text-white/55">Preparing editor…</span>}
      </div>

      {mode === 'crop' && (
        <div className="flex w-full flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <div className="flex gap-1 rounded-lg bg-black/25 p-1">
            <button type="button" onClick={selectCropFrame} aria-pressed={cropTarget === 'frame'} className={`rounded-md px-2.5 py-1.5 text-[11px] font-bold ${cropTarget === 'frame' ? 'bg-white text-slate-900' : 'text-white/55 hover:text-white'}`}>Crop frame</button>
            <button type="button" onClick={selectCropImage} aria-pressed={cropTarget === 'image'} className={`rounded-md px-2.5 py-1.5 text-[11px] font-bold ${cropTarget === 'image' ? 'bg-white text-slate-900' : 'text-white/55 hover:text-white'}`}>Move image</button>
          </div>
          <label className="flex min-w-36 flex-1 items-center gap-2 text-xs font-semibold text-white/75">
            Crop zoom
            <input type="range" min="50" max="200" value={cropZoom} onChange={(event) => applyCropZoom(Number(event.target.value))} className="min-w-20 flex-1 accent-[#00C86A]" />
            <output className="w-10 text-right font-mono text-[#00C86A]">{cropZoom}%</output>
          </label>
          <div className="flex flex-wrap gap-1 rounded-lg bg-black/25 p-1">
            {(['free', '1:1', '4:5', '16:9', '9:16'] as const).map((ratio) => (
              <button key={ratio} type="button" onClick={() => onCropRatioChange(ratio)} aria-pressed={cropRatio === ratio} className={`rounded-md px-2.5 py-1.5 text-[11px] font-bold ${cropRatio === ratio ? 'bg-white text-slate-900' : 'text-white/55 hover:text-white'}`}>
                {ratio === 'free' ? 'Free' : ratio}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        {mode === 'transform' ? (
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => flip('x')} title="Flip horizontal" aria-label="Flip horizontal" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"><FlipHorizontal className="h-4 w-4" /></button>
            <button type="button" onClick={() => flip('y')} title="Flip vertical" aria-label="Flip vertical" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"><FlipVertical className="h-4 w-4" /></button>
            <button type="button" onClick={resetTransform} className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/80 hover:bg-white/10"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        ) : <span className="text-[11px] text-white/45">Drag the image to reposition it inside the crop frame</span>}
        <div className="ml-auto flex gap-2">
          <button type="button" onClick={onCancel} disabled={busy} className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/75 hover:bg-white/10 disabled:opacity-50"><X className="h-4 w-4" />Cancel</button>
          <button type="button" onClick={apply} disabled={!ready || busy} className="flex h-9 items-center gap-2 rounded-lg bg-[#00C86A] px-3 text-xs font-bold text-black hover:bg-[#00b860] disabled:opacity-50"><Check className="h-4 w-4" />{busy ? 'Applying…' : mode === 'crop' ? 'Apply crop' : 'Apply transform'}</button>
        </div>
      </div>
    </div>
  );
}