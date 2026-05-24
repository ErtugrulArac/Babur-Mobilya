'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type ArcGalleryHeroProps = {
  images: string[];
  startAngle?: number;
  endAngle?: number;
  radiusLg?: number;
  radiusMd?: number;
  radiusSm?: number;
  cardSizeLg?: number;
  cardSizeMd?: number;
  cardSizeSm?: number;
  className?: string;
};

export const ArcGalleryHero: React.FC<ArcGalleryHeroProps> = ({
  images,
  startAngle = 20,
  endAngle = 160,
  radiusLg = 480,
  radiusMd = 360,
  radiusSm = 260,
  cardSizeLg = 120,
  cardSizeMd = 100,
  cardSizeSm = 80,
  className = '',
}) => {
  const [dimensions, setDimensions] = useState({ radius: radiusLg, cardSize: cardSizeLg });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDimensions({ radius: radiusSm, cardSize: cardSizeSm });
      } else if (width < 1024) {
        setDimensions({ radius: radiusMd, cardSize: cardSizeMd });
      } else {
        setDimensions({ radius: radiusLg, cardSize: cardSizeLg });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [radiusLg, radiusMd, radiusSm, cardSizeLg, cardSizeMd, cardSizeSm]);

  const count = Math.max(images.length, 2);
  const step = (endAngle - startAngle) / (count - 1);

  return (
    <section
      className={`relative overflow-hidden min-h-dvh flex flex-col ${className}`}
      style={{ background: '#0a0806' }}
    >
      {/* Arc container */}
      <div
        className="relative mx-auto"
        style={{ width: '100%', height: dimensions.radius * 1.2 }}
      >
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2">
          {images.map((src, i) => {
            const angle = startAngle + step * i;
            const angleRad = (angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * dimensions.radius;
            const y = Math.sin(angleRad) * dimensions.radius;
            return (
              <div
                key={i}
                className="absolute opacity-0 arc-fade-in"
                style={{
                  width: dimensions.cardSize,
                  height: dimensions.cardSize,
                  left: `calc(50% + ${x}px)`,
                  bottom: `${y}px`,
                  transform: 'translate(-50%, 50%)',
                  animationDelay: `${i * 100}ms`,
                  animationFillMode: 'forwards',
                  zIndex: count - i,
                }}
              >
                <div
                  className="rounded-2xl overflow-hidden w-full h-full"
                  style={{
                    transform: `rotate(${angle / 4}deg)`,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    className="block w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Text content */}
      <div
        className="relative z-10 flex-1 flex items-center justify-center px-6 opacity-0 arc-fade-in-text"
        style={{
          marginTop: '-10rem',
          animationDelay: '700ms',
          animationFillMode: 'forwards',
        }}
      >
        <div className="text-center" style={{ maxWidth: 640 }}>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-general)',
              fontSize: '0.62rem',
              fontWeight: 500,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: '1.5rem',
            }}
          >
            Est. 1970 · Babur Mobilya
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 7vw, 6.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
              color: '#ffffff',
              marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
            }}
          >
            Hizmetlerimiz
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-general)',
              fontSize: '0.85rem',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.75,
              marginBottom: '2.5rem',
            }}
          >
            Mutfaktan çalışma odasına, her mekan için özel tasarım.
          </p>
          <Link
            href="/iletisim"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontFamily: 'var(--font-general)',
              fontSize: '0.68rem',
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#0a0806',
              background: '#d7d5d1',
              padding: '13px 28px',
              borderRadius: 2,
              textDecoration: 'none',
            }}
          >
            Bizimle Çalışın
            <svg width="13" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M1 5h12M8 1l5 4-5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes arc-fade-in-up {
          from { opacity: 0; transform: translate(-50%, 60%); }
          to   { opacity: 1; transform: translate(-50%, 50%); }
        }
        @keyframes arc-fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .arc-fade-in {
          animation: arc-fade-in-up 0.8s ease-out;
        }
        .arc-fade-in-text {
          animation: arc-fade-in 0.8s ease-out;
        }
      `}</style>
    </section>
  );
};

export default ArcGalleryHero;
