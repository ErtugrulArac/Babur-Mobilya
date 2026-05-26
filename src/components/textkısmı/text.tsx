'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { PearlButton } from '@/components/ui/pearl-button';

const STEPS = [
  {
    num: '01',
    title: 'Mekanınızı Dinliyoruz.',
    desc: 'Her alan bir ihtiyacı barındırır. Sizinle birebir görüşerek yaşam biçiminizi, zevklerinizi ve mekanın ruhunu anlarız — form doldurmadan, katalog göndermeden.',
    href: '/surec#adim-1',
  },
  {
    num: '02',
    title: 'Tasarım Oluşturuyoruz.',
    desc: 'Duyduklarımızı somuta dönüştürürüz. Malzeme seçiminden renk paletine, ölçüden dokuya kadar size özgü bir tasarım dili kurulur; 3D görsellerle gözünüzde canlandırılır.',
    href: '/surec#adim-2',
  },
  {
    num: '03',
    title: 'Elinize Teslim Ediyoruz.',
    desc: 'Onaylı tasarım atölyemizde hayat bulur. Her parça kendi ustası tarafından işlenir, kalite kontrolünden geçer ve evinize kurulana kadar süreç bizim sorumluluğumuzdadır.',
    href: '/surec#adim-4',
  },
];

const MARQUEE_TEXT = 'BABUR MOBİLYA · EL İŞÇİLİĞİ · PREMİUM MALZEME · ÖZEL ÜRETİM · EST. 1970 · ';

// ── Kelime kelime reveal ──────────────────────────────────────────────────────
function WordReveal({ text, delay = 0, className = '', style = {} }: {
  text: string; delay?: number; className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const words = text.split(' ');
  return (
    <span ref={ref} className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`} style={style}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.65, delay: delay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ── Soldan çizilen çizgi ─────────────────────────────────────────────────────
function DrawLine({ delay = 0, inView }: { delay?: number; inView: boolean }) {
  return (
    <motion.div
      className="h-px w-full bg-black/8"
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : {}}
      style={{ originX: 'left' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}


// ── Ambient cursor glow ──────────────────────────────────────────────────────
function useAmbientGlow() {
  const gx = useMotionValue(-999);
  const gy = useMotionValue(-999);
  const sx = useSpring(gx, { stiffness: 60, damping: 20 });
  const sy = useSpring(gy, { stiffness: 60, damping: 20 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    gx.set(e.clientX - r.left);
    gy.set(e.clientY - r.top);
  }, [gx, gy]);

  const onMouseLeave = useCallback(() => {
    gx.set(-999); gy.set(-999);
  }, [gx, gy]);

  return { sx, sy, onMouseMove, onMouseLeave };
}

export default function TextSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12%' });
  const { sx, sy, onMouseMove, onMouseLeave } = useAmbientGlow();

  return (
    <div>
      {/* Marquee */}
      <div className="overflow-hidden bg-[#0f0f0f] py-2.5 select-none">
        <div className="flex whitespace-nowrap" style={{ animation: 'marquee 28s linear infinite' }}>
          {[...Array(4)].map((_, i) => (
            <span key={i} className="shrink-0" style={{
              fontFamily: "var(--font-poppins)", fontSize: '0.6rem', fontWeight: 500,
              letterSpacing: '0.35em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase',
            }}>
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* Ana section */}
      <section
        ref={ref}
        data-light-nav
        className="relative bg-white w-full px-6 md:px-16 lg:px-24 py-24 md:py-32 overflow-hidden"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* Grain texture */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.035]" aria-hidden>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>

        {/* Ambient glow */}
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{
            x: sx, y: sy,
            translateX: '-50%', translateY: '-50%',
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(0,0,0,0.04) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative">

          {/* SOL — sticky */}
          <div className="lg:w-5/12 flex flex-col gap-12">
            <div className="lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7 }}
              >
                <h2 className="leading-tight tracking-tight"
                  style={{ fontFamily: "var(--font-poppins)", fontSize: 'clamp(2.2rem,4.5vw,3.8rem)' }}>
                  <WordReveal text="Mobilya," delay={0} style={{ fontWeight: 700, display: 'block' }} />
                  <WordReveal text="Yeniden Düşünüldü." delay={0.12}
                    style={{ fontWeight: 300, color: '#9a9a9a', display: 'block' }} />
                </h2>

                <motion.p className="mt-6 leading-relaxed"
                  style={{ fontFamily: "var(--font-poppins)", fontSize: 'clamp(0.85rem,1.1vw,0.95rem)',
                    color: '#6b6b6b', fontWeight: 300, maxWidth: 340 }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.45 }}
                >
                  Babur Mobilya olarak standart üretimi reddediyoruz. Her parça,
                  yaşanacak hayatı hesaba katan bir tasarımın ürünüdür.
                </motion.p>
              </motion.div>

              <motion.div className="mt-10"
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.55 }}
              >
                <PearlButton href="/iletisim">Projemi Başlat</PearlButton>
              </motion.div>
            </div>
          </div>

          {/* SAĞ */}
          <div className="lg:w-7/12 flex flex-col">
            <motion.p className="mb-5"
              style={{ fontFamily: "var(--font-poppins)", fontSize: '0.68rem', fontWeight: 500,
                letterSpacing: '0.28em', textTransform: 'uppercase', color: '#bbb' }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Nasıl Çalışıyoruz
            </motion.p>
            <DrawLine delay={0.15} inView={inView} />

            <div className="flex flex-col">
              {STEPS.map((step, i) => (
                <StepRow key={step.num} step={step} index={i} inView={inView} />
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

function StepRow({ step, index, inView }: {
  step: typeof STEPS[0]; index: number; inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.25 + index * 0.15 }}
      style={{
        background: hovered ? 'rgba(0,0,0,0.025)' : 'transparent',
        transition: 'background 0.35s ease',
        marginLeft: '-1.5rem', marginRight: '-1.5rem',
        paddingLeft: '1.5rem', paddingRight: '1.5rem',
      }}
      className="flex gap-6 py-7 cursor-default"
    >
      {/* Metin */}
      <div className="flex flex-col gap-2 flex-1">
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: 'clamp(0.95rem,1.35vw,1.12rem)',
          lineHeight: 1.65, color: '#888', fontWeight: 300 }}>
          <motion.strong
            animate={{ color: hovered ? '#000' : '#111' }}
            transition={{ duration: 0.3 }}
            style={{ fontWeight: 600 }}
          >
            {step.title}
          </motion.strong>{' '}
          {step.desc}
        </p>
        <DrawLine delay={0.3 + index * 0.15} inView={inView} />
      </div>
    </motion.div>
  );
}
