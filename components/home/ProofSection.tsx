'use client';

import Link from 'next/link';
import { Reveal, RevealGroup, RevealItem } from './Reveal';
import { useTranslation } from '@/locales';

const USE_CASES = [
  {
    id: 'archives' as const,
    kicker: 'Archives',
    title: 'Rescue detail from old shoots.',
    copy: '8× tiled upscaling holds texture in faces, fabric and film grain - without sending originals to a cloud.',
    image: '/home/shots/old_photo.webp',
    alt: 'A family portrait restored locally with Pixelify',
  },
  {
    id: 'ecommerce' as const,
    kicker: 'E-commerce',
    title: 'Cut products out on the spot.',
    copy: 'Chopper isolates the subject, then Backdrop places it on a clean scene, a solid colour or the blurred original.',
    image: '/home/shots/proof-commerce.webp',
    alt: 'Running shoes cut out and placed on a dark backdrop',
  },
  {
    id: 'social' as const,
    kicker: 'Social',
    title: 'Sharpen before it posts.',
    copy: 'Upscale stills and frames to 8×, then crop and set type on the same canvas before exporting.',
    image: '/home/shots/proof-social.webp',
    alt: 'Night car shot enhanced for social publishing',
  },
  {
    id: 'photography' as const,
    kicker: 'Photography',
    title: 'Restore without cloud uploads.',
    copy: 'Family photos and scans stay on the machine with zero cloud uploads. The model is cached after the first run, so the next pass is faster.',
    image: '/home/shots/family3.webp',
    alt: 'A family portrait restored locally with Pixelify',
  },
];

/** Framer's "trusted by teams" band, reframed as honest use cases + product facts. */
export function ProofSection() {
  const { t } = useTranslation();
  const ps = t.proofSection;

  return (
    <section className="fh-section fh-proof" id="use-cases">
      <div className="fh-container">
        <Reveal className="fh-section-header">
          <div className="fh-section-header-copy">
            <h2 className="fh-h2">{ps?.title || 'Professional results, with every file kept local'}</h2>
            <p className="fh-section-lede">
              {ps?.lede ||
                'Explore workflow guides, on-device neural specifications, and integration documentation for teams that require files to stay strictly local.'}
            </p>
          </div>
          <Link href="/docs/" className="fh-pill fh-pill-secondary fh-section-action">
            {ps?.readDocs || 'Read the docs'}
          </Link>
        </Reveal>

        <RevealGroup className="fh-proof-grid" stagger={0.08}>
          {USE_CASES.map((item) => {
            const caseTrans = ps?.cases?.[item.id];
            return (
              <RevealItem key={item.kicker} className="fh-proof-card">
                <img src={item.image} alt={item.alt} loading="lazy" />
                <span className="fh-proof-kicker">{caseTrans?.kicker || item.kicker}</span>
                <div>
                  <h3>{caseTrans?.title || item.title}</h3>
                  <p>{caseTrans?.copy || item.copy}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
