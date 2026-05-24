"use client";

import { Ref, forwardRef, useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { motion, useMotionValue } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Direction = "left" | "right";

function getRandomNumberInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

const MotionImage = motion(
  forwardRef(function MotionImage(props: ImageProps, ref: Ref<HTMLImageElement>) {
    return <Image ref={ref} {...props} />;
  })
);

export const Photo = ({
  src, alt, className, direction, width, height, ...props
}: {
  src: string; alt: string; className?: string;
  direction?: Direction; width: number; height: number;
}) => {
  const [rotation, setRotation] = useState(0);
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  useEffect(() => {
    setRotation(getRandomNumberInRange(1, 4) * (direction === "left" ? -1 : 1));
  }, [direction]);

  const handleMouse = (event: { currentTarget: { getBoundingClientRect: () => DOMRect }; clientX: number; clientY: number }) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.2, zIndex: 9999 }}
      whileHover={{ scale: 1.1, rotateZ: 2 * (direction === "left" ? -1 : 1), zIndex: 9999 }}
      whileDrag={{ scale: 1.1, zIndex: 9999 }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{ width, height, perspective: 400, WebkitUserSelect: "none", userSelect: "none", touchAction: "none" }}
      className={cn(className, "relative mx-auto shrink-0 cursor-grab active:cursor-grabbing")}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(200); y.set(200); }}
      draggable={false}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-sm">
        <MotionImage className="rounded-3xl object-cover" fill src={src} alt={alt} {...props} draggable={false} />
      </div>
    </motion.div>
  );
};

export const PhotoGallery = ({ animationDelay = 0.5 }: { animationDelay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setIsVisible(true), animationDelay * 1000);
    const t2 = setTimeout(() => setIsLoaded(true), (animationDelay + 0.4) * 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [animationDelay]);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };

  const photoVariants = {
    hidden: () => ({ x: 0, y: 0, rotate: 0, scale: 1 }),
    visible: (custom: { x: string; y: string; order: number }) => ({
      x: custom.x, y: custom.y, rotate: 0, scale: 1,
      transition: { type: "spring" as const, stiffness: 70, damping: 12, mass: 1, delay: custom.order * 0.15 },
    }),
  };

  const photos = [
    { id: 1, order: 0, x: "-320px", y: "15px",  zIndex: 50, direction: "left"  as Direction, src: "/deneme1.webp"   },
    { id: 2, order: 1, x: "-160px", y: "32px",  zIndex: 40, direction: "left"  as Direction, src: "/deneme2.webp"   },
    { id: 3, order: 2, x: "0px",    y: "8px",   zIndex: 30, direction: "right" as Direction, src: "/deneme3.webp"   },
    { id: 4, order: 3, x: "160px",  y: "22px",  zIndex: 20, direction: "right" as Direction, src: "/arkaplan2.webp" },
    { id: 5, order: 4, x: "320px",  y: "44px",  zIndex: 10, direction: "left"  as Direction, src: "/arkaplan3.webp" },
  ];

  return (
    <div style={{ background: "#ffffff", minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "clamp(5rem,10vw,8rem)", paddingBottom: "clamp(3rem,6vw,5rem)" }}>

      {/* Grid doku */}
      <div className="absolute inset-0 max-md:hidden -z-10 h-full w-full bg-transparent opacity-20"
        style={{ backgroundImage: "linear-gradient(to right,#57534e 1px,transparent 1px),linear-gradient(to bottom,#57534e 1px,transparent 1px)", backgroundSize: "3rem 3rem", maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%,#000 70%,transparent 110%)" }}
      />

      <span style={{ fontFamily: "var(--font-general)", fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(10,8,6,0.35)", marginBottom: "1rem", display: "block" }}>
        Est. 2010 · Babür Mobilya
      </span>

      <h1 style={{ fontFamily: "var(--font-general)", fontSize: "clamp(3rem,7vw,6rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 0.95, color: "#0a0806", textAlign: "center", marginBottom: "clamp(2rem,4vw,3rem)" }}>
        Hizmetlerimiz
      </h1>

      {/* Fotoğraflar — desktop: yatay yelpaze, mobil: dikey istif */}
      <div className="relative w-full flex items-center justify-center overflow-hidden"
        style={{ height: "clamp(260px, 38vw, 420px)", marginBottom: "clamp(1.5rem,3vw,2.5rem)" }}>
        <motion.div
          className="relative mx-auto flex w-full max-w-7xl justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="relative flex w-full justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            {/* Mobil: basit yatay scroll */}
            <div className="flex md:hidden gap-3 overflow-x-auto px-6 pb-2 w-full snap-x snap-mandatory">
              {photos.map((photo) => (
                <div key={photo.id} className="shrink-0 snap-center" style={{ width: 140, height: 140, borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
                  <img src={photo.src} alt="Babür Mobilya" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>

            {/* Desktop: yelpaze animasyonu */}
            <div className="hidden md:block relative h-55 w-55">
              {[...photos].reverse().map((photo) => (
                <motion.div
                  key={photo.id}
                  className="absolute left-0 top-0"
                  style={{ zIndex: photo.zIndex }}
                  variants={photoVariants}
                  custom={{ x: photo.x, y: photo.y, order: photo.order }}
                >
                  <Photo width={220} height={220} src={photo.src} alt="Babür Mobilya" direction={photo.direction} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <p style={{ fontFamily: "var(--font-general)", fontSize: "clamp(0.9rem,1.3vw,1rem)", fontWeight: 400, color: "rgba(10,8,6,0.5)", lineHeight: 1.7, textAlign: "center", maxWidth: "42ch", marginBottom: "2rem" }}>
        Mutfaktan çalışma odasına, her mekan için özel tasarım.
      </p>

      <Link
        href="/iletisim"
        style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", fontFamily: "var(--font-general)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#ffffff", background: "#0a0806", padding: "14px 32px", borderRadius: 4, textDecoration: "none" }}
      >
        Bizimle Çalışın
        <svg width="13" height="10" viewBox="0 0 14 10" fill="none">
          <path d="M1 5h12M8 1l5 4-5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
};

export default PhotoGallery;
