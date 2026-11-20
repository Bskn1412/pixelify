
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { ToolTabsDemo } from './ToolTabsDemo';
import { ImageWheel } from './ImageWheel';
import { useTranslation } from '@/locales';

/** People, creative workflows and sample use cases. */
export function WorkflowSection() {
  const { t } = useTranslation();

  return (
    <section className="fh-section fh-workflow" id="workflow">
      <div className="fh-container">

        {/* ========================================================================= */}
        {/* SUBSECTION 1: Post-processing studio tools */}
        {/* ========================================================================= */}
        <div className="fh-workflow-header">
          <Reveal>
            <p className="fh-eyebrow">{t.workflowSection?.toolsEyebrow || 'Post-Processing Tools'}</p>
            <h2 className="fh-h2">
              {t.workflowSection?.toolsTitle || 'From clean cutout to finished composition'}
            </h2>
            <p className="fh-lede">
              {t.workflowSection?.toolsLede || 'Backdrops, edge shadows, aspect ratio crops, and typography layers live in one focused canvas.'}
            </p>
          </Reveal>
        </div>

        <Reveal y={30} className="fh-work-block">
          <div className="fh-work-card">
            <div className="fh-shotbar">
              <span className="fh-shotbar-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="fh-shotbar-title">{t.workflowSection?.toolsShotbarTitle || 'BG Remover · tools'}</span>
              <span className="fh-shotbar-tag">{t.workflowSection?.toolsShotbarTag || '4 tabs · one mask'}</span>
            </div>
            <ToolTabsDemo />
          </div>
        </Reveal>

        {/* ========================================================================= */}
        {/* SUBSECTION 2: Your work. Your vision. Pixelify. */}
        {/* ========================================================================= */}
        <div className="fh-workflow-header mt-14 sm:mt-20 lg:mt-24">
          <Reveal>
            <p className="fh-eyebrow">{t.workflowSection?.workflowEyebrow || 'Made for every creative workflow'}</p>

            <h2 className="fh-h2">
              {t.workflowSection?.workflowTitle || 'Your work. Your vision. Pixelify.'}
            </h2>

            <p className="fh-lede">
              {t.workflowSection?.workflowLede || 'From student projects to professional designs, Pixelify helps you remove backgrounds and upscale images without slowing down your creativity.'}
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <Link href="/bg_remove/" className="fh-pill fh-pill-secondary">
              {t.workflowSection?.exploreTools || 'Explore the tools'}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        {/* People carousel */}
        <Reveal y={30} className="fh-work-block">
          <div className="fh-work-card fh-people-card">

            <div className="fh-shotbar">
              <span className="fh-shotbar-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>

              <span className="fh-shotbar-title">
                {t.workflowSection?.carouselShotbarTitle || 'Pixelify · Made for you'}
              </span>

              <span className="fh-shotbar-tag">
                {t.workflowSection?.carouselShotbarTag || 'Every image has a purpose'}
              </span>
            </div>

            <div className="fh-people-carousel">
              <ImageWheel />
            </div>
          </div>

          {/* Carousel footer */}
          <div className="fh-work-meta fh-people-meta">
            <div>
              <h3>{t.workflowSection?.carouselHeading || 'Different people. Different possibilities.'}</h3>
              <p>
                {t.workflowSection?.carouselBody || "Whether you're creating, designing, studying, or running a business, there's a place for Pixelify in your workflow."}
              </p>
            </div>

            <div className="fh-work-meta-side">
              <p>
                {t.workflowSection?.carouselMetaSide || 'Better cutouts. Sharper images. More room to create. All in one simple workspace.'}
              </p>

              <Link href="#gallery" className="fh-text-link">
                {t.workflowSection?.carouselLink || 'Explore what Pixelify can do'}
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
