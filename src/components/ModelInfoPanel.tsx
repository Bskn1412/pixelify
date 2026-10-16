import { useState } from 'react';
import { MODELS } from '../constants';
import type { ModelKey } from '../types';

interface ModelInfoPanelProps {
  currentModel: ModelKey;
}

const MODEL_KEYS: ModelKey[] = ['vitality', 'pixel-dance', 'alpha-satoru'];

export default function ModelInfoPanel({ currentModel }: ModelInfoPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-dark hover:text-muted transition-colors mx-auto"
        type="button"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        {open ? 'Hide model details' : 'Compare models'}
      </button>

      {open && (
        <div className="mt-3 animate-slide-up grid grid-cols-1 md:grid-cols-3 gap-3">
          {MODEL_KEYS.map((key) => {
            const m = MODELS[key];
            const isActive = key === currentModel;
            return (
              <div
                key={key}
                className={`
                  rounded-xl border p-4 transition-all duration-300
                  ${isActive
                    ? 'border-accent/40 bg-accent/5 shadow-sm shadow-accent-glow'
                    : 'border-border bg-surface-card'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-white">{m.name}</span>
                  {isActive && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/15 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted leading-relaxed mb-2">{m.description}</p>
                <p className="text-xs text-amber font-medium">{m.recommendation}</p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  <SpecBadge color="teal">{m.badges.quality}</SpecBadge>
                  <SpecBadge color="amber">{m.badges.time}</SpecBadge>
                  <SpecBadge color="coral">{m.badges.req}</SpecBadge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SpecBadge({ color, children }: { color: string; children: React.ReactNode }) {
  const colorClasses: Record<string, string> = {
    teal: 'border-teal/20 text-teal bg-teal/5',
    amber: 'border-amber/20 text-amber bg-amber/5',
    coral: 'border-coral/20 text-coral bg-coral/5',
  };

  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colorClasses[color] || colorClasses.teal}`}>
      {children}
    </span>
  );
}
