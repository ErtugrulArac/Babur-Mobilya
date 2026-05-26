"use client"

import { DottedSurface } from "@/components/ui/dotted-surface"
import { PearlButton } from "@/components/ui/pearl-button"
import {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  type MouseEvent,
} from "react"
import clsx from "clsx"
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  type MotionStyle,
  type MotionValue,
  type Variants,
} from "framer-motion"

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

type WrapperStyle = MotionStyle & {
  "--x": MotionValue<string>
  "--y": MotionValue<string>
}

interface StepImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
}

interface AnimatedStepImageProps extends StepImageProps {
  preset?: keyof typeof ANIMATION_PRESETS
  delay?: number
}

const ANIMATION_PRESETS = {
  fadeInScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit:    { opacity: 0, scale: 0.95 },
    transition: { type: "spring", stiffness: 300, damping: 25, mass: 0.5 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -20 },
    transition: { type: "spring", stiffness: 300, damping: 25, mass: 0.5 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: 20 },
    transition: { type: "spring", stiffness: 300, damping: 25, mass: 0.5 },
  },
} as const

const steps = [
  {
    id: "1",
    name: "01 — Keşif",
    title: "Ölçüm & Keşif",
    description:
      "Mekanınızı yerinde ziyaret ediyor, ışık koşullarını, kullanım alışkanlıklarınızı ve hayallerinizi dinliyoruz. Milimetre hassasiyetinde alınan ölçümler ve kapsamlı bir brifingyle her projeye sağlam bir temel atıyoruz. Doğru başlangıç, mükemmel sonucun yarısıdır.",
  },
  {
    id: "2",
    name: "02 — Tasarım",
    title: "Tasarım & Proje",
    description:
      "Brifingden yola çıkarak 2D teknik çizimler ve fotogerçekçi 3D render görseller hazırlıyoruz. Malzeme, renk ve iç düzenleme seçimlerini sizinle birlikte yapıyor; siz memnun kalana kadar revize ediyoruz. Onay imzanız alınmadan üretime tek adım atılmaz.",
  },
  {
    id: "3",
    name: "03 — Üretim",
    title: "Üretim",
    description:
      "Tüm üretim kendi atölyemizde, hiçbir iş dışarıya taşeron verilmeden gerçekleşir. Premium MDF, masif ahşap ve lake kapak seçenekleri ustalarımızın elinde şekillenir. Her aşamada kalite kontrol yapılır; ortalama 3-6 haftada tamamlanan süreç boyunca sizi bilgilendiririz.",
  },
  {
    id: "4",
    name: "04 — Teslim",
    title: "Montaj & Teslim",
    description:
      "Mobilyalarınız korumalı ambalajla mekanınıza taşınır, uzman ekibimiz tarafından kurulur ve kontrol turu sizinle birlikte yapılır. Teslim gününde imzalanan garanti belgesiyle 2 yıl tam garanti ve ücretsiz servis desteği başlar. Herhangi bir sorun bildirdiğinizde aynı gün dönüş yapılır.",
  },
] as const

function useNumberCycler(totalSteps = 4, interval = 5000) {
  const [currentNumber, setCurrentNumber] = useState(0)

  useEffect(() => {
    const id = setTimeout(
      () => setCurrentNumber((p) => (p + 1) % totalSteps),
      interval,
    )
    return () => clearTimeout(id)
  }, [currentNumber, totalSteps, interval])

  const setStep = useCallback(
    (i: number) => setCurrentNumber(i % totalSteps),
    [totalSteps],
  )

  return { currentNumber, setStep }
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isMobile
}

function IconCheck(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className={cn("h-3.5 w-3.5", props.className)} {...props}>
      <path d="m229.66 77.66-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z" />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  )
}

const stepVariants: Variants = {
  inactive: { scale: 0.9, opacity: 0.6 },
  active:   { scale: 1,   opacity: 1   },
}

const StepImage = forwardRef<HTMLImageElement, StepImageProps>(
  ({ src, alt, className, style }, ref) => (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      style={{ position: "absolute", userSelect: "none", maxWidth: "unset", ...style }}
    />
  ),
)
StepImage.displayName = "StepImage"

