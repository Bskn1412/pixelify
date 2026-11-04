"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, BookOpen, ChevronDown, Command, Menu, Moon,
  Search, ShieldCheck, Sparkles, Sun, X
} from "lucide-react";
import { navGroups, articles } from "@/data/docs/docs-data";
import { PixelMascot } from "./pixel-mascot";

export function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return Object.values(articles).slice(0, 4);
    return Object.values(articles).filter((a) =>
      `${a.title} ${a.description} ${a.category}`.toLowerCase().includes(q)
    );
  }, [query]);

  const sidebar = (
    <div className="px-sidebar-inner">
      <Link href="/docs" className="px-brand" onClick={() => setMobileOpen(false)}>
        <span className="px-brand-mark"><Sparkles size={17} /></span>
        <span>pixelify<span className="px-brand-docs"> docs</span></span>
      </Link>
      <button className="px-search-trigger" onClick={() => setSearchOpen(true)}>
        <Search size={15} /><span>Search documentation</span><kbd>⌘ K</kbd>
      </button>
      <nav className="px-nav">
        {navGroups.map((group) => (
          <div className="px-nav-group" key={group.title}>
            <div className="px-nav-label">{group.title}</div>
            {group.items.map((item) => {
              const active = pathname === `/docs/${item.slug}`;
              return (
                <Link key={item.slug} href={`/docs/${item.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className={`px-nav-link ${active ? "is-active" : ""}`}>
                  <span className="px-nav-dot" />{item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="px-sidebar-bottom">
        <div className="px-sidebar-note">
          <div className="px-sidebar-note-icon"><ShieldCheck size={16} /></div>
          <div><strong>Made to stay local.</strong><span>AI image processing in your browser.</span></div>
        </div>
        <a className="px-back-link" href="/" target="_self"><ArrowLeft size={14} /> Back to Pixelify</a>
      </div>
    </div>
  );

  return (
    <div className={`px-docs ${dark ? "px-dark" : ""}`}>
      <header className="px-mobile-header">
        <button className="px-icon-button" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu /></button>
        <Link href="/docs" className="px-brand"><span className="px-brand-mark"><Sparkles size={16} /></span><span>pixelify<span className="px-brand-docs"> docs</span></span></Link>
        <button className="px-icon-button" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun /> : <Moon />}</button>
      </header>

      <aside className="px-sidebar">{sidebar}</aside>
      <AnimatePresence>
        {mobileOpen && <motion.div className="px-mobile-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)}>
          <motion.aside className="px-mobile-sidebar" initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} onClick={(e) => e.stopPropagation()}>
            <button className="px-close-mobile" onClick={() => setMobileOpen(false)}><X size={18} /></button>
            {sidebar}
          </motion.aside>
        </motion.div>}
      </AnimatePresence>

      <div className="px-main">
        <div className="px-topbar">
          <div className="px-topbar-left"><span>Documentation</span><span className="px-topbar-slash">/</span><span className="px-topbar-muted">Pixelify</span></div>
          <div className="px-topbar-actions">
            <button className="px-top-search" onClick={() => setSearchOpen(true)}><Search size={14} /> Search <kbd>⌘ K</kbd></button>
            <button className="px-icon-button px-desktop-theme" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
            <a className="px-top-link" href="/" target="_self">Visit Pixelify <ArrowRight size={14} /></a>
          </div>
        </div>
        <main className="px-content">{children}</main>
        <footer className="px-footer"><span>© {new Date().getFullYear()} Pixelify</span><span>Made for creators, powered by your device.</span></footer>
      </div>

 <PixelMascot pageKey={pathname} searching={searchOpen} />

      <AnimatePresence>
        {searchOpen && <motion.div className="px-search-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setSearchOpen(false)}>
          <motion.div className="px-search-modal" initial={{ opacity: 0, y: 12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} onMouseDown={(e) => e.stopPropagation()}>
            <div className="px-search-input-wrap"><Search size={18} /><input autoFocus placeholder="Search guides, tools, and topics..." value={query} onChange={(e) => setQuery(e.target.value)} /><button onClick={() => setSearchOpen(false)}><kbd>ESC</kbd></button></div>
            <div className="px-search-results">
              <div className="px-search-caption">{query ? `${results.length} RESULTS` : "QUICK ACCESS"}</div>
              {results.map((a) => <Link key={a.slug} href={`/docs/${a.slug}`} onClick={() => { setSearchOpen(false); setQuery(""); }} className="px-search-result"><span className="px-result-icon"><BookOpen size={16} /></span><span><strong>{a.title}</strong><small>{a.description}</small></span><ArrowRight size={15} /></Link>)}
              {results.length === 0 && <div className="px-no-results">No results found. Try another search.</div>}
            </div>
            <div className="px-search-foot"><span><kbd>↵</kbd> to open</span><span><kbd>ESC</kbd> to close</span></div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}
