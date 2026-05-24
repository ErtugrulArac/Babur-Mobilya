"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface ImageCard {
  id: string
  src: string
  alt: string
  rotation: number
}

interface ImageCarouselHeroProps {
  title: string
  subtitle: string
  description: string
  ctaText: string
  ctaHref?: string
  onCtaClick?: () => void
  images: ImageCard[]
  features?: Array<{ title: string; description: string }>
}

export function ImageCarouselHero({
  title,
  subtitle,
  description,
  ctaText,
  ctaHref = "/iletisim",
  onCtaClick,
  images,
  features = [],
}: ImageCarouselHeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const [rotatingCards, setRotatingCards] = useState<number[]>([])
  const [radius, setRadius] = useState(200)
  const [cardW, setCardW] = useState(140)
  const [cardH, setCardH] = useState(175)

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth
      if (w < 480) {
        setRadius(50);  setCardW(36);  setCardH(45)
      } else if (w < 768) {
        setRadius(65);  setCardW(48);  setCardH(60)
      } else if (w < 1280) {
        setRadius(80);  setCardW(60);  setCardH(75)
      } else {
        setRadius(95);  setCardW(70);  setCardH(88)
      }
    }
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useEffect(() => {
    setRotatingCards(images.map((_, i) => i * (360 / images.length)))
  }, [images.length])

  useEffect(() => {
    const id = setInterval(() => {
      setRotatingCards(prev => prev.map(v => (v + 0.4) % 360))
    }, 50)
    return () => clearInterval(id)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setMousePosition({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height })
  }

  const pX = (mousePosition.x - 0.5) * 18
  const pY = (mousePosition.y - 0.5) * 18

  return (
    <section style={{ background: "#ffffff", minHeight: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>

      {/* Carousel */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePosition({ x: 0.5, y: 0.5 })}
        style={{
          position: "relative",
          width: "100%",
          height: `clamp(220px, 32vw, 380px)`,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: "1200px",
          paddingTop: "clamp(80px, 10vw, 120px)",
          overflow: "hidden",
        }}
      >
        {images.map((image, i) => {
          const angle = (rotatingCards[i] || 0) * (Math.PI / 180)
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          return (
            <div
              key={image.id}
              style={{
                position: "absolute",
                width: cardW,
                height: cardH,
                transform: `translate(${x}px, ${y}px) rotateX(${pY}deg) rotateY(${pX}deg) rotateZ(${image.rotation}deg)`,
                transformStyle: "preserve-3d",
                transition: "transform 0.1s linear",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <Image src={image.src} alt={image.alt} fill className="object-cover" priority={i < 3} />
            </div>
          )
        })}
      </div>

      {/* Text + CTA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "clamp(2rem,5vw,4rem) clamp(1.5rem,6vw,6rem)", textAlign: "center", gap: "clamp(1rem,2vw,1.5rem)" }}>

        <span style={{ fontFamily: "var(--font-general)", fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(10,8,6,0.35)" }}>
          {subtitle}
        </span>

        <h1 style={{ fontFamily: "var(--font-general)", fontSize: "clamp(2.8rem,7vw,6rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 0.95, color: "#0a0806", margin: 0, maxWidth: "14ch" }}>
          {title}
        </h1>

        <p style={{ fontFamily: "var(--font-general)", fontSize: "clamp(0.9rem,1.4vw,1.05rem)", fontWeight: 400, color: "rgba(10,8,6,0.5)", lineHeight: 1.7, maxWidth: "44ch", margin: 0 }}>
          {description}
        </p>

        <Link
          href={ctaHref}
          onClick={onCtaClick}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            fontFamily: "var(--font-general)",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#ffffff",
            background: "#0a0806",
            padding: "14px 32px",
            borderRadius: 4,
            textDecoration: "none",
            marginTop: "0.5rem",
            transition: "opacity 0.2s",
          }}
        >
          {ctaText}
          <ArrowRight size={14} strokeWidth={2} />
        </Link>
      </div>

      {/* Feature cards */}
      {features.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1px", background: "rgba(10,8,6,0.1)", borderTop: "1px solid rgba(10,8,6,0.1)" }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: "#ffffff", padding: "clamp(1.5rem,3vw,2.5rem)", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-general)", fontSize: "clamp(0.95rem,1.2vw,1.05rem)", fontWeight: 600, color: "#0a0806", letterSpacing: "-0.01em", marginBottom: "0.5rem" }}>
                {f.title}
              </div>
              <div style={{ fontFamily: "var(--font-general)", fontSize: "0.8rem", fontWeight: 400, color: "rgba(10,8,6,0.48)", lineHeight: 1.7 }}>
                {f.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default ImageCarouselHero
