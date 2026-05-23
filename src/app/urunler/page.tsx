"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });
import { Ruler, PenLine, Hammer, PackageCheck } from "lucide-react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import UrunDetay from "@/components/urun-detay/urun-detay";
import SmoothScrollReveal from "@/components/smooth-scroll-reveal/smooth-scroll-reveal";

const CATEGORIES = [
  { id: 1, src: "/deneme1.webp",   label: "Mutfak",  sub: "Yerleşik Sistemler" },
  { id: 2, src: "/deneme2.webp",   label: "Ofis",    sub: "Kurumsal Üniteler"  },
  { id: 3, src: "/deneme3.webp",   label: "Vitrin",  sub: "Medya Sistemleri"   },
  { id: 4, src: "/arkaplan2.webp", label: "Masa",    sub: "Oturma Grupları"    },
];

const SUREC = [
  { icon: Ruler,        title: "Ölçüm & Keşif",   body: "Mekanınızı yerinde ziyaret ediyor, ihtiyaçlarınızı ve beklentilerinizi dinliyoruz." },
  { icon: PenLine,      title: "Tasarım & Proje",  body: "Mimari çizimler ve görsellerle hayalinizdeki mobilyayı somutlaştırıyoruz." },
  { icon: Hammer,       title: "Üretim",           body: "Seçkin malzemelerle, ustalarımızın elinde her detay özenle hayata geçirilir." },
  { icon: PackageCheck, title: "Montaj & Teslim",  body: "Profesyonel montaj ve teslim garantisiyle projeyi tamamlıyoruz." },
];


