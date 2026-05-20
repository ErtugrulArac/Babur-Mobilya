"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Armchair, BarChart2, Layers, Sparkles, ShieldCheck, Truck, Wrench, Leaf } from "lucide-react";

const TOTAL_FRAMES = 193;
const SCROLL_HEIGHT = "560vh";

const BOX_DARK: React.CSSProperties = {
  background: "rgba(8,8,8,0.90)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderLeft: "2px solid rgba(255,255,255,0.2)",
};
const BOX_LIGHT: React.CSSProperties = {
  background: "rgba(20,20,22,0.88)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderTop: "2px solid rgba(255,255,255,0.15)",
};
const BOX_GLASS: React.CSSProperties = {
  background: "rgba(12,12,14,0.82)",
  backdropFilter: "blur(14px)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRight: "2px solid rgba(255,255,255,0.2)",
};

function frameUrl(i: number, mobile: boolean) {
  const dir = mobile ? "frames-ofis-mobile" : "frames-ofis";
  return `/${dir}/frame_${String(i).padStart(4, "0")}.webp`;
}

function getPhase(p: number): 0 | 1 | 2 | 3 {
  if (p < 0.14) return 0;
  if (p < 0.50) return 1;
  if (p < 0.86) return 2;
  return 3;
}

export default function Ofis() {
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const sectionRef      = useRef<HTMLDivElement>(null);
  const framesRef       = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef          = useRef<number | null>(null);

  const [framesReady, setFramesReady] = useState(false);
  const [isMobile, setIsMobile]       = useState(false);
  const [phase, setPhase]             = useState<0 | 1 | 2 | 3>(0);
  const phaseTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingPhaseRef = useRef<0 | 1 | 2 | 3>(0);

  const rawX    = useMotionValue(0);
  const rawY    = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 80, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 80, damping: 20 });
  const canvasX = useMotionValue(0);
  const canvasY = useMotionValue(0);

  // Parallax — sadece desktop
  useEffect(() => {
    if (isMobile) return;
    const ux = springX.on("change", (v) => canvasX.set(v * 10));
    const uy = springY.on("change", (v) => canvasY.set(v * 7));
    return () => { ux(); uy(); };
  }, [isMobile, springX, springY, canvasX, canvasY]);

  // Mobile tespiti + frame yükleme
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
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      ctx.drawImage(img,
        (cw - img.naturalWidth * s) / 2,
        (ch - img.naturalHeight * s) / 2,
        img.naturalWidth * s,
        img.naturalHeight * s);
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
      const progress = Math.min(Math.max(-rect.top / total, 0), 1);

      const newPhase = getPhase(progress);
      if (newPhase !== pendingPhaseRef.current) {
        pendingPhaseRef.current = newPhase;
        if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
        phaseTimerRef.current = setTimeout(() => setPhase(newPhase), 150);
      }

      const idx = Math.floor(progress * (TOTAL_FRAMES - 1));
      if (idx !== currentFrameRef.current) {
        currentFrameRef.current = idx;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(idx));
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, [framesReady]);

  // Mouse parallax — desktop only
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

        <div className="absolute inset-0 bg-black/35 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #000)" }} />

        <AnimatePresence mode="sync">

          {/* FAZ 0 — SOLDAN: giriş kutusu */}
          {phase === 0 && (
            <motion.div
              key="p0"
              className="absolute left-0 top-1/2 -translate-y-1/2 p-6 md:p-10 w-[85vw] max-w-xs md:max-w-sm"
              style={BOX_DARK}
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            >
              <motion.div
                className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-4 md:mb-6"
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Armchair size={isMobile ? 16 : 20} strokeWidth={1.2} className="text-white/60" />
              </motion.div>

              <motion.h2
                className="text-white font-bold leading-tight mb-3 md:mb-4"
                style={{ fontSize: "clamp(1.3rem,4vw,2rem)" }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.6 }}
              >
                Ofis Mobilyası<br />Tasarım & Üretimi
              </motion.h2>

              <motion.p
                className="text-white/45 leading-relaxed"
                style={{ fontSize: "clamp(0.75rem,2.5vw,0.9rem)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                Yönetici odalarından açık çalışma alanlarına, toplantı
                ünitelerinden resepsiyon tasarımlarına — her ofis mobilyası
                mekanın işlevini ve kurumsal kimliğini yansıtacak şekilde
                özel olarak inşa edilir.
              </motion.p>
            </motion.div>
          )}

          {/* FAZ 1 — SOL + SAĞ (mobilde üst + alt) */}
          {phase === 1 && (
            <motion.div key="p1" className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}>

              {/* Sol / Üst */}
              <motion.div
                className={`absolute ${
                  isMobile
                    ? "left-3 right-3 top-[14%] p-3"
                    : "left-0 top-1/2 translate-y-[-62%] w-72 md:w-76 p-5 md:p-9"
                }`}
                style={BOX_DARK}
                initial={{ x: isMobile ? 0 : "-100%", y: isMobile ? -30 : 0, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                exit={{ x: isMobile ? 0 : "-100%", y: isMobile ? -30 : 0, opacity: 0 }}
                transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
              >
                <div className="w-7 h-7 md:w-11 md:h-11 rounded-full flex items-center justify-center mb-2 md:mb-5"
                  style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
                  <BarChart2 size={isMobile ? 12 : 18} strokeWidth={1.2} className="text-white/60" />
                </div>
                <h3 className="text-white font-bold leading-tight mb-1"
                  style={{ fontSize: "clamp(0.9rem,3.5vw,1.8rem)" }}>
                  Çalışma Masası<br />& Depolama
                </h3>
                <p className="text-white/40 leading-snug"
                  style={{ fontSize: "clamp(0.65rem,2vw,0.85rem)" }}>
                  Masif ahşap ve metal kombinasyonuyla üretilen çalışma
                  masaları; kablo kanalları, gizli çekmeceler ve ergonomik
                  yükseklik ayarı ile birlikte tasarlanır.
                </p>
              </motion.div>

              {/* Sağ / Alt */}
              <motion.div
                className={`absolute ${
                  isMobile
                    ? "left-3 right-3 bottom-[8%] p-3"
                    : "right-0 top-1/2 translate-y-[-38%] w-72 md:w-76 p-5 md:p-9"
                }`}
                style={BOX_LIGHT}
                initial={{ x: isMobile ? 0 : "100%", y: isMobile ? 30 : 0, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                exit={{ x: isMobile ? 0 : "100%", y: isMobile ? 30 : 0, opacity: 0 }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
              >
                <div className="w-7 h-7 md:w-11 md:h-11 rounded-full flex items-center justify-center mb-2 md:mb-5"
                  style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
                  <Sparkles size={isMobile ? 12 : 18} strokeWidth={1.2} className="text-white/60" />
                </div>
                <h3 className="text-white font-bold leading-tight mb-1"
                  style={{ fontSize: "clamp(0.9rem,3.5vw,1.8rem)" }}>
                  Toplantı & Yönetici<br />Üniteleri
                </h3>
                <p className="text-white/40 leading-snug"
                  style={{ fontSize: "clamp(0.65rem,2vw,0.85rem)" }}>
                  Kurumsal kimliğinizi yansıtan toplantı masaları, yönetici
                  ofis üniteleri ve kabul alanı mobilyaları özel ölçü ve
                  malzeme seçimiyle üretilir.
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* FAZ 2 — ALTTAN: geniş feature kutusu */}
          {phase === 2 && (
            <motion.div
              key="p2"
              className="absolute bottom-0 left-0 right-0 pt-4 md:pt-10"
              style={BOX_LIGHT}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            >
              <motion.p
                className="text-white font-bold leading-tight mb-5 md:mb-8 px-5 md:px-10"
                style={{ fontSize: "clamp(0.95rem,3.5vw,2.6rem)" }}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                İşin kalitesi,{" "}
                <span className="text-white/40 font-light">mekanın kalitesinden</span> başlar.
              </motion.p>

              <div className="grid grid-cols-3 md:grid-cols-7 gap-0 w-full">
                {[
                  { Icon: Layers,      title: "Ergonomi",          desc: "İnsan odaklı tasarım ve ayarlanabilir sistemler",  mobileVisible: true  },
                  { Icon: BarChart2,   title: "Premium Malzeme",   desc: "Avrupa standartlarında hammadde ve işçilik",       mobileVisible: true  },
                  { Icon: Sparkles,    title: "Özel Üretim",       desc: "Her projeye özgü ölçü ve konfigürasyon",          mobileVisible: true  },
                  { Icon: ShieldCheck, title: "5 Yıl Garanti",     desc: "Malzeme ve işçilik garantisi",                    mobileVisible: false },
                  { Icon: Truck,       title: "Hızlı Teslimat",    desc: "Proje tesliminde güvenilir planlama",             mobileVisible: false },
                  { Icon: Wrench,      title: "Kurulum",           desc: "Profesyonel montaj ve kurulum hizmeti",           mobileVisible: false },
                  { Icon: Leaf,        title: "Sürdürülebilirlik", desc: "Çevre dostu malzeme ve üretim süreçleri",         mobileVisible: false },
                ].map(({ Icon, title, desc, mobileVisible }, i) => (
                  <motion.div key={title}
                    className={`flex flex-col gap-2 p-3 md:p-6 border-r border-white/8 last:border-r-0 ${!mobileVisible ? "hidden md:flex" : ""}`}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 + i * 0.07, duration: 0.5 }}>
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center"
                      style={{ border: "1px solid rgba(255,255,255,0.18)" }}>
                      <Icon size={16} strokeWidth={1.2} className="text-white/60" />
                    </div>
                    <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.1)" }} />
                    <span className="text-white/85 font-semibold leading-tight"
                      style={{ fontSize: "clamp(0.78rem,1.1vw,0.92rem)" }}>{title}</span>
                    <span className="text-white/35 leading-snug"
                      style={{ fontSize: "clamp(0.68rem,0.9vw,0.78rem)" }}>{desc}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* FAZ 3 — SAĞDAN: CTA */}
          {phase === 3 && (
            <motion.div
              key="p3"
              className={`absolute p-7 md:p-12 ${
                isMobile
                  ? "left-3 right-3 bottom-[8%]"
                  : "right-0 top-1/2 -translate-y-1/2 max-w-sm"
              }`}
              style={BOX_GLASS}
              initial={{ x: isMobile ? 0 : "100%", y: isMobile ? 40 : 0, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={{ x: isMobile ? 0 : "100%", y: isMobile ? 40 : 0, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            >
              <motion.div className="w-10 h-10 rounded-full flex items-center justify-center mb-4 md:mb-6"
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}>
                <ArrowUpRight size={16} strokeWidth={1.2} className="text-white/60" />
              </motion.div>

              <motion.h3
                className="text-white font-bold leading-tight mb-3 md:mb-4"
                style={{ fontSize: "clamp(1.3rem,4vw,2.2rem)" }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.65 }}
              >
                Çalışma Alanınızı<br />
                <span className="text-white/40 font-light">Dönüştürelim</span>
              </motion.h3>

              <motion.p
                className="text-white/40 leading-relaxed mb-5 md:mb-8"
                style={{ fontSize: "clamp(0.75rem,2.2vw,0.9rem)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.52 }}
              >
                Ofis koleksiyonumuzu inceleyin, ücretsiz tasarım danışmanlığı için bize ulaşın.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.62, duration: 0.5 }}
                whileHover="hover" whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 cursor-pointer"
              >
                <span className="text-white/60 uppercase tracking-[0.35em]"
                  style={{ fontSize: "clamp(0.65rem,1.8vw,0.75rem)" }}>
                  Ofis Koleksiyonu
                </span>
                <motion.div
                  className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/20"
                  variants={{ hover: { backgroundColor: "white", scale: 1.1 } }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowUpRight size={12} strokeWidth={1.5} className="text-white/60" />
                </motion.div>
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Sol chapter göstergesi — desktop only */}
        {!isMobile && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 pointer-events-none select-none">
            <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.15))" }} />
            <span className="text-[8px] tracking-[0.4em] uppercase text-white/20"
              style={{ writingMode: "vertical-rl" }}>02</span>
            <div className="flex flex-col gap-1.5 my-1">
              {[0, 1, 2, 3].map((p) => (
                <motion.div key={p}
                  animate={{ width: phase === p ? 16 : 3, opacity: phase === p ? 0.7 : 0.2 }}
                  transition={{ duration: 0.35 }}
                  style={{ height: 1, background: "white", borderRadius: 1 }} />
              ))}
            </div>
            <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)" }} />
          </div>
        )}

      </div>
    </section>
  );
}
