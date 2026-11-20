'use client';

import { useState } from 'react';
import { Reveal } from './Reveal';
import { useTranslation } from '@/locales';

interface GalleryItem {
  src: string;
  alt: string;
  title: string;
  meta: string;
  tag: 'Cutout' | 'Upscaled';
  category: 'bgremove' | 'upscaler';
  aspectRatio: string;
  checker?: boolean;
  position?: string;
}

const RESULTS: GalleryItem[] = [
  {
    src: '/home/gallery/editorial.webp',
    alt: 'High-fashion editorial portrait upscaled 4× with Pixelify',
    title: 'Editorial Fashion',
    meta: 'Alpha-Satoru · 4×',
    tag: 'Upscaled',
    category: 'upscaler',
    aspectRatio: '3 / 4',
    position: 'center 24%',
  },
  {
    src: '/home/gallery/spidy-cutout.webp',
    alt: 'Spider-Man hero cutout on transparent background by Pixelify',
    title: 'Stay In Action',
    meta: 'Chopper · alpha matte',
    tag: 'Cutout',
    category: 'bgremove',
    aspectRatio: '4 / 3',
    checker: true,
  },
  {
    src: '/home/gallery/rajini.webp',
    alt: 'Superstar cinema portrait upscaled 4× with Pixelify',
    title: 'Cinema Superstar',
    meta: 'Vitality · 4×',
    tag: 'Upscaled',
    category: 'upscaler',
    aspectRatio: '4 / 3.2',
    position: 'center 20%',
  },
  {
    src: '/home/gallery/shoes-cutout.webp',
    alt: 'Commercial running shoe cutout on transparent background by Pixelify',
    title: 'Product Shot',
    meta: 'Chopper · alpha matte',
    tag: 'Cutout',
    category: 'bgremove',
    aspectRatio: '4 / 5',
    checker: true,
  },
  {
    src: '/home/gallery/model.webp',
    alt: 'Studio portrait under gel lighting upscaled 4× with Pixelify',
    title: 'Gel Lighting',
    meta: 'Vitality · 4×',
    tag: 'Upscaled',
    category: 'upscaler',
    aspectRatio: '3 / 4',
    position: 'center 16%',
  },
  {
    src: '/home/gallery/car_japan.webp',
    alt: 'Japanese sports car photographed at night and upscaled 4× with Pixelify',
    title: 'Night Street Drive',
    meta: 'Pixel-Dance · 4×',
    tag: 'Upscaled',
    category: 'upscaler',
    aspectRatio: '16 / 10',
    position: 'center 52%',
  },
  {
    src: '/home/gallery/model2-cutout.webp',
    alt: 'Studio fashion model cutout on transparent background by Pixelify',
    title: 'Studio Model',
    meta: 'Diablo · alpha matte',
    tag: 'Cutout',
    category: 'bgremove',
    aspectRatio: '3 / 4',
    checker: true,
  },
  {
    src: '/home/gallery/onset.webp',
    alt: 'Cinematographer and crew on set upscaled 4× with Pixelify',
    title: 'On Set Cinema',
    meta: 'Pixel-Dance · 4×',
    tag: 'Upscaled',
    category: 'upscaler',
    aspectRatio: '3 / 4',
    position: 'center 30%',
  },
  {
    src: '/home/gallery/bruce_lee-cutout.webp',
    alt: 'Martial arts action still cut out on transparent background',
    title: 'Martial Arts Still',
    meta: 'Diablo · alpha matte',
    tag: 'Cutout',
    category: 'bgremove',
    aspectRatio: '16 / 11',
    checker: true,
  },
  {
    src: '/home/gallery/last_of_us.webp',
    alt: 'Cinematic character frame upscaled 4× with Pixelify',
    title: 'Gaming Frame',
    meta: 'Pixel-Dance · 4×',
    tag: 'Upscaled',
    category: 'upscaler',
    aspectRatio: '3 / 4.4',
  },
  {
    src: '/home/gallery/st-cutout.webp',
    alt: 'Stranger Things sci-fi character ensemble cutout on transparent background',
    title: 'Sci-Fi Character',
    meta: 'Diablo · alpha matte',
    tag: 'Cutout',
    category: 'bgremove',
    aspectRatio: '3 / 4',
    checker: true,
  },
  {
    src: '/home/gallery/anime.webp',
    alt: 'Anime character art upscaled 4× with Pixelify',
    title: 'Anime Character',
    meta: 'Alpha-Satoru · 4×',
    tag: 'Upscaled',
    category: 'upscaler',
    aspectRatio: '3 / 4',
  },
  {
    src: '/home/gallery/meme_cat.webp',
    alt: 'Fine animal fur detail photo upscaled 4× with Pixelify',
    title: 'Animal Texture',
    meta: 'Pixel-Dance · 4×',
    tag: 'Upscaled',
    category: 'upscaler',
    aspectRatio: '16 / 11',
    position: 'center 30%',
  },
  {
    src: '/home/gallery/bd-cutout.webp',
    alt: 'Film hero action still cutout on transparent background',
    title: 'Action Still',
    meta: 'Chopper · alpha matte',
    tag: 'Cutout',
    category: 'bgremove',
    aspectRatio: '16 / 11',
    checker: true,
  },
  {
    src: '/home/gallery/old_photo2.webp',
    alt: 'Historic portrait photo restored and upscaled 4× with Pixelify',
    title: 'Historic Portrait',
    meta: 'Alpha-Satoru · 4×',
    tag: 'Upscaled',
    category: 'upscaler',
    aspectRatio: '3 / 4',
  },
  {
    src: '/home/gallery/anime2.webp',
    alt: 'Detailed digital illustration enhanced 4× with Pixelify',
    title: 'Digital Illustration',
    meta: 'Vitality · 4×',
    tag: 'Upscaled',
    category: 'upscaler',
    aspectRatio: '3 / 3.8',
  },
  {
    src: '/home/gallery/dark-cutout.webp',
    alt: 'Dark sci-fi character cutout on transparent background by Pixelify',
    title: 'Dark Cinematic',
    meta: 'Diablo · alpha matte',
    tag: 'Cutout',
    category: 'bgremove',
    aspectRatio: '16 / 12.5',
    checker: true,
  },
];