export default function UrunlerPage() {
  const [activeProductId, setActiveProductId] = React.useState(1);
  const featuresRef = React.useRef<HTMLDivElement>(null);
  const surecRef = React.useRef<HTMLDivElement>(null);
  const surecInView = useInView(surecRef, { once: true, margin: "-100px" });

  const handleCategoryClick = (id: number) => {
    setActiveProductId(id);
    setTimeout(() => featuresRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  };

  return (
    <div data-light-nav className={inter.className} style={{ background: "#d7d5d1", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 0.95 }}>
      <Navbar />

      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative flex flex-col overflow-hidden min-h-dvh">

        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }} animate={{ scale: 1.06 }}
          transition={{ duration: 20, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          style={{ backgroundImage: "url('/kutuarkaplantahta.webp')", backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 }}
        />

        <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-2 px-6 md:px-16 lg:px-24 pt-28 md:pt-36 pb-0 gap-6">

          {/* Sol */}
          <div className="flex flex-col justify-between pb-8">

            <motion.span
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ fontFamily: "var(--font-general)", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}
            >
              Est. 2010 · Babür Mobilya
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 56 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 55, damping: 18, delay: 0.35 }}
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "normal",
                fontSize: "clamp(4.5rem, 11vw, 13rem)",
                fontWeight: 400,
                lineHeight: 0.87,
                letterSpacing: "-0.03em",
                color: "#ffffff",
                margin: "clamp(2rem,4vw,4rem) 0",
              }}
            >
              Hizmet-<br/>lerimiz
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col gap-4"
            >
              <p style={{ fontFamily: "var(--font-general)", fontSize: "0.78rem", fontWeight: 300, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: "38ch", margin: 0 }}>
                Mutfaktan çalışma odasına, her mekan için özel tasarım.
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }} whileTap={{ y: 1, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{ width: "fit-content" }}
              >
                <Link href="/iletisim" className="group inline-flex items-center gap-3"
                  style={{ fontFamily: "var(--font-general)", fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#d7d5d1", background: "#0a0806", padding: "13px 26px", borderRadius: 2, textDecoration: "none" }}>
                  Bizimle Çalışın
                  <svg width="13" height="10" viewBox="0 0 14 10" fill="none" className="transition-transform duration-300 group-hover:translate-x-1.5">
                    <path d="M1 5h12M8 1l5 4-5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Sağ: 2×2 grid — self-end ile alta yaslanır */}
          <div className="grid grid-cols-2 gap-3 self-end pb-0">
            {CATEGORIES.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 75, damping: 20, delay: 0.45 + i * 0.08 }}
                onClick={() => handleCategoryClick(item.id)}
                className="relative overflow-hidden group text-left"
                style={{ aspectRatio: "4 / 3", borderRadius: 6, outline: "none", border: activeProductId === item.id ? "2px solid rgba(255,255,255,0.7)" : "2px solid transparent", transition: "border-color 0.3s" }}
              >
                <img src={item.src} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,8,6,0.68) 0%, rgba(10,8,6,0.05) 55%, transparent 100%)" }} />
                {activeProductId === item.id && (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.9)" }} />
                )}
                <div className="absolute bottom-0 left-0 p-3">
                  <span style={{ fontFamily: "var(--font-display)", fontStyle: "normal", fontSize: "clamp(0.95rem, 1.8vw, 1.2rem)", fontWeight: 400, color: "rgba(255,255,255,0.95)", lineHeight: 1, display: "block" }}>
                    {item.label}
                  </span>
                  <span style={{ fontFamily: "var(--font-general)", fontSize: "0.56rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                    {item.sub}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Alt bar */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="relative z-10 flex items-center justify-between px-6 md:px-16 lg:px-24 py-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
        >
          <div className="flex items-center gap-6 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => handleCategoryClick(cat.id)}
                style={{ fontFamily: "var(--font-general)", fontSize: "0.62rem", letterSpacing: "0.1em", color: activeProductId === cat.id ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.25s" }}>
                {cat.label}
              </button>
            ))}
          </div>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} className="hidden md:block">
            <svg width="11" height="15" viewBox="0 0 12 16" fill="none">
              <path d="M6 1v14M1 10l5 5 5-5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Smooth Scroll Reveal ──────────────────── */}
      <SmoothScrollReveal />

      {/* ── Ürün Detay scroll ──────────────────────── */}
      <div ref={featuresRef}>
        <UrunDetay productId={activeProductId} />
      </div>

      {/* ── Süreç Adımları ────────────────────────── */}
      <section
        ref={surecRef}
        style={{ background: "#d7d5d1", padding: "clamp(5rem,10vw,9rem) 0", overflow: "hidden" }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(1.5rem,5vw,4rem)" }}>

          {/* Üst kısım: etiket + başlık */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "clamp(3rem,6vw,6rem)" }}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={surecInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: "var(--font-general)",
                fontSize: "0.65rem",
                fontWeight: 500,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(10,8,6,0.4)",
              }}
            >
              Süreç
            </motion.span>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
              <motion.h2
                initial={{ opacity: 0, y: 28 }}
                animate={surecInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "normal",
                  fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  color: "#0a0806",
                  lineHeight: 0.95,
                  margin: 0,
                }}
              >
                Nasıl Çalışıyoruz?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={surecInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.3 }}
                style={{
                  fontFamily: "var(--font-general)",
                  fontSize: "0.82rem",
                  fontWeight: 300,
                  color: "rgba(10,8,6,0.55)",
                  lineHeight: 1.8,
                  maxWidth: 320,
                  margin: 0,
                  flexShrink: 0,
                }}
              >
                Fikirden teslimata her adımda<br />sizinle birlikte ilerliyoruz.
              </motion.p>
            </div>
          </div>

          {/* Ayırıcı çizgi */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={surecInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "1px", background: "rgba(10,8,6,0.15)", transformOrigin: "left", marginBottom: "clamp(3rem,5vw,5rem)" }}
          />

          {/* Staircase adımlar */}
          <div className="flex flex-col md:flex-row" style={{ gap: "1.5rem", alignItems: "flex-start" }}>
            {SUREC.map((step, i) => {
              const staircaseClass = ["", "md:mt-24", "md:mt-48", "md:mt-72"][i];
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 56 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ type: "spring", stiffness: 80, damping: 18, delay: i * 0.1 }}
                  className={staircaseClass}
                  style={{ flex: 1 }}
                >
                  {/* Üst çizgi + step no */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 90, damping: 20, delay: 0.08 + i * 0.1 }}
                      style={{
                        flex: 1,
                        height: 1,
                        background: "rgba(10,8,6,0.22)",
                        transformOrigin: "left",
                      }}
                    />
                    <span style={{
                      fontFamily: "var(--font-general)",
                      fontSize: "0.62rem",
                      fontWeight: 500,
                      letterSpacing: "0.18em",
                      color: "rgba(10,8,6,0.3)",
                    }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* İkon badge */}
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    background: "rgba(10,8,6,0.07)",
                    border: "1px solid rgba(10,8,6,0.13)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                  }}>
                    <StepIcon size={20} color="rgba(10,8,6,0.65)" strokeWidth={1.5} />
                  </div>

                  {/* Başlık */}
                  <div style={{
                    fontFamily: "var(--font-general)",
                    fontSize: "clamp(1rem, 1.3vw, 1.1rem)",
                    fontWeight: 600,
                    color: "#0a0806",
                    letterSpacing: "-0.01em",
                    marginBottom: "0.65rem",
                    lineHeight: 1.2,
                  }}>
                    {step.title}
                  </div>

                  {/* Açıklama */}
                  <div style={{
                    fontFamily: "var(--font-general)",
                    fontSize: "0.79rem",
                    fontWeight: 300,
                    color: "rgba(10,8,6,0.52)",
                    lineHeight: 1.85,
                  }}>
                    {step.body}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      <Footer variant="dark" />
    </div>
  );
}
