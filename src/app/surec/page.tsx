"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Navbar from "@/components/navbar/navbar"
import Footer from "@/components/footer/footer"
import { FeatureCarousel } from "@/components/feature-carousel/feature-carousel"
import { FeatureCard } from "@/components/ui/feature-card"
import { Ruler, PenLine, Hammer, PackageCheck } from "lucide-react"

const IMAGES = {
  step1: ["/surec-sayfasi/olcum-kesif.webp", "/surec-sayfasi/olcum-kesif.webp"] as [string, string],
  step2: ["/surec-sayfasi/tasarim-proje.webp", "/surec-sayfasi/tasarim-proje.webp"] as [string, string],
  step3: "/surec-sayfasi/uretim.webp",
  step4: "/surec-sayfasi/montaj-teslim.webp",
}

const DETAILS = [
  {
    num: "01",
    id: "adim-1",
    title: "Ölçüm & Keşif",
    lead: "Her proje, mekanınızı ve sizi tanımakla başlar.",
    body: [
      "Ekibimiz randevu alınan günde mekanınıza gelir; yaşam alanınızı, ışık koşullarını, var olan mobilyaları ve kullanım alışkanlıklarınızı yerinde değerlendirir. Bu ziyaret boyunca sizi sadece dinlemekle kalmaz, hayallerinizi somutlaştıracak soruları da sorarız.",
      "Milimetre hassasiyetinde alınan ölçümlerin yanı sıra tesisat yerleşimi, kapı-pencere mesafeleri ve zemin farkları gibi teknik detaylar da kayıt altına alınır. Bu aşamadan çıkan brifing belgesi, sonraki tüm adımların temelini oluşturur.",
    ],
    points: [
      "Ücretsiz yerinde ölçüm ve keşif",
      "Ortalama 1-2 saat sürer",
      "Referans görsel ve renk tercihlerinizi hazırlayın",
      "Bütçe ve zaman planı bu aşamada netleşir",
      "Keşif sonrası yazılı brifing teslim edilir",
    ],
    img: "/surec-sayfasi/olcum-kesif.webp",
    flip: false,
  },
  {
    num: "02",
    id: "adim-2",
    title: "Tasarım & Proje",
    lead: "Hayalinizdeki mobilyayı görmeden onaylamazsınız.",
    body: [
      "Keşif brifinginden yola çıkarak tasarım ekibimiz tam ölçekli teknik çizimler ve dijital perspektif görseller hazırlar. Sunumda malzeme örnekleri elinizde tutularak kapak renkleri, iç aksesuar düzeni ve aydınlatma detayları birlikte kararlaştırılır.",
      "Her revizyonu dikkate alır, tasarımı siz memnun kalana kadar geliştiririz. Onay imzanız alınmadan üretim aşamasına geçilmez; bu süreçte ek maliyet ve sürpriz yoktur.",
    ],
    points: [
      "Tam ölçekli teknik çizimler ve kat planı",
      "Dijital perspektif ve malzeme örnekleriyle sunum",
      "Malzeme ve renk kataloğuyla bire bir seçim",
      "Sınırsız revizyon hakkı",
      "Onay imzası alınmadan üretim başlamaz",
    ],
    img: "/surec-sayfasi/tasarim-proje.webp",
    flip: true,
  },
  {
    num: "03",
    id: "adim-3",
    title: "Üretim",
    lead: "Kendi atölyemizde, kendi ustalarımızın elinde.",
    body: [
      "Üretim sürecinin tamamı Babur Mobilya atölyesinde gerçekleşir; hiçbir aşama dışarıya taşeron olarak verilmez. Yüksek yoğunluklu MDF gövde, doğal ahşap, lake ve folyo kapak seçenekleri gibi premium hammaddeler tedarikçilerden özenle seçilir.",
      "Her parça kesim, kenar bantlama, delme ve montaj aşamalarından geçer; her aşamada kalite kontrol yapılır. Üretim süresi proje karmaşıklığına göre 3 ila 6 hafta arasında değişir ve süreç boyunca sizi bilgilendiririz.",
    ],
    points: [
      "%100 yerli üretim, kendi atölyemizde",
      "Premium MDF, masif ahşap ve lake seçenekleri",
      "Her üretim aşamasında kalite kontrol",
      "Ortalama 3-6 haftalık üretim süresi",
      "Süreç boyunca haftalık ilerleme bildirimi",
    ],
    img: "/surec-sayfasi/uretim.webp",
    flip: false,
  },
  {
    num: "04",
    id: "adim-4",
    title: "Montaj & Teslim",
    lead: "Montaj bittiğinde mekan hazır, iz kalmaz.",
    body: [
      "Uzman montaj ekibimiz mobilyaları fabrikadan direkt mekanınıza getirir; taşıma sırasında her parça korumalı ambalajda tutulur. Montaj süreci tamamlandıktan sonra ekibimiz alanı temizler ve sizinle birlikte kontrol turu yapar.",
      "Teslim gününde imzalanan belgeyle kapsamlı bir satış sonrası destek süreci başlar. Montaj ekibimiz her sorunuza aynı gün yanıt verir; uzun vadeli bakım ve teknik destek hizmetimiz kesintisiz sürer.",
    ],
    points: [
      "Korumalı ambalajla taşıma ve montaj",
      "Aynı gün temizlik ve düzen",
      "Teslim kontrol turu sizinle yapılır",
      "Teslim sonrası kapsamlı bakım ve teknik destek",
      "Her sorun bildirimi için aynı gün yanıt",
    ],
    img: "/surec-sayfasi/montaj-teslim.webp",
    flip: true,
  },
]

