"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_FRAMES = 192;
const GS = "var(--font-general)";
const PO = "var(--font-poppins)";

type Step = { title: string; body: string; side: "left" | "right"; anchor: [number, number] };

const MUTFAK_STEPS: Step[] = [
  { title: "Üst Tabla",        body: "Yüksek yoğunluklu MDF, mat lake veya doğal ahşap kaplama. Nem ve darbe dirençli yüzey işlemi.", side: "left",  anchor: [32, 14] },
  { title: "Gövde Sistemi",    body: "18mm E1 sınıfı sunta, köşe birleştirme konfirmatları. Uzun ömürlü taşıyıcı iç yapı.",           side: "right", anchor: [70, 42] },
  { title: "Aksesuar Paketi",  body: "Blum yumuşak kapanır menteşe ve tam açılım ray sistemi. Sessiz ve hassas hareket.",              side: "left",  anchor: [28, 38] },
  { title: "Çekmece Sistemi",  body: "40 kg kapasiteli tam açılım tel çekmece, ergonomik kulp profili ve geniş iç bölmeleme.",         side: "right", anchor: [68, 70] },
  { title: "Alt Yapı & Ayaklar", body: "Su dirençli PVC bant kenar kaplaması, zemin hizalama için yükseklik ayarlı profil ayak.",    side: "left",  anchor: [36, 82] },
];

const OFIS_STEPS: Step[] = [
  { title: "Masa Yüzeyi",      body: "Çizilmez laminat kaplama, 25mm MDF taşıyıcı. Uzun süreli kullanıma dayanıklı yüzey.",           side: "left",  anchor: [30, 22] },
  { title: "Kabin Sistemi",    body: "Kilitlenebilir kapaklı arşiv ve depolama bölmeleri. Modüler montaj yapısı.",                     side: "right", anchor: [72, 38] },
  { title: "Kablo Yönetimi",   body: "Entegre kablo kanalı ve masa içi priz grubu. Temiz ve düzenli çalışma ortamı.",                  side: "left",  anchor: [26, 55] },
  { title: "Yan Ünite",        body: "Tekerlekli konteyner, asma dosya ve sabit raflar. Ergonomik ulaşım mesafesi.",                   side: "right", anchor: [74, 65] },
  { title: "Ayak Sistemi",     body: "Döküm metal ayak, yükseklik ayarlanabilir versiyon. Zemin hizalama sistemi dahil.",              side: "left",  anchor: [40, 82] },
];

const PRODUCT_CONFIG: Record<number, { steps: Step[]; label: string; desktopFolder: string; mobileFolder: string }> = {
  1: { steps: MUTFAK_STEPS, label: "Yerleşik Mutfak Sistemleri", desktopFolder: "frames-mutfak",        mobileFolder: "frames-urun"         },
  2: { steps: OFIS_STEPS,   label: "Kurumsal & Ofis Üniteleri",  desktopFolder: "frames-ofis-desktop", mobileFolder: "frames-ofis-mobile"  },
};

// kept for page.tsx compatibility
export type UrunDetayItem = {
  id: number;
  navLabel: string;
  tag: string;
  heading: string;
  description: string;
  projeLink?: string;
  annotations: { num: string; title: string; desc: string }[];
};

