"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    tempId: 0,
    testimonial: "Ofisimizin tüm mobilyalarını Babur Mobilya ile yenilettik. Tasarım sürecinden teslimata kadar her aşama son derece profesyoneldi.",
    by: "Mehmet Yılmaz, Kurucu Ortak, Yılmaz Hukuk",
    imgSrc: "https://i.pravatar.cc/150?img=1"
  },
  {
    tempId: 1,
    testimonial: "Müşterilerim için birçok proje referansı verdim. Her seferinde kalite ve işçilik konusunda hayal kırıklığı yaşatmadılar. Masif ahşap işçiliği gerçekten üst düzey.",
    by: "Elif Kara, İç Mimar",
    imgSrc: "https://i.pravatar.cc/150?img=5"
  },
  {
    tempId: 2,
    testimonial: "Açık ofis alanımız için 40'tan fazla çalışma birimi sipariş ettik. Montaj ekibi son derece düzenli çalıştı, teslim tarihi tam tutturuldu.",
    by: "Serkan Doğan, Genel Müdür, TechPark AŞ",
    imgSrc: "https://i.pravatar.cc/150?img=3"
  },
  {
    tempId: 3,
    testimonial: "Yatak odamız için özel gardrop ve çekmece ünitesi yaptırdık. Ölçüler mükemmel, malzeme kalitesi beklentinin çok üzerinde.",
    by: "Ayşe Tunç, Ev Sahibi",
    imgSrc: "https://i.pravatar.cc/150?img=9"
  },
  {
    tempId: 4,
    testimonial: "Projenin en kritik anında üretim takvimine sadık kaldılar. Hem estetik hem teknik detaylara gösterdikleri özen beni etkiledi.",
    by: "Burak Şahin, Mimar",
    imgSrc: "https://i.pravatar.cc/150?img=7"
  },
  {
    tempId: 5,
    testimonial: "Mutfak dolabımızı yaptırdık. Renk seçiminden iç düzenlemeye kadar her konuda destek aldık. Sonuç harika oldu.",
    by: "Selin Arslan, Ev Sahibi",
    imgSrc: "https://i.pravatar.cc/150?img=10"
  },
  {
    tempId: 6,
    testimonial: "Kurumsal kimliğimizi yansıtan bir ofis mobilyası istiyorduk. Babur Mobilya tam olarak bunu başardı. Misafirlerimiz her zaman hayran kalıyor.",
    by: "Can Öztürk, CEO, Öztürk Mimarlık",
    imgSrc: "https://i.pravatar.cc/150?img=12"
  },
  {
    tempId: 7,
    testimonial: "Tüm evi mobilya açısından yenilettik. Oturma odası, yatak odası ve çalışma köşesi için özel üretim yaptırdık. Her biri beklentinin üzerinde çıktı.",
    by: "Zeynep Koç, Ev Sahibi",
    imgSrc: "https://i.pravatar.cc/150?img=15"
  },
  {
    tempId: 8,
    testimonial: "Resepsiyon alanımız için modern bir kabul masası tasarlandı. Hem işlevsel hem de şık bir sonuç çıktı. Ziyaretçilerimiz ilk gördüklerinde beğenilerini dile getiriyor.",
    by: "Hakan Demir, Ofis Yöneticisi",
    imgSrc: "https://i.pravatar.cc/150?img=17"
  },
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof testimonials[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-6 md:p-8 transition-all duration-500 ease-in-out",
        isCenter
          ? "z-10 border-transparent"
          : "z-0 border-gray-200 hover:border-gray-400"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        fontFamily: "var(--font-poppins)",
        background: isCenter ? "#111" : "#ffffff",
        backdropFilter: "none",
        clipPath: `polygon(40px 0%, calc(100% - 40px) 0%, 100% 40px, 100% 100%, calc(100% - 40px) 100%, 40px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter
          ? "0px 8px 0px 4px rgba(0,0,0,0.15)"
          : "0px 0px 0px 0px transparent",
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45"
        style={{
          right: -2,
          top: 38,
          width: SQRT_5000,
          height: 1,
          background: isCenter ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
        }}
      />

      <img
        src={testimonial.imgSrc}
        alt={testimonial.by.split(',')[0]}
        className="mb-4 h-12 w-10 object-cover object-top"
        style={{ boxShadow: "3px 3px 0px rgba(0,0,0,0.3)" }}
      />

      <h3 className={cn(
        "text-sm md:text-base font-light leading-relaxed",
        isCenter ? "text-white/85" : "text-gray-700"
      )}>
        "{testimonial.testimonial}"
      </h3>

      <p className="absolute bottom-6 left-6 right-6 text-xs italic text-orange-500">
        — {testimonial.by}
      </p>
    </div>
  );
};

export default function Yorumlar() {
  const [cardSize, setCardSize] = useState(340);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const touchStartX = React.useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      handleMove(diff > 0 ? 1 : -1);
    }
  };

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push(item);
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift(item);
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 340 : 270);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <section
      className="w-full overflow-hidden relative"
      style={{
        background: "linear-gradient(160deg, #f5f0ea 0%, #f0ece6 50%, #e8e2da 100%)",
      }}
    >
      {/* data-light-nav */}

      {/* Üst başlık */}
      <div className="relative pt-14 md:pt-20 pb-6 text-center px-6" data-light-nav>
        <span
          className="text-[10px] tracking-[0.5em] uppercase text-black/30 block mb-4"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Müşteri Yorumları
        </span>
        <h2
          className="text-gray-900 leading-tight mb-5"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem,4.5vw,3.8rem)",
            fontWeight: 400,
          }}
        >
          Onların Sözleriyle
        </h2>
        <p
          className="text-black/45 font-light leading-relaxed mx-auto"
          style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "clamp(0.82rem,1.1vw,0.95rem)",
            maxWidth: 480,
          }}
        >
          Her mobilya bir ilişkinin ürünüdür. Dinledik, anladık, ürettik 
          ve arkamızda bıraktığımız en değerli şey, müşterilerimizin
          gülümsemesi oldu.
        </p>
      </div>

      {/* Kartlar */}
      <div
        className="relative"
        style={{ height: 560 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {testimonialsList.map((testimonial, index) => {
          const position = testimonialsList.length % 2
            ? index - (testimonialsList.length + 1) / 2
            : index - testimonialsList.length / 2;
          return (
            <TestimonialCard
              key={testimonial.tempId}
              testimonial={testimonial}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
            />
          );
        })}

        {/* Kontrol butonları */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
          <button
            onClick={() => handleMove(-1)}
            className="flex h-11 w-11 items-center justify-center transition-all duration-300 text-orange-500 hover:text-orange-600 border border-orange-200 hover:border-orange-400 bg-white"
            aria-label="Önceki"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => handleMove(1)}
            className="flex h-11 w-11 items-center justify-center transition-all duration-300 text-orange-500 hover:text-orange-600 border border-orange-200 hover:border-orange-400 bg-white"
            aria-label="Sonraki"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="relative pb-12" />
    </section>
  );
}
