'use client';

import Link from 'next/link';
import { ArrowRight, Download, SlidersHorizontal, Upload } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from './Reveal';
import { StudioCanvas } from './StudioCanvas';
import { useTranslation } from '@/locales';

/**
 * Framer's "website builder for standout sites" section, rebuilt around the
 * real Pixelify upscaler workspace.
 */
export function StudioIntro() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Upload,
      title: t.studioIntro?.features?.start?.title || 'Start with any image',
      copy: t.studioIntro?.features?.start?.copy || 'Drop a PNG, JPG or WebP or paste straight from the clipboard. Files up to 20 MB open instantly.',
    },
    {
      icon: SlidersHorizontal,
      title: t.studioIntro?.features?.refine?.title || 'Refine in the studio',
      copy: t.studioIntro?.features?.refine?.copy || 'Choose a model and scale, then tune sharpness, denoise and face detail before you run.',
    },
    {
      icon: Download,
      title: t.studioIntro?.features?.export?.title || 'Export in one click',
      copy: t.studioIntro?.features?.export?.copy || 'Download the full-resolution result or a transparent cutout. No account, no watermark.',
    },
  ];

  return (
    <section className="fh-section fh-intro" id="studio">
      <div className="fh-container">
        <Reveal>
          <h2 className="fh-h2 fh-intro-title">
            {t.studioIntro?.title || 'A complete image studio, running on your device'}
          </h2>
          <p className="fh-lede">
            {t.studioIntro?.lede || 'Upscale to 8×, cut out any subject, and finish the frame, all on your device, with nothing uploaded to a server.'}
          </p>
          <div className="fh-actions">
            <Link href="/upscaler/" className="fh-pill fh-pill-primary">
              {t.studioIntro?.openUpscaler || 'Open the upscaler'}
            </Link>
            <Link href="/bg_remove/" className="fh-pill fh-pill-secondary">
              {t.studioIntro?.tryBgRemover || 'Try the BG remover'}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.08} y={32} className="fh-intro-canvas">
          <StudioCanvas />
        </Reveal>

        <RevealGroup className="fh-intro-features">
          {features.map(({ icon: Icon, title, copy }) => (
            <RevealItem key={title} className="fh-intro-feature">
              <span className="fh-intro-feature-icon">
                <Icon size={15} strokeWidth={1.7} aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <p className="fh-caption" style={{ marginTop: 20 }}>
            <Link href="/products/" className="fh-text-link">
              {t.studioIntro?.seeAll || 'See everything the studio can do'}
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
