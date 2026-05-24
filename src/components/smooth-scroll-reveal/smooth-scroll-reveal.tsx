"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";

const STATS = [
  { stat: "15+",  label: "Yıl Deneyim"       },
  { stat: "500+", label: "Tamamlanan Proje"   },
  { stat: "100%", label: "Yerli Üretim"       },
  { stat: "1970", label: "'dan Beri"          },
];

const FEATURES = [
  { title: "El İşçiliği",    body: "Her parça ustalarımızın elinden çıkar. Endüstriyel seri üretim yoktur — sadece ustalık vardır." },
  { title: "Özel Ölçü",     body: "Standart ürün bulunmaz. Her proje mekanınıza özgün tasarlanır." },
  { title: "2 Yıl Garanti", body: "Montajdan itibaren 2 yıl tam garanti ve ücretsiz servis." },
];

interface SmoothScrollRevealProps {
  scrollHeight?: number;
  desktopImage?: string;
  mobileImage?: string;
  initialClip?: number;
  finalClip?: number;
}

export default function SmoothScrollReveal({
  scrollHeight = 1600,
  desktopImage = "/arkaplan3.webp",
  mobileImage = "/arkaplan2.webp",
  initialClip = 22,
  finalClip = 78,
}: SmoothScrollRevealProps) {
  const { scrollY } = useScroll();

  const clipStart = useTransform(scrollY, [0, scrollHeight], [initialClip, 0]);
  const clipEnd   = useTransform(scrollY, [0, scrollHeight], [finalClip, 100]);
  const clipPath  = useMotionTemplate`polygon(${clipStart}% ${clipStart}%, ${clipEnd}% ${clipStart}%, ${clipEnd}% ${clipEnd}%, ${clipStart}% ${clipEnd}%)`;
  const bgSize    = useTransform(scrollY, [0, scrollHeight + 400], ["175%", "105%"]);

  const contentOpacity = useTransform(scrollY, [scrollHeight * 0.22, scrollHeight * 0.55], [0, 1]);
  const contentY       = useTransform(scrollY, [scrollHeight * 0.22, scrollHeight * 0.55], [36, 0]);
  const cardsOpacity   = useTransform(scrollY, [scrollHeight * 0.45, scrollHeight * 0.78], [0, 1]);
  const cardsY         = useTransform(scrollY, [scrollHeight * 0.45, scrollHeight * 0.78], [28, 0]);

  return (
    <div style={{ height: `calc(${scrollHeight}px + 100vh)` }} className="relative w-full">

      {/* SKILL FIX: h-screen → min-h-dvh */}
      <motion.div
        className="sticky top-0 min-h-dvh w-full overflow-hidden"
        style={{ clipPath, willChange: "clip-path" }}
      >
        {/* Mobile bg */}
        <motion.div
          className="absolute inset-0 md:hidden"
          style={{ backgroundImage: `url(${mobileImage})`, backgroundSize: bgSize, backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
        />
        {/* Desktop bg */}
        <motion.div
          className="absolute inset-0 hidden md:block"
          style={{ backgroundImage: `url(${desktopImage})`, backgroundSize: bgSize, backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(8,6,4,0.82) 0%, rgba(8,6,4,0.55) 50%, rgba(8,6,4,0.72) 100%)" }} />

        {/* SKILL FIX: sol hizalı içerik (anti-center bias, DESIGN_VARIANCE 8) */}
        <div className="absolute inset-0 flex flex-col justify-center" style={{ padding: "0 clamp(2rem, 7vw, 6rem)" }}>
          <div style={{ maxWidth: 1200, width: "100%" }}>

            {/* Üst blok */}
            <motion.div style={{ opacity: contentOpacity, y: contentY }}>

              <span style={{
                display: "block",
                fontFamily: "var(--font-general)",
                fontSize: "0.62rem",
                fontWeight: 500,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.38)",
                marginBottom: "1.5rem",
              }}>
                Neden Babur Mobilya
              </span>

              <h2 style={{
                fontFamily: "var(--font-display)",
                fontStyle: "normal",
                fontSize: "clamp(2.8rem, 5.5vw, 5.8rem)",
                fontWeight: 400,
                letterSpacing: "-0.03em",
                color: "#ffffff",
                lineHeight: 0.92,
                margin: "0 0 clamp(2rem, 3vw, 3rem) 0",
                maxWidth: "14ch",
              }}>
                15 yıldır aynı özen, her projede.
              </h2>

              <div style={{ height: 1, background: "rgba(255,255,255,0.12)", marginBottom: "clamp(1.8rem,3vw,2.8rem)", maxWidth: 640 }} />

              {/* Stats — sol hizalı, dikey ayırıcılı */}
              <div className="grid grid-cols-2 md:grid-cols-4" style={{ maxWidth: 640, gap: 0 }}>
                {STATS.map((item, i) => (
                  <div key={item.stat} style={{
                    paddingLeft: i === 0 ? 0 : "clamp(1rem, 2vw, 2rem)",
                    paddingRight: "clamp(1rem, 2vw, 2rem)",
                    borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,0.1)",
                  }}>
                    <div style={{
                      fontFamily: "var(--font-display)",
                      fontStyle: "normal",
                      fontSize: "clamp(1.8rem, 3.5vw, 3.5rem)",
                      fontWeight: 400,
                      color: "#ffffff",
                      lineHeight: 0.88,
                      marginBottom: "0.35rem",
                    }}>
                      {item.stat}
                    </div>
                    <div style={{
                      fontFamily: "var(--font-general)",
                      fontSize: "0.58rem",
                      fontWeight: 400,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.35)",
                    }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Alt blok: asimetrik özellik grid + CTA */}
            <motion.div style={{ opacity: cardsOpacity, y: cardsY, marginTop: "clamp(2rem,4vw,3.5rem)" }}>

              <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: "clamp(1.5rem,2.5vw,2rem)", maxWidth: 640 }} />

              {/* SKILL FIX: 3-eşit kart YASAK → asimetrik 2fr 1fr grid */}
              <div
                className="grid grid-cols-1 md:grid-cols-[2fr_1fr]"
                style={{
                  gap: "1px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  /* SKILL FIX: Liquid Glass — inner border refraction */
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  overflow: "hidden",
                  maxWidth: 780,
                  marginBottom: "clamp(1.5rem,2.5vw,2rem)",
                }}
              >
                {/* Geniş sol kart */}
                <div
                  className="md:row-span-2"
                  style={{
                    background: "rgba(8,6,4,0.52)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    /* SKILL FIX: inner shadow — liquid glass refraction */
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                    padding: "clamp(1.5rem,2.5vw,2.2rem)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    justifyContent: "flex-end",
                  }}
                >
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "normal",
                    fontSize: "clamp(2rem, 3.5vw, 3rem)",
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.08)",
                    lineHeight: 1,
                    userSelect: "none",
                    marginBottom: "0.5rem",
                  }}>01</div>
                  <div style={{ fontFamily: "var(--font-general)", fontSize: "1rem", fontWeight: 600, color: "#ffffff", letterSpacing: "-0.01em" }}>
                    {FEATURES[0].title}
                  </div>
                  <div style={{ fontFamily: "var(--font-general)", fontSize: "0.78rem", fontWeight: 300, color: "rgba(255,255,255,0.45)", lineHeight: 1.85 }}>
                    {FEATURES[0].body}
                  </div>
                </div>

                {/* Sağ üst */}
                <div style={{
                  background: "rgba(8,6,4,0.48)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                  padding: "clamp(1.2rem,2vw,1.8rem)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}>
                  <div style={{ fontFamily: "var(--font-general)", fontSize: "0.9rem", fontWeight: 600, color: "#ffffff", letterSpacing: "-0.01em" }}>
                    {FEATURES[1].title}
                  </div>
                  <div style={{ fontFamily: "var(--font-general)", fontSize: "0.74rem", fontWeight: 300, color: "rgba(255,255,255,0.42)", lineHeight: 1.8 }}>
                    {FEATURES[1].body}
                  </div>
                </div>

                {/* Sağ alt */}
                <div style={{
                  background: "rgba(8,6,4,0.48)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                  padding: "clamp(1.2rem,2vw,1.8rem)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}>
                  <div style={{ fontFamily: "var(--font-general)", fontSize: "0.9rem", fontWeight: 600, color: "#ffffff", letterSpacing: "-0.01em" }}>
                    {FEATURES[2].title}
                  </div>
                  <div style={{ fontFamily: "var(--font-general)", fontSize: "0.74rem", fontWeight: 300, color: "rgba(255,255,255,0.42)", lineHeight: 1.8 }}>
                    {FEATURES[2].body}
                  </div>
                </div>
              </div>

              {/* SKILL FIX: tactile CTA — active state ile fiziksel push hissi */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ y: 1, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{ display: "inline-block" }}
              >
                <Link
                  href="/iletisim"
                  style={{
                    fontFamily: "var(--font-general)",
                    fontSize: "0.68rem",
                    fontWeight: 500,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#0a0806",
                    background: "#d7d5d1",
                    padding: "13px 30px",
                    borderRadius: 2,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  Projeni Başlat
                  <svg width="13" height="10" viewBox="0 0 14 10" fill="none">
                    <path d="M1 5h12M8 1l5 4-5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
