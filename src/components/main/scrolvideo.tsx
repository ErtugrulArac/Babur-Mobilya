"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowRight } from "lucide-react";

const TOTAL_FRAMES = 169;
const SCROLL_HEIGHT = "350vh";

function frameUrl(i: number, mobile: boolean) {
  const dir = mobile ? "frames-mobile" : "frames";
  return `/${dir}/frame_${String(i).padStart(4, "0")}.jpg`;
}

// Gold accent colour used throughout
const GOLD = "#C9A96E";

export default function ScrolVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [revealDone, setRevealDone] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [framesReady, setFramesReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setRevealDone(true), 1500);
    const t2 = setTimeout(() => setOverlayVisible(false), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Mouse parallax motion values (unused on mobile — springs stay at 0)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 80, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 80, damping: 20 });

  const canvasX = useMotionValue(0);
  const canvasY = useMotionValue(0);
  const textX  = useMotionValue(0);
  const textY  = useMotionValue(0);

  // Detect mobile, then load the right frame set
  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    setFramesReady(false);

    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let loaded = 0;
    const onLoad = () => { loaded++; if (loaded === 30) setFramesReady(true); };
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = frameUrl(i, mobile);
      img.onload = onLoad;
      images[i - 1] = img;
    }
    framesRef.current = images;
    return () => { images.forEach((img) => { img.onload = null; }); };
  }, []);

  // Parallax spring subscriptions — skip on mobile (no mouse events)
  useEffect(() => {
    if (isMobile) return;
    const unsubX = springX.on("change", (v) => { canvasX.set(v * 12); textX.set(v * -28); });
    const unsubY = springY.on("change", (v) => { canvasY.set(v * 8);  textY.set(v * -18); });
    return () => { unsubX(); unsubY(); };
  }, [isMobile, springX, springY, canvasX, canvasY, textX, textY]);

  // Canvas scroll scrubbing
  useEffect(() => {
    if (!framesReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const drawFrame = (index: number) => {
      const img = framesRef.current[index];
      if (!img?.complete || !img.naturalWidth) return;
      const { width: cw, height: ch } = canvas;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(currentFrameRef.current);
    };

    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect  = sectionRef.current.getBoundingClientRect();
      const total = sectionRef.current.offsetHeight - window.innerHeight;
      const progress   = Math.min(Math.max(-rect.top / total, 0), 1);
      const frameIndex = Math.floor(progress * (TOTAL_FRAMES - 1));
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [framesReady]);

  // mousemove only on desktop — touch devices have no cursor
  useEffect(() => {
    if (isMobile) return;
    const onMouseMove = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth  - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [isMobile, rawX, rawY]);

  return (
    <section ref={sectionRef} style={{ height: SCROLL_HEIGHT }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-black">

        {/* Canvas */}
        <motion.div className="absolute inset-0" style={{ x: canvasX, y: canvasY, scale: 1.05 }}>
          <canvas ref={canvasRef} className="w-full h-full" />
        </motion.div>

        {/* Gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/10 to-black/75 pointer-events-none" />

        {/* Text + Button */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-end pb-16 pl-10 md:pl-20"
          style={{ x: textX, y: textY }}
        >
          {/* Est. label */}
          <motion.p
            className="text-xs tracking-[0.45em] uppercase mb-5"
            style={{ color: GOLD, fontFamily: "var(--font-cormorant)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={revealDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            Est. &nbsp;2010
          </motion.p>

          {/* Main heading */}
          <motion.h1
            className="leading-[0.9] uppercase mb-6"
            style={{ fontFamily: "var(--font-cormorant)" }}
            initial={{ opacity: 0, y: 48 }}
            animate={revealDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.05, delay: 0.3 }}
          >
            <span className="block text-white text-[clamp(2.4rem,6vw,5.5rem)] font-light tracking-[0.22em]">
              Babur
            </span>
            <span
              className="block text-[clamp(2.4rem,6vw,5.5rem)] font-medium italic tracking-[0.18em]"
              style={{ color: GOLD }}
            >
              Mobilya
            </span>
          </motion.h1>

          {/* Gold divider */}
          <motion.div
            className="mb-5 h-px w-20"
            style={{
              background: `linear-gradient(to right, ${GOLD}, transparent)`,
              originX: "left",
            }}
            initial={{ scaleX: 0 }}
            animate={revealDone ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          />

          {/* Tagline */}
          <motion.p
            className="text-white/70 font-light tracking-[0.2em] text-base md:text-lg mb-10 max-w-sm leading-relaxed"
            style={{ fontFamily: "var(--font-cormorant)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={revealDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            El işçiliği ve modern tasarımın buluştuğu,
            <br />
            her mekâna anlam katan özel mobilya koleksiyonları.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={revealDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.75 }}
          >
            <CTAButton />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 right-10 flex flex-col items-center gap-3 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={revealDone ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <span
            className="text-[10px] tracking-[0.35em] uppercase"
            style={{ color: GOLD, writingMode: "vertical-rl", letterSpacing: "0.35em" }}
          >
            Scroll
          </span>
          <motion.div
            className="w-px h-12"
            style={{ background: `linear-gradient(to bottom, ${GOLD}80, transparent)`, originY: "top" }}
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Reveal overlay */}
        <AnimatePresence>
          {overlayVisible && <RevealOverlay />}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ── Premium CTA Button (adapted from Magic MCP) ─────────────────────────── */
function CTAButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      className="relative overflow-hidden inline-flex items-center gap-3 px-8 py-3.5 text-sm tracking-[0.25em] uppercase cursor-pointer"
      style={{
        border: `1px solid ${GOLD}`,
        color: hovered ? "#0a0a0a" : GOLD,
        fontFamily: "var(--font-cormorant)",
        fontSize: "0.95rem",
        fontWeight: 500,
        transition: "color 0.35s ease",
      }}
    >
      {/* Fill on hover */}
      <motion.span
        className="absolute inset-0 z-0"
        style={{ backgroundColor: GOLD }}
        initial={{ x: "-100%" }}
        animate={{ x: hovered ? "0%" : "-100%" }}
        transition={{ duration: 0.38, ease: [0.76, 0, 0.24, 1] }}
      />

      <span className="relative z-10">Koleksiyonu Keşfet</span>

      <motion.span
        className="relative z-10 inline-flex"
        animate={{ x: hovered ? 5 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <ArrowRight size={15} strokeWidth={1.5} />
      </motion.span>
    </motion.button>
  );
}

/* ── Opening reveal overlay ───────────────────────────────────────────────── */
function RevealOverlay() {
  const [phase, setPhase] = useState<"line" | "open">("line");

  useEffect(() => {
    const t = setTimeout(() => setPhase("open"), 650);
    return () => clearTimeout(t);
  }, []);

  if (phase === "open") {
    return (
      <>
        <motion.div
          className="absolute left-0 right-0 top-0 z-50 bg-black"
          style={{ height: "50%" }}
          initial={{ y: 0 }}
          animate={{ y: "-100%" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        />
        <motion.div
          className="absolute left-0 right-0 bottom-0 z-50 bg-black"
          style={{ height: "50%" }}
          initial={{ y: 0 }}
          animate={{ y: "100%" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        />
      </>
    );
  }

  return (
    <div className="absolute inset-0 z-50 bg-black flex items-center justify-center">
      <motion.div
        style={{ height: 1, backgroundColor: GOLD }}
        initial={{ width: 0 }}
        animate={{ width: "40vw" }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
      />
    </div>
  );
}