const MotionStepImage = motion(StepImage)

function AnimatedStepImage({ preset = "fadeInScale", delay = 0, ...props }: AnimatedStepImageProps) {
  const cfg = ANIMATION_PRESETS[preset]
  return <MotionStepImage {...props} {...cfg} transition={{ ...cfg.transition, delay }} />
}

const imgBase = "rounded-xl border border-neutral-200 shadow-xl shadow-black/10"

function FeatureCard({ children, step }: { children: React.ReactNode; step: number }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const isMobile = useIsMobile()

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent<HTMLDivElement>) {
    if (isMobile) return
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const scrollToDetail = () => {
    const el = document.getElementById(`adim-${step + 1}`)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <motion.div
      className="group relative w-full rounded-2xl"
      onMouseMove={handleMouseMove}
      style={{ "--x": useMotionTemplate`${mouseX}px`, "--y": useMotionTemplate`${mouseY}px` } as WrapperStyle}
    >
      <div className="relative w-full overflow-hidden rounded-3xl border border-neutral-200 bg-white">
        <DottedSurface />
        <div className="p-8 md:p-10 min-h-[420px]" style={{ position: "relative", zIndex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="flex w-full flex-col gap-3 md:w-3/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "rgba(10,8,6,0.4)" }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {steps[step].name}
              </motion.div>

              <motion.h2
                className="text-2xl md:text-3xl font-bold tracking-tight"
                style={{ color: "#0a0806", letterSpacing: "-0.03em" }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {steps[step].title}
              </motion.h2>

              <motion.p
                className="text-base leading-relaxed"
                style={{ color: "rgba(10,8,6,0.55)" }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {steps[step].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mt-2">
                  <PearlButton onClick={scrollToDetail} small>Devamını Gör</PearlButton>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
          {children}
        </div>
      </div>
    </motion.div>
  )
}

function StepsNav({ current, onChange }: { current: number; onChange: (i: number) => void }) {
  return (
    <nav className="flex justify-center px-4">
      <ol className="flex w-full flex-wrap items-center justify-center gap-2">
        {steps.map((step, idx) => {
          const isCompleted = current > idx
          const isCurrent   = current === idx
          return (
            <motion.li
              key={step.id}
              initial="inactive"
              animate={isCurrent ? "active" : "inactive"}
              variants={stepVariants}
              transition={{ duration: 0.3 }}
            >
              <button
                type="button"
                onClick={() => onChange(idx)}
                className="flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-300 focus:outline-none"
                style={{
                  background: isCurrent ? "#0a0806" : "#f3f4f6",
                  color: isCurrent ? "#ffffff" : "#6b7280",
                }}
              >
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-300 text-xs"
                  style={{
                    background: isCompleted ? "#0a0806" : isCurrent ? "rgba(255,255,255,0.2)" : "#e5e7eb",
                    color: isCompleted || isCurrent ? "#ffffff" : "#374151",
                  }}
                >
                  {isCompleted ? <IconCheck /> : <span>{idx + 1}</span>}
                </span>
                <span className="hidden sm:inline-block">{step.name}</span>
              </button>
            </motion.li>
          )
        })}
      </ol>
    </nav>
  )
}

interface FeatureCarouselProps {
  images: {
    step1: [string, string]
    step2: [string, string]
    step3: string
    step4: string
  }
}

export function FeatureCarousel({ images }: FeatureCarouselProps) {
  const { currentNumber: step, setStep } = useNumberCycler()

  const renderImages = () => {
    switch (step) {
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-10 w-full max-w-4xl mx-auto px-4">
      <FeatureCard step={step}>
        <AnimatePresence mode="wait">
          <motion.div key={step} {...ANIMATION_PRESETS.fadeInScale} className="w-full h-full absolute">
            {renderImages()}
          </motion.div>
        </AnimatePresence>
      </FeatureCard>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <StepsNav current={step} onChange={setStep} />
      </motion.div>
    </div>
  )
}
