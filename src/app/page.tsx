import Navbar from "@/components/navbar/navbar";
import ScrolVideo from "@/components/main/scrolvideo";
import StoryScrol from "@/components/storyscrol/storyscrol";
import Ofis from "@/components/ofis/ofis";
import ScrollExpandMedia from "@/components/scrolvideo/scrolbased";
import TextSection from "@/components/textkısmı/text";
import Text2 from "@/components/textkısmı/text2";
import SSS from "@/components/sss/sss";
import Yorumlar from "@/components/müşteriyorumları/yorumlar";
import Footer from "@/components/footer/footer";
import { WavePath } from "@/components/ui/wave-path";

function ChapterBreak({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-black flex items-center justify-center py-8 select-none">
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
      <StoryScrol />
      <TextSection />
      <div className="bg-white px-6 md:px-16 lg:px-24 pt-12 pb-24">
        <div className="flex justify-center">
          <WavePath className="text-black" />
        </div>
        <div className="mt-10 flex flex-col md:flex-row gap-6 md:gap-16 max-w-5xl mx-auto">
          <span className="text-xs text-neutral-400 tracking-widest uppercase shrink-0 mt-1">Babur Mobilya</span>
          <div className="relative">
            <span className="absolute -top-6 -left-4 text-6xl text-neutral-200 font-serif leading-none select-none">"</span>
            <p className="text-2xl md:text-4xl text-neutral-800 leading-snug font-light px-4">
              Piyasadaki birbirinin kopyası, ruhsuz ve ne üretildiği bile belli olmayan standart mobilyalardan sıkıldıysanız; malzemesiyle, dokusuyla ve işçiliğiyle gerçekten hissedilen bir yaşam alanı arıyorsanız, doğru yerdesiniz.
            </p>
            <span className="absolute -bottom-8 -right-2 text-6xl text-neutral-200 font-serif leading-none select-none">"</span>
          </div>
        </div>
      </div>
      <Text2 />

      <ChapterBreak number="02" label="Çalışma Alanları" />
      <Ofis />
      <ChapterBreak number="03" label="Koleksiyon" />
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/gardrop.mp4"
        posterSrc="/gardrop1.webp"
        bgImageSrc="/gardrop1.webp"
        logoSrc="/logo/baburlogo.png"
        mediaMobileSrc="/gardropresponsıve.mp4"
        posterMobileSrc="/gardropresponsive.webp"
        bgMobileImageSrc="/gardropresponsive.webp"
        date="Gardrop Koleksiyonu"
        scrollToExpand="Keşfetmek için kaydırın"
      >
        <div className="max-w-3xl mx-auto flex flex-col gap-10 text-center" style={{ fontFamily: "var(--font-poppins)" }}>
          <div className="flex flex-col gap-3">
            <p className="text-white/70 text-base md:text-lg font-light leading-relaxed">
              Yaşam alanınıza özel tasarlanan gardrop koleksiyonumuz; mekanın
              boyutlarına göre ölçülendirilen, içinde her şeyin yerli yerine
              oturduğu bir düzen sunar.
            </p>
            <p className="text-white/40 text-sm font-light leading-relaxed">
              Masif ahşap gövde, Avusturya gizli ray sistemi ve kişiye özel
              iç düzenleme ile her gardrop bire bir üretilir.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 text-center border-t border-white/10 pt-8">
            {[
              { num: "Masif Ahşap", label: "Gövde & Kapak" },
              { num: "Kişiye Özel", label: "İç Düzenleme" },
              { num: "5 Yıl",       label: "Tam Garanti" },
            ].map((s) => (
              <div key={s.num} className="flex flex-col gap-1.5">
                <span className="text-white font-semibold text-base md:text-lg">{s.num}</span>
                <span className="text-white/30 text-xs tracking-widest uppercase">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </ScrollExpandMedia>
      <SSS />
      <Yorumlar />
      <Footer />
    </div>
  );
}
