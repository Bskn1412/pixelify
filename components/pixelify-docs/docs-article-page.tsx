"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Clock3, Info, Lightbulb, AlertTriangle, Copy, Play, ExternalLink } from "lucide-react";
import { DocsShell } from "./docs-shell";
import { Article, articles, navGroups } from "@/data/docs/docs-data";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function DocsArticlePage({ article }: { article: Article }) {
  const ordered = Object.values(articles);
  const index = ordered.findIndex((a) => a.slug === article.slug);
  const prev = ordered[index - 1];
  const next = ordered[index + 1];
  const toc = useMemo(() => article.blocks.filter((b) => b.type === "heading").map((b: any) => ({ id: b.id, text: b.text })), [article]);

  return <DocsShell>
    <motion.div className="px-article-layout" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>
      <article className="px-article">
        <div className="px-breadcrumb"><Link href="/docs">Docs</Link><ChevronRight size={13} /><span>{article.category}</span></div>
        <div className="px-article-heading">
          <div className="px-article-category">{article.category}</div>
          <h1>{article.title}</h1>
          <p>{article.description}</p>
          <div className="px-article-meta"><span><Clock3 size={14} /> {article.readTime}</span><span className="px-meta-dot" /><span>Pixelify documentation</span></div>
        </div>
        <div className="px-article-body">
          {article.blocks.map((block: any, i) => {
            if (block.type === "paragraph") return <p key={i}>{block.text}</p>;
            if (block.type === "heading") return <h2 id={block.id} key={i}>{block.text}</h2>;
            if (block.type === "callout") {
              const Icon = block.tone === "warning" ? AlertTriangle : block.tone === "tip" ? Lightbulb : Info;
              return <div key={i} className={`px-callout px-callout-${block.tone}`}><span className="px-callout-icon"><Icon size={18} /></span><div><strong>{block.title}</strong><p>{block.text}</p></div></div>;
            }
            if (block.type === "steps") return <div className="px-steps" key={i}>{block.items.map((step: any, j: number) => <div className="px-step" key={j}><div className="px-step-number">{String(j + 1).padStart(2, "0")}</div><div><strong>{step.title}</strong><p>{step.text}</p></div></div>)}</div>;
            if (block.type === "bullets") return <ul key={i}>{block.items.map((item: string, j: number) => <li key={j}>{item}</li>)}</ul>;
            if (block.type === "code") return <CodeBlock key={i} block={block} />;
            if (block.type === "video") return <VideoBlock key={i} block={block} />;
            if (block.type === "table") return <div className="px-table-wrap" key={i}><table><thead><tr>{block.headers.map((h: string) => <th key={h}>{h}</th>)}</tr></thead><tbody>{block.rows.map((r: string[], j: number) => <tr key={j}>{r.map((c, k) => <td key={k}>{c}</td>)}</tr>)}</tbody></table></div>;
            return null;
          })}
        </div>
        <div className="px-article-feedback"><span>Was this guide helpful?</span><a href="mailto:hello@pixelify.me?subject=Pixelify%20Docs%20Feedback">Send feedback <ExternalLink size={13} /></a></div>
        <div className="px-prev-next">
          {prev ? <Link href={`/docs/${prev.slug}`} className="px-prev-card"><span><ArrowLeft size={14} /> Previous</span><strong>{prev.title}</strong></Link> : <span />}
          {next ? <Link href={`/docs/${next.slug}`} className="px-next-card"><span>Next <ArrowRight size={14} /></span><strong>{next.title}</strong></Link> : <span />}
        </div>
      </article>
      <aside className="px-toc"><div className="px-toc-sticky"><div className="px-toc-title">ON THIS PAGE</div>{toc.map((item) => <a href={`#${item.id}`} key={item.id}>{item.text}</a>)}<div className="px-toc-divider" /><div className="px-toc-help"><strong>Still have questions?</strong><p>Find quick answers in our troubleshooting guide.</p><Link href="/docs/troubleshooting">Get help <ArrowRight size={13} /></Link></div></div></aside>
    </motion.div>
  </DocsShell>;
}

function CodeBlock({ block }: { block: any }) {
  return <div className="px-code-block"><div className="px-code-head"><span>{block.title || "Example"}</span><span>{block.language}</span></div><pre><code>{block.code}</code></pre></div>;
}

function VideoBlock({ block }: { block: any }) {
  return <div className="px-video-card">
    {block.videoUrl ? <div className="px-video-frame"><iframe src={block.videoUrl} title={block.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div> :
      <div className="px-video-placeholder"><div className="px-video-placeholder-orb" /><div className="px-play-button"><Play size={20} fill="currentColor" /></div><span>PIXELIFY VIDEO GUIDE</span></div>}
    <div className="px-video-card-copy"><div><strong>{block.title}</strong><p>{block.description}</p></div><span className="px-video-duration">{block.duration}</span></div>
  </div>;
}