export default function UrunDetay({ productId = 1 }: { productId?: number; items?: UrunDetayItem[]; activeId?: number }) {
  const sectionRef        = useRef<HTMLDivElement>(null);
  const canvasDesktopRef  = useRef<HTMLCanvasElement>(null);
  const canvasMobileRef   = useRef<HTMLCanvasElement>(null);
  const framesDesktopRef  = useRef<HTMLImageElement[]>([]);
  const framesMobileRef   = useRef<HTMLImageElement[]>([]);
  const frameIdxRef       = useRef(0);
  const rafRef            = useRef<number | null>(null);

  // line measurement refs
  const rowRef       = useRef<HTMLDivElement>(null);
  const leftBoxRef   = useRef<HTMLDivElement>(null);
  const canvasBoxRef = useRef<HTMLDivElement>(null);
  const rightBoxRef  = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  const [step, setStep]   = useState(0);
  const [linePts, setLinePts] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  // preload frame sets — productId değişince yeniden yükle
  useEffect(() => {
    const cfg = PRODUCT_CONFIG[productId] ?? PRODUCT_CONFIG[1]!;
    setReady(false);
    setStep(0);
    frameIdxRef.current = 0;

    let loadedD = 0, loadedM = 0;
    const target = 25;
    const pad = (i: number) => String(i).padStart(4, "0");

    const imgsD: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    const imgsM: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const d = new Image();
      d.src = `/${cfg.desktopFolder}/frame_${pad(i)}.webp`;
      d.onload = () => { loadedD++; if (loadedD >= target && loadedM >= target) setReady(true); };
      imgsD[i - 1] = d;

      const m = new Image();
      m.src = `/${cfg.mobileFolder}/frame_${pad(i)}.webp`;
      m.onload = () => { loadedM++; if (loadedD >= target && loadedM >= target) setReady(true); };
      imgsM[i - 1] = m;
    }
    framesDesktopRef.current = imgsD;
    framesMobileRef.current  = imgsM;
    return () => {
      imgsD.forEach(im => { im.onload = null; });
      imgsM.forEach(im => { im.onload = null; });
    };
  }, [productId]);

  useEffect(() => {
    if (!ready) return;

    const drawTo = (
      canvas: HTMLCanvasElement | null,
      frames: HTMLImageElement[],
      idx: number
    ) => {
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;
      const img = frames[idx];
      if (!img?.complete || !img.naturalWidth) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      const { width: cw, height: ch } = canvas;
      const s = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
      const dx = (cw - img.naturalWidth * s) / 2;
      const dy = (ch - img.naturalHeight * s) / 2;
      ctx.fillStyle = "#d7d5d1";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, img.naturalWidth * s, img.naturalHeight * s);
    };

    const draw = (idx: number) => {
      drawTo(canvasDesktopRef.current, framesDesktopRef.current, idx);
      drawTo(canvasMobileRef.current,  framesMobileRef.current,  idx);
    };

    const resizeOne = (canvas: HTMLCanvasElement | null, frames: HTMLImageElement[]) => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      drawTo(canvas, frames, frameIdxRef.current);
    };

    const resize = () => {
      resizeOne(canvasDesktopRef.current, framesDesktopRef.current);
      resizeOne(canvasMobileRef.current,  framesMobileRef.current);
    };

    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect  = sectionRef.current.getBoundingClientRect();
      const total = sectionRef.current.offsetHeight - window.innerHeight;
      const p     = Math.min(Math.max(-rect.top / total, 0), 1);
      const idx   = Math.floor(p * (TOTAL_FRAMES - 1));
      const newStep = Math.min(Math.floor(p * N), N - 1);
      setStep(newStep);
      if (idx !== frameIdxRef.current) {
        frameIdxRef.current = idx;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => draw(idx));
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
  }, [ready]);

  const goToStep = useCallback((target: number) => {
    if (!sectionRef.current) return;
    const s = Math.max(0, Math.min(N - 1, target));
    const total = sectionRef.current.offsetHeight - window.innerHeight;
    const top   = sectionRef.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + total * ((s + 0.5) / N), behavior: "smooth" });
  }, []);

  const cfg   = PRODUCT_CONFIG[productId] ?? PRODUCT_CONFIG[1]!;
  const steps = cfg.steps;
  const N     = steps.length;
  const cur   = steps[Math.min(step, N - 1)]!;
  const prev  = step > 0     ? steps[step - 1]! : null;
  const next  = step < N - 1 ? steps[step + 1]! : null;

  // annotation line coordinates
  useEffect(() => {
    const measure = () => {
      const row     = rowRef.current;
      const canvas  = canvasBoxRef.current;
      const leftBox = leftBoxRef.current;
      const rightBox= rightBoxRef.current;
      if (!row || !canvas || !leftBox || !rightBox) return;

      const rr = row.getBoundingClientRect();
      const cr = canvas.getBoundingClientRect();

      const [ax, ay] = cur.anchor;
      const anchorX = (cr.left - rr.left) + (ax / 100) * cr.width;
      const anchorY = (cr.top  - rr.top)  + (ay / 100) * cr.height;

      if (cur.side === "left") {
        const br = leftBox.getBoundingClientRect();
        setLinePts({
          x1: br.right  - rr.left,
          y1: br.top    - rr.top + br.height / 2,
          x2: anchorX,
          y2: anchorY,
        });
      } else {
        const br = rightBox.getBoundingClientRect();
        setLinePts({
          x1: anchorX,
          y1: anchorY,
          x2: br.left   - rr.left,
          y2: br.top    - rr.top + br.height / 2,
        });
      }
    };

    const t = setTimeout(measure, 50);
    window.addEventListener("resize", measure);
    return () => { clearTimeout(t); window.removeEventListener("resize", measure); };
  }, [step, cur]);
  return (
    <section ref={sectionRef} style={{ height: `${N * 100 + 100}vh`, background: "#d7d5d1" }}>
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── DESKTOP ───────────────────────────────────── */}
        <div className="hidden md:flex flex-col h-full py-8 gap-4">

          {/* Üst bar */}
          <div className="flex items-center justify-between shrink-0 px-14">
            <span style={{ fontFamily: GS, fontSize: "0.62rem", letterSpacing: "0.48em", textTransform: "uppercase", color: "rgba(26,23,18,0.3)" }}>
              {cfg.label}
            </span>
            <div className="flex items-center gap-1.5">
              {steps.map((_: Step, i: number) => (
                <button key={i} onClick={() => goToStep(i)} className="py-2">
                  <motion.div className="h-px"
                    animate={{ width: i === step ? 36 : 12, background: i === step ? "rgba(26,23,18,0.6)" : "rgba(26,23,18,0.14)" }}
                    transition={{ duration: 0.4 }} />
                </button>
              ))}
              <span style={{ fontFamily: GS, fontSize: "0.62rem", letterSpacing: "0.12em", color: "rgba(26,23,18,0.25)", marginLeft: 8 }}>
                {step + 1} / {N}
              </span>
            </div>
          </div>

          {/* Ana satır: kutu — canvas — kutu */}
          <div ref={rowRef} className="relative flex items-center flex-1 min-h-0">

            {/* SVG overlay — annotation çizgileri */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10, overflow: "visible" }}>
              <AnimatePresence>
                {linePts && (
                  <motion.line
                    key={`line-${step}`}
                    x1={linePts.x1} y1={linePts.y1}
                    x2={linePts.x2} y2={linePts.y2}
                    stroke="rgba(26,23,18,0.85)"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                )}
                {linePts && (
                  <motion.circle
                    key={`dot-${step}`}
                    cx={cur.side === "left" ? linePts.x2 : linePts.x1}
                    cy={cur.side === "left" ? linePts.y2 : linePts.y1}
                    r="5"
                    fill="none"
                    stroke="rgba(26,23,18,0.85)"
                    strokeWidth="1.5"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.65 }}
                  />
                )}
                {linePts && (
                  <motion.circle
                    key={`dot-inner-${step}`}
                    cx={cur.side === "left" ? linePts.x2 : linePts.x1}
                    cy={cur.side === "left" ? linePts.y2 : linePts.y1}
                    r="2.5"
                    fill="rgba(26,23,18,0.85)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                  />
                )}
              </AnimatePresence>
            </svg>

            {/* Sol annotation kutusu */}
            <div ref={leftBoxRef} className="w-[22%] shrink-0 flex items-center px-2">
              <AnimatePresence mode="wait">
                {cur.side === "left" && (
                  <motion.div key={`L-${step}`}
                    initial={{ opacity: 0, x: -32 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full p-5 flex flex-col gap-4"
                    style={{
                      border: "1px solid rgba(26,23,18,0.15)",
                      borderRadius: 4,
                      backgroundImage: "url('/kutuarkaplantahta.webp')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}>
                    <div style={{ width: 20, height: 1, background: "rgba(255,255,255,0.4)" }} />
                    <h3 style={{
                      fontFamily: "var(--font-display)",
                      fontStyle: "italic",
                      fontSize: "clamp(1.5rem, 2.4vw, 2.6rem)",
                      fontWeight: 400,
                      lineHeight: 0.95,
                      letterSpacing: "-0.025em",
                      color: "rgba(255,255,255,0.95)",
                      textShadow: "0 1px 8px rgba(0,0,0,0.3)",
                    }}>
                      {cur.title}
                    </h3>
                    <p style={{ fontFamily: GS, fontSize: "0.78rem", fontWeight: 300, color: "rgba(255,255,255,0.72)", lineHeight: 1.85, textShadow: "0 1px 4px rgba(0,0,0,0.2)" }}>
                      {cur.body}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CANVAS — orta */}
            <div ref={canvasBoxRef} className="flex-1 min-w-0 flex flex-col items-center gap-3 px-4">
              <div className="relative w-full rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.13)]"
                style={{ aspectRatio: "16/9", width: "100%", maxWidth: "min(100%, calc(52vh * 16 / 9))" }}>
                <canvas ref={canvasDesktopRef} className="absolute inset-0 w-full h-full" />
              </div>

              {/* Oklar — canvas altı, dışarıda */}
              <div className="flex items-center gap-3">
                <button onClick={() => goToStep(step - 1)} disabled={step === 0}
                  className="group transition-all duration-300"
                  style={{ opacity: step === 0 ? 0.18 : 1 }}>
                  <motion.div whileHover={{ x: -3 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="w-9 h-9 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-200"
                    style={{ border: "1px solid rgba(26,23,18,0.2)", background: "rgba(26,23,18,0.04)" }}>
                    <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
                      <path d="M6 2L2 7L6 12" stroke="rgba(26,23,18,0.65)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                </button>

                <button onClick={() => goToStep(step + 1)} disabled={step === N - 1}
                  className="group transition-all duration-300"
                  style={{ opacity: step === N - 1 ? 0.18 : 1 }}>
                  <motion.div whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="w-9 h-9 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-200"
                    style={{ border: "1px solid rgba(26,23,18,0.2)", background: "rgba(26,23,18,0.04)" }}>
                    <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
                      <path d="M3 2L7 7L3 12" stroke="rgba(26,23,18,0.65)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                </button>
              </div>
            </div>

            {/* Sağ annotation kutusu */}
            <div ref={rightBoxRef} className="w-[22%] shrink-0 flex items-center px-2">
              <AnimatePresence mode="wait">
                {cur.side === "right" && (
                  <motion.div key={`R-${step}`}
                    initial={{ opacity: 0, x: 32 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full p-5 flex flex-col gap-4"
                    style={{
                      border: "1px solid rgba(26,23,18,0.15)",
                      borderRadius: 4,
                      backgroundImage: "url('/kutuarkaplantahta.webp')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}>
                    <div style={{ width: 20, height: 1, background: "rgba(255,255,255,0.4)" }} />
                    <h3 style={{
                      fontFamily: "var(--font-display)",
                      fontStyle: "italic",
                      fontSize: "clamp(1.5rem, 2.4vw, 2.6rem)",
                      fontWeight: 400,
                      lineHeight: 0.95,
                      letterSpacing: "-0.025em",
                      color: "rgba(255,255,255,0.95)",
                      textShadow: "0 1px 8px rgba(0,0,0,0.3)",
                    }}>
                      {cur.title}
                    </h3>
                    <p style={{ fontFamily: GS, fontSize: "0.78rem", fontWeight: 300, color: "rgba(255,255,255,0.72)", lineHeight: 1.85, textShadow: "0 1px 4px rgba(0,0,0,0.2)" }}>
                      {cur.body}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* ── MOBILE ────────────────────────────────────── */}
        <div className="flex md:hidden flex-col items-center justify-center h-full w-full gap-5 px-5">
          <div className="relative rounded-xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.12)] shrink-0"
            style={{ width: "min(240px,65vw)", aspectRatio: "9/16" }}>
            <canvas ref={canvasMobileRef} className="absolute inset-0 w-full h-full" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-2 text-center max-w-xs">
              <h3 style={{ fontFamily: GS, fontSize: "1.05rem", fontWeight: 600, color: "rgba(26,23,18,0.88)" }}>
                {cur.title}
              </h3>
              <p style={{ fontFamily: PO, fontSize: "0.78rem", fontWeight: 300, color: "rgba(26,23,18,0.58)", lineHeight: 1.68 }}>
                {cur.body}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-4">
            <button onClick={() => goToStep(step - 1)} disabled={step === 0}
              className="w-9 h-9 rounded-full border border-black/15 flex items-center justify-center"
              style={{ opacity: step === 0 ? 0.15 : 1 }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7L9 12" stroke="rgba(26,23,18,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex gap-2">
              {steps.map((_: Step, i: number) => (
                <button key={i} onClick={() => goToStep(i)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{ width: i === step ? 20 : 5, background: i === step ? "rgba(26,23,18,0.65)" : "rgba(26,23,18,0.18)" }} />
              ))}
            </div>
            <button onClick={() => goToStep(step + 1)} disabled={step === N - 1}
              className="w-9 h-9 rounded-full border border-black/15 flex items-center justify-center"
              style={{ opacity: step === N - 1 ? 0.15 : 1 }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M5 2L10 7L5 12" stroke="rgba(26,23,18,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
