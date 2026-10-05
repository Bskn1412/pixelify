// HomePage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';
import Footer from './Footer';
import PoppedCard from './PoppedCard';
import CardsTest from './CardsTest';
import TruckScene from './TruckScene';
import type { ViewTab } from '../types';
import Hero from "./Hero";
import PixelifyStory from './PixelifyStory';
import BGRemoverSection from './BGRemoverSection';
import AIUpscalerSection from './AIUpscalerSection';

interface HomePageProps {
  onLaunchUpscaler: () => void;
  onLaunchBGRemove: () => void;
  onSelectSample: (sampleUrl: string, type: 'upscale' | 'bg_remove') => void;
  onTabChange: (tab: ViewTab) => void;
}

const SAMPLES = [
  {
    id: 's1',
    name: 'Sports',
    src: '/home/ronaldo.jpg',
    type: 'bg_remove' as const,
    description: 'Extract subject with sub-pixel edge detection',
  },
  {
    id: 's2',
    name: 'Anime Art',
    src: '/home/one-piece.jpg',
    type: 'bg_remove' as const,
    description: '4x upscale with micro-texture enhancement',
  },
  {
    id: 's3',
    name: 'Ocean Life',
    src: '/home/turtle.jpeg',
    type: 'upscale' as const,
    description: 'Clean product cutout for commercial use',
  },
  {
    id: 's4',
    name: 'Face Restoration',
    src: '/home/mt-king.webp',
    type: 'upscale' as const,
    description: 'Clean product cutout for commercial use',
  },
];

const FEATURES_TABS = [
  {
    id: 'f1',
    title: 'Background Remover',
    subtitle: 'Isolate subjects with sub-pixel precision around transparent objects and fine hair strands.',
    badge: 'BiRefNet AI',
    detailTitle: 'BiRefNet Neural Segmentation',
    detailDesc: 'Dual-path vision transformers generate smooth alpha matte masks directly in browser memory.',
  },
  {
    id: 'f2',
    title: 'Background Remover',
    subtitle: 'Isolate subjects with sub-pixel precision around transparent objects and fine hair strands.',
    badge: 'BiRefNet AI',
    detailTitle: 'BiRefNet Neural Segmentation',
    detailDesc: 'Dual-path vision transformers generate smooth alpha matte masks directly in browser memory.',
  },
  {
    id: 'f3',
    title: 'AI Upscaler',
    subtitle: 'Reconstruct high-frequency textures and crisp edges up to 8K resolution without artifacts.',
    badge: '4x Factor',
    detailTitle: 'ClearReality, UltraSharp & Real-ESRGAN',
    detailDesc: 'Direct ONNX Runtime Web execution utilizing WebGPU shaders for hardware-accelerated tensor math.',
  },
  {
    id: 'f4',
    title: 'AI Upscaler',
    subtitle: 'Zero cloud servers, zero external data uploads. Your images never leave your computer.',
    badge: 'Local WASM',
    detailTitle: 'Air-Gapped Client Security',
    detailDesc: 'Complete offline capability powered by WASM SIMD and WebGPU.',
  },
];