/** Framer-style results gallery with on-device AI renders. */
export function ResultsGallery() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'all' | 'bgremove' | 'upscaler'>('all');

  const filteredResults = activeTab === 'all'
    ? RESULTS
    : RESULTS.filter((item) => item.category === activeTab);

  return (
    <section className="fh-section fh-gallery" id="gallery">
      <div className="fh-container" style={{ maxWidth: '1280px' }}>
        <Reveal className="fh-section-header">
          <div className="fh-section-header-copy">
            <p className="fh-eyebrow">{t.resultsGallery?.eyebrow || 'Results · Studio Gallery'}</p>
            <h2 className="fh-h2">{t.resultsGallery?.title || 'See the detail in every finished image'}</h2>
            <p className="fh-section-lede">
              {t.resultsGallery?.lede || 'Sample renders from the on-device AI models. Upscales, alpha mattes and backdrops, all processed locally in the browser tab.'}
            </p>
          </div>
        </Reveal>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#0099ff] text-white shadow-[0_0_18px_rgba(0,153,255,0.4)]'
                : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white border border-white/10'
            }`}
          >
            {t.resultsGallery?.tabs?.all || 'All Work'} <span className="opacity-60 ml-1">({RESULTS.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bgremove')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'bgremove'
                ? 'bg-emerald-500 text-white shadow-[0_0_18px_rgba(16,185,129,0.4)]'
                : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white border border-white/10'
            }`}
          >
            {t.resultsGallery?.tabs?.cutouts || 'Cutouts · BG Remover'} <span className="opacity-60 ml-1">({RESULTS.filter((r) => r.category === 'bgremove').length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upscaler')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'upscaler'
                ? 'bg-[#0099ff] text-white shadow-[0_0_18px_rgba(0,153,255,0.4)]'
                : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white border border-white/10'
            }`}
          >
            {t.resultsGallery?.tabs?.upscaler || 'AI Upscaler · 8× Detail'} <span className="opacity-60 ml-1">({RESULTS.filter((r) => r.category === 'upscaler').length})</span>
          </button>
        </div>

        <div className="fh-gallery-masonry" key={activeTab}>
          {filteredResults.map((item) => (
            <div
              key={item.src}
              className={`fh-gallery-item ${item.checker ? 'fh-gallery-checker' : ''}`}
              style={{
                aspectRatio: item.aspectRatio,
              }}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                style={item.position ? { objectPosition: item.position } : undefined}
              />
              <div className="fh-gallery-label">
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.meta}</span>
                </div>
                <span className={`fh-gallery-tag ${item.tag === 'Cutout' ? 'fh-gallery-tag--cutout' : ''}`}>
                  {item.tag === 'Cutout' ? (t.resultsGallery?.tags?.cutout || 'Cutout') : (t.resultsGallery?.tags?.upscaled || 'Upscaled')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
