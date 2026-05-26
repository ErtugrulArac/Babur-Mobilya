'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

// ─── Veri ────────────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    index: '01',
    label: 'Koleksiyon',
    heading: ['El İşçiliği', '& Tasarım'],
    body: 'Her mobilya bir hikâye anlatır. Malzemeden üretime, her detay sizin için özenle seçildi. Yaşam alanlarınızı dönüştüren, kalıcı güzelliğe sahip parçalar.',
    bg: '/deneme1.webp',
    overlay: 'rgba(0,0,0,0.45)',
    whiteText: false,
    leftDetail: { top: 'Türk', bottom: 'El Sanatı' },
    leftItems: [
      { label: 'Stil',      value: 'Modern Klasik' },
      { label: 'Renk',      value: 'Doğal Tonlar' },
      { label: 'Form',      value: 'Organik Hatlar' },
      { label: 'Doku',      value: 'Matte Perdah' },
    ],
    rightItems: [
      { label: 'Malzeme',    value: 'Masif Ceviz · Meşe · Kayın' },
      { label: 'Yüzey',     value: 'El ile Perdah & Doğal Boya' },
      { label: 'Bağlantı',  value: 'Geleneksel Zıvana Tekniği' },
      { label: 'Koruma',    value: 'Su Bazlı Mat Vernik' },
    ],
  },
  {
    index: '02',
    label: 'Kalite',
    heading: ['Premium', 'Malzeme'],
    body: 'İtalyan deri, doğal taş ve birinci sınıf metalleri ustalıkla bir araya getiriyoruz. Her parça, göze değil dokuya da hitap eder.',
    bg: '/deneme2.webp',
    overlay: 'rgba(0,0,0,0.45)',
    whiteText: true,
    leftDetail: { top: 'İtalyan', bottom: 'Deri' },
    leftItems: [
      { label: 'Sertlik',   value: 'HR40 Yoğunluk' },
      { label: 'Kaplama',   value: 'Anilüy Napa' },
      { label: 'İskelet',   value: 'Gürgen Konstrük.' },
      { label: 'Test',      value: '80.000 Oturma' },
    ],
    rightItems: [
      { label: 'Döşeme',    value: 'Tam Anilüy İtalyan Deri' },
      { label: 'Kaplama',   value: 'Soğuk Preslenmiş Alüminyum' },
      { label: 'Menteşe',   value: 'Avusturya Gizli Ray Sistemi' },
      { label: 'Dolgu',     value: 'Yüksek Yoğunluklu HR Sünger' },
    ],
  },
  {
    index: '03',
    label: 'Vizyon',
    heading: ['Hayalinizi', 'Kuralım'],
    body: 'Konseptten teslimata kadar her aşamada yanınızdayız. Mekanınızı ölçüyoruz, 3D modelliyoruz, üretip kapınıza kuruyoruz.',
    bg: '/deneme3.webp',
    overlay: 'rgba(0,0,0,0.45)',
    whiteText: true,
    leftDetail: { top: 'Ücretsiz', bottom: 'Keşif' },
    leftItems: [
      { label: 'Süre',      value: '4–6 Hafta Üretim' },
      { label: 'Garanti',   value: '5 Yıl Tam Garanti' },
      { label: 'Teslimat',  value: 'Kapıya Montaj' },
      { label: 'Destek',   value: '7/24 Servis Hattı' },
    ],
    rightItems: [
      { label: 'Adım 01',   value: 'Ücretsiz Keşif & Ölçüm' },
      { label: 'Adım 02',   value: '3D Tasarım & Sunum' },
      { label: 'Adım 03',   value: 'Onaylı Üretim Süreci' },
      { label: 'Adım 04',   value: 'Kapıya Montaj & Garanti' },
    ],
  },
];

// ─── FlowSection ─────────────────────────────────────────────────────────────
interface SectionData {
  index: string;
  label: string;
  heading: string[];
  body: string;
  bg: string;
  overlay: string;
  whiteText: boolean;
  leftDetail: { top: string; bottom: string };
  leftItems: { label: string; value: string }[];
  rightItems: { label: string; value: string }[];
}

