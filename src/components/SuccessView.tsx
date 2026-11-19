import { Check, Download } from "lucide-react";

interface SuccessViewProps {
  readonly orderId: string;
}

export default function SuccessView({ orderId }: Readonly<SuccessViewProps>) {
  return (
    <main className="grid min-h-[calc(100vh-80px)] place-items-center bg-sky-50 px-5 py-16">
      <div className="w-full max-w-lg rounded-[2rem] border border-sky-100 bg-white p-8 text-center shadow-2xl shadow-sky-950/10 sm:p-12">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <Check size={38} strokeWidth={3} />
        </div>
        <p className="mt-7 text-xs font-black uppercase tracking-[0.22em] text-emerald-600">Pedido registrado</p>
        <h1 className="mt-3 text-3xl font-black text-sky-950">¡Gracias por tu compra!</h1>
        <p className="mt-4 leading-relaxed text-sky-700">
          Hemos recibido tu pedido y comprobante. Conserva este código para cualquier consulta.
        </p>
        <div className="mt-7 rounded-2xl bg-sky-950 px-5 py-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">Código de orden</p>
          <p className="mt-2 text-2xl font-black tracking-wider text-orange-300">{orderId}</p>
        </div>
        <button type="button" onClick={() => window.location.reload()} className="mx-auto mt-7 flex items-center gap-2 rounded-full border border-sky-200 px-5 py-3 font-bold text-sky-900 hover:bg-sky-50">
          <Download size={17} /> Finalizar
        </button>
      </div>
    </main>
  );
}
