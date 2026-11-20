'use client';

import { Boxes, Compass, Cpu, Flame, Smile, Zap, type LucideIcon } from 'lucide-react';
import { RevealGroup, RevealItem } from './Reveal';
import { useTranslation } from '@/locales';

const CUSTOMERS: Array<{
  name: string;
  className: string;
  icon?: LucideIcon;
  imageSrc?: string;
}> = [
  { name: 'ONNX Runtime', className: 'fh-logo-onnx', icon: Boxes },
  { name: 'WebGPU', className: 'fh-logo-webgpu', icon: Cpu },
  { name: 'Hugging Face', className: 'fh-logo-hf', icon: Smile },
  { name: 'LiteRT', className: 'fh-logo-litert', icon: Zap },
  { name: 'Chrome', className: 'fh-logo-chrome', imageSrc: '/chrome.svg' },
  { name: 'Safari', className: 'fh-logo-safari', icon: Compass },
  { name: 'Firefox', className: 'fh-logo-firefox', icon: Flame },
  { name: 'Brave', className: 'fh-logo-brave', imageSrc: '/brave.svg' },
];

/** Monochrome tech logo band, mirroring Framer's two rows of four. */
export function CustomerLogos() {
  const { t } = useTranslation();

  return (
    <section className="fh-logos" aria-label={t.customerLogos?.ariaLabel || 'Pixelify runs on open web technology'}>
      <div className="fh-container">
        <RevealGroup className="fh-logos-grid">
          {CUSTOMERS.map((customer) => {
            const Icon = customer.icon;
            return (
              <RevealItem key={customer.name} className="fh-logo-cell">
                <span className={`fh-logo-mark ${customer.className}`}>
                  {customer.imageSrc ? (
                    <img
                      src={customer.imageSrc}
                      alt=""
                      aria-hidden="true"
                      width={17}
                      height={17}
                      className="fh-logo-svg-img"
                    />
                  ) : Icon ? (
                    <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
                  ) : null}
                  {customer.name}
                </span>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