const FlowSection: React.FC<{ data: SectionData }> = ({ data }) => (
  <section
    data-flow-section
    aria-label={data.label}
    className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
    style={{
      backgroundImage: `url('/arkaplan${data.index === '01' ? '' : data.index === '02' ? '2' : '3'}.webp')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      willChange: 'transform',
      transform: 'translateZ(0)',
    }}
  >
    {/* ── SOL PANEL — desktop only ──────────────────────── */}
    <div data-flow-left className="hidden md:flex absolute left-0 top-0 bottom-0 flex-col justify-center gap-5 py-12 px-8 pointer-events-none select-none z-10">
      <div className="w-px h-8 self-center" style={{ background: data.whiteText ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }} />
      {data.leftItems.map((item, i) => (
        <div key={i} className="flex flex-col gap-0.5">
          <span className="font-black text-[7px] tracking-[0.5em] uppercase"
            style={{ color: data.whiteText ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.25)' }}>
            {item.label}
          </span>
          <span className="font-bold leading-snug"
            style={{ fontSize: 'clamp(0.6rem,0.85vw,0.75rem)', writingMode: 'vertical-rl', letterSpacing: '0.05em', color: data.whiteText ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.60)' }}>
            {item.value}
          </span>
          {i < data.leftItems.length - 1 && (
            <div className="w-full h-px mt-2" style={{ background: data.whiteText ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }} />
          )}
        </div>
      ))}
      <div className="w-px h-8 self-center" style={{ background: data.whiteText ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }} />
    </div>

    {/* ── SAĞ PANEL — desktop only ──────────────────────── */}
    <div data-flow-right className="hidden md:flex absolute right-0 top-0 bottom-0 flex-col justify-center gap-5 py-12 px-8 pointer-events-none select-none z-10">
      <div className="w-px h-8 self-center" style={{ background: data.whiteText ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }} />
      {data.rightItems.map((item, i) => (
        <div key={i} className="flex flex-col gap-0.5">
          <span className="font-black text-[7px] tracking-[0.5em] uppercase"
            style={{ color: data.whiteText ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.25)' }}>
            {item.label}
          </span>
          <span className="font-bold leading-snug"
            style={{ fontSize: 'clamp(0.6rem,0.85vw,0.75rem)', writingMode: 'vertical-rl', letterSpacing: '0.05em', color: data.whiteText ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.60)' }}>
            {item.value}
          </span>
          {i < data.rightItems.length - 1 && (
            <div className="w-full h-px mt-2" style={{ background: data.whiteText ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }} />
          )}
        </div>
      ))}
      <div className="w-px h-8 self-center" style={{ background: data.whiteText ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }} />
      <div className="flex flex-col items-center gap-2">
        {['01','02','03'].map((n) => (
          <div key={n} style={{
            width: n === data.index ? 12 : 3,
            height: 1,
            background: n === data.index
              ? (data.whiteText ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.55)')
              : (data.whiteText ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.18)'),
            borderRadius: 2,
            transition: 'width 0.3s',
          }} />
        ))}
      </div>
    </div>
    {/* Kart / mockup */}
    <div
      data-flow-inner
      className={cx(
        'flow-art-container',
        'relative flex flex-col justify-between gap-6 will-change-transform',
        'overflow-hidden',
      )}
      style={{
        transformOrigin: 'bottom left',
        width: 'clamp(300px, 92vw, 1260px)',
        height: 'clamp(360px, 75vh, 940px)',
        borderRadius: '4px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
      }}
    >
      {/* Arka plan görseli */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${data.bg})` }}
      />
      <div className="absolute inset-0" style={{ background: data.overlay }} />

      {/* Kenar çizgisi */}
      <div className="absolute inset-0 rounded-sm ring-1 ring-white/8 pointer-events-none" />

      {/* Logo — sağ üst köşe */}
      <img
        src="/logo/baburlogo.png"
        alt="Babur Mobilya"
        className="absolute top-4 right-4 md:top-6 md:right-6 z-10 pointer-events-none select-none"
        style={{ height: 'clamp(28px, 3vw, 44px)', width: 'auto', objectFit: 'contain' }}
      />

      {/* İçerik */}
      <div className="relative flex flex-col justify-between h-full p-6 md:p-12">
        {/* Üst */}
        <div />

        {/* Orta */}
        <div className="flex flex-col gap-4">
          <h2
            className="text-white font-bold leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.2rem,6vw,7rem)' }}
          >
            {data.heading.map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h2>
          <div className="h-px w-12 bg-white/20" />
          <p
            className="text-white/45 max-w-sm leading-relaxed"
            style={{ fontSize: 'clamp(0.8rem,1.2vw,1rem)' }}
          >
            {data.body}
          </p>
        </div>

        {/* Alt */}
        <div className="flex items-center justify-between">
          <span className="text-[9px] tracking-[0.5em] uppercase text-white/55">
            Babur Mobilya
          </span>
          <span className="text-[9px] tracking-[0.4em] uppercase text-white/40">
            Est. 1970
          </span>
        </div>
      </div>
    </div>
  </section>
);

// ─── FlowArt (wrapper) ───────────────────────────────────────────────────────
const FlowArt: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || reducedMotion) return;

      const sections = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>('[data-flow-section]'),
      );
      if (sections.length === 0) return;

      const triggers: ScrollTrigger[] = [];

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector<HTMLElement>('.flow-art-container');
        if (!inner) return;

        if (i > 0) {
          const leftPanel  = section.querySelector<HTMLElement>('[data-flow-left]');
          const rightPanel = section.querySelector<HTMLElement>('[data-flow-right]');

          // Kart — rotation + blur
          gsap.set(inner, { rotation: 30, filter: 'blur(12px)', transformOrigin: 'bottom left' });
          const tween = gsap.to(inner, {
            rotation: 0,
            filter: 'blur(0px)',
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top 25%',
              scrub: true,
            },
          });
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);

          // Sol/sağ paneller sadece desktop'ta animate edilir
          if (window.innerWidth >= 768) {

          // Sol panel — soldan + yukarıdan düşme
          if (leftPanel) {
            gsap.set(leftPanel, { x: -70, y: -50, opacity: 0 });
            const lt = gsap.to(leftPanel, {
              x: 0, y: 0, opacity: 1, ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                end: 'top 20%',
                scrub: true,
              },
            });
            if (lt.scrollTrigger) triggers.push(lt.scrollTrigger);
          }

          // Sağ panel — sağdan + yukarıdan düşme
          if (rightPanel) {
            gsap.set(rightPanel, { x: 70, y: -50, opacity: 0 });
            const rt = gsap.to(rightPanel, {
              x: 0, y: 0, opacity: 1, ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                end: 'top 20%',
                scrub: true,
              },
            });
            if (rt.scrollTrigger) triggers.push(rt.scrollTrigger);
          }
          } // end desktop-only panels

        }

        if (i < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: 'bottom bottom',
              end: 'bottom top',
              pin: true,
              pinSpacing: false,
            }),
          );
        }
      });

      ScrollTrigger.refresh();

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [reducedMotion] },
  );

  return (
    <main
      ref={containerRef}
      aria-label="Babur Mobilya Story"
      className="w-full overflow-x-hidden"
    >
      {SECTIONS.map((s) => (
        <FlowSection key={s.index} data={s} />
      ))}
    </main>
  );
};

export default FlowArt;