export default function HomePage({
  onLaunchUpscaler,
  onLaunchBGRemove,
  onSelectSample,
  onTabChange,
}: HomePageProps) {
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);
  const currentTab = FEATURES_TABS[activeFeatureTab];

  return (
    <div className="relative min-h-screen bg-[#050507] text-white">

      {/* ========================================================================= */}
      {/* HERO SECTION AT FULL VIEWPORT SCREEN WIDTH (100VW) */}
      {/* ========================================================================= */}
      <Hero
        onLaunchUpscaler={onLaunchUpscaler}
        onLaunchBGRemove={onLaunchBGRemove}
      />

      <div id="home-content" className="flex flex-col gap-10 sm:gap-16 pt-6 sm:pt-12 pb-12 max-w-7xl mx-auto px-3 sm:px-6 relative z-10">

        {/* ========================================================================= */}
        {/* DUAL POPPED WORKSPACE CARDS ("CHOOSE YOUR STUDIO" - reference.mp4 style) */}
        {/* ========================================================================= */}
        <section className="flex flex-col gap-8 sm:gap-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto flex flex-col gap-3 px-2"
          >
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00FF85]">
              Choose Your Studio
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Crafted for Creatives & Engineers
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-neutral-400">
              Pick the workstation built specifically for your image processing needs.
            </p>
          </motion.div>

          <div className="flex flex-col gap-0 relative">

            {/* ROW 1: NEURAL BACKGROUND REMOVER WORKSTATION (REFERENCE UI) */}
            <BGRemoverSection onLaunchBGRemove={onLaunchBGRemove} />

            {/* ROW 2: AI UPSCALER STUDIO (REFERENCE UI WITH SPIDERMAN CARDS) */}
            <AIUpscalerSection onLaunchUpscaler={onLaunchUpscaler} />

          </div>
        </section>

        {/* ========================================================================= */}
        {/* PixelifyStory
        {/* ========================================================================= */}


        <PixelifyStory />


        {/* ========================================================================= */}
        {/* SAMPLE DEMOS GRID */}
        {/* ========================================================================= */}
        <section className="flex flex-col gap-8">

          {/* SECTION HEADING */}
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#A4D641]">
              Instant Demos
            </span>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mt-1">
              Try sample assets with a single click
            </h2>
          </div>


          {/* MAIN GRID BACKGROUND */}
          <div className="w-full bg-[#233447] rounded-sm p-4 sm:p-5 lg:p-6">
            {/* FOUR COLUMN GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {SAMPLES.map((sample, idx) => {

                /*
                * Match each sample card with the corresponding
                * FEATURES_TABS item.
                */
                const feature = FEATURES_TABS[idx];

                /*
                * First two cards:
                *   popup opens toward the RIGHT
                *
                * Last two cards:
                *   popup opens toward the LEFT
                *
                * This prevents the popup from going outside
                * the main content area.
                */
                const popupOpensLeft = idx >= 2;

                return (
                  <motion.div
                    key={sample.id}

                    initial={{
                      opacity: 0,
                      y: 25,
                    }}

                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}

                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}

                    transition={{
                      delay: idx * 0.08,
                      duration: 0.45,
                      ease: "easeOut",
                    }}

                    whileHover={{
                      y: -5,
                    }}

                    onClick={() =>
                      onSelectSample(sample.src, sample.type)
                    }

                    className="group relative z-10 cursor-pointer flex flex-col overflow-visible lg:hover:z-[100]">

                    {/* ============================================================= */}
                    {/* CARD */}
                    {/* ============================================================= */}

                    <div className="relative z-10 flex flex-col overflow-hidden bg-[#1B2838] rounded-sm border border-white/5 hover:border-[#A4D641]/50 transition-all duration-300">

                      {/* IMAGE */}
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#101822]">

                        <img
                          src={sample.src}
                          alt={sample.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.045]"
                        />

                        {/* IMAGE DARKEN ON HOVER */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />

                      </div>

                      {/* =========================================================== */}
                      {/* CARD FOOTER */}
                      {/* =========================================================== */}

                      <div className="flex items-center justify-between min-h-[38px] bg-[#1B2838] px-2 py-0.5">
                        <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-neutral-400 lg:hidden">
                          {sample.type === 'bg_remove' ? 'BG REMOVE' : 'AI UPSCALE'}
                        </span>
                        <div className="flex items-center ml-auto">
                          {/* SAMPLE NAME */}
                          <div className="flex items-center justify-center min-h-[34px] px-2.5 sm:px-3 bg-[#A4D641] text-[#101820] font-bold text-xs sm:text-sm truncate transition-colors duration-300 group-hover:bg-[#B9EB50]">
                            <span className="truncate">
                              {sample.name}
                            </span>
                          </div>

                          {/* ARROW */}
                          <div className="flex items-center justify-center w-8 sm:w-10 h-[34px] shrink-0 text-white group-hover:text-[#A4D641] transition-colors duration-300">
                            <span className="text-lg sm:text-xl leading-none transition-transform duration-300 group-hover:translate-x-1">
                              →
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>


                    {/* ============================================================= */}
                    {/* STEAM-STYLE HOVER DESCRIPTION */}
                    {/* DESKTOP ONLY */}
                    {/* ============================================================= */}

                    <div
                      className={`
                        hidden
                        lg:block
                        pointer-events-none
                        absolute
                        top-0
                        w-[360px]
                        z-50

                        opacity-0
                        invisible
                        translate-y-2
                        scale-[0.98]

                        group-hover:opacity-100
                        group-hover:visible
                        group-hover:translate-y-0
                        group-hover:scale-100

                        transition-all
                        duration-200
                        ease-out

                        ${popupOpensLeft
                          ? "right-[calc(100%-1px)]"
                          : "left-[calc(100%-1px)]"
                        }
                      `}
                    >

                      {/* =========================================================== */}
                      {/* POPUP PANEL */}
                      {/* =========================================================== */}

                      <div className="relative bg-[#3B4A5A] text-white shadow-2xl px-5 py-4 min-h-[250px]">

                        {/* ========================================================= */}
                        {/* ARROW / TRIANGLE */}
                        {/* ========================================================= */}

                        <div
                          className={`
                            absolute
                            top-[45px]
                            w-0
                            h-0
                            border-y-[14px]
                            border-y-transparent

                            ${popupOpensLeft
                              ? `
                                  left-full
                                  border-l-[14px]
                                  border-l-[#3B4A5A]
                                `
                              : `
                                  right-full
                                  border-r-[14px]
                                  border-r-[#3B4A5A]
                                `
                            }
                          `}
                        />


                        {/* ========================================================= */}
                        {/* TITLE */}
                        {/* ========================================================= */}

                        <h3 className="text-[17px] leading-tight  font-medium
                            text-white
                            pr-2
                          "
                        >
                          {feature.title}
                        </h3>


                        {/* ========================================================= */}
                        {/* BADGE */}
                        {/* ========================================================= */}

                        <div className="mt-2">

                          <span
                            className="
                              inline-flex
                              items-center
                              px-2
                              py-1
                              bg-[#263746]
                              text-[#BFD0DE]
                              text-[11px]
                              font-mono
                              font-semibold
                              rounded-sm
                              border
                              border-white/5
                            "
                          >
                            {feature.badge}
                          </span>

                        </div>


                        {/* ========================================================= */}
                        {/* MAIN DESCRIPTION */}
                        {/* ========================================================= */}

                        <p
                          className="
                            mt-3
                            text-[13px]
                            leading-[1.55]
                            text-[#D6DDE4]
                          "
                        >
                          {feature.subtitle}
                        </p>


                        {/* ========================================================= */}
                        {/* DETAIL SECTION */}
                        {/* ========================================================= */}

                        <div
                          className="
                            mt-4
                            bg-[#293A4A]
                            px-3
                            py-3
                            border-l-2
                            border-[#A4D641]
                          "
                        >

                          <p
                            className="
                              text-[12px]
                              font-semibold
                              text-white
                            "
                          >
                            {feature.detailTitle}
                          </p>

                          <p
                            className="
                              mt-1
                              text-[12px]
                              leading-[1.5]
                              text-[#B8C5D0]
                            "
                          >
                            {feature.detailDesc}
                          </p>

                        </div>


                        {/* ========================================================= */}
                        {/* CLICK HINT */}
                        {/* ========================================================= */}

                      </div>

                    </div>

                  </motion.div>
                );
              })}

            </div>

          </div>

        </section>

      </div>

      {/* ========================================================================= */}
      {/* 3D TRUCK SCENE AT FULL DEVICE VIEWPORT WIDTH (EDGE-TO-EDGE) */}
      {/* ========================================================================= */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative w-full overflow-hidden my-4 sm:my-8"
      >
        <TruckScene />
      </motion.section>

      {/* FOOTER */}
      <Footer onTabChange={onTabChange} />
    </div>
  );
}