function DetailSection({ detail }: { detail: typeof DETAILS[number] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      id={detail.id}
      ref={ref}
      style={{
        padding: "clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,5rem)",
        background: "#ffffff",
        scrollMarginTop: "80px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className={`flex flex-col ${detail.flip ? "md:flex-row-reverse" : "md:flex-row"} gap-10 md:gap-16 items-center`}>
          {/* Metin */}
          <div className="w-full md:w-1/2">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: "clamp(2rem,4vw,3.2rem)",
                fontWeight: 700,
                color: "#0a0806",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                marginBottom: "1rem",
              }}
            >
              {detail.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.14 }}
              style={{
                fontSize: "1.05rem",
                fontWeight: 600,
                color: "#0a0806",
                marginBottom: "1.25rem",
                lineHeight: 1.5,
              }}
            >
              {detail.lead}
            </motion.p>

            {detail.body.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontSize: "0.95rem",
                  color: "rgba(10,8,6,0.55)",
                  lineHeight: 1.8,
                  marginBottom: "1rem",
                }}
              >
                {para}
              </motion.p>
            ))}

            <motion.ul
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.38 }}
              style={{
                marginTop: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
                listStyle: "none",
                padding: 0,
              }}
            >
              {detail.points.map((point, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.6rem",
                    fontSize: "0.875rem",
                    color: "rgba(10,8,6,0.65)",
                  }}
                >
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 18,
                    height: 18,
                    background: "#0a0806",
                    borderRadius: "50%",
                    flexShrink: 0,
                    marginTop: 2,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 256 256" fill="white">
                      <path d="m229.66 77.66-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z" />
                    </svg>
                  </span>
                  {point}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Görsel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full md:w-1/2"
            style={{ position: "relative" }}
          >
            <div style={{
              position: "absolute",
              top: 16, left: -16,
              right: 16, bottom: -16,
              background: "rgba(10,8,6,0.06)",
              borderRadius: "0.75rem",
              zIndex: 0,
            }} />
            <img
              src={detail.img}
              alt={detail.title}
              style={{
                width: "100%",
                height: "clamp(280px,40vw,460px)",
                objectFit: "cover",
                borderRadius: "0.75rem",
                display: "block",
                position: "relative",
                zIndex: 1,
              }}
            />

            <div style={{
              position: "absolute",
              bottom: -16, right: -8,
              zIndex: 2,
              background: "#0a0806",
              padding: "0.6rem 1rem",
              borderRadius: "0.4rem",
            }}>
              <span style={{
                fontSize: "clamp(1.8rem,4vw,3rem)",
                fontWeight: 800,
                color: "rgba(255,255,255,0.15)",
                letterSpacing: "-0.04em",
                lineHeight: 1,
                display: "block",
                userSelect: "none",
              }}>
                {detail.num}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default function SurecPage() {
  return (
    <div data-light-nav style={{ background: "#ffffff" }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        paddingTop: "clamp(7rem, 14vw, 11rem)",
        paddingBottom: "clamp(2rem, 4vw, 3rem)",
        paddingLeft: "clamp(1.5rem, 5vw, 4rem)",
        paddingRight: "clamp(1.5rem, 5vw, 4rem)",
        textAlign: "center",
      }}>
        <p style={{
          fontSize: "0.72rem",
          letterSpacing: "0.28em",
          color: "rgba(10,8,6,0.35)",
          textTransform: "uppercase",
          fontFamily: "monospace",
          marginBottom: "1.25rem",
        }}>
          Est. 1970 · Babur Mobilya
        </p>
        <h1 style={{
          fontSize: "clamp(2.5rem, 6vw, 5rem)",
          fontWeight: 700,
          color: "#0a0806",
          letterSpacing: "-0.03em",
          lineHeight: 0.95,
          margin: "0 auto 1.5rem",
        }}>
          Nasıl Çalışıyoruz?
        </h1>
        <p style={{
          fontSize: "1rem",
          color: "rgba(10,8,6,0.45)",
          maxWidth: 420,
          margin: "0 auto",
          lineHeight: 1.7,
        }}>
          Fikirden teslimata dört adım. Her adımda sizinle, her detayda aynı özen.
        </p>
      </section>

      {/* Carousel */}
      <div style={{ paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
        <FeatureCarousel images={IMAGES} />
      </div>

      {/* Ayırıcı */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.5rem,5vw,5rem)" }}>
        <div style={{ height: 1, background: "rgba(10,8,6,0.08)" }} />
      </div>

      {/* Detay bölümleri */}
      {DETAILS.map((detail) => (
        <DetailSection key={detail.id} detail={detail} />
      ))}

      {/* ── Feature Cards ─────────────────────────── */}
      <div style={{ height: "clamp(4rem, 8vw, 7rem)" }} />
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y border" style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <a href="#adim-1" style={{ textDecoration: "none", color: "inherit" }}>
          <FeatureCard
            feature={{
              title: "Yerinde Ölçüm",
              icon: Ruler,
              description: "Mekanınızı ekibimiz yerinde ziyaret ederek milimetrik ölçümler alır; hiçbir detay atlanmaz.",
            }}
            className="cursor-pointer h-full"
          />
        </a>
        <a href="#adim-2" style={{ textDecoration: "none", color: "inherit" }}>
          <FeatureCard
            feature={{
              title: "Malzeme & Renk Seçimi",
              icon: PenLine,
              description: "Ahşap türü, kapak rengi ve yüzey dokusunu katalogdan değil, bire bir deneyimleyerek seçin; tasarım size uygun netleşir.",
            }}
            className="cursor-pointer h-full"
          />
        </a>
        <a href="#adim-3" style={{ textDecoration: "none", color: "inherit" }}>
          <FeatureCard
            feature={{
              title: "Atölye Üretimi",
              icon: Hammer,
              description: "Her parça kendi atölyemizde, uzman ustalar tarafından üretilir. Hiçbir iş dışarıya taşeron olarak verilmez.",
            }}
            className="cursor-pointer h-full"
          />
        </a>
        <a href="#adim-4" style={{ textDecoration: "none", color: "inherit" }}>
          <FeatureCard
            feature={{
              title: "Montaj & Kurulum",
              icon: PackageCheck,
              description: "Uzman ekibimiz mobilyalarınızı mekanınıza taşır, kurar ve kontrol turuyla teslim eder; alan temiz, iz kalmaz.",
            }}
            className="cursor-pointer h-full"
          />
        </a>
      </div>

      <div style={{ height: "clamp(6rem, 12vw, 10rem)" }} />
      <Footer variant="dark" />
    </div>
  )
}
