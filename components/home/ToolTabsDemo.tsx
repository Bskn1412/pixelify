'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { useTranslation } from '@/locales';

const TOOL_IDS = ['backdrop', 'effects', 'crop', 'design'] as const;
type ToolId = (typeof TOOL_IDS)[number];

/**
 * The four post-cutout tools as one running preview: each tab applies a real
 * change to the same cutout, so the panel switches instead of loading a new
 * screenshot. Auto-advances while in view, pauses the moment you hover or
 * focus it, and is driven as a real tablist: arrow keys, Home and End move
 * between tools, and each tab owns the panel it controls.
 */
export function ToolTabsDemo() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const inView = useInView(ref, { once: false, amount: 0.3 });
  const reduce = useReducedMotion();
  const uid = useId();
  const [active, setActive] = useState<ToolId>('backdrop');
  const [held, setHeld] = useState(false);

  const tools = [
    {
      id: 'backdrop' as const,
      label: t.workflowSection?.toolTabs?.backdrop?.label || 'Backdrop',
      copy: t.workflowSection?.toolTabs?.backdrop?.copy || 'Photo, colour or the blurred original behind the cutout.',
    },
    {
      id: 'effects' as const,
      label: t.workflowSection?.toolTabs?.effects?.label || 'Effects',
      copy: t.workflowSection?.toolTabs?.effects?.copy || 'Drop shadow, edge stroke and exposure on the subject alone.',
    },
    {
      id: 'crop' as const,
      label: t.workflowSection?.toolTabs?.crop?.label || 'Crop',
      copy: t.workflowSection?.toolTabs?.crop?.copy || 'Transform, mirror and lock to a social ratio without re-cutting.',
    },
    {
      id: 'design' as const,
      label: t.workflowSection?.toolTabs?.design?.label || 'Design',
      copy: t.workflowSection?.toolTabs?.design?.copy || 'Headline, sticker and layers export with the image.',
    },
  ];

  useEffect(() => {
    if (!inView || held || reduce) return;
    const timer = window.setInterval(() => {
      setActive((current) => {
        const index = TOOL_IDS.indexOf(current);
        return TOOL_IDS[(index + 1) % TOOL_IDS.length];
      });
    }, 3600);
    return () => window.clearInterval(timer);
  }, [inView, held, reduce]);

  const current = tools.find((tool) => tool.id === active) ?? tools[0];

  const select = useCallback((index: number, focus = false) => {
    const nextId = TOOL_IDS[(index + TOOL_IDS.length) % TOOL_IDS.length];
    setActive(nextId);
    setHeld(true);
    if (focus) tabs.current[(index + TOOL_IDS.length) % TOOL_IDS.length]?.focus();
  }, []);

  return (
    <div
      className="fh-tools-demo"
      ref={ref}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHeld(false);
      }}
    >
      <div
        className={`fh-tools-stage${active === 'crop' ? ' is-cropping' : ''}`}
        data-tab={active}
        aria-labelledby={`${uid}-tab-${active}`}
        aria-describedby={`${uid}-panel`}
      >
        <div className="fh-tools-bg fh-tools-bg--backdrop" aria-hidden="true" />
        <div className="fh-tools-bg fh-tools-bg--effects" aria-hidden="true" />
        <div className="fh-tools-bg fh-tools-bg--crop" aria-hidden="true" />
        <div className="fh-tools-bg fh-tools-bg--design" aria-hidden="true" />
        <img
          className="fh-tools-subject"
          src="/home/results/live-cut-subject.webp"
          alt="A cut out pair of headphones being finished in the Pixelify editor"
          loading="lazy"
        />
        <div className="fh-tools-design" aria-hidden="true">
          <span className="fh-tools-design-line">{t.workflowSection?.toolTabs?.designLine || 'Studio Sound. Pure Focus.'}</span>
          <span className="fh-tools-design-tag">{t.workflowSection?.toolTabs?.designTag || 'Headline · Sticker Layer'}</span>
        </div>
        <div className="fh-tools-sticker" aria-hidden="true">
          <span className="fh-tools-sticker-val">{t.workflowSection?.toolTabs?.stickerVal || '50% OFF'}</span>
          <span className="fh-tools-sticker-label">{t.workflowSection?.toolTabs?.stickerLabel || 'DEAL'}</span>
        </div>
        <span className="fh-tools-crop-frame" aria-hidden="true" />
      </div>

      <div
        className="fh-tools-tabs"
        role="tablist"
        aria-label="Editor tools"
        aria-orientation="horizontal"
        onKeyDown={(event) => {
          const index = TOOL_IDS.indexOf(active);
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            select(index + 1, true);
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            select(index - 1, true);
          } else if (event.key === 'Home') {
            event.preventDefault();
            select(0, true);
          } else if (event.key === 'End') {
            event.preventDefault();
            select(TOOL_IDS.length - 1, true);
          }
        }}
      >
        {tools.map((tool, index) => (
          <button
            key={tool.id}
            ref={(node) => {
              tabs.current[index] = node;
            }}
            id={`${uid}-tab-${tool.id}`}
            type="button"
            role="tab"
            aria-selected={tool.id === active}
            aria-controls={`${uid}-panel`}
            tabIndex={tool.id === active ? 0 : -1}
            className={`fh-tools-tab${tool.id === active ? ' is-active' : ''}`}
            onClick={() => select(index)}
          >
            {tool.label}
          </button>
        ))}
      </div>

      <p
        className="fh-tools-copy"
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${active}`}
        tabIndex={0}
        key={current.id}
      >
        <strong>{current.label}</strong> {current.copy}
      </p>
    </div>
  );
}
