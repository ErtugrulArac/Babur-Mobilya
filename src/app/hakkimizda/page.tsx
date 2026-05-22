"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STYLES = `
  .gsap-reveal { visibility: hidden; }

  .film-grain {
    position: absolute; inset: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 50; opacity: 0.04; mix-blend-mode: overlay;
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>');
  }

  .bg-grid-warm {
    background-size: 60px 60px;
    background-image:
      linear-gradient(to right, rgba(26,23,18,0.06) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(26,23,18,0.06) 1px, transparent 1px);
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  .text-3d-warm {
    color: #1a1712;
    text-shadow:
      0 10px 30px rgba(26,23,18,0.12),
      0 2px 4px rgba(26,23,18,0.08);
  }

  .text-silver-warm {
    background: linear-gradient(180deg, #1a1712 0%, rgba(26,23,18,0.45) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transform: translateZ(0);
    filter:
      drop-shadow(0px 8px 20px rgba(26,23,18,0.12))
      drop-shadow(0px 2px 4px rgba(26,23,18,0.08));
  }

  .text-card-cream {
    background: linear-gradient(180deg, #f5f0ea 0%, #c9a87a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transform: translateZ(0);
    filter:
      drop-shadow(0px 10px 22px rgba(0,0,0,0.7))
      drop-shadow(0px 3px 6px rgba(0,0,0,0.5));
  }

  .premium-card {
    background: linear-gradient(145deg, #1a1410 0%, #0d0b08 100%);
    box-shadow:
      0 40px 100px -20px rgba(0,0,0,0.9),
      0 20px 40px -20px rgba(0,0,0,0.8),
      inset 0 1px 2px rgba(201,168,122,0.15),
      inset 0 -2px 4px rgba(0,0,0,0.8);
    border: 1px solid rgba(201,168,122,0.08);
  }

  .card-sheen {
    position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
    background: radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(201,168,122,0.07) 0%, transparent 40%);
    mix-blend-mode: screen; transition: opacity 0.3s ease;
  }


  .floating-chip {
    background: linear-gradient(135deg, rgba(245,240,234,0.07) 0%, rgba(245,240,234,0.02) 100%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow:
      0 0 0 1px rgba(201,168,122,0.15),
      0 20px 40px -10px rgba(0,0,0,0.7),
      inset 0 1px 1px rgba(245,240,234,0.1);
  }

  .progress-ring {
    transform: rotate(-90deg); transform-origin: center;
    stroke-dasharray: 502; stroke-dashoffset: 502;
    stroke-linecap: round;
  }

  .btn-cream {
    background: linear-gradient(180deg, #f5f0ea 0%, #e8e0d5 100%);
    color: #1a1712;
    box-shadow:
      0 0 0 1px rgba(26,23,18,0.08),
      0 2px 4px rgba(26,23,18,0.1),
      0 12px 24px -4px rgba(0,0,0,0.2),
      inset 0 1px 1px rgba(255,255,255,0.9);
    transition: all 0.35s cubic-bezier(0.25,1,0.5,1);
    font-family: var(--font-poppins);
  }
  .btn-cream:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 0 1px rgba(26,23,18,0.08), 0 8px 16px -4px rgba(0,0,0,0.15), 0 20px 32px -6px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.9);
  }
  .btn-cream:active { transform: translateY(1px); }
`;

export default function Hakkimizda() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef  = useRef<HTMLDivElement>(null);
  const artRef       = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);

  /* mouse lighting + 3D tilt */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!mainCardRef.current || !artRef.current) return;
        const rect = mainCardRef.current.getBoundingClientRect();
        mainCardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        mainCardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        const xv = (e.clientX / window.innerWidth  - 0.5) * 2;
        const yv = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(artRef.current, { rotationY: xv * 10, rotationX: -yv * 10, ease: "power3.out", duration: 1.2 });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafRef.current); };
  }, []);

  /* navbar renk sinyali — siyah kart açıkken beyaz navbar */
  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const total = containerRef.current.offsetHeight - window.innerHeight;
      const p = Math.min(Math.max(-containerRef.current.getBoundingClientRect().top / total, 0), 1);
      // ~%15'ten sonra siyah kart ekrana gelmiş — navbar beyaz olsun
      const isDark = p > 0.12 && p < 0.96;
      if (document.body.dataset.navbarDark !== (isDark ? "1" : "0")) {
        document.body.dataset.navbarDark = isDark ? "1" : "0";
        window.dispatchEvent(new CustomEvent("navbar-check"));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      delete document.body.dataset.navbarDark;
    };
  }, []);

  /* scroll timeline */
  useEffect(() => {
    const mobile = window.innerWidth < 768;
    const ctx = gsap.context(() => {
      gsap.set(".text-track",    { autoAlpha: 0, y: 60, scale: 0.88, filter: "blur(18px)", rotationX: -18 });
      gsap.set(".text-sub",      { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".main-card",     { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set([".card-left-text", ".card-right-text", ".art-scroll-wrap", ".floating-chip"], { autoAlpha: 0 });
      gsap.set(".cta-wrapper",   { autoAlpha: 0, scale: 0.82, filter: "blur(28px)" });

      /* intro */
      gsap.timeline({ delay: 0.3 })
        .to(".text-track", { duration: 1.8, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out" })
        .to(".text-sub",   { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=1.0");

      /* scroll */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top", end: "+=4000",
          pin: true, scrub: 1, anticipatePin: 1,
        },
      });

      tl
        .to([".hero-text-wrapper", ".bg-grid-warm"], { scale: 1.12, filter: "blur(18px)", opacity: 0.15, ease: "power2.inOut", duration: 2 }, 0)
        .to(".main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        .to(".main-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.5 })
        .fromTo(".art-scroll-wrap",
          { y: 280, z: -500, rotationX: 45, rotationY: -25, autoAlpha: 0, scale: 0.6 },
          { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2.5 }, "-=0.8"
        )
        .to(".progress-ring",    { strokeDashoffset: 80, duration: 2.5, ease: "power3.inOut" }, "-=1.5")
        .fromTo(".art-stat",     { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, stagger: 0.15, ease: "power3.out", duration: 1 }, "-=2.0")
        .fromTo(".card-left-text",  { x: -50, autoAlpha: 0 },          { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 }, "-=1.2")
        .fromTo(".card-right-text", { x:  50, autoAlpha: 0, scale: 0.82 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 }, "<")
        .to({}, { duration: 0.8 })
        .set(".hero-text-wrapper", { autoAlpha: 0 })
        .set(".cta-wrapper", { autoAlpha: 1 })
        .to({}, { duration: 0.5 })
        .to([".art-scroll-wrap", ".card-left-text", ".card-right-text"],
          { scale: 0.88, y: -40, z: -200, autoAlpha: 0, ease: "power3.in", duration: 1.2, stagger: 0.05 })
        .to(".main-card", {
          width: mobile ? "92vw" : "85vw",
          height: mobile ? "92vh" : "85vh",
          borderRadius: mobile ? "28px" : "36px",
          ease: "expo.inOut", duration: 1.8,
        }, "pull")
        .to(".cta-wrapper", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.8 }, "pull")
        .to(".main-card", { y: -window.innerHeight - 300, ease: "power3.in", duration: 1.5 });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div data-light-nav style={{ background: "#f5f0ea" }}>
      {/* Navbar ayrı stacking context'te — GSAP pin'i tarafından bloklanmaz */}
      <div style={{ position: "relative", zIndex: 9999 }}>
        <Navbar />
      </div>

      <div
        ref={containerRef}
        className="relative w-screen h-screen overflow-hidden flex items-center justify-center"
        style={{ perspective: "1500px", background: "#f5f0ea", color: "#1a1712", fontFamily: "var(--font-poppins)" }}
      >
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="film-grain" aria-hidden />
        <div className="bg-grid-warm absolute inset-0 z-0 pointer-events-none opacity-60" aria-hidden />

        {/* ── HERO METİN ──────────────────────────────── */}
        <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-start text-center w-screen px-6 pt-24 md:pt-28 overflow-hidden" style={{ maxHeight: "100vh" }}>
          <h1 className="text-track gsap-reveal text-3d-warm font-bold tracking-tight mb-1"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.8rem,7vw,6rem)" }}>
            Hakkımızda
          </h1>
          <h1 className="text-sub gsap-reveal text-silver-warm font-normal tracking-tight mb-8"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(2.4rem,6vw,5rem)" }}>
            1970'dan bu yana.
          </h1>

          <div className="max-w-xl mx-auto flex flex-col gap-5 mt-2" style={{ fontFamily: "var(--font-poppins)" }}>
            <p className="font-light leading-[1.85]"
              style={{ color: "rgba(26,23,18,0.58)", fontSize: "clamp(0.82rem,1.1vw,0.96rem)" }}>
              Babur Mobilya, 1970 yılında Gebze'de — o zamanlar henüz sanayi kokusundan arınmamış,
              ama hayale alan tanıyan küçük bir Anadolu kasabasında — bir ustanın atölyesinde doğdu.
              Ne büyük bir sermaye vardı başlangıçta ne de geniş bir depo; yalnızca ağacın lifini
              tanıyan eller, formun ruhunu hisseden bir göz ve "bu işi farklı yapmalıyız" diyen
              inatçı bir ses.
            </p>
            <p className="font-light leading-[1.85]"
              style={{ color: "rgba(26,23,18,0.4)", fontSize: "clamp(0.8rem,1vw,0.92rem)" }}>
              O ilk çivi çakılışından bu yana elli yılı aşkın bir süre geçti. Gebze'nin tozu,
              İstanbul'un koşuşturması, değişen zevkler, gelip geçen modalar — hiçbiri o ilk kararı
              değiştirmedi: standart üretmeyecektik. Her mobilya, sahibinin hayatından bir şey
              taşımalıydı. Bugün hâlâ aynı inançla, aynı özenle üretiyoruz.
            </p>
          </div>
        </div>

        {/* ── CTA (SON SAHNE) ─────────────────────────── */}
        <div className="cta-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-6 pointer-events-auto">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold mb-6 tracking-tight text-silver-warm"
            style={{ fontFamily: "var(--font-general)" }}>
            Bir çaya ne dersiniz?
          </h2>
          <p className="text-base md:text-xl mb-10 max-w-xl mx-auto font-light leading-relaxed"
            style={{ color: "rgba(26,23,18,0.55)", fontFamily: "var(--font-general)" }}>
            Mekanınızı, hayalinizi ve beklentilerinizi birlikte konuşalım.
            Ücretsiz keşif ve tasarım danışmanlığı sunuyoruz.
          </p>
          <a href="/iletisim"
            className="btn-cream inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-semibold"
            style={{ fontFamily: "var(--font-general)" }}>
            Randevu Al
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* ── ANA KART ────────────────────────────────── */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          style={{ perspective: "1500px" }}>
          <div
            ref={mainCardRef}
            className="main-card premium-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[28px] md:rounded-[36px]"
          >
            <div className="card-sheen" aria-hidden />

            <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-12 flex flex-col justify-evenly lg:grid lg:grid-cols-3 items-center z-10 py-3 lg:py-0 gap-2 lg:gap-16"
              style={{ fontFamily: "var(--font-general)" }}>

              {/* SAĞ — Misyon */}
              <div className="card-right-text gsap-reveal order-1 lg:order-3 flex flex-col justify-center text-center lg:text-right z-20 w-full">
                <p className="text-[10px] tracking-[0.5em] uppercase mb-3"
                  style={{ color: "rgba(201,168,122,0.5)", fontFamily: "var(--font-poppins)" }}>
                  Misyonumuz
                </p>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight mb-4 text-card-cream"
                  style={{ fontFamily: "var(--font-general)" }}>
                  Yalnızca Sizin İçin.
                </h2>
                <p className="text-sm font-light leading-relaxed"
                  style={{ color: "rgba(245,240,234,0.45)", fontFamily: "var(--font-poppins)" }}>
                  Standart katalog yoktur. Her proje mekanın ruhu okunarak sıfırdan düşünülür 
                  dinle, anla, üret. Bu sıra 1970'den bu yana hiç değişmedi.
                </p>
              </div>

              {/* MERKEZ — Art Gallery tarih görseli */}
              <div className="art-scroll-wrap order-2 relative w-full h-24 lg:h-130 flex flex-col items-center justify-center z-10 gap-0"
                style={{ perspective: "1000px" }}>
                <div ref={artRef} className="flex flex-col items-center w-full" style={{ transformStyle: "preserve-3d" }}>

                  {/* Büyük yıl — outline tipografi */}
                  <div className="relative select-none leading-none text-center"
                    style={{
                      fontSize: "clamp(5rem,18vw,14rem)",
                      fontFamily: "var(--font-general)",
                      fontWeight: 700,
                      letterSpacing: "-0.04em",
                      WebkitTextStroke: "1px rgba(201,168,122,0.55)",
                      color: "transparent",
                      lineHeight: 0.85,
                    }}>
                    1970
                  </div>

                  {/* Yatay kural */}
                  <div className="w-full my-5" style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(201,168,122,0.4), transparent)" }} />

                  {/* Ek bilgi satırı */}
                  <div className="flex items-center justify-center gap-6">
                    {["K U R U L U Ş", "·", "K O C A E L İ"].map((w, i) => (
                      <span key={i} className="text-[9px] md:text-[10px]"
                        style={{ color: i === 1 ? "rgba(201,168,122,0.4)" : "rgba(245,240,234,0.35)", letterSpacing: "0.1em", fontFamily: "var(--font-poppins)", fontWeight: 500 }}>
                        {w}
                      </span>
                    ))}
                  </div>

                </div>
              </div>

              {/* SOL — Vizyon */}
              <div className="card-left-text gsap-reveal order-3 lg:order-1 flex flex-col justify-center text-center lg:text-left z-20 w-full px-4 lg:px-0">
                <p className="text-[10px] tracking-[0.5em] uppercase mb-3"
                  style={{ color: "rgba(201,168,122,0.5)", fontFamily: "var(--font-poppins)" }}>
                  Vizyonumuz
                </p>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight mb-4 text-card-cream"
                  style={{ fontFamily: "var(--font-general)" }}>
                  Kalıcı Güzellik.
                </h3>
                <p className="text-sm font-light leading-relaxed"
                  style={{ color: "rgba(245,240,234,0.45)", fontFamily: "var(--font-poppins)" }}>
                  Türk el işçiliğini çağdaş tasarımla buluşturmak. Nesilden nesile geçen,
                  zamanın testinden çıkan mobilyalar üretmek bu bizim pusulamız.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
