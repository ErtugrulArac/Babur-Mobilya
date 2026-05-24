"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
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

  // Scroll progress → text wipe up
  const scrollProg  = useMotionValue(0);
  const textExitY   = useTransform(scrollProg, [0, 0.2], [0, -80]);
  const textOpacity = useTransform(scrollProg, [0, 0.2], [1, 0]);
  const textClip    = useTransform(
    scrollProg,
    [0, 0.2],
    ["inset(0 0 0% 0 round 0px)", "inset(0 0 100% 0 round 0px)"]
  );

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
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => {
      images.forEach((img) => { img.onload = null; });
      window.removeEventListener("resize", onResize);
    };
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
      scrollProg.set(progress);
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
      <div className="sticky top-0 overflow-hidden bg-black" style={{ height: "100dvh" }}>

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

        {/* İçerik — desktop: yatay 3 sütun, mobile: dikey */}
        <motion.div
          className="absolute inset-0 flex items-end md:items-center justify-center px-6 md:px-12 pb-16 md:pb-0 pt-20 md:pt-0"
          style={{ y: textExitY, opacity: textOpacity, clipPath: textClip }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 w-full max-w-7xl">

            {/* SOL — Est. + dikey çizgi */}
            <motion.div
              className="hidden md:flex flex-col items-center gap-4 shrink-0 pr-10 md:pr-14"
              initial={{ opacity: 0, x: -20 }}
              animate={revealDone ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              <span className="text-[8px] font-medium tracking-[0.55em] uppercase"
                style={{ color: "rgba(235,225,210,0.45)" }}>
                Est. 2010
              </span>
              <div className="w-px h-16" style={{ background: "rgba(235,225,210,0.12)" }} />
              <span className="text-[7px] font-light tracking-[0.5em] uppercase"
                style={{ writingMode: "vertical-rl", color: "rgba(235,225,210,0.25)" }}>
                Babur Mobilya
              </span>
            </motion.div>

            {/* ORTA — Ana başlık */}
            <motion.div
              className="flex-1 select-none"
              initial={{ opacity: 0, y: 40 }}
              animate={revealDone ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              <p className="md:hidden text-[8px] font-medium tracking-[0.5em] uppercase mb-3"
                style={{ color: "rgba(235,225,210,0.4)" }}>
                Est. 2010
              </p>
              <h1 className="leading-none">
                <span
                  className="block font-semibold tracking-tight"
                  style={{
                    fontSize: "clamp(3rem,10vw,9.5rem)",
                    lineHeight: 0.9,
                    color: "#F0EBE3",
                    letterSpacing: "-0.01em",
                  }}
                >
                  BABUR
                </span>
                <span
                  className="block font-light"
                  style={{
                    fontSize: "clamp(1.2rem,3.6vw,3.8rem)",
                    lineHeight: 1.2,
                    letterSpacing: "0.38em",
                    color: "rgba(235,225,210,0.42)",
                  }}
                >
                  MOBİLYA
                </span>
              </h1>
            </motion.div>

            {/* SAĞ — tagline + buton */}
            <motion.div
              className="flex items-start md:pl-10 md:border-l"
              style={{ borderColor: "rgba(235,225,210,0.1)", fontFamily: "var(--font-poppins)" }}
              initial={{ opacity: 0, x: 20 }}
              animate={revealDone ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              <div className="flex flex-col gap-5 max-w-55 md:max-w-xs">
                <p
                  className="font-light leading-relaxed"
                  style={{
                    fontSize: "clamp(0.72rem,1vw,0.88rem)",
                    letterSpacing: "0.02em",
                    color: "rgba(235,225,210,0.72)",
                  }}
                >
                  El işçiliği ve modern tasarımın buluştuğu,
                  her mekâna anlam katan özel mobilya koleksiyonları.
                </p>
                <div className="h-px w-8" style={{ background: "rgba(235,225,210,0.18)" }} />
                <PillButton />
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* Annotation kutucukları */}
        <AnnotationLayer scrollProg={scrollProg} isMobile={isMobile} />

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
      className="relative overflow-hidden inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full cursor-pointer"
      style={{
        border: "1px solid rgba(235,225,210,0.3)",
        color: hovered ? "#1a1410" : "rgba(235,225,210,0.8)",
        fontFamily: "var(--font-poppins)",
        fontSize: "0.68rem",
        fontWeight: 500,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        transition: "color 0.35s ease",
      }}
    >
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ background: "rgba(235,225,210,0.92)" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.38, ease: [0.76, 0, 0.24, 1] }}
      />
      <span className="relative z-10 whitespace-nowrap">Koleksiyonu Keşfet</span>
      <motion.span className="relative z-10 inline-flex" animate={{ x: hovered ? 4 : 0 }} transition={{ duration: 0.3 }}>
        <ArrowRight size={13} strokeWidth={1.5} />
      </motion.span>
    </motion.button>
  );
}

