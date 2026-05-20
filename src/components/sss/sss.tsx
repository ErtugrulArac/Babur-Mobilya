'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowDownRight, ArrowRight } from 'lucide-react';

const FAQS = [
  {
    q: 'Özel ölçü mobilya tasarlanabiliyor mu?',
    a: 'Evet. Tüm mobilyalarımız mekanınıza özgü ölçüde üretilir. Standart katalog ürünü satmıyor; her proje için ölçüm, tasarım ve üretim süreci ayrıca işlenir.',
  },
  {
    q: 'Tasarımdan teslimata ne kadar süre geçer?',
    a: 'Proje büyüklüğüne göre değişmekle birlikte ortalama süreç 4-8 haftadır. Tasarım onayından sonra üretim başlar; teslimat ve montaj planlaması size önceden bildirilir.',
  },
  {
    q: 'Hangi malzemeleri kullanıyorsunuz?',
    a: 'Masif ceviz, meşe ve kayın başta olmak üzere Avrupa menşeli ahşap malzemeler kullanıyoruz. Döşemede İtalyan anilüy deri, kaplama ve aksesuarlarda Avusturya ve Alman menşeli ürünler tercih edilir.',
  },
  {
    q: 'Teslimat ve montaj hizmeti veriyor musunuz?',
    a: 'Evet. Mobilyalarınız fabrikadan çıktığı günkü korumayla taşınır ve profesyonel montaj ekibimiz tarafından yerine kurulur. Montaj sonrası kontrol ve son ayarlamalar da dahildir.',
  },
  {
    q: 'Garanti kapsamı nedir?',
    a: 'Tüm ürünlerimiz 5 yıl malzeme ve işçilik garantisi kapsamındadır. Garanti süresi boyunca oluşan üretim kaynaklı sorunlarda ücretsiz müdahale sağlanır.',
  },
  {
    q: 'Yalnızca İstanbul\'a mı hizmet veriyorsunuz?',
    a: 'Hayır. İstanbul başta olmak üzere tüm Türkiye\'ye teslimat ve montaj hizmeti sunuyoruz. Yurt dışı projeler için de talep alıyor ve fiyatlandırma yapıyoruz.',
  },
  {
    q: 'Showroom\'unuzu ziyaret edebilir miyim?',
    a: 'Evet. Randevu ile showroom\'umuzu ziyaret edebilir, malzeme ve renk örneklerini bizzat inceleyebilirsiniz. İletişim formu üzerinden randevu talep edebilirsiniz.',
  },
];

// Köşe işareti
function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const base = 'absolute w-3 h-3 border-black/25';
  const map = {
    tl: 'top-0 left-0 border-t border-l',
    tr: 'top-0 right-0 border-t border-r',
    bl: 'bottom-0 left-0 border-b border-l',
    br: 'bottom-0 right-0 border-b border-r',
  };
  return <span className={`${base} ${map[pos]}`} />;
}

export default function SSS() {
  const [open, setOpen] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? FAQS : FAQS.slice(0, 3);

  return (
    <section
      className="w-full"
      data-light-nav
      style={{ background: '#f0ece6', fontFamily: "var(--font-poppins)" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="relative border border-black/10">
          <Corner pos="tl" /><Corner pos="tr" />
          <Corner pos="bl" /><Corner pos="br" />

          <div className="flex flex-col md:flex-row">

            {/* SOL */}
            <div
              className="md:w-5/12 p-8 md:p-12 flex flex-col justify-between gap-8 border-b md:border-b-0 md:border-r border-black/10"
              style={{ background: 'linear-gradient(160deg, #e8d5c8 0%, #f0ece6 60%)' }}
            >
              <h2
                className="leading-tight"
                style={{ fontSize: 'clamp(1.5rem,3vw,2.4rem)', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}
              >
                Mobilya projenize dair aklınızdaki soruların cevapları
              </h2>

              {/* Desktop buton */}
              <button
                className="hidden md:inline-flex items-center gap-2.5 px-5 py-3 w-fit text-xs font-semibold tracking-widest uppercase text-white cursor-pointer"
                style={{ background: '#111', letterSpacing: '0.12em' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                Ücretsiz Keşif Randevusu
              </button>
            </div>

            {/* SAĞ */}
            <div className="md:w-7/12 flex flex-col">

              {/* Desktop: tüm sorular */}
              <div className="hidden md:block">
                {FAQS.map((faq, i) => (
                  <FaqRow
                    key={i}
                    faq={faq}
                    isOpen={open === i}
                    onToggle={() => setOpen(open === i ? null : i)}
                    last={i === FAQS.length - 1}
                  />
                ))}
              </div>

              {/* Mobile: kısaltılmış + load more */}
              <div className="md:hidden">
                {visible.map((faq, i) => (
                  <FaqRow
                    key={i}
                    faq={faq}
                    isOpen={open === i}
                    onToggle={() => setOpen(open === i ? null : i)}
                    last={i === visible.length - 1}
                  />
                ))}
                {!showAll && (
                  <div className="flex items-center justify-center gap-2 py-6 border-t border-black/10">
                    <button
                      onClick={() => setShowAll(true)}
                      className="flex items-center gap-2 text-xs font-medium text-black/60 tracking-widest uppercase cursor-pointer"
                      style={{ letterSpacing: '0.12em' }}
                    >
                      Devamını Gör
                      <span className="w-6 h-6 border border-black/20 flex items-center justify-center text-black/50">+</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Mobile sticky buton */}
        <div className="md:hidden mt-4">
          <button
            className="w-full flex items-center justify-center gap-2.5 py-4 text-xs font-semibold tracking-widest uppercase text-white cursor-pointer"
            style={{ background: '#111', letterSpacing: '0.12em' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
            Ücretsiz Keşif Randevusu
            <ArrowRight size={13} strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}

function FaqRow({
  faq, isOpen, onToggle, last,
}: {
  faq: typeof FAQS[0];
  isOpen: boolean;
  onToggle: () => void;
  last: boolean;
}) {
  return (
    <div className={`${!last ? 'border-b border-black/10' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-3 px-6 md:px-8 py-5 text-left cursor-pointer group"
      >
        {/* Ok ikonu */}
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 mt-0.5"
        >
          <ArrowDownRight size={16} strokeWidth={2} className="text-orange-500" />
        </motion.span>

        {/* Soru */}
        <span
          className="flex-1 font-medium text-black/80 group-hover:text-black transition-colors duration-200"
          style={{ fontSize: 'clamp(0.82rem,1.1vw,0.95rem)', lineHeight: 1.5 }}
        >
          {faq.q}
        </span>

        {/* Chevron butonu */}
        <motion.span
          animate={{ backgroundColor: isOpen ? '#111' : '#1a1a1a' }}
          className="shrink-0 w-7 h-7 flex items-center justify-center ml-2 mt-0.5"
          style={{ background: '#111' }}
        >
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={13} strokeWidth={2.5} className="text-white" />
          </motion.span>
        </motion.span>
      </button>

      {/* Cevap */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p
              className="px-6 md:px-8 pb-5 pl-14 md:pl-16 text-black/50 font-light leading-relaxed"
              style={{ fontSize: 'clamp(0.8rem,1vw,0.88rem)' }}
            >
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
