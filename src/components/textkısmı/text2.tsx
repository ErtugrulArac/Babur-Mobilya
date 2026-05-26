'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ITEMS = [
  {
    num: '1',
    word: 'Tasarım',
    desc: 'Ev ve ofis mobilyası tasarımında ölçü, malzeme ve estetik bir araya gelir. Mekanınıza özel konsept geliştirip 3D görselleştirme ile onayınızı alır, sonra üretime geçeriz.',
    bg: '/deneme1.webp',
    href: '/surec#adim-2',
  },
  {
    num: '2',
    word: 'Üretim',
    desc: 'Masif ahşap, İtalyan deri ve Avrupa menşeli yarı mamuller kullanılarak el işçiliğiyle üretilir. Endüstriyel seri üretimin yerini alamayacağı bir atölye kalitesi sunarız.',
    bg: '/deneme2.webp',
    href: '/surec#adim-3',
  },
  {
    num: '3',
    word: 'Kurulum',
    desc: 'Mobilyalarınız fabrikadan çıktığı günkü kaliteyle evinize taşınır, profesyonel ekibimiz tarafından kurulur. 5 yıl malzeme ve işçilik garantisi ile teslim edilir.',
    bg: '/deneme3.webp',
    href: '/surec#adim-4',
  },
];

export default function Text2() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      className="w-full select-none"
      style={{ background: '#0c0c0c', fontFamily: "var(--font-poppins)" }}
    >
      {/* Üst başlık */}
      <div className="hidden md:flex items-end justify-between px-10 pt-14 pb-8 border-b border-white/8">
        <h2
          style={{
            fontFamily: "var(--font-poppins)",
            fontSize: 'clamp(1.6rem,2.8vw,2.6rem)',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.9)',
            lineHeight: 1,
            letterSpacing: '-0.01em',
          }}
        >
          Özel Mobilya Tasarımı & Üretimi
        </h2>
        <span
          style={{
            fontFamily: "var(--font-poppins)",
            fontSize: '0.68rem',
            fontWeight: 400,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.2)',
          }}
        >
          Babur Mobilya
        </span>
      </div>

      {/* DESKTOP — 3 satır */}
      <div className="hidden md:block">
        {ITEMS.map((item, i) => (
          <DesktopRow
            key={item.num}
            item={item}
            isHovered={hovered === i}
            anyHovered={hovered !== null}
            onEnter={() => setHovered(i)}
            onLeave={() => setHovered(null)}
          />
        ))}

        {/* Desktop alt CTA */}
        <div className="px-10 py-14 border-t border-white/8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <p className="text-white leading-snug max-w-lg"
              style={{ fontFamily: "var(--font-poppins)", fontSize: 'clamp(1.2rem,2vw,1.6rem)', fontWeight: 600 }}>
              Ev ve ofis için özel mobilya tasarımı,{' '}
              <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>
                el işçiliğiyle üretim ve kapıya profesyonel kurulum.
              </span>
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="shrink-0 inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-white/25 text-white cursor-pointer"
              style={{ fontFamily: "var(--font-poppins)", fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase' }}
            >
              Projeye Başla <ArrowRight size={13} strokeWidth={2} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* MOBILE — kartlar */}
      <div className="md:hidden flex flex-col">
        {ITEMS.map((item, i) => (
          <MobileCard key={item.num} item={item} index={i} />
        ))}

        {/* Alt CTA */}
        <div className="px-6 py-12 border-t border-white/8">
          <p className="text-white font-semibold text-xl leading-snug mb-1">
            Hayalinizdeki mobilyayı birlikte
          </p>
          <p className="text-white font-semibold text-xl leading-snug mb-1">
            tasarlayalım{' '}
            <span className="text-white/35 font-light">
              uzman ekibimizle
            </span>
          </p>
          <p className="text-white/35 font-light text-xl leading-snug">
            kişiye özel çözümler üretelim.
          </p>
          <button
            className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/25 text-white text-xs font-medium tracking-widest uppercase"
          >
            Projeye Başla <ArrowRight size={13} strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}

function DesktopRow({
  item, isHovered, anyHovered, onEnter, onLeave,
}: {
  item: typeof ITEMS[0];
  isHovered: boolean;
  anyHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <a href={item.href} style={{ textDecoration: 'none', display: 'block' }}>
    <motion.div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      animate={{
        backgroundColor: isHovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0)',
      }}
      transition={{ duration: 0.3 }}
      className="relative flex items-center border-b border-white/8 cursor-pointer overflow-hidden"
      style={{ minHeight: 280 }}
    >
      {/* Sol — numara + açıklama */}
      <div className="flex items-start gap-6 px-10 py-12 w-[44%] shrink-0 z-10">
        {/* Daire numarası */}
        <motion.div
          animate={{
            borderColor: isHovered ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)',
          }}
          transition={{ duration: 0.3 }}
          className="shrink-0 w-7 h-7 rounded-full border flex items-center justify-center mt-0.5"
        >
          <span className="text-[10px] text-white/50 font-medium">{item.num}</span>
        </motion.div>

        {/* Açıklama */}
        <motion.p
          animate={{ color: isHovered ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.35)' }}
          transition={{ duration: 0.35 }}
          className="font-light leading-relaxed"
          style={{ fontSize: 'clamp(0.78rem,1vw,0.9rem)' }}
        >
          {item.desc}
        </motion.p>
      </div>

      {/* Sağ — büyük kelime */}
      <div className="flex-1 flex items-center justify-end pr-10 z-10">
        <motion.span
          animate={{
            opacity: isHovered ? 1 : anyHovered ? 0.06 : 0.12,
            x: isHovered ? 0 : 10,
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-bold text-white tracking-tight leading-none"
          style={{ fontSize: 'clamp(5rem,10vw,11rem)' }}
        >
          {item.word}
        </motion.span>

        {/* Ok oku */}
        <motion.span
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -12 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="ml-4 text-white"
        >
          <ArrowRight size={28} strokeWidth={1.5} />
        </motion.span>
      </div>

      {/* Hover arka plan görseli */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${item.bg})` }}
        animate={{ opacity: isHovered ? 0.55 : 0 }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
    </a>
  );
}

function MobileCard({ item, index }: { item: typeof ITEMS[0]; index: number }) {
  return (
    <a href={item.href} style={{ textDecoration: 'none', display: 'block' }}>
    <div
      className="relative overflow-hidden border-b border-white/8"
      style={{ minHeight: 340 }}
    >
      {/* Arka plan */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${item.bg})` }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* İçerik */}
      <div className="relative z-10 flex flex-col justify-between h-full p-6 pt-8"
        style={{ minHeight: 340 }}>
        {/* Üst — numara + açıklama */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-8 h-8 rounded-full border border-white/30 flex items-center justify-center mt-0.5">
            <span className="text-[11px] text-white/70 font-medium">{index + 1}</span>
          </div>
          <p className="text-white/70 font-light leading-relaxed text-sm">
            {item.desc}
          </p>
        </div>

        {/* Alt — büyük kelime + ok */}
        <div className="flex items-end justify-between mt-8">
          <span
            className="text-white font-bold tracking-tight leading-none"
            style={{ fontSize: 'clamp(3.5rem,14vw,5.5rem)' }}
          >
            {item.word}
          </span>
          <ArrowRight size={32} strokeWidth={1.5} className="text-white/70 mb-2" />
        </div>
      </div>
    </div>
    </a>
  );
}
