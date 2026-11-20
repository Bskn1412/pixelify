'use client';

import Link from 'next/link';
import { Reveal } from './Reveal';
import { useTranslation } from '@/locales';

/** Closing spotlight card. */
export function FinalCta() {
  const { t } = useTranslation();
  const fc = t.finalCta;

  return (
    <section className="fh-cta-section" id="closing-cta">
      <div className="fh-container">
        <Reveal y={30}>
          <div className="fh-cta-card">
            <div className="fh-cta-inner">
              <h2 className="fh-cta-title">
                {fc?.titleLine1 || 'Bring every image'}
                <br />
                {fc?.titleLine2 || 'into focus'}
              </h2>
              <p className="fh-cta-copy">
                {fc?.copy ||
                  'Drop a photo, pick a model, and watch it resolve at 8×. Or cut the subject out and design the frame, all before an upload bar would have moved.'}
              </p>
              <div className="fh-cta-actions">
                <Link href="/upscaler/" className="fh-pill fh-pill-primary">
                  {fc?.openUpscaler || 'Open the upscaler'}
                </Link>
                <Link href="/bg_remove/" className="fh-pill fh-pill-ghost">
                  {fc?.removeBackground || 'Remove a background'}
                </Link>
              </div>
              <p className="fh-cta-fine">
                {fc?.finePrint || 'Runs completely on-device in all modern web browsers'}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
