import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Canvas as FabricCanvas, FabricImage, Line, Rect, controlsUtils } from 'fabric';

export type FabricEditMode = 'transform' | 'crop';
export type FabricCropRatio = 'free' | '1:1' | '4:5' | '16:9' | '9:16';

export interface SubjectTransform {
  relX: number; // Normalized offset from artboard center (-0.5 to 0.5)
  relY: number; // Normalized offset from artboard center (-0.5 to 0.5)
  scale: number; // Scale multiplier (1 = default fit size)
  rotation: number; // Angle in degrees (-180 to 180)
  flipX: boolean;
  flipY: boolean;
}

export const DEFAULT_SUBJECT_TRANSFORM: SubjectTransform = {
  relX: 0,
  relY: 0,
  scale: 1,
  rotation: 0,
  flipX: false,
  flipY: false,
};

export interface FabricImageEditorHandle {
  flipX: () => void;
  flipY: () => void;
  resetTransform: () => void;
  apply: () => Promise<void> | void;
  cancel: () => void;
  selectCropFrame: () => void;
  selectCropImage: () => void;
  setCropZoom: (zoom: number) => void;
  setRotation: (angle: number) => void;
  getCurrentTransform?: () => SubjectTransform | null;
}

export interface FabricImageEditorProps {
  imageUrl: string;
  artboardWidth?: number;
  artboardHeight?: number;
  naturalArtboardWidth?: number;
  naturalArtboardHeight?: number;
  mode: FabricEditMode;
  cropRatio: FabricCropRatio;
  backgroundStyle?: string;
  customBgColor?: string;
  rotation?: number;
  initialScale?: number;
  initialRotation?: number;
  initialPosition?: { x: number; y: number };
  subjectTransform?: SubjectTransform;
  hasCustomBg?: boolean;
  cropTarget?: 'frame' | 'image';
  cropZoom?: number;
  onCropTargetChange?: (target: 'frame' | 'image') => void;
  onCropZoomChange?: (zoom: number) => void;
  onCropRatioChange?: (ratio: FabricCropRatio) => void;
  onRotationChange?: (angle: number) => void;
  onApplyTransform?: (transform: SubjectTransform) => void;
  onApply: (blob: Blob) => void;
  onCancel: () => void;
}

const STAGE_MAX_WIDTH = 760;
const STAGE_MAX_HEIGHT = 500;

