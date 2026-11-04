"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BookOpen, Cpu, Image, Scan, Search, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { DocsShell } from "@/components/pixelify-docs/docs-shell";
import { articles } from "@/data/docs/docs-data";

const featured = [
  { slug: "background-remover", icon: Scan, tint: "violet", eyebrow: "AI TOOL", title: "Background Remover", text: "Create clean cutouts and transparent backgrounds in a few clicks." },
  { slug: "ai-upscaler", icon: Image, tint: "blue", eyebrow: "AI TOOL", title: "AI Upscaler", text: "Bring more clarity and resolution to the images that matter." },
  { slug: "privacy-and-security", icon: ShieldCheck, tint: "green", eyebrow: "YOUR PRIVACY", title: "Private by design", text: "Understand how local-first processing keeps source images on your device." },
];

export function DocsHome() {
  return <DocsShell>
    <motion.div className="px-home" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
      <div className="px-hero">
        <div className="px-hero-grid" />
        <div className="px-hero-glow" />
        <div className="px-hero-content">
          <div className="px-eyebrow"><span className="px-eyebrow-dot" /> THE PIXELIFY FIELD GUIDE</div>
          <h1>Make every pixel<br /><span>count.</span></h1>
          <p>Everything you need to create, enhance, and understand your images with Pixelify.</p>
          <div className="px-hero-actions">
            <Link href="/docs/getting-started" className="px-button-primary">Start learning <ArrowRight size={16} /></Link>
            <a href="/" className="px-button-ghost">Explore Pixelify <ArrowUpRight size={15} /></a>
          </div>
        </div>
        <div className="px-hero-art" aria-hidden="true">
          <div className="px-orbit px-orbit-one" /><div className="px-orbit px-orbit-two" />
          <div className="px-art-card px-art-card-back"><div className="px-art-swatch" /><div className="px-art-lines"><i /><i /><i /></div></div>
          <div className="px-art-card px-art-card-front"><div className="px-art-image"><div className="px-art-sun" /><div className="px-art-mountain one" /><div className="px-art-mountain two" /><div className="px-art-subject" /></div><div className="px-art-card-footer"><span>AI ENHANCED</span><span className="px-art-check">✓</span></div></div>
          <div className="px-float-pill"><Sparkles size={13} /> Made on your device</div>
        </div>
        <div className="px-hero-bottom"><span><Zap size={13} /> Browser-powered AI</span><span><ShieldCheck size={13} /> Local-first processing</span><span><Cpu size={13} /> Built for creators</span></div>
      </div>

      <section className="px-section px-welcome">
        <div className="px-section-heading"><div><div className="px-kicker">START HERE</div><h2>A little help goes a long way.</h2><p>New to Pixelify? Get familiar with the essentials and start creating.</p></div><Link href="/docs/getting-started" className="px-text-link">View getting started <ArrowRight size={14} /></Link></div>
        <Link href="/docs/getting-started" className="px-start-card"><div className="px-start-icon"><BookOpen size={22} /></div><div className="px-start-copy"><span>YOUR FIRST 4 MINUTES</span><strong>Meet your new creative toolkit.</strong><small>Learn how Pixelify works, how to run your first edit, and what to expect.</small></div><div className="px-start-arrow"><ArrowUpRight size={20} /></div></Link>
      </section>

      <section className="px-section">
        <div className="px-section-heading"><div><div className="px-kicker">EXPLORE THE TOOLS</div><h2>Powerful tools. Simple workflows.</h2><p>Find the guide that gets you from idea to finished image.</p></div></div>
        <div className="px-feature-grid">{featured.map((item, i) => { const Icon = item.icon; return <motion.div key={item.slug} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .08 }}><Link href={`/docs/${item.slug}`} className={`px-feature-card px-${item.tint}`}><div className="px-feature-top"><span className="px-feature-icon"><Icon size={19} /></span><ArrowUpRight size={17} className="px-feature-arrow" /></div><span className="px-card-eyebrow">{item.eyebrow}</span><strong>{item.title}</strong><p>{item.text}</p></Link></motion.div> })}</div>
      </section>

      <section className="px-section px-learning">
        <div className="px-section-heading"><div><div className="px-kicker">LEARN AT YOUR PACE</div><h2>Go a little deeper.</h2><p>Understand the technology and get the most out of your setup.</p></div></div>
        <div className="px-learning-grid">
          <Link href="/docs/models-and-performance" className="px-learning-card"><span className="px-learning-icon"><Cpu size={18} /></span><span className="px-card-eyebrow">UNDER THE HOOD</span><strong>Models & performance</strong><p>Learn about model assets, execution engines, and device performance.</p><span className="px-learn-more">Explore guide <ArrowRight size={14} /></span></Link>
          <Link href="/docs/troubleshooting" className="px-learning-card"><span className="px-learning-icon"><BookOpen size={18} /></span><span className="px-card-eyebrow">HELP & SUPPORT</span><strong>Troubleshooting</strong><p>Quick fixes for model loading, memory, compatibility, and exports.</p><span className="px-learn-more">Find an answer <ArrowRight size={14} /></span></Link>
        </div>
      </section>

      <section className="px-video-banner">
        <div className="px-video-play"><span>▶</span></div>
        <div><div className="px-kicker">SEE IT IN ACTION</div><h2>Learn by watching.</h2><p>Short, practical walkthroughs make every workflow easier to follow.</p><small>Official Pixelify video tutorials can be added here when available.</small></div>
        <Link href="/docs/getting-started#watch-and-learn" className="px-video-link">Explore tutorials <ArrowUpRight size={15} /></Link>
      </section>

      <div className="px-bottom-cta"><div><span className="px-kicker">NEED A HAND?</span><h2>Can't find what you're looking for?</h2><p>Start with troubleshooting or add your official support channel here.</p></div><Link href="/docs/troubleshooting" className="px-button-primary">Visit help center <ArrowRight size={16} /></Link></div>
    </motion.div>
  </DocsShell>;
}
