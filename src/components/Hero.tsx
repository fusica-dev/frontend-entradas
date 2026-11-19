import { useEffect, useState } from "react";
import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1800&q=85",
    eyebrow: "Música · Arte · Comunidad",
  },
  {
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=85",
    eyebrow: "Una tarde para celebrar",
  },
  {
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1800&q=85",
    eyebrow: "Vive el Festival Cultural",
  },
];

export default function Hero() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % slides.length), 5500);
    return () => window.clearInterval(timer);
  }, []);

  const changeSlide = (direction: number) => {
    setSlide((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <section className="relative min-h-[640px] overflow-hidden bg-sky-950 lg:min-h-[700px]">
      {slides.map((item, index) => (
        <div
          key={item.image}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === slide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={item.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-950/95 via-sky-950/75 to-sky-950/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/70 via-transparent to-transparent" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex min-h-[640px] max-w-7xl items-center px-5 pb-16 pt-28 lg:min-h-[700px] lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-5 flex items-center gap-3 text-xs font-black uppercase tracking-[0.28em] text-orange-300">
            <span className="h-px w-10 bg-orange-300" />
            {slides[slide].eyebrow}
          </p>
          <h1 className="text-5xl font-black leading-[0.94] tracking-tight text-white sm:text-6xl lg:text-8xl">
            <span className="block">Festival</span>
            <span className="block text-sky-300">Cultural 2026</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-sky-100 sm:text-xl">
            Una celebración única de talento, arte y comunidad. Vive una tarde inolvidable en el campus UTEC.
          </p>
          <button
            type="button"
            onClick={() => document.querySelector("#comprar")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-orange-400 px-7 py-4 text-base font-black text-sky-950 shadow-xl shadow-orange-950/20 transition hover:-translate-y-1 hover:bg-orange-300"
          >
            Compra ya
            <ArrowDown size={18} />
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 right-5 z-20 flex items-center gap-2 lg:right-8">
        <button type="button" onClick={() => changeSlide(-1)} className="hero-control" aria-label="Anterior">
          <ChevronLeft size={20} />
        </button>
        <span className="mx-2 text-sm font-bold text-white">0{slide + 1} / 0{slides.length}</span>
        <button type="button" onClick={() => changeSlide(1)} className="hero-control" aria-label="Siguiente">
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
