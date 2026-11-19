export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-40 border-b border-white/15">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-center px-3 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-1.5 sm:flex-row sm:gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/90 sm:text-xs">
            Organizado por:
          </p>
          <div className="grid grid-cols-3 items-center gap-2 sm:gap-4">
          <img
            src="/images/logos/preludio_sinfonico_logo.webp"
            alt="Preludio Sinfónico"
            className="h-12 w-24 rounded-lg bg-white/95 p-1 object-contain shadow-lg backdrop-blur-sm sm:h-16 sm:w-36"
          />
          <img
            src="/images/logos/fusica_logo.webp"
            alt="Fúsica"
            className="h-12 w-24 rounded-lg bg-white/95 p-1 object-contain shadow-lg backdrop-blur-sm sm:h-16 sm:w-36"
          />
          <img
            src="/images/logos/dancetec_logo.webp"
            alt="DanceTEC"
            className="h-12 w-24 rounded-lg bg-white/95 p-1 object-contain shadow-lg backdrop-blur-sm sm:h-16 sm:w-36"
          />
          </div>
        </div>
      </div>
    </header>
  );
}
