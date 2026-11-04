import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Zap,
  Infinity as InfinityIcon,
  WifiOff,
  Sliders,
  CheckCircle2,
  XCircle,
  Cpu,
  Lock,
  ArrowUpRight,
  BrainCircuit,
  CircleCheckBig,
  CloudOff,
} from 'lucide-react';
import { useTranslation } from '@/locales';

type FeatureCardProps = {
  icon: React.ElementType;
  tag: string;
  badge?: string;
  title: string;
  description: string;
  highlight?: boolean;
  tone?: 'mint' | 'blue' | 'violet' | 'amber' | 'rose';
  className?: string;
  visual?: React.ReactNode;
  index: number;
};

const toneClasses = {
  mint: 'pixelify-feature-card--mint',
  blue: 'pixelify-feature-card--blue',
  violet: 'pixelify-feature-card--violet',
  amber: 'pixelify-feature-card--amber',
  rose: 'pixelify-feature-card--rose',
};

function FeatureCard({
  icon: Icon,
  tag,
  badge,
  title,
  description,
  highlight = false,
  tone = 'mint',
  className = '',
  visual,
  index,
}: FeatureCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.065, 0.32), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.22 } }}
      className={`pixelify-feature-card group ${highlight ? 'pixelify-feature-card--security' : toneClasses[tone]} ${className}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <span className="pixelify-feature-icon"><Icon size={22} strokeWidth={2} /></span>
          <div className="flex max-w-[72%] flex-wrap items-center justify-end gap-1.5">
            <span className="pixelify-feature-tag">{tag}</span>
            {badge && <span className="pixelify-feature-badge">{badge}</span>}
          </div>
        </div>

        <div className="mt-1 flex flex-col gap-2">
          <h3 className="text-lg font-bold tracking-tight sm:text-xl">{title}</h3>
          <p className="text-sm leading-6">{description}</p>
        </div>
      </div>

      {visual && <div className="pixelify-feature-visual">{visual}</div>}
      <ArrowUpRight className="pixelify-feature-arrow" size={17} aria-hidden="true" />
    </motion.article>
  );
}

export default function WhyChoosePixelify() {
  const { t } = useTranslation();
  return (
    <section
      className="pixelify-why-section w-full overflow-hidden"
      aria-labelledby="why-pixelify-title"
    >
      <div className="pixelify-why-shell relative isolate w-full overflow-hidden rounded-[28px] sm:rounded-[44px] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.7)]">
        <div className="pixelify-why-glow pixelify-why-glow-one" aria-hidden="true" />
        <div className="pixelify-why-glow pixelify-why-glow-two" aria-hidden="true" />

        <div className="pixelify-why-content relative z-10 mx-auto w-full px-0 py-14 sm:py-18 lg:py-24">
          <motion.header
            className="mx-auto mb-10 max-w-3xl text-center sm:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="pixelify-eyebrow">
              {t.whyPixelify.eyebrow}
            </span>
            <h2 id="why-pixelify-title" className="mt-5 text-balance text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t.whyPixelify.titlePrefix}{' '}
              <span className="bg-gradient-to-r from-emerald-300 via-[#00FF85] to-emerald-500 bg-clip-text text-transparent">Pixelify</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-300/75 sm:text-base">
              {t.whyPixelify.subtitle}
            </p>
          </motion.header>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            <FeatureCard
              index={0}
              icon={ShieldCheck}
              tag={t.whyPixelify.zeroCloudTag}
              badge={t.whyPixelify.zeroCloudBadge}
              title={t.whyPixelify.zeroCloudTitle}
              description={t.whyPixelify.zeroCloudDesc}
              highlight
              className="sm:col-span-2 lg:col-span-2"
              visual={
                <div className="flex flex-col items-start justify-between gap-3 text-xs font-mono sm:flex-row sm:items-center">
                  <div className="flex flex-wrap items-center gap-2 text-neutral-400">
                    <Lock size={14} className="text-[#00FF85]" />
                    <span>{t.whyPixelify.sandboxing}</span>
                    <span className="font-semibold text-white">{t.whyPixelify.sandboxingActive}</span>
                  </div>
                  <div className="flex max-w-full items-center gap-2 rounded-lg border border-white/15 bg-white/[0.07] px-3 py-2 text-[#00FF85]">
                    <CloudOff size={14} className="text-[#00FF85]" /><span>{t.whyPixelify.processedOnDevice}</span>
                  </div>
                </div>
              }
            />

            <FeatureCard
              index={1}
              icon={Zap}
              tag={t.whyPixelify.webgpuTag}
              badge={t.whyPixelify.webgpuBadge}
              title={t.whyPixelify.webgpuTitle}
              description={t.whyPixelify.webgpuDesc}
              tone="mint"
              visual={<div className="flex flex-wrap items-center justify-between gap-2 text-xs"><span className="flex items-center gap-2 font-semibold"><Cpu size={15} /> {t.whyPixelify.engineHardware}</span><span className="rounded-full border border-emerald-300/70 bg-emerald-100/80 px-3 py-1 font-bold text-emerald-800">{t.whyPixelify.engineParallelism}</span></div>}
            />

            <FeatureCard
              index={2}
              icon={BrainCircuit}
              tag={t.whyPixelify.neuralTag}
              badge={t.whyPixelify.neuralBadge}
              title={t.whyPixelify.neuralTitle}
              description={t.whyPixelify.neuralDesc}
              tone="violet"
            />

            <FeatureCard
              index={3}
              icon={InfinityIcon}
              tag={t.whyPixelify.paywallTag}
              badge={t.whyPixelify.paywallBadge}
              title={t.whyPixelify.paywallTitle}
              description={t.whyPixelify.paywallDesc}
              tone="amber"
            />

            <FeatureCard
              index={4}
              icon={WifiOff}
              tag={t.whyPixelify.offlineTag}
              badge={t.whyPixelify.offlineBadge}
              title={t.whyPixelify.offlineTitle}
              description={t.whyPixelify.offlineDesc}
              tone="blue"
            />

            <FeatureCard
              index={5}
              icon={Sliders}
              tag={t.whyPixelify.proStudioTag}
              badge={t.whyPixelify.proStudioBadge}
              title={t.whyPixelify.proStudioTitle}
              description={t.whyPixelify.proStudioDesc}
              tone="rose"
              className="sm:col-span-2 lg:col-span-3"
              visual={
                <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    t.whyPixelify.featureSubPixel,
                    t.whyPixelify.featureScaling,
                    t.whyPixelify.featureFormats,
                    t.whyPixelify.featureBatch,
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 font-medium">
                      <CircleCheckBig size={15} className="shrink-0 text-emerald-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              }
            />
          </div>

          <div className="pixelify-comparison mt-7 rounded-2xl p-5 sm:mt-9 sm:rounded-3xl sm:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              <div className="flex flex-col gap-3.5">
                <span className="text-md font-bold uppercase tracking-wider text-rose-400">{t.whyPixelify.cloudTitle}</span>
                <ul className="flex flex-col gap-3 text-sm text-neutral-300">
                  <li className="flex items-start gap-2.5"><XCircle size={16} className="mt-0.5 shrink-0 text-rose-500" /><span>{t.whyPixelify.cloudPoint1}</span></li>
                  <li className="flex items-start gap-2.5"><XCircle size={16} className="mt-0.5 shrink-0 text-rose-500" /><span>{t.whyPixelify.cloudPoint2}</span></li>
                  <li className="flex items-start gap-2.5"><XCircle size={16} className="mt-0.5 shrink-0 text-rose-500" /><span>{t.whyPixelify.cloudPoint3}</span></li>
                </ul>
              </div>
              <div className="flex flex-col gap-3.5 border-t border-neutral-200 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <span className="text-md font-bold uppercase tracking-wider text-emerald-400">{t.whyPixelify.localTitle}</span>
                <ul className="flex flex-col gap-3 text-sm font-medium text-neutral-300">
                  <li className="flex items-start gap-2.5"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" /><span>{t.whyPixelify.localPoint1}</span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" /><span>{t.whyPixelify.localPoint2}</span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" /><span>{t.whyPixelify.localPoint3}</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center text-xs text-white/55 sm:mt-10 sm:text-sm">
            <span className="inline-flex items-center gap-2"><Lock size={14} className="text-[#00FF85]" /> {t.whyPixelify.footerPill1}</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
            <span>{t.whyPixelify.footerPill2}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
