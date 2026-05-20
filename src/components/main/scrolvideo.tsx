"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";

const TOTAL_FRAMES = 169;
const SCROLL_HEIGHT = "350vh";

function frameUrl(i: number, mobile: boolean) {
  const dir = mobile ? "frames-mobile" : "frames";
  return `/${dir}/frame_${String(i).padStart(4, "0")}.webp`;
}

export default function ScrolVideo() {
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const sectionRef      = useRef<HTMLDivElement>(null);
  const framesRef       = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef          = useRef<number | null>(null);

  const [revealDone, setRevealDone]         = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [framesReady, setFramesReady]       = useState(false);
  const [isMobile, setIsMobile]             = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setRevealDone(true),      1500);
    const t2 = setTimeout(() => setOverlayVisible(false), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const rawX    = useMotionValue(0);
  const rawY    = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 80, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 80, damping: 20 });
  const canvasX = useMotionValue(0);
  const canvasY = useMotionValue(0);
  const textX   = useMotionValue(0);
  const textY   = useMotionValue(0);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
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

  useEffect(() => {
    if (isMobile) return;
    const ux = springX.on("change", (v) => { canvasX.set(v * 12); textX.set(v * -20); });
    const uy = springY.on("change", (v) => { canvasY.set(v * 8);  textY.set(v * -14); });
    return () => { ux(); uy(); };
  }, [isMobile, springX, springY, canvasX, canvasY, textX, textY]);

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
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      ctx.drawImage(img, (cw - img.naturalWidth * s) / 2, (ch - img.naturalHeight * s) / 2,
        img.naturalWidth * s, img.naturalHeight * s);
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width        = window.innerWidth  * dpr;
      canvas.height       = window.innerHeight * dpr;
      canvas.style.width  = window.innerWidth  + "px";
      canvas.style.height = window.innerHeight + "px";
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

  useEffect(() => {
    if (isMobile) return;
    const onMove = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth  - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isMobile, rawX, rawY]);

  return (
    <section ref={sectionRef} style={{ height: SCROLL_HEIGHT }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-black">

        {/* Canvas */}
        <motion.div className="absolute inset-0" style={{ x: canvasX, y: canvasY, scale: 1.04 }}>
          <canvas ref={canvasRef} className="w-full h-full" />
        </motion.div>

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)" }} />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #000)" }} />

        {/* Merkezi içerik */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ x: textX, y: textY }}
        >
          <motion.p
            className="text-xs tracking-[0.6em] uppercase text-white/40 mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={revealDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Est. 2010
          </motion.p>

          <motion.h1
            className="leading-none mb-8 select-none"
            initial={{ opacity: 0, y: 50 }}
            animate={revealDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span
              className="block text-white font-bold tracking-tight"
              style={{ fontSize: "clamp(4.5rem,13vw,12rem)", lineHeight: 0.88 }}
            >
              BABUR
            </span>
            <span
              className="block text-white/60 font-light tracking-[0.08em]"
              style={{ fontSize: "clamp(2rem,5.5vw,5rem)", lineHeight: 1.2, letterSpacing: "0.3em" }}
            >
              MOBİLYA
            </span>
          </motion.h1>

          <motion.div
            className="mb-8 h-px w-12 bg-white/25"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={revealDone ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
          />

          <motion.p
            className="text-white/50 font-light mb-12 max-w-md leading-relaxed text-sm md:text-base tracking-wide"
            initial={{ opacity: 0, y: 16 }}
            animate={revealDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            El işçiliği ve modern tasarımın buluştuğu,
            her mekâna anlam katan özel mobilya koleksiyonları.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={revealDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.75 }}
          >
            <PillButton />
          </motion.div>
        </motion.div>

        {/* Scroll göstergesi */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={revealDone ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <motion.div
            className="w-px h-10 bg-white/30"
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-[9px] tracking-[0.4em] uppercase text-white/25">Scroll</span>
        </motion.div>

        {/* Reveal overlay */}
        <AnimatePresence>
          {overlayVisible && <RevealOverlay />}
        </AnimatePresence>
      </div>
    </section>
  );
}

function PillButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      className="relative overflow-hidden inline-flex items-center gap-3 px-10 py-4 rounded-full cursor-pointer"
      style={{
        border: "1px solid rgba(255,255,255,0.3)",
        color: hovered ? "#000" : "rgba(255,255,255,0.85)",
        fontSize: "0.75rem",
        fontWeight: 500,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        transition: "color 0.35s ease",
      }}
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-white"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.38, ease: [0.76, 0, 0.24, 1] }}
      />
      <span className="relative z-10">Koleksiyonu Keşfet</span>
      <motion.span className="relative z-10 inline-flex" animate={{ x: hovered ? 4 : 0 }} transition={{ duration: 0.3 }}>
        <ArrowRight size={13} strokeWidth={1.5} />
      </motion.span>
    </motion.button>
  );
}

function RevealOverlay() {
  const [phase, setPhase] = useState<"line" | "open">("line");
  useEffect(() => {
    const t = setTimeout(() => setPhase("open"), 650);
    return () => clearTimeout(t);
  }, []);

  if (phase === "open") return (
    <>
      <motion.div className="absolute left-0 right-0 top-0 z-50 bg-black" style={{ height: "50%" }}
        initial={{ y: 0 }} animate={{ y: "-100%" }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }} />
      <motion.div className="absolute left-0 right-0 bottom-0 z-50 bg-black" style={{ height: "50%" }}
        initial={{ y: 0 }} animate={{ y: "100%" }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }} />
    </>
  );

  return (
    <div className="absolute inset-0 z-50 bg-black flex items-center justify-center">
      <motion.div className="bg-white/60 h-px"
        initial={{ width: 0 }} animate={{ width: "40vw" }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }} />
    </div>
  );
}
