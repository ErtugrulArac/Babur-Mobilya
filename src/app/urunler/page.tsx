"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Inter } from "next/font/google";
import { Ruler, PenLine, Hammer, PackageCheck } from "lucide-react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import ShuffleHero from "@/components/shuffle-hero/shuffle-hero";
import { Component as BaliCard } from "@/components/bali-card/bali-card";
import { ImageComparison } from "@/components/image-comparison/image-comparison";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const CARDS = [
  {
    title: "Mutfak",
    subtitle: "Sistemleri",
    imageSrc: "/hizmetkartları/mutfakdolabıkart.webp",
    description: "Yerleşik mutfak sistemleri, yüksek yoğunluklu MDF ve doğal ahşap kaplamalarla özel üretim.",
    detailTitle: "Mutfak Dolabı",
    detailBody: "Her mutfak projesi, mekanınızın ölçüleri ve kullanım alışkanlıklarınız doğrultusunda sıfırdan tasarlanır. Yüksek yoğunluklu MDF gövde, doğal ahşap veya lake kapak seçenekleri ve iç aksesuar sistemleriyle işlevsel bir mutfak yaratıyoruz. Üretimden montaja kadar her aşama Babur atölyesinde, ustalarımızın gözetiminde tamamlanır.",
    beforeImage: "/beforeafter/mutfakbefore.webp",
    afterImage: "/beforeafter/mutfakefter.webp",
  },
  {
    title: "Ofis",
    subtitle: "Üniteleri",
    imageSrc: "/hizmetkartları/ofiskart.webp",
    description: "Kurumsal çalışma alanları için şık ve fonksiyonel ofis mobilyaları, özel ölçüde üretim.",
    detailTitle: "Ofis Üniteleri",
    detailBody: "Çalışma alanınızın verimliliğini artıracak, kurumsal kimliğinize uygun ofis mobilyaları tasarlıyoruz. Masalar, toplantı üniteleri, dolap sistemleri ve resepsiyon alanları özel ölçü ve malzeme seçenekleriyle üretilir. Her proje ergonomi ve estetiği bir arada sunar.",
    beforeImage: "/beforeafter/ofisafter.webp",
    afterImage: "/beforeafter/ofisbefore.webp",
  },
  {
    title: "Masa & TV",
    subtitle: "Ünitesi",
    imageSrc: "/hizmetkartları/tvünitesikart.webp",
    description: "Medya ve sunum sistemleri, TV üniteleri ve özel masa tasarımları.",
    detailTitle: "Masa & TV Ünitesi",
    detailBody: "Oturma alanınızın odak noktasını oluşturan TV üniteleri ve çalışma masaları, mekanınızın boyutlarına ve kullanım ihtiyaçlarınıza göre sıfırdan tasarlanır. Gizli kablo kanalları, arka aydınlatma sistemleri ve modüler raf düzenlemeleriyle hem estetik hem de işlevsel çözümler sunuyoruz.",
    beforeImage: "/beforeafter/masatvafter.webp",
    afterImage: "/beforeafter/masatvbefore.webp",
  },
  {
    title: "Gardrop",
    subtitle: "Sistemleri",
    imageSrc: "/hizmetkartları/gardropkart.webp",
    description: "Mekanınıza özel gardrop sistemleri, sürgülü kapaklı ve açık raf çözümleri.",
    detailTitle: "Gardrop Sistemleri",
    detailBody: "Yatak odanızın her santimetresini en verimli şekilde kullanan gardrop sistemleri tasarlıyoruz. Sürgülü, menteşeli veya açık raf seçenekleriyle; iç düzenleme, çekmece ve aydınlatma detaylarına kadar her şey size özel planlanır. Mat, parlak lake veya doğal ahşap kapak alternatifleriyle estetiği işlevsellikle buluşturuyoruz.",
    beforeImage: "/beforeafter/gardropafter.webp",
    afterImage: "/beforeafter/gardropbefore.webp",
  },
];

const SUREC = [
  { icon: Ruler,        color: "#3b82f6", bg: "rgba(59,130,246,0.10)",  title: "Ölçüm & Keşif",   body: "Mekanınızı yerinde ziyaret ediyor, ihtiyaçlarınızı ve beklentilerinizi dinliyoruz." },
  { icon: PenLine,      color: "#8b5cf6", bg: "rgba(139,92,246,0.10)",  title: "Tasarım & Proje",  body: "Mimari çizimler ve görsellerle hayalinizdeki mobilyayı somutlaştırıyoruz." },
  { icon: Hammer,       color: "#f59e0b", bg: "rgba(245,158,11,0.10)",  title: "Üretim",           body: "Seçkin malzemelerle, ustalarımızın elinde her detay özenle hayata geçirilir." },
  { icon: PackageCheck, color: "#10b981", bg: "rgba(16,185,129,0.10)", title: "Montaj & Teslim",  body: "Profesyonel montaj ve teslim garantisiyle projeyi tamamlıyoruz." },
];

