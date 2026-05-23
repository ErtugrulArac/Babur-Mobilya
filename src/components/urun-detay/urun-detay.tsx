"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_FRAMES = 192;
const GS = "var(--font-general)";

type Step = { title: string; body: string; side: "left" | "right"; anchor: [number, number] };

const MUTFAK_STEPS: Step[] = [
  { title: "Üst Tabla",          body: "Yüksek yoğunluklu MDF, mat lake veya doğal ahşap kaplama. Nem ve darbe dirençli yüzey işlemi.",     side: "left",  anchor: [32, 14] },
  { title: "Gövde Sistemi",      body: "18mm E1 sınıfı sunta, köşe birleştirme konfirmatları. Uzun ömürlü taşıyıcı iç yapı.",                side: "right", anchor: [70, 42] },
  { title: "Aksesuar Paketi",    body: "Blum yumuşak kapanır menteşe ve tam açılım ray sistemi. Sessiz ve hassas hareket.",                  side: "left",  anchor: [28, 38] },
  { title: "Çekmece Sistemi",    body: "40 kg kapasiteli tam açılım tel çekmece, ergonomik kulp profili ve geniş iç bölmeleme.",              side: "right", anchor: [68, 70] },
  { title: "Alt Yapı & Ayaklar", body: "Su dirençli PVC bant kenar kaplaması, zemin hizalama için yükseklik ayarlı profil ayak.",           side: "left",  anchor: [36, 82] },
];

const OFIS_STEPS: Step[] = [
  { title: "Masa Yüzeyi",     body: "Çizilmez laminat kaplama, 25mm MDF taşıyıcı. Uzun süreli kullanıma dayanıklı yüzey.",            side: "left",  anchor: [30, 22] },
  { title: "Kabin Sistemi",   body: "Kilitlenebilir kapaklı arşiv ve depolama bölmeleri. Modüler montaj yapısı.",                      side: "right", anchor: [72, 38] },
  { title: "Kablo Yönetimi",  body: "Entegre kablo kanalı ve masa içi priz grubu. Temiz ve düzenli çalışma ortamı.",                   side: "left",  anchor: [26, 55] },
  { title: "Yan Ünite",       body: "Tekerlekli konteyner, asma dosya ve sabit raflar. Ergonomik ulaşım mesafesi.",                    side: "right", anchor: [74, 65] },
  { title: "Ayak Sistemi",    body: "Döküm metal ayak, yükseklik ayarlanabilir versiyon. Zemin hizalama sistemi dahil.",               side: "left",  anchor: [40, 82] },
];

const MASA_STEPS: Step[] = [
  { title: "Tabla Yüzeyi",   body: "Masif ahşap veya yüksek baskı laminat. Çizilmez, ısıya dayanıklı yüzey seçenekleri.",          side: "left",  anchor: [35, 18] },
  { title: "Kasa & Ayaklar", body: "Alüminyum veya masif ahşap taşıyıcı bacaklar. Zemin hizalama vidası dahil.",                    side: "right", anchor: [72, 45] },
  { title: "Uzatma Sistemi", body: "Yaylı kelebek uzatma mekanizması. 50 cm ek kapasite, sessiz açılım.",                           side: "left",  anchor: [30, 55] },
  { title: "Kenar Detayı",   body: "El yapımı ahşap kenar bandı veya 3mm yarıçaplı köşe profili. Dokunuşta fark hissedilir.",       side: "right", anchor: [70, 72] },
  { title: "Yüzey Koruma",   body: "Su bazlı vernik veya mat/parlak lake. UV dirençli, uzun ömürlü koruma katmanı.",                 side: "left",  anchor: [38, 85] },
];