// ── Annotation kutucukları ────────────────────────────────────────────────────
const ANNOTATIONS = [
  {
    id: 1,
    dot: { x: 22, y: 38 }, box: { x: 4,  y: 18 },
    mobileDot: { x: 25, y: 38 }, mobileBox: { x: 6, y: 30 },
    label: "Masif Ahşap Gövde",
  },
  {
    id: 2,
    dot: { x: 62, y: 32 }, box: { x: 54, y: 18 },
    mobileDot: { x: 62, y: 38 }, mobileBox: { x: 50, y: 30 },
    label: "Mat Lak Yüzey",
  },
  {
    id: 3,
    dot: { x: 78, y: 62 }, box: { x: 68, y: 74 },
    mobileDot: { x: 65, y: 60 }, mobileBox: { x: 50, y: 60 },
    label: "Yumuşak Kapama",
  },
  {
    id: 4,
    dot: { x: 38, y: 72 }, box: { x: 22, y: 80 },
    mobileDot: { x: 32, y: 60 }, mobileBox: { x: 6, y: 60 },
    label: "Entegre Aydınlatma",
  },
];

function AnnotationLayer({ scrollProg, isMobile }: { scrollProg: ReturnType<typeof useMotionValue<number>>; isMobile: boolean }) {
  const layerOpacity = useTransform(scrollProg, [0.22, 0.32, 0.80, 0.92], [0, 1, 1, 0]);

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: layerOpacity }}
    >
      <svg className="absolute inset-0 w-full h-full overflow-visible">
        {ANNOTATIONS.map((a, i) => (
          <AnnotationLine key={a.id} annotation={a} delay={i * 0.12} scrollProg={scrollProg} isMobile={isMobile} />
        ))}
      </svg>
      {ANNOTATIONS.map((a, i) => (
        <AnnotationBox key={a.id} annotation={a} delay={i * 0.12 + 0.08} scrollProg={scrollProg} isMobile={isMobile} />
      ))}
    </motion.div>
  );
}

function AnnotationLine({
  annotation,
  delay,
  scrollProg,
  isMobile,
}: {
  annotation: typeof ANNOTATIONS[0];
  delay: number;
  scrollProg: ReturnType<typeof useMotionValue<number>>;
  isMobile: boolean;
}) {
  const ref = useRef<SVGLineElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    return scrollProg.on("change", (v) => {
      if (!ref.current) return;
      if (v > 0.28 && !triggered.current) {
        triggered.current = true;
        ref.current.style.transition = `stroke-dashoffset ${0.5}s ease ${delay}s`;
        ref.current.style.strokeDashoffset = "0";
      }
      if (v < 0.22) {
        triggered.current = false;
        ref.current.style.transition = "none";
        ref.current.style.strokeDashoffset = "60";
      }
    });
  }, [scrollProg, delay]);

  const dot = isMobile ? annotation.mobileDot : annotation.dot;
  const box = isMobile ? annotation.mobileBox : annotation.box;
  const x1 = `${dot.x}%`;
  const y1 = `${dot.y}%`;
  const x2 = `${box.x + 6}%`;
  const y2 = `${box.y + 2}%`;

  return (
    <>
      {/* Dot */}
      <circle cx={x1} cy={y1} r="2.5" fill="white" opacity="0.6" />
      <circle cx={x1} cy={y1} r="5" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
      {/* Line */}
      <line
        ref={ref}
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="white" strokeWidth="0.5" opacity="0.4"
        strokeDasharray="60" strokeDashoffset="60"
      />
    </>
  );
}

function AnnotationBox({
  annotation,
  delay,
  scrollProg,
  isMobile,
}: {
  annotation: typeof ANNOTATIONS[0];
  delay: number;
  scrollProg: ReturnType<typeof useMotionValue<number>>;
  isMobile: boolean;
}) {
  const opacity = useTransform(scrollProg, [0.28 + delay * 0.5, 0.32 + delay * 0.5], [0, 1]);
  const y       = useTransform(scrollProg, [0.28 + delay * 0.5, 0.32 + delay * 0.5], [6, 0]);

  return (
    <motion.div
      className="absolute flex items-start gap-1.5 px-2.5 py-2"
      style={{
        left: `${isMobile ? annotation.mobileBox.x : annotation.box.x}%`,
        top:  `${isMobile ? annotation.mobileBox.y : annotation.box.y}%`,
        opacity,
        y,
        background: "rgba(0,0,0,0.65)",
        border: "1px solid rgba(255,255,255,0.18)",
        backdropFilter: "blur(6px)",
        minWidth: isMobile ? 80 : 120,
      }}
    >
      {/* ⊠ icon */}
      <svg width="10" height="10" viewBox="0 0 10 10" className="shrink-0 mt-0.5 opacity-70">
        <rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="white" strokeWidth="0.8"/>
        <line x1="1.5" y1="1.5" x2="8.5" y2="8.5" stroke="white" strokeWidth="0.8"/>
        <line x1="8.5" y1="1.5" x2="1.5" y2="8.5" stroke="white" strokeWidth="0.8"/>
      </svg>
      <span
        className="text-white/80 font-medium uppercase whitespace-nowrap"
        style={{ fontSize: "0.58rem", letterSpacing: "0.12em", lineHeight: 1.4 }}
      >
        {annotation.label}
      </span>
    </motion.div>
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