export default function UrunlerPage() {
  const [selectedCard, setSelectedCard] = React.useState(0);
  const [activeCarouselCard, setActiveCarouselCard] = React.useState(0);
  const comparisonRef = React.useRef<HTMLDivElement>(null);
  const mobileScrollRef = React.useRef<HTMLDivElement>(null);
  const surecRef = React.useRef<HTMLDivElement>(null);
  const surecInView = useInView(surecRef, { once: true, margin: "-100px" });

  const handleCardClick = (i: number) => {
    setSelectedCard(i);
    setTimeout(() => {
      comparisonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleMobileScroll = () => {
    const container = mobileScrollRef.current;
    if (!container) return;
    const cardWidth = container.clientWidth * 0.76 + 16;
    const index = Math.round(container.scrollLeft / cardWidth);
    setActiveCarouselCard(Math.min(Math.max(index, 0), CARDS.length - 1));
  };

  return (
    <div data-light-nav className={inter.className} style={{ background: "#ffffff", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 0.95, overflowX: "hidden" }}>
      <Navbar />

      {/* ── Hero ────────────────────────────────────── */}
      <ShuffleHero />

      {/* ── Hizmet Kartları ───────────────────────── */}

      {/* Mobile carousel */}
      <div className="md:hidden" style={{ background: "#ffffff", paddingTop: "2rem", paddingBottom: "3rem" }}>
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          style={{
            display: "flex",
            overflowX: "scroll",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
            gap: "1rem",
            padding: "1rem 12vw 1rem",
            scrollbarWidth: "none" as React.CSSProperties["scrollbarWidth"],
          }}
        >
          {CARDS.map((card, i) => (
            <div
              key={card.title}
              style={{
                flexShrink: 0,
                width: "76vw",
                scrollSnapAlign: "center",
                transform: activeCarouselCard === i ? "scale(1)" : "scale(0.88)",
                opacity: activeCarouselCard === i ? 1 : 0.5,
                transition: "transform 0.4s ease, opacity 0.4s ease",
              }}
            >
              <BaliCard
                title={card.title}
                subtitle={card.subtitle}
                imageSrc={card.imageSrc}
                description={card.description}
                isSelected={selectedCard === i}
                onClick={() => handleCardClick(i)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex flex-row gap-10 px-8 pt-56 pb-12 items-start justify-center" style={{ background: "#ffffff" }}>
        {CARDS.map((card, i) => (
          <BaliCard
            key={card.title}
            title={card.title}
            subtitle={card.subtitle}
            imageSrc={card.imageSrc}
            description={card.description}
            isSelected={selectedCard === i}
            onClick={() => handleCardClick(i)}
          />
        ))}
      </div>

      {/* ── Önce / Sonra Karşılaştırma ────────────── */}
      <div ref={comparisonRef} style={{ background: "#ffffff", padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <motion.div
            key={selectedCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: "clamp(3rem,6vw,5rem)" }}
          >
            <h2 style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)", fontWeight: 600, letterSpacing: "-0.03em", color: "#0a0806", lineHeight: 0.95, margin: "0 0 1.25rem 0" }}>
              {CARDS[selectedCard].detailTitle}
            </h2>
            <p style={{ fontSize: "1.125rem", fontWeight: 500, color: "#0a0806", lineHeight: 1.6, maxWidth: 580, margin: 0 }}>
              {CARDS[selectedCard].detailBody}
            </p>
          </motion.div>
          <ImageComparison
            beforeImage={CARDS[selectedCard].beforeImage}
            afterImage={CARDS[selectedCard].afterImage}
            altBefore="Öncesi"
            altAfter="Sonrası"
          />

          {/* Progress indicator */}
          <div style={{ marginTop: "3rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", maxWidth: "48rem", margin: "0 auto" }}>
              {["Ölçüm & Keşif", "Tasarım & Proje", "Üretim", "Montaj & Teslim"].map((step, i, arr) => (
                <React.Fragment key={step}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0a0806" }} />
                    <span style={{ fontSize: "0.6rem", color: "rgba(10,8,6,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap", textAlign: "center" }}>
                      {step}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ flex: 1, height: 1, background: "rgba(10,8,6,0.2)", margin: "3px 8px 0" }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Slogan */}
          <div style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "1rem", color: "#0a0806", letterSpacing: "-0.01em", fontWeight: 600, lineHeight: 1.6 }}>
            1970'ten bu yana her fikri titizlikle esere taşıyan Babur, yalnızca mobilya değil yaşam alanları yaratır.
          </div>

          {/* CTA Button */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
            <motion.a
              href="/iletisim"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.6rem",
                padding: "0.9rem 2.4rem",
                background: "#0a0806",
                color: "#ffffff",
                fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
                textDecoration: "none",
                border: "1px solid #0a0806",
                borderRadius: "0",
                transition: "all 0.3s ease",
              }}
            >
              İletişime Geç
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </motion.a>
          </div>
        </div>
      </div>

      {/* ── Süreç Adımları ────────────────────────── */}
      <section
        ref={surecRef}
        style={{ background: "#ffffff", padding: "clamp(5rem,10vw,9rem) 0", overflow: "hidden" }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(1.5rem,5vw,4rem)" }}>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "clamp(3rem,6vw,6rem)" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
              <motion.h2
                initial={{ opacity: 0, y: 28 }}
                animate={surecInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)", fontWeight: 600, letterSpacing: "-0.03em", color: "#0a0806", lineHeight: 0.95, margin: 0 }}
              >
                Nasıl Çalışıyoruz?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={surecInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.3 }}
                style={{ fontSize: "1.125rem", fontWeight: 500, color: "#0a0806", lineHeight: 1.6, maxWidth: 320, margin: 0, flexShrink: 0 }}
              >
                Fikirden teslimata her adımda<br />sizinle birlikte ilerliyoruz.
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={surecInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "1px", background: "rgba(10,8,6,0.15)", transformOrigin: "left", marginBottom: "clamp(3rem,5vw,5rem)" }}
          />

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
                  <div className="hidden md:flex" style={{ alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 90, damping: 20, delay: 0.08 + i * 0.1 }}
                      style={{ flex: 1, height: 1, background: "rgba(10,8,6,0.22)", transformOrigin: "left" }}
                    />
                  </div>

                  <div style={{ width: 48, height: 48, borderRadius: 10, background: "#000000", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                    <StepIcon size={20} color="#ffffff" strokeWidth={1.5} />
                  </div>

                  <div style={{ fontSize: "clamp(1rem, 1.3vw, 1.1rem)", fontWeight: 600, color: "#0a0806", letterSpacing: "-0.03em", marginBottom: "0.65rem", lineHeight: 1.2 }}>
                    {step.title}
                  </div>

                  <div style={{ fontSize: "0.79rem", fontWeight: 400, color: "rgba(10,8,6,0.52)", lineHeight: 1.85 }}>
                    {step.body}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Neden Babur? ──────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "clamp(5rem,10vw,9rem) 0" }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        >
          <source src="/baburvideo.mp4" type="video/mp4" />
        </video>
        <div style={{ position: "absolute", inset: 0, background: "rgba(8,6,4,0.72)", zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", padding: "0 clamp(1.5rem,5vw,4rem)" }}>
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(2.4rem,5vw,4.5rem)", fontWeight: 600, letterSpacing: "-0.03em", color: "#ffffff", lineHeight: 0.95, margin: "0 0 clamp(3rem,5vw,5rem) 0" }}
          >
            Neden Babur Mobilya?
          </motion.h2>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "1rem", marginBottom: "clamp(3rem,5vw,4rem)" }}>
            {[
              { stat: "55+",  label: "Yıl Deneyim"        },
              { stat: "500+", label: "Tamamlanan Proje"    },
              { stat: "100%", label: "Yerli Üretim"        },
              { stat: "1970", label: "'dan Beri"           },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  padding: "clamp(1.5rem,3vw,2.5rem) clamp(1rem,2vw,1.5rem)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  {item.stat}
                </div>
                <div style={{ fontSize: "0.78rem", fontWeight: 500, color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: "0.5rem" }}>
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "1rem" }}>
            {[
              { title: "El İşçiliği",    body: "Her parça ustalarımızın elinden çıkar, endüstriyel seri üretim yok." },
              { title: "Özel Ölçü",     body: "Standart ürün bulunmaz. Her proje mekanınıza özgün tasarlanır." },
              { title: "2 Yıl Garanti", body: "Montajdan itibaren 2 yıl tam garanti ve ücretsiz servis desteği." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  padding: "clamp(1.5rem,3vw,2.5rem)",
                }}
              >
                <div style={{ fontSize: "1rem", fontWeight: 600, color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
                  {f.title}
                </div>
                <div style={{ fontSize: "0.875rem", fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
                  {f.body}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer variant="dark" />
    </div>
  );
}
