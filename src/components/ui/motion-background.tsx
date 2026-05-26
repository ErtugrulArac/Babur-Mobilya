"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function MotionBackground() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: "-5%" })
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })

  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40])
  const y2 = useTransform(scrollYProgress, [0, 1], [20, -60])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -30])
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 60])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -40])
  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.05, 0.9])

  const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 900 500" preserveAspectRatio="xMidYMid slice">
        <motion.circle
          cx="720" cy="280" r="260"
          fill="none" stroke="black" strokeWidth="0.6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 0.08 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 2.2, delay: 0, ease }}
        />
        <motion.circle
          cx="720" cy="280" r="160"
          fill="none" stroke="black" strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 0.06 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 2.2, delay: 0.25, ease }}
        />
        <motion.circle
          cx="720" cy="280" r="70"
          fill="none" stroke="black" strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 0.08 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 2.2, delay: 0.5, ease }}
        />
        <motion.line
          x1="0" y1="250" x2="400" y2="250"
          stroke="black" strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 0.06 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 2.2, delay: 0.3, ease }}
        />
        <motion.line
          x1="0" y1="0" x2="500" y2="500"
          stroke="black" strokeWidth="0.4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 0.04 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 2.2, delay: 0.6, ease }}
        />
        <motion.path
          d="M 900 0 Q 600 200 900 400"
          fill="none" stroke="black" strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 0.06 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 2.2, delay: 0.4, ease }}
        />
      </svg>

      <motion.div
        style={{
          position: "absolute", right: "8%", top: "10%",
          width: 180, height: 180,
          border: "0.6px solid rgba(0,0,0,0.09)",
          rotate: rotate1, y: y1, scale: scale1,
        }}
      />
      <motion.div
        style={{
          position: "absolute", right: "14%", top: "18%",
          width: 90, height: 90,
          border: "0.5px solid rgba(0,0,0,0.07)",
          rotate: rotate2, y: y2,
        }}
      />
      <motion.div
        style={{
          position: "absolute", left: "5%", bottom: "8%",
          width: 120, height: 120, borderRadius: "50%",
          border: "0.5px solid rgba(0,0,0,0.07)",
          y: y3,
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.18) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 70% 60% at 20% 80%, white 0%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 20% 80%, white 0%, transparent 100%)",
        }}
      />

      {[
        { x: "12%", y: "22%", delay: 0.4, size: 4 },
        { x: "28%", y: "65%", delay: 0.7, size: 3 },
        { x: "55%", y: "15%", delay: 0.9, size: 3.5 },
        { x: "75%", y: "70%", delay: 0.5, size: 4 },
        { x: "88%", y: "35%", delay: 1.1, size: 3 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute", left: dot.x, top: dot.y,
            width: dot.size, height: dot.size,
            borderRadius: "50%", background: "black",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 0.25, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.6, delay: dot.delay, ease }}
        />
      ))}
    </div>
  )
}
