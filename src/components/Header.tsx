import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-40 border-b border-white/15">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <a href="/" className="flex items-center gap-3 text-white" aria-label="Inicio">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-400 text-sky-950">
            <Sparkles size={20} fill="currentColor" />
          </span>
          <span>
            <strong className="block text-sm leading-none tracking-[0.16em]">UTEC</strong>
            <small className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-200">Cultura</small>
          </span>
        </a>
        <button
          type="button"
          onClick={() => document.querySelector("#comprar")?.scrollIntoView({ behavior: "smooth" })}
          className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white hover:text-sky-950"
        >
          Comprar entradas
        </button>
      </div>
    </header>
  );
}
