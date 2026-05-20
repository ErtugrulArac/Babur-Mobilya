'use client';

import { useEffect, useRef, useState, ReactNode, TouchEvent, WheelEvent } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  mediaMobileSrc?: string;
  posterMobileSrc?: string;
  bgMobileImageSrc?: string;
  logoSrc?: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  mediaMobileSrc,
  posterMobileSrc,
  bgMobileImageSrc,
  logoSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress]         = useState<number>(0);
  const [showContent, setShowContent]               = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY]               = useState<number>(0);
  const [isMobileState, setIsMobileState]           = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Orijinal: mediaType değişince sıfırla
  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaType]);

  useEffect(() => {
    // Section'ın sayfadaki mutlak konumu
    const top = () => sectionRef.current?.offsetTop ?? 0;

    const handleWheel = (e: WheelEvent) => {
      const sectionTop = top();

      // Sadece section yakınındayken devreye gir
      if (!mediaFullyExpanded && Math.abs(window.scrollY - sectionTop) > 60 && scrollProgress <= 0) return;

      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= sectionTop + 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        // Progress 0'da yukarı scroll → serbest bırak
        if (e.deltaY < 0 && scrollProgress <= 0) return;

        e.preventDefault();
        const newProgress = Math.min(Math.max(scrollProgress + e.deltaY * 0.0015, 0), 1);
        setScrollProgress(newProgress);
        if (newProgress >= 1)        { setMediaFullyExpanded(true); setShowContent(true); }
        else if (newProgress < 0.75) { setShowContent(false); }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      const touchY  = e.touches[0].clientY;
      const deltaY  = touchStartY - touchY;
      const sectionTop = top();

      if (!mediaFullyExpanded && Math.abs(window.scrollY - sectionTop) > 60 && scrollProgress <= 0) return;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= sectionTop + 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        if (deltaY < 0 && scrollProgress <= 0) return;
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.004 : 0.003;
        const newProgress  = Math.min(Math.max(scrollProgress + deltaY * scrollFactor, 0), 1);
        setScrollProgress(newProgress);
        if (newProgress >= 1)        { setMediaFullyExpanded(true); setShowContent(true); }
        else if (newProgress < 0.75) { setShowContent(false); }
        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = () => setTouchStartY(0);

    // Orijinal handleScroll — sadece section'ın ALTINA kaçmayı engelle
    const handleScroll = () => {
      if (!mediaFullyExpanded) {
        const sectionTop = top();
        if (window.scrollY > sectionTop + 5) {
          window.scrollTo(0, sectionTop);
        }
      }
    };

    window.addEventListener('wheel',      handleWheel      as unknown as EventListener, { passive: false });
    window.addEventListener('scroll',     handleScroll     as EventListener);
    window.addEventListener('touchstart', handleTouchStart as unknown as EventListener, { passive: false });
    window.addEventListener('touchmove',  handleTouchMove  as unknown as EventListener, { passive: false });
    window.addEventListener('touchend',   handleTouchEnd   as EventListener);

    return () => {
      window.removeEventListener('wheel',      handleWheel      as unknown as EventListener);
      window.removeEventListener('scroll',     handleScroll     as EventListener);
      window.removeEventListener('touchstart', handleTouchStart as unknown as EventListener);
      window.removeEventListener('touchmove',  handleTouchMove  as unknown as EventListener);
      window.removeEventListener('touchend',   handleTouchEnd   as EventListener);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  useEffect(() => {
    const check = () => setIsMobileState(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const mediaWidth     = 300 + scrollProgress * (isMobileState ? 650  : 1250);
  const mediaHeight    = 400 + scrollProgress * (isMobileState ? 200  : 400);
  const textTranslateX = scrollProgress        * (isMobileState ? 180  : 150);
  const firstWord      = title ? title.split(' ')[0] : '';
  const restOfTitle    = title ? title.split(' ').slice(1).join(' ') : '';
  const activeSrc      = isMobileState && mediaMobileSrc   ? mediaMobileSrc   : mediaSrc;
  const activePoster   = isMobileState && posterMobileSrc  ? posterMobileSrc  : posterSrc;
  const activeBg       = isMobileState && bgMobileImageSrc ? bgMobileImageSrc : bgImageSrc;

  return (
    <div ref={sectionRef} className="transition-colors duration-700 ease-in-out overflow-x-hidden">
      <section className="relative flex flex-col items-center justify-start min-h-dvh">
        <div className="relative w-full flex flex-col items-center min-h-dvh">

          <motion.div className="absolute inset-0 z-0 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <Image src={activeBg} alt="Background" width={1920} height={1080}
              className="w-screen h-screen"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority
            />
            <div className="absolute inset-0 bg-black/10" />
          </motion.div>

          <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-dvh relative">

              <div className="absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-none rounded-2xl"
                style={{ width: `${mediaWidth}px`, height: `${mediaHeight}px`, maxWidth: '95vw', maxHeight: '85vh', boxShadow: '0px 0px 50px rgba(0,0,0,0.3)' }}
              >
                {mediaType === 'video' ? (
                  activeSrc.includes('youtube.com') ? (
                    <div className="relative w-full h-full pointer-events-none">
                      <iframe width="100%" height="100%"
                        src={activeSrc.includes('embed')
                          ? activeSrc + (activeSrc.includes('?') ? '&' : '?') + 'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                          : activeSrc.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=' + activeSrc.split('v=')[1]}
                        className="w-full h-full rounded-xl" style={{ border: 'none' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <motion.div className="absolute inset-0 bg-black/30 rounded-xl"
                        initial={{ opacity: 0.7 }} animate={{ opacity: 0.5 - scrollProgress * 0.3 }} transition={{ duration: 0.2 }} />
                    </div>
                  ) : (
                    <div className="relative w-full h-full pointer-events-none">
                      <video src={activeSrc} poster={activePoster} autoPlay muted loop playsInline preload="auto"
                        className="w-full h-full object-cover rounded-xl" controls={false} disablePictureInPicture disableRemotePlayback />
                      <motion.div className="absolute inset-0 bg-black/30 rounded-xl"
                        initial={{ opacity: 0.7 }} animate={{ opacity: 0.5 - scrollProgress * 0.3 }} transition={{ duration: 0.2 }} />
                    </div>
                  )
                ) : (
                  <div className="relative w-full h-full">
                    <Image src={activeSrc} alt={title || 'Media'} width={1280} height={720} className="w-full h-full object-cover rounded-xl" />
                    <motion.div className="absolute inset-0 bg-black/50 rounded-xl"
                      initial={{ opacity: 0.7 }} animate={{ opacity: 0.7 - scrollProgress * 0.3 }} transition={{ duration: 0.2 }} />
                  </div>
                )}

                <div className="flex flex-col items-center text-center relative z-10 mt-4 transition-none">
                  {date && (
                    <p className="text-sm font-medium text-white/50 tracking-widest uppercase"
                      style={{ fontFamily: 'var(--font-poppins)', transform: `translateX(-${textTranslateX}vw)`, letterSpacing: '0.3em' }}>
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p className="text-white/35 text-xs tracking-widest uppercase text-center mt-1"
                      style={{ fontFamily: 'var(--font-poppins)', transform: `translateX(${textTranslateX}vw)`, letterSpacing: '0.25em' }}>
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              <div className={`flex items-center justify-center text-center gap-2 w-full relative z-10 transition-none flex-col ${textBlend ? 'mix-blend-difference' : 'mix-blend-normal'}`}>
                {logoSrc ? (
                  <img src={logoSrc} alt="Logo" className="object-contain transition-none"
                    style={{ maxHeight: 'clamp(60px,12vw,140px)', maxWidth: '60vw', transform: `translateX(-${textTranslateX}vw)`, filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
                ) : (
                  <>
                    <h2 className="font-normal text-white transition-none"
                      style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,7vw,7rem)', lineHeight: 1, transform: `translateX(-${textTranslateX}vw)` }}>
                      {firstWord}
                    </h2>
                    <h2 className="font-normal italic text-white/70 transition-none text-center"
                      style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,7vw,7rem)', lineHeight: 1, transform: `translateX(${textTranslateX}vw)` }}>
                      {restOfTitle}
                    </h2>
                  </>
                )}
              </div>
            </div>

            <motion.section className="flex flex-col w-full px-8 py-10 md:px-16 lg:py-20"
              initial={{ opacity: 0 }} animate={{ opacity: showContent ? 1 : 0 }} transition={{ duration: 0.7 }}>
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
