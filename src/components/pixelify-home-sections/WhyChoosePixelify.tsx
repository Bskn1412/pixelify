import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Cpu,
  ShieldCheck,
  Sparkles,
  Zap,
  LockKeyhole,
} from 'lucide-react';

const benefits = [
  {
    number: '01',
    icon: Cpu,
    title: 'Your device. Your workflow.',
    description:
      'Process images locally in your browser, without sending your originals to a remote processing server.',
    tag: 'On-device processing',
  },
  {
    number: '02',
    icon: ShieldCheck,
    title: 'Privacy comes first.',
    description:
      'Keep your images close. Local processing helps you stay in control of personal and project files.',
    tag: 'Privacy-minded by design',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'More detail, less effort.',
    description:
      'Remove backgrounds and upscale images with focused tools built for everyday creative work.',
    tag: 'Made for creators',
  },
  {
    number: '04',
    icon: Zap,
    title: 'A simpler creative flow.',
    description:
      'Get from upload to result in a clean interface, with no complicated editing timeline to learn.',
    tag: 'Fast, focused tools',
  },
];

export default function WhyChoosePixelify() {
  return (
    <section className="px-4 sm:px-6 lg:px-10" aria-labelledby="why-pixelify-title">
      <div className="pixelify-why-shell relative isolate mx-auto max-w-[1440px] overflow-hidden rounded-[28px] sm:rounded-[36px]">
        <div className="pixelify-why-glow pixelify-why-glow-one" aria-hidden="true" />
        <div className="pixelify-why-glow pixelify-why-glow-two" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <motion.div
            className="mx-auto mb-11 max-w-3xl text-center sm:mb-14"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <span className="pixelify-eyebrow">
              <Sparkles size={14} aria-hidden="true" />
              THE PIXELIFY DIFFERENCE
            </span>
            <h2
              id="why-pixelify-title"
              className="mt-5 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              Creative tools that put <span className="text-[#00FF85]">you first.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-400 sm:text-base">
              Powerful image tools, a focused experience, and more control over your creative workflow.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.article
                  key={benefit.number}
                  className="pixelify-benefit-card group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: index * 0.07, ease: 'easeOut' }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="pixelify-benefit-icon"><Icon size={21} strokeWidth={1.8} /></span>
                    <span className="text-xs font-semibold tracking-[0.18em] text-white/25">{benefit.number}</span>
                  </div>
                  <h3 className="mt-7 text-lg font-semibold tracking-tight text-white sm:text-xl">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-400">{benefit.description}</p>
                  <div className="mt-7 flex items-center justify-between gap-3 border-t border-white/[0.09] pt-4">
                    <span className="text-[11px] font-medium tracking-wide text-neutral-400">{benefit.tag}</span>
                    <ArrowUpRight size={16} className="text-[#00FF85] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-neutral-500 sm:mt-11 sm:text-sm">
            <span className="inline-flex items-center gap-2"><LockKeyhole size={14} className="text-[#00FF85]" /> Local-first workflow</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
            <span>Built for quick, everyday image tasks</span>
          </div>
        </div>
      </div>
    </section>
  );
}
