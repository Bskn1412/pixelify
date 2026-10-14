import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react';

/**
 * Replace the sample review copy and names below with real, permissioned feedback
 * before publishing. These are starter examples, not verified customer reviews.
 */
const testimonials = [
  {
    name: 'Aarav M.',
    role: 'Indie creator',
    initials: 'AM',
    tone: 'mint',
    quote: 'The interface is refreshingly simple. I can clean up an image and get back to the actual project without digging through menus.',
    context: 'Background remover',
  },
  {
    name: 'Priya S.',
    role: 'Design student',
    initials: 'PS',
    tone: 'lavender',
    quote: 'I like having the image tools together in one place. The workflow feels clear, and I know what to do next at every step.',
    context: 'Everyday image editing',
  },
  {
    name: 'Rohan K.',
    role: 'Online seller',
    initials: 'RK',
    tone: 'peach',
    quote: 'Product photos are a regular task for me. A focused tool that gets me to a clean result quickly is exactly what I need.',
    context: 'Product images',
  },
  {
    name: 'Meera R.',
    role: 'Digital artist',
    initials: 'MR',
    tone: 'blue',
    quote: 'The local-first approach is a welcome touch. I prefer tools that give me more control over the files I am working with.',
    context: 'Privacy-minded workflow',
  },
  {
    name: 'Dev P.',
    role: 'Content creator',
    initials: 'DP',
    tone: 'rose',
    quote: 'The experience feels lightweight and direct. I can focus on the image instead of learning a complicated editor.',
    context: 'Creator workflow',
  },
  {
    name: 'Ananya T.',
    role: 'Freelance designer',
    initials: 'AT',
    tone: 'gold',
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
    setCanGoBack(track.scrollLeft > 8);
    setCanGoForward(track.scrollLeft < maxScroll - 8);
  };

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('[data-testimonial-card]');
    const gap = 20;
    const distance = card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * distance, behavior: 'smooth' });
    window.setTimeout(updateArrows, 350);
  };

  return (
    <section className="pixelify-testimonials-wrap px-4 py-10 sm:px-6 sm:py-14 lg:px-10" aria-labelledby="pixelify-testimonials-title">
      <div className="pixelify-testimonials-panel mx-auto max-w-[1440px] overflow-hidden rounded-[28px] bg-white px-5 py-12 sm:rounded-[36px] sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <span className="pixelify-testimonial-eyebrow">THE WORD IS OUT</span>
            <h2 id="pixelify-testimonials-title" className="mt-4 text-balance text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              Made for the way <span className="text-[#16A765]">you create.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
              A little less friction between your idea and the finished image.
            </p>
          </motion.div>

          <div className="flex shrink-0 items-center gap-3" aria-label="Testimonial carousel controls">
            <button
              type="button"
              onClick={() => move(-1)}
              disabled={!canGoBack}
              className="pixelify-carousel-arrow"
              aria-label="Scroll to previous reviews"
            >
              <ArrowLeft size={19} />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              disabled={!canGoForward}
              className="pixelify-carousel-arrow pixelify-carousel-arrow-next"
              aria-label="Scroll to more reviews"
            >
              <ArrowRight size={19} />
            </button>
          </div>
        </div>

        <div className="pixelify-testimonial-viewport relative mx-auto mt-9 max-w-7xl sm:mt-12">
          <div
            ref={trackRef}
            onScroll={updateArrows}
            className="pixelify-testimonial-track flex gap-5 overflow-x-auto scroll-smooth pb-3"
            aria-label="Customer testimonials"
          >
            {testimonials.map((item, index) => (
              <motion.article
                key={`${item.initials}-${index}`}
                data-testimonial-card
                className="pixelify-testimonial-card flex shrink-0 flex-col"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.2) }}
              >
                <div className="flex items-center justify-between">
                  <span className={`pixelify-avatar pixelify-avatar-${item.tone}`} aria-hidden="true">{item.initials}</span>
                  <Quote size={23} className="text-neutral-300" aria-hidden="true" />
                </div>
                <div className="mt-5 flex gap-1 text-amber-400" aria-label="Sample five-star rating">
                  {Array.from({ length: 5 }, (_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={1.5} />)}
                </div>
                <p className="mt-4 flex-1 text-[15px] leading-7 text-neutral-700">“{item.quote}”</p>
                <div className="mt-6 border-t border-neutral-100 pt-4">
                  <div className="font-semibold text-neutral-950">{item.name}</div>
                  <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
                    <span>{item.role}</span>
                    <span className="rounded-full bg-neutral-100 px-2.5 py-1">{item.context}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
          <div className="pixelify-testimonial-fade" aria-hidden="true" />
        </div>

        <div className="mx-auto mt-5 flex max-w-7xl items-center justify-between gap-4 text-xs text-neutral-400">
          <span>More feedback</span>
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#16A765]" /> Swipe or use the arrows</span>
        </div>
      </div>
    </section>
  );
}
