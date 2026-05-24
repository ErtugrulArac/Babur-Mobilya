'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  altBefore?: string;
  altAfter?: string;
}

export const ImageComparison = ({ beforeImage, afterImage, altBefore = 'Before', altAfter = 'After' }: ImageComparisonProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let newPosition = ((clientX - rect.left) / rect.width) * 100;
    newPosition = Math.max(0, Math.min(100, newPosition));
    setSliderPosition(newPosition);
  }, []);

  const startDrag = () => {
    isDraggingRef.current = true;
    setIsDragging(true);
  };

  const stopDrag = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mouseup', stopDrag);
    return () => { window.removeEventListener('mouseup', stopDrag); };
  }, [stopDrag]);

  return (
    <div
      ref={containerRef}
      className="relative w-full mx-auto select-none rounded-xl overflow-hidden shadow-2xl aspect-video"
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseLeave={stopDrag}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={stopDrag}
    >
      {/* Before image — sets container height */}
      <img
        src={beforeImage}
        alt={altBefore}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* After image — absolute overlay, clipped from right */}
      <div
        className="absolute top-0 left-0 h-full w-full"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={afterImage}
          alt={altAfter}
          className="block w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-1.5 bg-white/80 cursor-ew-resize flex items-center justify-center"
        style={{ left: `calc(${sliderPosition}% - 0.1875rem)` }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
      >
        <div className={`bg-white rounded-full h-12 w-12 flex items-center justify-center shadow-md transition-all duration-200 ${isDragging ? 'scale-110 shadow-xl' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
            <path d="M5 12h14" />
            <path d="M5 12l3-3M5 12l3 3" />
            <path d="M19 12l-3-3M19 12l-3 3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ImageComparison;
