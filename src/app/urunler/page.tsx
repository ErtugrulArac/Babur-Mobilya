"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import UrunDetay from "@/components/urun-detay/urun-detay";


function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  ctaLabel?: string;
  tag?: string;
};

export type CardStackProps<T extends CardStackItem> = {
  items: T[];
  initialIndex?: number;
  maxVisible?: number;
  cardWidth?: number;
  cardHeight?: number;
  overlap?: number;
  spreadDeg?: number;
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;
  springStiffness?: number;
  springDamping?: number;
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;
  showDots?: boolean;
  className?: string;
  onChangeIndex?: (index: number, item: T) => void;
  renderCard?: (item: T, state: { active: boolean }) => React.ReactNode;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 7,
  cardWidth = 520,
  cardHeight = 320,
  overlap = 0.48,
  spreadDeg = 48,
  perspectivePx = 1100,
  depthPx = 140,
  tiltXDeg = 12,
  activeLiftPx = 22,
  activeScale = 1.03,
  inactiveScale = 0.94,
  springStiffness = 280,
  springDamping = 28,
  loop = true,
  autoAdvance = false,
  intervalMs = 2800,
  pauseOnHover = true,
  showDots = true,
  className,
  onChangeIndex,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion();
  const len = items.length;
  const [active, setActive] = React.useState(() => wrapIndex(initialIndex, len));
  const [hovering, setHovering] = React.useState(false);

  React.useEffect(() => { setActive((a) => wrapIndex(a, len)); }, [len]);
  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
  }, [active]); // eslint-disable-line

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));
  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;
  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len || !canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len || !canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  React.useEffect(() => {
    if (!autoAdvance || reduceMotion || !len || (pauseOnHover && hovering)) return;
    const id = window.setInterval(() => {
      if (loop || active < len - 1) next();
    }, Math.max(700, intervalMs));
    return () => window.clearInterval(id);
  }, [autoAdvance, intervalMs, hovering, pauseOnHover, reduceMotion, len, loop, active, next]);

  if (!len) return null;
  const activeItem = items[active]!;

  return (
    <div className={cn("w-full", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}>
      <div className="relative w-full" style={{ height: Math.max(380, cardHeight + 80) }}
        tabIndex={0} onKeyDown={onKeyDown}>
        <div className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-48 w-[70%] rounded-full bg-black/5 blur-3xl dark:bg-white/5" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-40 w-[76%] rounded-full bg-black/10 blur-3xl dark:bg-black/30" aria-hidden />
        <div className="absolute inset-0 flex items-end justify-center" style={{ perspective: `${perspectivePx}px` }}>
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              if (abs > maxOffset) return null;
              const rotateZ = off * stepDeg;
              const x = off * cardSpacing;
              const y = abs * 10;
              const z = -abs * depthPx;
              const isActive = off === 0;
              const scale = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx : 0;
              const rotateX = isActive ? 0 : tiltXDeg;
              const zIndex = 100 - abs;
              const dragProps = isActive ? {
                drag: "x" as const,
                dragConstraints: { left: 0, right: 0 },
                dragElastic: 0.18,
                onDragEnd: (_e: any, info: { offset: { x: number }; velocity: { x: number } }) => {
                  if (reduceMotion) return;
                  const travel = info.offset.x;
                  const v = info.velocity.x;
                  const threshold = Math.min(160, cardWidth * 0.22);
                  if (travel > threshold || v > 650) prev();
                  else if (travel < -threshold || v < -650) next();
                },
              } : {};
              return (
                <motion.div key={item.id}
                  className={cn("absolute bottom-0 rounded-2xl border-4 border-black/10 dark:border-white/10 overflow-hidden shadow-xl will-change-transform select-none",
                    isActive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer")}
                  style={{ width: cardWidth, height: cardHeight, zIndex, transformStyle: "preserve-3d" }}
                  initial={reduceMotion ? false : { opacity: 0, y: y + 40, x, rotateZ, rotateX, scale }}
                  animate={{ opacity: 1, x, y: y + lift, rotateZ, rotateX, scale }}
                  transition={{ type: "spring", stiffness: springStiffness, damping: springDamping }}
                  onClick={() => setActive(i)}
                  {...dragProps}>
                  <div className="h-full w-full" style={{ transform: `translateZ(${z}px)`, transformStyle: "preserve-3d" }}>
                    {renderCard ? renderCard(item, { active: isActive }) : <DefaultFanCard item={item} active={isActive} />}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      {showDots && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            {items.map((it, idx) => (
              <button key={it.id} onClick={() => setActive(idx)}
                className={cn("h-2 w-2 rounded-full transition",
                  idx === active ? "bg-foreground" : "bg-foreground/30 hover:bg-foreground/50")}
                aria-label={`Go to ${it.title}`} />
            ))}
          </div>
          {activeItem.href && (
            <Link href={activeItem.href} target="_blank" rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition" aria-label="Open link">
              <SquareArrowOutUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function DefaultFanCard({ item }: { item: CardStackItem; active: boolean }) {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0">
        {item.imageSrc ? (
          <img src={item.imageSrc} alt={item.title} className="h-full w-full object-cover" draggable={false} loading="eager" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary text-sm text-muted-foreground">No image</div>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-end p-5">
        <div className="truncate text-lg font-semibold text-white">{item.title}</div>
        {item.description && <div className="mt-1 line-clamp-2 text-sm text-white/80">{item.description}</div>}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────── */
const ITEMS: CardStackItem[] = [
  { id: 1, title: "Yerleşik Mutfak Sistemleri", imageSrc: "/deneme1.webp", href: "/iletisim", tag: "Mutfak" },
  { id: 2, title: "Kurumsal & Ofis Üniteleri",  imageSrc: "/deneme2.webp", href: "/iletisim", tag: "Ofis" },
  { id: 3, title: "Medya & Vitrin Sistemleri",  imageSrc: "/deneme3.webp", href: "/iletisim", tag: "Oturma Odası" },
  { id: 4, title: "Masa & Oturma Grupları",     imageSrc: "/arkaplan2.webp", href: "/iletisim", tag: "Yemek Odası" },
];


function useCardSize() {
  const [cfg, setCfg] = React.useState({ w: 520, h: 320, spread: 48, overlap: 0.48, maxVisible: 7 });
  React.useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      if (vw < 480) {
        const w = vw - 32;
        setCfg({ w, h: Math.round(w * 0.62), spread: 18, overlap: 0.72, maxVisible: 3 });
      } else if (vw < 768) {
        setCfg({ w: Math.min(380, vw - 40), h: 240, spread: 24, overlap: 0.65, maxVisible: 3 });
      } else {
        setCfg({ w: 520, h: 320, spread: 48, overlap: 0.48, maxVisible: 7 });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cfg;
}

export default function UrunlerPage() {
  const cfg = useCardSize();
  const [activeProductId, setActiveProductId] = React.useState(1);
  const featuresRef = React.useRef<HTMLDivElement>(null);

  const handleChange = (_i: number, item: CardStackItem) => {
    setActiveProductId(item.id as number);
    setTimeout(() => featuresRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  return (
    <div data-light-nav style={{ background: "#d7d5d1" }}>
      <Navbar />

      {/* ── Hero: Hizmetlerimiz ─────────────────────── */}
      <section className="min-h-screen flex flex-col justify-between px-6 md:px-16 lg:px-24 pt-32 pb-12 md:pt-40 md:pb-16">

        {/* Üst: etiket */}
        <p style={{ fontFamily: "var(--font-general)", fontSize: "0.68rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(26,23,18,0.35)" }}>
          Babür Mobilya — Hizmetler
        </p>

        {/* Orta: büyük başlık */}
        <div className="flex-1 flex items-center">
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(4.5rem, 12vw, 13rem)",
              fontWeight: 400,
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              color: "rgba(26,23,18,0.88)",
              maxWidth: "14ch",
            }}>
            Hizmet&shy;lerimiz
          </h1>
        </div>

        {/* Alt: metin + buton — iki sütun */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-16">
          <p
            className="max-w-md leading-[1.85]"
            style={{
              fontFamily: "var(--font-general)",
              fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)",
              fontWeight: 300,
              color: "rgba(26,23,18,0.52)",
            }}>
            Bir mekânın ruhu, içindeki her dokunuşta saklıdır.
            Mutfaktan çalışma odasına, oturma grubundan vitrin
            sistemlerine — mekanınızın kimliğini anlayan, onu
            yansıtan mobilyalar tasarlıyoruz. Her ölçü sizi,
            her desen hikâyenizi taşısın diye.
          </p>

          <Link
            href="/iletisim"
            className="group inline-flex items-center gap-3 shrink-0 self-start md:self-auto"
            style={{
              fontFamily: "var(--font-general)",
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(26,23,18,0.75)",
              borderBottom: "1px solid rgba(26,23,18,0.2)",
              paddingBottom: "6px",
              transition: "color 0.3s, border-color 0.3s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = "rgba(26,23,18,1)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(26,23,18,0.7)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = "rgba(26,23,18,0.75)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(26,23,18,0.2)";
            }}>
            Bizimle Çalışın
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ── CardStack ──────────────────────────────── */}
      <div className="flex items-center justify-center overflow-hidden px-4 pb-28">
        <div className="w-full max-w-2xl mx-auto">
          <CardStack
            items={ITEMS}
            cardWidth={cfg.w}
            cardHeight={cfg.h}
            spreadDeg={cfg.spread}
            overlap={cfg.overlap}
            maxVisible={cfg.maxVisible}
            onChangeIndex={handleChange}
          />
        </div>
      </div>

      {/* ── UrunDetay scroll ───────────────────────── */}
      <div ref={featuresRef}>
        <UrunDetay productId={activeProductId} />
      </div>

      <Footer variant="light" />
    </div>
  );
}
