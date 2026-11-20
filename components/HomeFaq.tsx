'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useTranslation } from '@/locales';

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'How does Pixelify process images without uploading to cloud servers?',
    a: 'The AI runs right in your browser using WebGPU and ONNX Runtime, so your images stay on your device-not on someone else’s server.',
  },
  {
    q: 'Is Pixelify really 100% free with no watermarks or subscriptions?',
    a: 'Yes - no subscriptions, credits, watermarks, or surprise paywalls; just upload, edit, and download.',
  },
  {
    q: 'What is the maximum resolution and image size I can upscale?',
    a: 'Upscale images up to 40 MB and 16K resolution (16,384 x 16,384 px) - your device’s memory is the only real boss here.',
  },
  {
    q: 'Can I use Pixelify offline without an active internet connection?',
    a: 'Once the AI models are cached, you can process images offline - perfect for flights, commutes, or Wi-Fi that decided to take a day off.',
  },
  {
    q: 'How does Chopper compare to standard background removers?',
    a: 'Chopper is designed to preserve tricky details like hair, fur, and fine edges, so your subject doesn’t end up looking like it lost a fight with scissors.',
  },
  {
    q: 'Does Pixelify work on mobile phones and tablets?',
    a: 'Yes! Pixelify works on supported mobile browsers too, using WebGPU or a compatible WASM fallback when available.',
  },
  {
    q: 'Are my private photos and client confidential assets safe?',
    a: 'Your images stay on your device during processing. We store anonymous page visits and successful tool actions for the community leaderboard, never your images or file names.',
  },
  {
    q: 'How do I clear downloaded models if I need to free up browser storage?',
    a: 'Open Settings and select “Clear downloaded models”, a quick cleanup without having to clear your entire browser cache.',
  },
];

export default function HomeFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { t } = useTranslation();
  const faqItems = t.homeFaq?.items || FAQ_ITEMS;

  const title = t.homeFaq
    ? `${t.homeFaq.titlePrefix || 'Frequently'} ${t.homeFaq.titleMiddle || 'Asked'} ${t.homeFaq.titleSuffix || 'Questions'}`.trim()
    : 'Frequently Asked Questions';

  return (
    <section className="fh-section relative overflow-hidden py-20 sm:py-28" id="home-faq">
      {/* FAQPage structured data for search engines */}
      <script
        type="application/ld+json"
        id="faq-jsonld-home"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      {/* Subtle ambient lighting washing across the section header and questions */}
      <div className="pointer-events-none absolute -top-16 right-0 w-[600px] sm:w-[800px] h-[520px] sm:h-[650px] bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.13)_28%,rgba(255,255,255,0.04)_55%,transparent_75%)] blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-4 right-4 sm:right-16 w-[400px] sm:w-[520px] h-[340px] sm:h-[420px] bg-[radial-gradient(circle_at_75%_25%,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.06)_42%,transparent_72%)] blur-xl"
      />

      {/* Constrained container matching 740px layout so close button aligns directly over the end of the first answer line */}
      <div
        className="fh-faq-container relative z-10 w-full mx-auto px-4 sm:px-5"
        style={{ maxWidth: '740px' }}
      >
        {/* TITLE MATCHING ATTACHED SCREENSHOT */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold tracking-tight text-white leading-tight">
            {title}
          </h2>
        </div>

        {/* LINE-SEPARATED ACCORDION LIST MATCHING SCREENSHOT */}
        <div className="w-full border-t border-white/10">
          {faqItems.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <article
                key={idx}
                className="border-b border-white/10 transition-colors duration-200"
              >
                <button
                  type="button"
                  className="uc-faq-q group focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                >
                  <span className="uc-faq-qtext text-[14.5px] sm:text-[16px] font-semibold text-white/95 leading-snug group-hover:text-white transition-colors">
                    {item.q}
                  </span>

                  {/* Circular button: glowing white circle with solid black icon across all questions */}
                  <span
                    className={`uc-faq-plus shrink-0 w-7 h-7 sm:w-[32px] sm:h-[32px] rounded-full flex items-center justify-center justify-self-end transition-all duration-300 
                      ${isOpen
                        ? 'bg-white shadow-[0_0_20px_rgba(255,255,255,0.7),0_0_8px_rgba(255,255,255,0.9)]'
                        : 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.2)] hover:shadow-[0_0_16px_rgba(255,255,255,0.45)]'
                      }`}
                    style={{
                      backgroundColor: '#151313ff',
                      color: '#ffffffff',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                    }}
                    aria-hidden="true"
                  >
                    <Plus
                      size={15}
                      strokeWidth={isOpen ? 3 : 2.5}
                      color="#ffffffff"
                      style={{ stroke: '#ffffffff' }}
                      className={`transition-transform duration-300 text-black ${isOpen ? 'rotate-45' : ''}`}
                    />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-5 pt-0 text-[13.5px] sm:text-[14px] text-neutral-400 font-normal leading-relaxed pr-2">
                        <p>{item.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
