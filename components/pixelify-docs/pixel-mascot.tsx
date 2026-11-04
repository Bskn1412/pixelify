"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

type Mood = "happy" | "curious" | "wow" | "love" | "sleepy";

const reactions: { mood: Mood; message: string }[] = [
  { mood: "happy", message: "Hey, creator! ✨" },
  { mood: "curious", message: "What are we making?" },
  { mood: "wow", message: "Pixel magic!" },
  { mood: "love", message: "Looking good! 💜" },
  { mood: "sleepy", message: "Tiny break?" },
];

export function PixelMascot({ pageKey, searching = false }: { pageKey: string; searching?: boolean }) {
  const mascotRef = useRef<HTMLButtonElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [mood, setMood] = useState<Mood>("happy");
  const [message, setMessage] = useState("Hey, creator!");
  const [showMessage, setShowMessage] = useState(false);
  const clickCount = useRef(0);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const rect = mascotRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.39;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(1, Math.hypot(dx, dy) / 260);
      setLook({ x: Math.cos(angle) * distance * 5, y: Math.sin(angle) * distance * 4 });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    if (searching) {
      setMood("wow");
      setMessage("Let's find it!");
      setShowMessage(true);
      return;
    }
    const pageMood: Record<string, Mood> = {
      "/docs": "happy",
      "/docs/getting-started": "curious",
      "/docs/background-remover": "wow",
      "/docs/ai-upscaler": "love",
      "/docs/privacy-and-security": "happy",
      "/docs/models-and-performance": "curious",
      "/docs/troubleshooting": "sleepy",
    };
    setMood(pageMood[pageKey] || "happy");
    setMessage(pageKey === "/docs/background-remover" ? "Let's make it transparent!" : pageKey === "/docs/ai-upscaler" ? "More pixels, please!" : "I'm right here!");
  }, [pageKey, searching]);

  const react = () => {
    const next = reactions[clickCount.current % reactions.length];
    clickCount.current += 1;
    setMood(next.mood);
    setMessage(next.message);
    setShowMessage(true);
  };

  return (
    <div className="px-mascot-dock">
      <AnimatePresence>
        {showMessage && <motion.div className="px-mascot-bubble" initial={{ opacity: 0, y: 8, scale: .92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: .95 }} key={message}>
          {message}<span className="px-bubble-tail" />
        </motion.div>}
      </AnimatePresence>
      <button ref={mascotRef} type="button" className={`px-mascot px-mascot-${mood}`} onClick={react} aria-label="Interact with Pixelify mascot" title="Say hello">
        <span className="px-mascot-shadow" />
        <span className="px-mascot-body">
          <span className="px-mascot-ear px-mascot-ear-left" /><span className="px-mascot-ear px-mascot-ear-right" />
          <span className="px-mascot-cheek px-mascot-cheek-left" /><span className="px-mascot-cheek px-mascot-cheek-right" />
          <span className="px-mascot-eye px-mascot-eye-left"><i style={{ transform: `translate(${look.x}px, ${look.y}px)` }} /></span>
          <span className="px-mascot-eye px-mascot-eye-right"><i style={{ transform: `translate(${look.x}px, ${look.y}px)` }} /></span>
          <span className="px-mascot-mouth" />
          <span className="px-mascot-shine" />
        </span>
      </button>
      <span className="px-mascot-hint">tap me</span>
    </div>
  );
}
