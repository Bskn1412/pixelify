"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import {
  MetalFx,
  MetalText,
  PRESETS,
  setCursorLightConfig,
  setSharedPresetMode,
  useMetalTextReflection,
  type MetalFxPreset,
  type MetalFxTheme,
  type MetalFxReflectionTarget,
} from "metal-fx";
import "@/styles/metal-badge.css";

// Disable mouse cursor light overlay by default
if (typeof window !== "undefined") {
  try {
    setCursorLightConfig({ cursor: false });
  } catch {
    // ignore
  }
}

const BARE_STYLE_ID = "mfx-bare-style";
const BARE_CSS =
  ".metal-fx-root[data-mfx-bare]{background:transparent!important}.metal-fx-root[data-mfx-bare]::before,.metal-fx-root[data-mfx-bare]::after{box-shadow:none!important}.metal-fx-root[data-mfx-bare] .metal-fx-inner{display:none!important}";

export interface MetalBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Label shown inside the metallic pill (e.g. "New"). */
  label?: string;
  /** Children if not using label. */
  children?: ReactNode;
  /** Optional leading icon or element. */
  leading?: ReactNode;
  /** metal-fx preset: 'silver' | 'chromatic' | 'gold'. Defaults to 'silver' (monochrome pure metal, NO rainbow). */
  preset?: MetalFxPreset;
  /** Theme: 'dark' | 'light' | 'auto'. Defaults to 'dark'. */
  theme?: MetalFxTheme;
  /** Effect strength (0..1). Defaults to 0.95. */
  strength?: number;
  /** Shader scale. Defaults to 1.6 for the compact 45x25 pill. */
  shaderScale?: number;
  /** Animation speed multiplier. Defaults to 3.5 for fluid diagonal liquid motion. */
  speed?: number;
  /** Text color inside badge. Defaults to white '#ffffff'. */
  textColor?: string;
  /** Optional reflection targets. */
  reflectionTargets?: ReadonlyArray<MetalFxReflectionTarget>;
  className?: string;
}

export function MetalBadge({
  label,
  children = label ?? "New",
  leading,
  preset = "silver",
  theme = "dark",
  strength = 0.95,
  shaderScale = 1.6,
  speed = 1.5,
  textColor = "#ffffff",
  reflectionTargets,
  className = "",
  ...props
}: MetalBadgeProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Configure WebGL shader for pure liquid silver flow with diagonal motion and ZERO rainbow dispersion
  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      for (const p of ["silver", "chromatic"] as const) {
        if (PRESETS[p]) {
          for (const mode of Object.values(PRESETS[p].modes)) {
            mode.speed = speed;
            mode.angle = 45; // 45-degree diagonal liquid motion
            mode.distortion = 0.2;
            mode.shiftRed = 0; // ZERO chromatic aberration (NO rainbow colors)
            mode.shiftBlue = 0; // ZERO chromatic aberration (NO rainbow colors)
            mode.colorTint = "#ffffff88"; // Pure liquid silver metallic sheen
            mode.shaderOpacity = 1;
          }
        }
      }

      if (PRESETS[preset]?.modes?.[theme === "light" ? "light" : "dark"]) {
        try {
          setSharedPresetMode(PRESETS[preset].modes[theme === "light" ? "light" : "dark"]);
        } catch {
          // ignore
        }
      }

      if (!document.getElementById(BARE_STYLE_ID)) {
        const style = document.createElement("style");
        style.id = BARE_STYLE_ID;
        style.textContent = BARE_CSS;
        document.head.appendChild(style);
      }
    }
  }, [preset, speed, theme]);

  // Strip default dark chrome & raise canvas
  useEffect(() => {
    if (!mounted) return;

    if (rootRef.current) {
      rootRef.current.setAttribute("data-mfx-bare", "");
      const canvas = rootRef.current.querySelector("canvas.metal-fx-canvas") as HTMLCanvasElement | null;
      if (canvas) {
        canvas.style.zIndex = "1";
      }
    }
  }, [mounted]);

  // Mask: Draws the pill capsule shape onto the 2D canvas context.
  const pillMask = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const r = h / 2;
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(0, 0, w, h, r);
    } else {
      ctx.arc(r, r, r, Math.PI / 2, (3 * Math.PI) / 2);
      ctx.arc(w - r, r, r, (3 * Math.PI) / 2, Math.PI / 2);
    }
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  }, []);

  if (!mounted) {
    return (
      <span
        ref={containerRef}
        className={`px-metal-badge ${className}`.trim()}
        {...props}
      >
        <span className="px-metal-badge__content" style={{ color: textColor }}>
          {leading ? <span className="px-metal-badge__leading">{leading}</span> : null}
          <span>{children}</span>
        </span>
      </span>
    );
  }

  return (
    <span
      ref={containerRef}
      className={`px-metal-badge ${className}`.trim()}
      {...props}
    >
      <MetalFx
        ref={rootRef}
        preset={preset}
        theme={theme}
        strength={strength}
        shaderScale={shaderScale}
        mask={pillMask}
        disableGlow
        reflectionTargets={reflectionTargets}
        style={{ background: "transparent", width: 45, height: 25 }}
      >
        <span className="px-metal-badge__content" style={{ color: textColor }}>
          {leading ? <span className="px-metal-badge__leading">{leading}</span> : null}
          <span>{children}</span>
        </span>
      </MetalFx>
    </span>
  );
}

export default MetalBadge;
export { useMetalTextReflection, MetalText, MetalFx, setCursorLightConfig, PRESETS };