const FabricImageEditor = forwardRef<FabricImageEditorHandle, FabricImageEditorProps>(function FabricImageEditor({
  imageUrl,
  artboardWidth,
  artboardHeight,
  naturalArtboardWidth,
  naturalArtboardHeight,
  mode,
  cropRatio,
  backgroundStyle,
  customBgColor,
  rotation = 0,
  initialScale = 1,
  initialRotation = 0,
  initialPosition = { x: 0, y: 0 },
  subjectTransform,
  hasCustomBg = false,
  cropTarget: controlledCropTarget,
  cropZoom: controlledCropZoom,
  onCropTargetChange,
  onCropZoomChange,
  onCropRatioChange,
  onRotationChange,
  onApplyTransform,
  onApply,
  onCancel,
}, ref) {
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
  const [internalCropZoom, setInternalCropZoom] = useState(100);
  const cropZoom = controlledCropZoom ?? internalCropZoom;
  const [guides, setGuides] = useState({ x: false, y: false });
  const [internalCropTarget, setInternalCropTarget] = useState<'frame' | 'image'>('frame');
  const cropTarget = controlledCropTarget ?? internalCropTarget;
  const cropTargetRef = useRef<'frame' | 'image'>('frame');
  const cropPanRef = useRef<{ x: number; y: number } | null>(null);
  const baseScaleRef = useRef(1);

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

    const width = Math.max(1, Math.round(artboardWidth || STAGE_MAX_WIDTH));
    const height = Math.max(1, Math.round(artboardHeight || STAGE_MAX_HEIGHT));
    naturalSizeRef.current = {
      width: Math.max(1, Math.round(naturalArtboardWidth || width)),
      height: Math.max(1, Math.round(naturalArtboardHeight || height)),
    };

    fabric.setDimensions({ width, height });
    fabric.set({ selection: false });

    FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' }).then((image) => {
      if (disposed) {
        image.dispose();
        return;
      }

      const cutoutWidth = image.width || 1;
      const cutoutHeight = image.height || 1;
      const fitFactor = hasCustomBg ? 0.75 : 1.0;
      const fit = Math.min((width * fitFactor) / cutoutWidth, (height * fitFactor) / cutoutHeight, 1);
      baseScaleRef.current = fit;

      const tf = subjectTransform || DEFAULT_SUBJECT_TRANSFORM;
      const initialX = tf.relX * width;
      const initialY = tf.relY * height;
      const currentScale = fit * tf.scale;
      const initialAngle = tf.rotation || initialRotation || rotation;

      image.set({
        originX: 'center',
        originY: 'center',
        left: width / 2 + initialX,
        top: height / 2 + initialY,
        scaleX: currentScale,
        scaleY: currentScale,
        angle: initialAngle,
        flipX: tf.flipX,
        flipY: tf.flipY,
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
          const currentImg = imageRef.current;
          currentImg.set({ left: (currentImg.left || 0) + pointer.x - cropPanRef.current.x, top: (currentImg.top || 0) + pointer.y - cropPanRef.current.y });
          currentImg.setCoords();
          cropPanRef.current = { x: pointer.x, y: pointer.y };
          fabric.requestRenderAll();
        });
        fabric.on('mouse:up', () => { cropPanRef.current = null; });
      } else {
        fabric.setActiveObject(image);
      }

      fabric.on('object:rotating', () => {
        if (imageRef.current) {
          const currentAngle = Math.round(imageRef.current.angle || 0);
          onRotationChange?.(currentAngle);
        }
      });

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
      setInternalCropTarget('frame');
      cropTargetRef.current = 'frame';
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
  }, [imageUrl, mode, artboardWidth, artboardHeight, naturalArtboardWidth, naturalArtboardHeight]);

  useEffect(() => {
    const fabric = fabricRef.current;
    if (!fabric || !ready || mode !== 'crop') return;
    createCropFrame(fabric, fabric.getWidth(), fabric.getHeight(), cropRatio);
    if (cropTarget === 'image') selectCropImage();
  }, [cropRatio, mode, ready]);

  // Synchronize rotation prop
  useEffect(() => {
    if (typeof rotation === 'number' && imageRef.current && fabricRef.current) {
      if (Math.round(imageRef.current.angle || 0) !== Math.round(rotation)) {
        imageRef.current.set({ angle: rotation });
        imageRef.current.setCoords();
        fabricRef.current.requestRenderAll();
      }
    }
  }, [rotation]);

  // Synchronize controlled crop target
  useEffect(() => {
    if (controlledCropTarget && controlledCropTarget !== cropTargetRef.current) {
      if (controlledCropTarget === 'frame') {
        selectCropFrame();
      } else {
        selectCropImage();
      }
    }
  }, [controlledCropTarget]);

  // Synchronize controlled crop zoom
  useEffect(() => {
    if (typeof controlledCropZoom === 'number' && controlledCropZoom !== internalCropZoom) {
      applyCropZoom(controlledCropZoom);
    }
  }, [controlledCropZoom]);

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
      fill: 'transparent',
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
      fill: 'rgba(0,0,0,0.5)',
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
    setInternalCropTarget('frame');
    cropTargetRef.current = 'frame';
    onCropTargetChange?.('frame');
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
    setInternalCropTarget('image');
    cropTargetRef.current = 'image';
    onCropTargetChange?.('image');
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
    setInternalCropTarget('frame');
    cropTargetRef.current = 'frame';
    onCropTargetChange?.('frame');
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
    const baseScale = baseScaleRef.current || 1;
    const targetScale = baseScale * (zoom / 100);
    const prevScale = image.scaleX || baseScale;
    const scaleRatio = targetScale / (prevScale || 1);
    const cropBounds = cropRef.current?.getBoundingRect();
    const anchor = cropBounds
      ? { x: cropBounds.left + cropBounds.width / 2, y: cropBounds.top + cropBounds.height / 2 }
      : { x: fabric.getWidth() / 2, y: fabric.getHeight() / 2 };

    image.set({
      left: anchor.x + ((image.left || 0) - anchor.x) * scaleRatio,
      top: anchor.y + ((image.top || 0) - anchor.y) * scaleRatio,
      scaleX: targetScale,
      scaleY: targetScale,
    });
    image.setCoords();
    fabric.requestRenderAll();
    setInternalCropZoom(zoom);
    onCropZoomChange?.(zoom);
  }

  async function apply() {
    const fabric = fabricRef.current;
    const image = imageRef.current;
    if (!fabric || !image) return;
    setBusy(true);

    try {
      if (mode === 'crop' && cropRef.current) {
        const bounds = cropRef.current.getBoundingRect();
        const multiplier = naturalSizeRef.current.width / fabric.getWidth();
        const output = fabric.toCanvasElement(multiplier, {
          left: bounds.left,
          top: bounds.top,
          width: bounds.width,
          height: bounds.height,
          filter: (object) => object === image,
        });
        fabric.setActiveObject(cropRef.current);
        fabric.requestRenderAll();

        const blob = await new Promise<Blob>((resolve, reject) => {
          output.toBlob((value) => value ? resolve(value) : reject(new Error('Could not render crop edit')), 'image/png');
        });
        onApply(blob);
      } else {
        const cWidth = fabric.getWidth();
        const cHeight = fabric.getHeight();
        const currentFit = baseScaleRef.current || 1;
        const currentScaleX = Math.abs(image.scaleX || currentFit);
        const newTransform: SubjectTransform = {
          relX: Number((((image.left || 0) - cWidth / 2) / cWidth).toFixed(4)),
          relY: Number((((image.top || 0) - cHeight / 2) / cHeight).toFixed(4)),
          scale: Number((currentScaleX / currentFit).toFixed(3)),
          rotation: Math.round(image.angle || 0),
          flipX: !!image.flipX,
          flipY: !!image.flipY,
        };

        if (onApplyTransform) {
          onApplyTransform(newTransform);
        } else {
          const { width } = naturalSizeRef.current;
          const output = fabric.toCanvasElement(width / fabric.getWidth(), { filter: (object) => object === image });
          cropMasksRef.current = [];
          const blob = await new Promise<Blob>((resolve, reject) => {
            output.toBlob((value) => value ? resolve(value) : reject(new Error('Could not render image edit')), 'image/png');
          });
          onApply(blob);
        }
      }
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
    const cWidth = fabric.getWidth();
    const cHeight = fabric.getHeight();
    const fit = baseScaleRef.current || 1;
    image.set({
      left: cWidth / 2,
      top: cHeight / 2,
      scaleX: fit,
      scaleY: fit,
      angle: 0,
      flipX: false,
      flipY: false,
    });
    image.setCoords();
    fabric.requestRenderAll();
    onRotationChange?.(0);
    onApplyTransform?.(DEFAULT_SUBJECT_TRANSFORM);
  }

  useImperativeHandle(ref, () => ({
    flipX: () => flip('x'),
    flipY: () => flip('y'),
    resetTransform: () => resetTransform(),
    apply: () => apply(),
    cancel: () => onCancelRef.current(),
    selectCropFrame: () => selectCropFrame(),
    selectCropImage: () => selectCropImage(),
    setCropZoom: (z: number) => applyCropZoom(z),
    setRotation: (angle: number) => {
      if (imageRef.current && fabricRef.current) {
        imageRef.current.set({ angle });
        imageRef.current.setCoords();
        fabricRef.current.requestRenderAll();
      }
    },
    getCurrentTransform: () => {
      const img = imageRef.current;
      const fab = fabricRef.current;
      if (!img || !fab) return null;
      const cWidth = fab.getWidth();
      const cHeight = fab.getHeight();
      const fit = baseScaleRef.current || 1;
      return {
        relX: Number((((img.left || 0) - cWidth / 2) / cWidth).toFixed(4)),
        relY: Number((((img.top || 0) - cHeight / 2) / cHeight).toFixed(4)),
        scale: Number((Math.abs(img.scaleX || fit) / fit).toFixed(3)),
        rotation: Math.round(img.angle || 0),
        flipX: !!img.flipX,
        flipY: !!img.flipY,
      };
    },
  }), []);

  const canvasWidth = fabricRef.current?.getWidth() || Math.round(artboardWidth || STAGE_MAX_WIDTH);
  const canvasHeight = fabricRef.current?.getHeight() || Math.round(artboardHeight || STAGE_MAX_HEIGHT);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden select-none">
      <canvas
        ref={canvasElementRef}
        className="touch-none"
        style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
        aria-label={mode === 'crop' ? 'Crop image with Fabric controls' : 'Transform image with Fabric controls'}
      />
      {mode === 'transform' && ready && (guides.x || guides.y) && (
        <span className="pointer-events-none absolute right-3 top-3 z-10 rounded bg-black/70 px-2 py-1 text-[10px] font-bold text-[#00FF85]">
          Aligned
        </span>
      )}
      {!ready && <span className="absolute text-xs font-semibold text-white/55">Preparing editor…</span>}
    </div>
  );
});

export default FabricImageEditor;