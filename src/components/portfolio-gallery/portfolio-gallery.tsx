"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface PortfolioGalleryProps {
  title?: string
  archiveButton?: { text: string; href: string }
  images?: Array<{ src: string; alt: string; title?: string }>
  className?: string
  maxHeight?: number
  spacing?: string
  onImageClick?: (index: number) => void
  pauseOnHover?: boolean
  marqueeRepeat?: number
}

export function PortfolioGallery({
  title = "Browse my library",
  archiveButton = { text: "View gallery", href: "/work" },
  images: customImages,
  className = "",
  maxHeight = 120,
  spacing = "-space-x-72 md:-space-x-80",
  onImageClick,
  pauseOnHover = true,
  marqueeRepeat = 4,
}: PortfolioGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const defaultImages = [
    { src: "/deneme1.webp",   alt: "Mutfak" },
    { src: "/deneme2.webp",   alt: "Ofis" },
    { src: "/deneme3.webp",   alt: "Vitrin" },
    { src: "/arkaplan2.webp", alt: "Masa" },
    { src: "/arkaplan3.webp", alt: "Diğer" },
  ]

  const images = customImages || defaultImages

  return (
    <section
      aria-label={title}
      className={`relative min-h-dvh py-20 px-4 ${className}`}
      style={{ background: "#ffffff" }}
      id="archives"
    >
      <div
        className="max-w-7xl mx-auto rounded-2xl overflow-hidden"
        style={{ background: "rgba(10,8,6,0.03)", border: "1px solid rgba(10,8,6,0.08)" }}
      >
        {/* Header */}
        <div className="relative z-10 text-center pt-16 pb-8 px-8">
          <h2
            className="text-4xl md:text-6xl font-bold mb-8"
            style={{ color: "#0a0806", fontFamily: "var(--font-general)", letterSpacing: "-0.03em", lineHeight: 0.95 }}
          >
            {title}
          </h2>

          <Link
            href={archiveButton.href}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-medium group mb-20 transition-opacity hover:opacity-80"
            style={{
              background: "#0a0806",
              color: "#ffffff",
              fontFamily: "var(--font-general)",
              fontSize: "0.78rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            <span>{archiveButton.text}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Desktop 3D overlapping layout */}
        <div className="hidden md:block relative overflow-hidden h-[400px] -mb-[200px]">
          <div className={`flex ${spacing} pb-8 pt-40 items-end justify-center`}>
            {images.map((image, index) => {
              const middle = Math.floor(images.length / 2)
              const distanceFromMiddle = Math.abs(index - middle)
              const staggerOffset = maxHeight - distanceFromMiddle * 20
              const isHovered = hoveredIndex === index
              const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index
              const yOffset = isHovered ? -120 : isOtherHovered ? 0 : -staggerOffset

              return (
                <motion.div
                  key={index}
                  className="group cursor-pointer flex-shrink-0"
                  style={{ zIndex: images.length - index }}
                  initial={{ transform: `perspective(5000px) rotateY(-45deg) translateY(200px)`, opacity: 0 }}
                  animate={{ transform: `perspective(5000px) rotateY(-45deg) translateY(${yOffset}px)`, opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  onClick={() => onImageClick?.(index)}
                >
                  <div
                    className="relative aspect-video w-64 md:w-80 lg:w-96 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105"
                    style={{
                      boxShadow: "rgba(0,0,0,0.01) 0.8px 0px 0.8px, rgba(0,0,0,0.03) 2.4px 0px 2.4px, rgba(0,0,0,0.08) 6.4px 0px 6.4px, rgba(0,0,0,0.25) 20px 0px 20px",
                    }}
                  >
                    <img src={image.src} alt={image.alt} className="w-full h-full object-cover object-center" loading="lazy" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Mobile marquee */}
        <div className="block md:hidden relative pb-8">
          <div className={cn("group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]", "flex-row")}>
            {Array(marqueeRepeat).fill(0).map((_, i) => (
              <div
                key={i}
                className={cn("flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row", pauseOnHover ? "group-hover:[animation-play-state:paused]" : "")}
              >
                {images.map((image, index) => (
                  <div key={`${i}-${index}`} className="group cursor-pointer flex-shrink-0" onClick={() => onImageClick?.(index)}>
                    <div
                      className="relative aspect-video w-64 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105"
                      style={{ boxShadow: "rgba(0,0,0,0.01) 0.8px 0px 0.8px, rgba(0,0,0,0.25) 20px 0px 20px" }}
                    >
                      <img src={image.src} alt={image.alt} className="w-full h-full object-cover object-center" loading="lazy" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PortfolioGallery
