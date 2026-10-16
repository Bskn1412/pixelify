import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronRight, ChevronLeft, Quote, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarText: string;
  avatarBg: string;
  rating: number;
  highlightTag: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Elena Rostova',
    role: 'Lead Retoucher & Fashion Director',
    company: 'Studio Lumière Paris',
    avatarText: 'ER',
    avatarBg: 'from-emerald-600 to-teal-800',
    rating: 5,
    highlightTag: 'Saved 4+ hrs/day on hair cutouts',
    quote:
      'The Chopper cutout accuracy around fine curly hair and semi-sheer fabrics is remarkable. Doing this 100% locally without uploading 80MB client RAW files to some random cloud server is a game-changer for our studio workflow.',
  },
  {
    id: 't2',
    name: 'David Chen',
    role: 'Staff Frontend Engineer & OSS Dev',
    company: 'Independent Architect',
    avatarText: 'DC',
    avatarBg: 'from-blue-600 to-indigo-800',
    rating: 5,
    highlightTag: 'Verified 0 outgoing packets',
    quote:
      'I opened Chrome DevTools Network tab and inspected the WebGPU execution — zero outgoing network packets! As an engineer, seeing WGSL shaders and ONNX Runtime Web run client-side neural inference this smoothly in-browser is pure art.',
  },
  {
    id: 't3',
    name: 'Maya Patel',
    role: 'Head of E-Commerce Operations',
    company: 'Artisan Brands (45k+ SKUs)',
    avatarText: 'MP',
    avatarBg: 'from-amber-600 to-orange-800',
    rating: 5,
    highlightTag: 'Processed 1,200+ product cutouts',
    quote:
      'Other background removers wanted $0.20 per API call or $250/month for batch uploads. With Pixelify, we cut out 1,200 product shots in one afternoon on a standard M-series Mac. Zero cost, zero queues, zero rate limits.',
  },
  {
    id: 't4',
    name: 'Lucas Vance',
    role: '3D VFX & Texture Lead',
    company: 'Polygonal Dreams Interactive',
    avatarText: 'LV',
    avatarBg: 'from-purple-600 to-violet-900',
    rating: 5,
    highlightTag: '4x Ultra-Sharp Texture Upscaling',
    quote:
      'The Vitality upscaler extracts crisp, high-frequency micro-details from low-res game textures without introducing the weird plastic hallucination artifacts that other upscalers suffer from. Truly studio-grade fidelity.',
  },
  {
    id: 't5',
    name: 'Sarah Jenkins',
    role: 'Archival & Restoration Specialist',
    company: 'Historic Photo Archives',
    avatarText: 'SJ',
    avatarBg: 'from-rose-600 to-pink-800',
    rating: 5,
    highlightTag: 'Restored 1960s family photographs',
    quote:
      'Restored fragile 1960s family photographs that were scanned at only 400x600 pixels. The face restoration model reconstructed natural skin pores and realistic eyelash lines. My clients were brought to tears.',
  },
  {
    id: 't6',
    name: 'Marcus Thorne',
    role: 'Creative Director & Brand Designer',
    company: 'Apex Design Collective',
    avatarText: 'MT',
    avatarBg: 'from-emerald-700 to-cyan-900',
    rating: 5,
    highlightTag: 'Essential daily studio toolkit',
    quote:
      'Having both state-of-the-art background removal and 8K AI upscaling in a single browser tab that works offline on my laptop during flights is completely unmatched. Pixelify is permanently pinned in our team browser tabs.',
  },
];

