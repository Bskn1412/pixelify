"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, BookOpen, Cpu, Image, Scan, ShieldCheck, Zap, Sparkles
} from "lucide-react";
import { DocsShell } from "@/components/docs/docs-shell";

const featured = [
  {
    slug: "background-remover",
    icon: Scan,
    tint: "violet",
    eyebrow: "NEURAL MATTING",
    title: "Background Remover",
    text: "Dual AI models (Chopper & Diablo BEN2 1024) for instant transparent cutouts and fine hair matting."
  },
  {
    slug: "ai-upscaler",
    icon: Image,
    tint: "blue",
    eyebrow: "SUPER-RESOLUTION",
    title: "AI Upscaler",
    text: "Enlarge images up to 8× (16K resolution) with Vitality, Pixel-Dance, and Alpha-Satoru models."
  },
  {
    slug: "privacy-and-security",
    icon: ShieldCheck,
    tint: "green",
    eyebrow: "YOUR PRIVACY",
    title: "100% Private by Design",
    text: "All neural inference runs client-side in your browser. Source photos never touch a remote server."
  },
];

export function DocsHome() {
  return (
    <DocsShell>
      <motion.div
        className="px-home"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="px-hero">
          <div className="px-hero-grid" />
          <div className="px-hero-glow" />
          <div className="px-hero-content">
            <div className="px-eyebrow">
              <span className="px-eyebrow-dot" /> THE PIXELIFY FIELD GUIDE
            </div>
            <h1>
              Make every pixel<br />
              <span>count.</span>
            </h1>
            <p>
              Master on-device AI photo editing: 8× super-resolution upscaling,
              neural background removal, and precision image enhancements right in your browser.
            </p>
            <div className="px-hero-actions">
              <Link href="/docs/getting-started" className="px-button-primary">
                Start learning <ArrowRight size={16} />
              </Link>
              <a href="/" className="px-button-ghost">
                Open Pixelify Editor <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          <div className="px-hero-art" aria-hidden="true">
            <div className="px-orbit px-orbit-one" />
            <div className="px-orbit px-orbit-two" />
            <div className="px-art-card px-art-card-back">
              <div className="px-art-swatch" />
              <div className="px-art-lines"><i /><i /><i /></div>
            </div>
            <div className="px-art-card px-art-card-front">
              <div className="px-art-image">
                <div className="px-art-sun" />
                <div className="px-art-mountain one" />
                <div className="px-art-mountain two" />
                <div className="px-art-subject" />
              </div>
              <div className="px-art-card-footer">
                <span>AI ENHANCED (16K)</span>
                <span className="px-art-check">✓</span>
              </div>
            </div>
            <div className="px-float-pill">Zero Server Uploads</div>
          </div>

          <div className="px-hero-bottom">
            <span><Zap size={14} /> WebGPU Acceleration</span>
            <span><ShieldCheck size={14} /> 100% Local-First Privacy</span>
            <span><Cpu size={14} /> LiteRT WASM Fallback</span>
          </div>
        </div>

        <section className="px-section px-welcome">
          <div className="px-section-heading">
            <div>
              <div className="px-kicker">START HERE</div>
              <h2>Everything you need to master Pixelify.</h2>
              <p>Explore tools, model architectures, and practical guides to get the most out of your setup.</p>
            </div>
            <Link href="/docs/getting-started" className="px-text-link">
              View getting started <ArrowRight size={15} />
            </Link>
          </div>

          <Link href="/docs/getting-started" className="px-start-card">
            <div className="px-start-icon"><BookOpen size={24} /></div>
            <div className="px-start-copy">
              <span>GETTING STARTED GUIDE</span>
              <strong>Meet your on-device AI toolkit.</strong>
              <small>Learn how WebGPU powers instant 8× upscaling and background segmentation with zero cloud uploads.</small>
            </div>
            <div className="px-start-arrow"><ArrowUpRight size={22} /></div>
          </Link>
        </section>

        <section className="px-section">
          <div className="px-section-heading">
            <div>
              <div className="px-kicker">EXPLORE THE TOOLS</div>
              <h2>Powerful AI tools. Simple workflows.</h2>
              <p>Find the guide that gets you from raw input to finished high-resolution image.</p>
            </div>
          </div>

          <div className="px-feature-grid">
            {featured.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link href={`/docs/${item.slug}`} className={`px-feature-card px-${item.tint}`}>
                    <div className="px-feature-top">
                      <span className="px-feature-icon"><Icon size={20} /></span>
                      <ArrowUpRight size={18} className="px-feature-arrow" />
                    </div>
                    <span className="px-card-eyebrow">{item.eyebrow}</span>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="px-section px-learning">
          <div className="px-section-heading">
            <div>
              <div className="px-kicker">DEEP DIVE</div>
              <h2>Under the hood & architecture.</h2>
              <p>Understand on-device execution engines, tiling mechanics, and troubleshooting tips.</p>
            </div>
          </div>

          <div className="px-learning-grid">
            <Link href="/docs/models-and-performance" className="px-learning-card">
              <span className="px-learning-icon"><Cpu size={20} /></span>
              <span className="px-card-eyebrow">UNDER THE HOOD</span>
              <strong>Models & performance</strong>
              <p>Explore Vitality, Pixel-Dance, Alpha-Satoru, Chopper, and Diablo execution paths across WebGPU and WASM.</p>
              <span className="px-learn-more">Explore guide <ArrowRight size={14} /></span>
            </Link>

            <Link href="/docs/troubleshooting" className="px-learning-card">
              <span className="px-learning-icon"><BookOpen size={20} /></span>
              <span className="px-card-eyebrow">HELP & SUPPORT</span>
              <strong>Troubleshooting</strong>
              <p>Quick fixes for browser memory limits, WebGPU flag activation, model cache clearing, and exports.</p>
              <span className="px-learn-more">Find an answer <ArrowRight size={14} /></span>
            </Link>
          </div>
        </section>

        <section className="px-video-banner">
          <div className="px-video-play"><span>▶</span></div>
          <div>
            <div className="px-kicker">VIDEO TUTORIALS</div>
            <h2>Learn by watching.</h2>
            <p>Step-by-step walkthroughs make every AI photo workflow easy to master.</p>
            <small>Watch full-resolution demonstrations of 8× upscaling and Diablo matting in action.</small>
          </div>
          <Link href="/docs/getting-started#watch-and-learn" className="px-video-link">
            Explore tutorials <ArrowUpRight size={15} />
          </Link>
        </section>

        <div className="px-bottom-cta">
          <div>
            <span className="px-kicker">NEED ASSISTANCE?</span>
            <h2>Have questions or feedback?</h2>
            <p>Check our troubleshooting guide or contact the Pixelify team directly.</p>
          </div>
          <Link href="/docs/troubleshooting" className="px-button-primary">
            Visit help center <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </DocsShell>
  );
}
