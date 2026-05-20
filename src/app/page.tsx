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
      <StoryScrol />
      <TextSection />
      <Text2 />

      <ChapterBreak number="02" label="Çalışma Alanları" />
      <Ofis />
      <ChapterBreak number="03" label="Koleksiyon" />
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/gardrop.mp4"
        posterSrc="/gardrop1.png"
        bgImageSrc="/gardrop1.png"
        logoSrc="/logo/baburlogo.png"
        mediaMobileSrc="/gardropresponsıve.mp4"
        posterMobileSrc="/gardropresponsıve.png"
        bgMobileImageSrc="/gardropresponsıve.png"
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
