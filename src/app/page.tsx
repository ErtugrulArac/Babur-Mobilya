import Navbar from "@/components/navbar/navbar";
import ScrolVideo from "@/components/main/scrolvideo";
import Ofis from "@/components/ofis/ofis";
import ScrollExpandMedia from "@/components/scrolvideo/scrolbased";

function ChapterBreak({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-black flex items-center justify-center py-14 select-none">
      <div className="flex items-center gap-5">
        <div className="w-10 h-px bg-white/10" />
        <span className="text-[9px] tracking-[0.55em] uppercase text-white/20">{number}</span>
        <span className="text-[9px] tracking-[0.4em] uppercase text-white/12">{label}</span>
        <div className="w-10 h-px bg-white/10" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-black">
      <Navbar />
      <ScrolVideo />
      <ChapterBreak number="02" label="Çalışma Alanları" />
      <Ofis />
      <ChapterBreak number="03" label="Koleksiyon" />
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/baburvideo.mp4"
        bgImageSrc="/frames/frame_0001.webp"
        title="BABUR MOBİLYA"
        date="Est. 2010"
        scrollToExpand="Keşfetmek için kaydırın"
      >
        <div className="max-w-3xl mx-auto flex flex-col gap-8 text-center">
          <p className="text-white/50 text-sm tracking-wide leading-relaxed">
            Her mobilya bir hikaye anlatır. Babur Mobilya olarak, yaşam ve çalışma
            alanlarınızı zarafetle dönüştüren, el işçiliğiyle tasarlanmış koleksiyonlar
            sunuyoruz. Malzemeden üretime, her detay sizin için özenle seçildi.
          </p>
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { num: "500+", label: "Tamamlanan Proje" },
              { num: "15+",  label: "Yıl Deneyim" },
              { num: "100%", label: "Özel Üretim" },
            ].map((s) => (
              <div key={s.num} className="flex flex-col gap-1">
                <span className="text-white font-bold text-2xl">{s.num}</span>
                <span className="text-white/30 text-xs tracking-widest uppercase">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </ScrollExpandMedia>
    </div>
  );
}