const PRODUCT_CONFIG: Record<number, { steps: Step[]; label: string; desktopFolder: string; mobileFolder: string }> = {
  1: { steps: MUTFAK_STEPS, label: "Yerleşik Mutfak Sistemleri", desktopFolder: "frames-mutfak",        mobileFolder: "frames-urun"        },
  2: { steps: OFIS_STEPS,   label: "Kurumsal & Ofis Üniteleri",  desktopFolder: "frames-ofis-desktop",  mobileFolder: "frames-ofis-mobile" },
  4: { steps: MASA_STEPS,   label: "Masa & Oturma Grupları",     desktopFolder: "frames-masa-desktop",  mobileFolder: "frames-masa-mobile" },
};

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
  const sectionRef       = useRef<HTMLDivElement>(null);
  const canvasDesktopRef = useRef<HTMLCanvasElement>(null);
  const canvasMobileRef  = useRef<HTMLCanvasElement>(null);
  const framesDesktopRef = useRef<HTMLImageElement[]>([]);
  const framesMobileRef  = useRef<HTMLImageElement[]>([]);
  const frameIdxRef      = useRef(0);
  const rafRef           = useRef<number | null>(null);

  const rowRef      = useRef<HTMLDivElement>(null);
  const leftBoxRef  = useRef<HTMLDivElement>(null);
  const rightBoxRef = useRef<HTMLDivElement>(null);
  const canvasBoxRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  const [step, setStep]   = useState(0);

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

    const drawTo = (canvas: HTMLCanvasElement | null, frames: HTMLImageElement[], idx: number) => {
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;
      const img = frames[idx];
      if (!img?.complete || !img.naturalWidth) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      const { width: cw, height: ch } = canvas;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dx = (cw - img.naturalWidth * s) / 2;
      const dy = (ch - img.naturalHeight * s) / 2;
      ctx.drawImage(img, dx, dy, img.naturalWidth * s, img.naturalHeight * s);
    };

    const draw = (idx: number) => {
      drawTo(canvasDesktopRef.current, framesDesktopRef.current, idx);
      drawTo(canvasMobileRef.current,  framesMobileRef.current,  idx);
    };

    const resizeOne = (canvas: HTMLCanvasElement | null, frames: HTMLImageElement[]) => {
      if (!canvas) return;
      if (!canvas.offsetWidth || !canvas.offsetHeight) return;
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

  const annotationBox = (side: "left" | "right") => (
    <AnimatePresence mode="wait">
      {cur.side === side && (
        <motion.div
          key={`${side}-${step}`}
          initial={{ opacity: 0, x: side === "left" ? -24 : 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: side === "left" ? -16 : 16 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-3 p-4"
          style={{
            background: "rgba(10,8,6,0.55)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 6,
            maxWidth: 160,
          }}>
          <div style={{ width: 16, height: 1, background: "rgba(255,255,255,0.3)" }} />
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontStyle: "normal",
            fontSize: "clamp(0.9rem,4vw,1.15rem)",
            fontWeight: 400,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            color: "rgba(255,255,255,0.95)",
          }}>
            {cur.title}
          </h3>
          <p style={{
            fontFamily: GS,
            fontSize: "0.65rem",
            fontWeight: 300,
            color: "rgba(255,255,255,0.62)",
            lineHeight: 1.75,
          }}>
            {cur.body}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <section ref={sectionRef} style={{ height: `${N * 100 + 100}vh` }}>
      <div ref={rowRef} className="sticky top-0 h-screen overflow-hidden">

        {/* ══════════════════════════════════════
            DESKTOP — editorial split layout
            ══════════════════════════════════════ */}
        <div className="hidden md:flex h-full w-full" style={{ background: "#d7d5d1" }}>

          {/* Left column: text + navigation */}
          <div
            className="relative flex flex-col justify-center shrink-0"
            style={{ width: "40%", padding: "5rem 2.5rem 5rem 5rem" }}
          >
            {/* Product label */}
            <span
              style={{
                position: "absolute",
                top: "2.8rem",
                left: "5rem",
                fontFamily: GS,
                fontSize: "0.58rem",
                letterSpacing: "0.48em",
                textTransform: "uppercase",
                color: "rgba(26,23,18,0.32)",
              }}
            >
              {cfg.label}
            </span>

            {/* Step counter */}
            <span
              style={{
                position: "absolute",
                top: "2.8rem",
                right: "2.5rem",
                fontFamily: GS,
                fontSize: "0.58rem",
                letterSpacing: "0.12em",
                color: "rgba(26,23,18,0.25)",
              }}
            >
              {String(step + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </span>

            {/* Animated text block */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`dt-${step}`}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
              >
                <div style={{ width: 28, height: 1, background: "rgba(26,23,18,0.2)" }} />
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "normal",
                    fontSize: "clamp(2.6rem, 3.8vw, 5rem)",
                    fontWeight: 400,
                    lineHeight: 0.93,
                    letterSpacing: "-0.03em",
                    color: "rgba(26,23,18,0.88)",
                  }}
                >
                  {cur.title}
                </h2>
                <p
                  style={{
                    fontFamily: GS,
                    fontSize: "0.84rem",
                    fontWeight: 300,
                    color: "rgba(26,23,18,0.5)",
                    lineHeight: 1.85,
                    maxWidth: "33ch",
                  }}
                >
                  {cur.body}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation: arrows + dots */}
            <div className="flex items-center gap-3" style={{ marginTop: "2.5rem" }}>
              <button
                onClick={() => goToStep(step - 1)}
                disabled={step === 0}
                className="transition-all duration-300"
                style={{ opacity: step === 0 ? 0.18 : 1 }}
              >
                <motion.div
                  whileHover={{ x: -3 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ border: "1px solid rgba(26,23,18,0.22)" }}
                >
                  <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
                    <path d="M6 2L2 7L6 12" stroke="rgba(26,23,18,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </button>

              <div className="flex gap-1.5 items-center">
                {steps.map((_: Step, i: number) => (
                  <button key={i} onClick={() => goToStep(i)} className="py-1.5">
                    <motion.div
                      className="h-px"
                      animate={{
                        width: i === step ? 28 : 10,
                        background: i === step ? "rgba(26,23,18,0.65)" : "rgba(26,23,18,0.18)",
                      }}
                      transition={{ duration: 0.35 }}
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToStep(step + 1)}
                disabled={step === N - 1}
                className="transition-all duration-300"
                style={{ opacity: step === N - 1 ? 0.18 : 1 }}
              >
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ border: "1px solid rgba(26,23,18,0.22)" }}
                >
                  <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
                    <path d="M3 2L7 7L3 12" stroke="rgba(26,23,18,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </button>
            </div>
          </div>

          {/* Right column: contained video canvas */}
          <div
            className="relative flex items-center justify-center"
            style={{ width: "60%", padding: "3.5rem 4.5rem 3.5rem 1rem" }}
          >
            <div
              ref={canvasBoxRef}
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: "16 / 9",
                borderRadius: 10,
                boxShadow:
                  "0 32px 72px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.12)",
              }}
            >
              <canvas ref={canvasDesktopRef} className="absolute inset-0 w-full h-full" />
              {/* subtle bottom vignette */}
              <div
                className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.2), transparent)" }}
              />
            </div>
          </div>

        </div>
        {/* ══════════ END DESKTOP ══════════ */}


        {/* ══════════════════════════════════════
            MOBILE — full-screen (unchanged)
            ══════════════════════════════════════ */}

        {/* Full-screen mobile canvas */}
        <canvas ref={canvasMobileRef} className="md:hidden absolute inset-0 w-full h-full" />

        {/* Mobile top bar */}
        <div className="md:hidden absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-5 z-20">
          <span style={{ fontFamily: GS, fontSize: "0.6rem", letterSpacing: "0.46em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
            {cfg.label}
          </span>
          <div className="flex items-center gap-1.5">
            {steps.map((_: Step, i: number) => (
              <button key={i} onClick={() => goToStep(i)} className="py-2">
                <motion.div
                  className="h-px"
                  animate={{ width: i === step ? 32 : 10, background: i === step ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)" }}
                  transition={{ duration: 0.35 }}
                />
              </button>
            ))}
            <span style={{ fontFamily: GS, fontSize: "0.6rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", marginLeft: 6 }}>
              {step + 1} / {N}
            </span>
          </div>
        </div>

        {/* Mobile left annotation */}
        <div ref={leftBoxRef} className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 z-20">
          {annotationBox("left")}
        </div>

        {/* Mobile right annotation */}
        <div ref={rightBoxRef} className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 z-20">
          {annotationBox("right")}
        </div>

        {/* Mobile bottom gradient */}
        <div
          className="md:hidden absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-10"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)" }}
        />

        {/* Mobile arrows + dots */}
        <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
          <button
            onClick={() => goToStep(step - 1)}
            disabled={step === 0}
            className="group transition-all duration-300"
            style={{ opacity: step === 0 ? 0.18 : 1 }}
          >
            <motion.div
              whileHover={{ x: -3 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
            >
              <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
                <path d="M6 2L2 7L6 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </button>

          <div className="flex gap-1.5">
            {steps.map((_: Step, i: number) => (
              <button
                key={i}
                onClick={() => goToStep(i)}
                className="h-1 rounded-full transition-all duration-300"
                style={{ width: i === step ? 20 : 5, background: i === step ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)" }}
              />
            ))}
          </div>

          <button
            onClick={() => goToStep(step + 1)}
            disabled={step === N - 1}
            className="group transition-all duration-300"
            style={{ opacity: step === N - 1 ? 0.18 : 1 }}
          >
            <motion.div
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
            >
              <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
                <path d="M3 2L7 7L3 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </button>
        </div>
        {/* ══════════ END MOBILE ══════════ */}

      </div>
    </section>
  );
}
