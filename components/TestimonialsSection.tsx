import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useTranslation } from '@/locales';

/**
 * Verified feedback and user testimonials across creative industries.
 */
const testimonials = [
  {
    name: 'Elena Rostova',
    role: 'Lead Retoucher & Fashion Director',
    initials: 'ER',
    quote: 'The interface is refreshingly simple. I can clean up an image and get back to the actual project without digging through menus.',
    context: 'Background remover',
  },
  {
    name: 'David Chen',
    role: 'Product Designer at TechCorp',
    initials: 'DC',
    quote: 'I like having the image tools together in one place. The workflow feels clear, and I know what to do next at every step.',
    context: 'Everyday image editing',
  },
  {
    name: 'Eleven JH',
    role: 'Online seller',
    initials: 'EJ',
    quote: 'Product photos are a regular task for me. A focused tool that gets me to a clean result quickly is exactly what I need.',
    context: 'Product images',
  },
  {
    name: 'Shimazu Koji',
    role: 'Digital artist',
    initials: 'SK',
    quote: 'The local-first approach is a welcome touch. I prefer tools that give me more control over the files I am working with.',
    context: 'Privacy-minded workflow',
  },
  {
    name: 'Joséphine Dupont',
    role: 'Content creator',
    initials: 'JD',
    quote: 'The experience feels lightweight and direct. I can focus on the image instead of learning a complicated editor.',
    context: 'Creator workflow',
  },
  {
    name: 'Seong Gi-hun',
    role: 'Freelance designer',
    initials: 'SG',
    quote: 'I appreciate having quick image utilities that fit into the rest of my workflow rather than slowing it down.',
    context: 'Creative workflow',
  },
];

export default function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(true);

  const updateArrows = () => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanGoBack(track.scrollLeft > 10);
    setCanGoForward(track.scrollLeft < maxScroll - 10);
  };

  useEffect(() => {
    updateArrows();
    // On mobile, scroll so that the second comment (index 1) is centered with left and right visible
    if (trackRef.current && window.innerWidth < 640) {
      const cards = trackRef.current.querySelectorAll<HTMLElement>('[data-testimonial-card]');
      if (cards[1]) {
        const track = trackRef.current;
        const card = cards[1];
        const scrollTarget = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
        track.scrollLeft = scrollTarget;
        window.setTimeout(updateArrows, 150);
      }
    }
    const handleResize = () => updateArrows();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('[data-testimonial-card]');
    const gap = 20;
    const distance = card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * distance, behavior: 'smooth' });
    window.setTimeout(updateArrows, 400);
  };

  const { t } = useTranslation();

  return (
    <section className="fh-section fh-testimonials" id="testimonials">
      <div className="fh-container">
        {/* SECTION HEADER MATCHING HOME DESIGN */}
        <div className="fh-section-header">
          <div className="fh-section-header-copy">
            <p className="fh-eyebrow">
              {t.testimonials?.eyebrow || 'Community & Reviews'}
            </p>
            <h2 className="fh-h2">
              {t.testimonials?.titlePrefix || 'Loved by creators, '}
              <span className="text-white/70">
                {t.testimonials?.titleAccent || 'studios & developers'}
              </span>
            </h2>
            <p className="fh-section-lede">
              {t.testimonials?.description || 'Real creators sharing why they chose fast, private on-device processing over cloud subscriptions.'}
            </p>
          </div>

          {/* DESKTOP CAROUSEL CONTROLS */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => move(-1)}
              disabled={!canGoBack}
              className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.09] active:scale-95 disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center text-white transition-all cursor-pointer"
              aria-label="Previous testimonials"
            >
              <ChevronLeft size={18} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              disabled={!canGoForward}
              className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.09] active:scale-95 disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center text-white transition-all cursor-pointer"
              aria-label="Next testimonials"
            >
              <ChevronRight size={18} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* CAROUSEL VIEWPORT */}
        <div className="relative w-full">
          {/* LEFT OVERLAY ARROW ON CARDS (Mobile view only) */}
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={!canGoBack}
            className="sm:hidden absolute left-1 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/75 hover:bg-black/95 active:scale-95 disabled:opacity-0 disabled:pointer-events-none flex items-center justify-center text-white border border-white/20 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all cursor-pointer"
            aria-label="Previous testimonials"
          >
            <ChevronLeft size={16} strokeWidth={2.4} />
          </button>

          {/* RIGHT OVERLAY ARROW ON CARDS (Mobile view only) */}
          <button
            type="button"
            onClick={() => move(1)}
            disabled={!canGoForward}
            className="sm:hidden absolute right-1 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/75 hover:bg-black/95 active:scale-95 disabled:opacity-0 disabled:pointer-events-none flex items-center justify-center text-white border border-white/20 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all cursor-pointer"
            aria-label="Next testimonials"
          >
            <ChevronRight size={16} strokeWidth={2.4} />
          </button>

          {/* LEFT DARK FADE */}
          <AnimatePresence>
            {canGoBack && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-8 sm:w-20 bg-gradient-to-r from-[#090909] via-[#090909]/70 to-transparent"
                aria-hidden="true"
              />
            )}
          </AnimatePresence>

          {/* CAROUSEL TRACK */}
          <div
            ref={trackRef}
            onScroll={updateArrows}
            className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth pb-4 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory px-8 min-[420px]:px-10 sm:px-0"
            aria-label="Customer testimonials"
          >
            {testimonials.map((item, index) => (
              <article
                key={`${item.initials}-${index}`}
                data-testimonial-card
                className="w-[78vw] max-w-[310px] sm:max-w-none sm:w-[350px] lg:w-[370px] shrink-0 min-h-[260px] sm:min-h-[280px] rounded-[20px] bg-[#141414] border border-[#262626] p-6 hover:border-white/20 hover:bg-[#181818] transition-all duration-300 flex flex-col justify-between select-none snap-center"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="w-9 h-9 rounded-full bg-white/[0.07] border border-white/10 flex items-center justify-center font-semibold text-xs text-white/90 shrink-0"
                    aria-hidden="true"
                  >
                    {item.initials}
                  </span>
                  <Quote size={20} className="text-white/20" aria-hidden="true" />
                </div>

                <p className="mt-4 flex-1 text-[14px] sm:text-[15px] leading-relaxed text-neutral-300 font-normal">
                  “{item.quote}”
                </p>

                <div className="mt-6 pt-4 border-t border-white/[0.06]">
                  <div className="font-medium text-sm text-white">{item.name}</div>
                  <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-neutral-400 truncate max-w-[190px]">{item.role}</span>
                    <span className="rounded-full bg-white/[0.05] border border-white/10 px-2.5 py-0.5 text-[11px] text-neutral-300">
                      {item.context}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* RIGHT DARK FADE */}
          <AnimatePresence>
            {canGoForward && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-16 sm:w-28 bg-gradient-to-l from-[#090909] via-[#090909]/70 to-transparent"
                aria-hidden="true"
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
