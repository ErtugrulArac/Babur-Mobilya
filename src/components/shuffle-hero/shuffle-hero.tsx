"use client"

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { StarButton } from "@/components/ui/star-button";

export const ShuffleHero = () => {
  return (
    <section className="w-full px-8 pt-32 md:pt-48 pb-12 grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-6xl mx-auto">
      <div>
        <span className="block mb-4 text-sm md:text-base font-medium" style={{ color: "#0a0806" }}>
          Est. 2010 · Babür Mobilya
        </span>
        <h3 className="text-5xl md:text-7xl font-semibold" style={{ color: "#0a0806" }}>
          Hizmetlerimiz
        </h3>
        <p className="text-lg md:text-xl my-4 md:my-6" style={{ color: "#0a0806" }}>
          Mutfaktan çalışma odasına, her mekan için özel tasarım. 2010'dan bu yana aynı özen, her projede.
        </p>
        <StarButton className="h-12 px-6 text-base">
          Bizimle Çalışın
        </StarButton>
      </div>
      <ShuffleGrid />
    </section>
  );
};

const shuffle = (array: (typeof squareData)[0][]) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const squareData = [
  { id: 1,  src: "/hizmetlermain/hizmet1.webp"  },
  { id: 2,  src: "/hizmetlermain/hizmet2.webp"  },
  { id: 3,  src: "/hizmetlermain/hizmet3.webp"  },
  { id: 4,  src: "/hizmetlermain/hizmet4.webp"  },
  { id: 5,  src: "/hizmetlermain/hizmet5.webp"  },
  { id: 6,  src: "/hizmetlermain/hizmet6.webp"  },
  { id: 7,  src: "/hizmetlermain/hizmet7.webp"  },
  { id: 8,  src: "/hizmetlermain/hizmet8.webp"  },
  { id: 9,  src: "/hizmetlermain/hizmet9.webp"  },
  { id: 10, src: "/hizmetlermain/hizmet10.webp" },
  { id: 11, src: "/hizmetlermain/hizmet11.webp" },
  { id: 12, src: "/hizmetlermain/hizmet12.webp" },
  { id: 13, src: "/hizmetlermain/hizmet13.webp" },
  { id: 14, src: "/hizmetlermain/hizmet14.webp" },
  { id: 15, src: "/hizmetlermain/hizmet15.webp" },
  { id: 16, src: "/hizmetlermain/hizmet16.webp" },
];

const generateSquares = () => {
  return shuffle(squareData).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full rounded-md overflow-hidden bg-muted"
      style={{
        backgroundImage: `url(${sq.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></motion.div>
  ));
};

const ShuffleGrid = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [squares, setSquares] = useState(generateSquares());

  useEffect(() => {
    shuffleSquares();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const shuffleSquares = () => {
    setSquares(generateSquares());

    timeoutRef.current = setTimeout(shuffleSquares, 3000);
  };

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1">
      {squares.map((sq) => sq)}
    </div>
  );
};

export default ShuffleHero;
