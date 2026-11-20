'use client';

// HomePage.tsx
import React, { useEffect } from 'react';
import Footer from './Footer';
import type { ViewTab } from '../types';
import Hero from './Hero';
import BGRemoverSection from './BGRemoverSection';
import AIUpscalerSection from './AIUpscalerSection';
import PixelifyStory from './PixelifyStory';
import Testimonials from './TestimonialsSection';
import HomeFaq from './HomeFaq';
import { CustomerLogos } from './home/CustomerLogos';
import { StudioIntro } from './home/StudioIntro';
import { WorkflowSection } from './home/WorkflowSection';
import { PlatformBento } from './home/PlatformBento';
import { ResultsGallery } from './home/ResultsGallery';
import { TruckHero } from './home/TruckHero';
import { ProofSection } from './home/ProofSection';
import { InstantDemos } from './home/InstantDemos';
import { FinalCta } from './home/FinalCta';
import '@/styles/framer-home.css';
import '@/styles/truck-hero.css';

interface HomePageProps {
  onLaunchUpscaler: () => void;
  onLaunchBGRemove: () => void;
  onTabChange: (tab: ViewTab) => void;
}

export default function HomePage({
  onLaunchUpscaler,
  onLaunchBGRemove,
  onTabChange,
}: HomePageProps) {
  // Sections are client rendered, so the browser's own hash jump lands before
  // the anchor exists. Re-run it once the page has painted.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const timer = window.setTimeout(() => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      target?.scrollIntoView({ block: 'start' });
    }, 400);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#090909] text-white fh-page">
      <Hero
        onLaunchUpscaler={onLaunchUpscaler}
        onLaunchBGRemove={onLaunchBGRemove}
      />

      <div id="home-content" className="relative z-10">
        <CustomerLogos />
        <StudioIntro />
        <BGRemoverSection onLaunchBGRemove={onLaunchBGRemove} />
        <AIUpscalerSection onLaunchUpscaler={onLaunchUpscaler} />
        <WorkflowSection />
        <PlatformBento />
        <ResultsGallery />
        <PixelifyStory />
        <TruckHero />
        <ProofSection />
        <Testimonials />
        <InstantDemos />
        <HomeFaq />
        <FinalCta />
      </div>

      <Footer onTabChange={onTabChange} />
    </div>
  );
}