export default function TestimonialsSection() {
  // Current view offset: 0 shows initial cards (1-3 full, 4th faded with right arrow), 1+ shifts to next set
  const [slideIndex, setSlideIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardsPerView, setCardsPerView] = useState(3);

  // Responsive cards per view determination
  useEffect(() => {
    const updateView = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };
    updateView();
    window.addEventListener('resize', updateView, { passive: true });
    return () => window.removeEventListener('resize', updateView);
  }, []);

  const maxIndex = Math.max(0, TESTIMONIALS.length - cardsPerView);

  const handleNext = () => {
    setSlideIndex((prev) => Math.min(prev + cardsPerView, maxIndex));
  };

  const handlePrev = () => {
    setSlideIndex((prev) => Math.max(prev - cardsPerView, 0));
  };

  const canGoNext = slideIndex < maxIndex;
  const canGoPrev = slideIndex > 0;

  // The 4th card (or the peeked card right after the current visible window)
  const peekIndex = slideIndex + cardsPerView;
  const hasPeekCard = peekIndex < TESTIMONIALS.length;

  return (
    <section className="w-screen max-w-[100vw] relative left-1/2 -translate-x-1/2 rounded-[28px] sm:rounded-[44px] bg-white text-neutral-900 py-16 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-12 shadow-[0_30px_100px_rgba(0,0,0,0.7)] relative z-20 overflow-hidden my-4 sm:my-8">
      {/* Decorative ambient subtle glow */}
      <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-emerald-100/40 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute -bottom-20 right-10 w-[400px] h-[400px] bg-[#00FF85]/15 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto w-full relative z-10 flex flex-col gap-10 sm:gap-14">
        {/* ========================================================================= */}
        {/* HEADER: BADGE + TITLE + CONTROLS */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
          <div className="flex flex-col gap-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] font-mono font-bold tracking-wider uppercase text-neutral-700 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#00C86A]" />
              COMMUNITY & CREATOR REVIEWS
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 leading-[1.12]">
              Loved by digital artists,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-[#00C86A]">
                studios & developers
              </span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Real creators sharing why they ditched cloud subscription models for fast, private in-browser neural processing.
            </p>
          </div>

          {/* DESKTOP TOP NAV ARROWS */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              disabled={!canGoPrev}
              aria-label="Previous reviews"
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canGoPrev
                  ? 'border-neutral-300 bg-white text-neutral-900 shadow-sm hover:bg-neutral-50 hover:scale-105 active:scale-95 cursor-pointer'
                  : 'border-neutral-200 bg-neutral-100 text-neutral-400 opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={20} strokeWidth={2.4} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext}
              aria-label="Next reviews"
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canGoNext
                  ? 'border-neutral-950 bg-neutral-950 text-white shadow-md hover:bg-emerald-600 hover:border-emerald-600 hover:scale-105 active:scale-95 cursor-pointer'
                  : 'border-neutral-200 bg-neutral-100 text-neutral-400 opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={20} strokeWidth={2.4} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARDS SLIDER CONTAINER WITH FADED 4TH CARD & OVERLAY ARROW               */}
        {/* ========================================================================= */}
        <div className="relative w-full overflow-hidden" ref={containerRef}>
          {/* LEFT FLOATING ARROW: appears once user has scrolled right */}
          <AnimatePresence>
            {canGoPrev && (
              <motion.div
                initial={{ opacity: 0, x: -16, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -16, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 pointer-events-auto"
              >
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Go back to first reviews"
                  className="flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-neutral-950/95 hover:bg-neutral-900 text-white shadow-[0_12px_40px_rgba(0,0,0,0.4)] border border-white/20 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group"
                >
                  <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs font-bold tracking-wide hidden md:inline">Previous Reviews</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SLIDER TRACK */}
          <div
            className="flex gap-5 sm:gap-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: `translateX(-${(slideIndex * (100 / cardsPerView))}%)`,
            }}
          >
            {TESTIMONIALS.map((item, idx) => {
              // Determine if this card is currently within the active primary window
              const isVisible = idx >= slideIndex && idx < slideIndex + cardsPerView;
              // Check if this card is the peek/faded card on the right
              const isPeekCard = idx === peekIndex;

              return (
                <div
                  key={item.id}
                  style={{
                    flex: `0 0 calc(${100 / cardsPerView}% - ${(cardsPerView - 1) * (cardsPerView === 1 ? 0 : 20) / cardsPerView}px)`,
                  }}
                  className={`relative flex flex-col justify-between rounded-2xl sm:rounded-3xl p-6 sm:p-7 border transition-all duration-500 min-h-[320px] sm:min-h-[350px] ${
                    isVisible
                      ? 'bg-neutral-50/90 border-neutral-200/90 shadow-sm hover:shadow-md hover:border-neutral-300'
                      : isPeekCard
                      ? 'opacity-40 blur-[0.4px] scale-[0.98] bg-neutral-100 border-neutral-200 pointer-events-none select-none'
                      : 'opacity-20 scale-[0.96] bg-neutral-100 border-neutral-200 pointer-events-none select-none'
                  }`}
                >
                  {/* Top Meta: Rating Stars + Tag */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-amber-500" aria-label="5 stars rating">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} size={15} fill="currentColor" stroke="none" />
                        ))}
                      </div>

                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-semibold">
                        <CheckCircle size={11} className="text-emerald-600" />
                        Verified
                      </span>
                    </div>

                    {/* Tag badge */}
                    <div className="text-[11px] font-mono font-bold text-neutral-500 uppercase tracking-wide">
                      {item.highlightTag}
                    </div>

                    {/* Quote */}
                    <div className="relative mt-1">
                      <Quote size={20} className="text-neutral-300 mb-1.5 opacity-60" />
                      <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-normal">
                        "{item.quote}"
                      </p>
                    </div>
                  </div>

                  {/* Author Card Footer */}
                  <div className="flex items-center gap-3 pt-5 mt-4 border-t border-neutral-200/80">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white bg-gradient-to-br ${item.avatarBg} shadow-sm shrink-0`}
                    >
                      {item.avatarText}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-neutral-950 truncate">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-neutral-500 truncate">
                        {item.role} · <strong className="text-neutral-700 font-semibold">{item.company}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT FLOATING ARROW OVERLAY: Placed over the 4th/peeked card */}
          <AnimatePresence>
            {canGoNext && (
              <motion.div
                initial={{ opacity: 0, x: 16, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 16, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 pointer-events-auto"
              >
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="See more reviews"
                  className="flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-neutral-950 text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] border border-white/20 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer hover:bg-emerald-600 hover:border-emerald-500 group"
                >
                  <span className="text-xs font-bold tracking-wide">More Reviews</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM DOTS PAGINATION & COUNTER                                         */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between px-2 pt-2 border-t border-neutral-100">
          <div className="text-xs font-mono font-semibold text-neutral-500">
            Showing <span className="text-neutral-900 font-bold">{slideIndex + 1}</span>–
            <span className="text-neutral-900 font-bold">
              {Math.min(slideIndex + cardsPerView, TESTIMONIALS.length)}
            </span>{' '}
            of {TESTIMONIALS.length} reviews
          </div>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: Math.ceil(TESTIMONIALS.length / cardsPerView) }).map((_, pageIdx) => {
              const isActive = Math.floor(slideIndex / cardsPerView) === pageIdx;
              return (
                <button
                  key={pageIdx}
                  type="button"
                  onClick={() => setSlideIndex(pageIdx * cardsPerView)}
                  aria-label={`Jump to review page ${pageIdx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive ? 'w-6 bg-emerald-600' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                  }`}
                />
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
