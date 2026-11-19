import { useState } from "react";
import { ArrowLeft, Check, ImagePlus, LoaderCircle, ShieldCheck } from "lucide-react";
import type { ChangeEvent } from "react";
import type { GuestTicket, UtecTicket } from "../types";

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("No se pudo leer el comprobante."));
        return;
      }
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(reader.error ?? new Error("No se pudo leer el comprobante."));
    reader.readAsDataURL(file);
  });

interface PaymentViewProps {
  utecTickets: UtecTicket[];
  guestTickets: GuestTicket[];
  bingoQty: number;
  bingoShared: boolean;
  bingoNames: string[];
  total: number;
  onBack: () => void;
  onSuccess: (orderId: string) => void;
}

interface OrderRowProps {
  name: string;
  detail: string;
  price: string;
}

export default function PaymentView({
  utecTickets,
  guestTickets,
  bingoQty,
  bingoShared,
  bingoNames,
  total,
  onBack,
  onSuccess,
}: Readonly<PaymentViewProps>) {
  const [proof, setProof] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [email, setEmail] = useState("");
  const [yapeSender, setYapeSender] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("El comprobante debe ser JPG, PNG o WEBP.");
      return;
    }
    setError("");
    setProof(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitOrder = async () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError("Ingresa tu correo electrónico para recibir los detalles de la compra.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }
    if (!yapeSender.trim()) {
      setError("Ingresa el remitente o titular de la cuenta que realizó el Yape.");
      return;
    }
    if (!proof) {
      setError("Adjunta la captura de tu pago por Yape.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const base64 = await fileToBase64(proof);
      const orderId = `UTEC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const normalizedItems = [
        ...utecTickets.map((ticket) => ({
          type: "UTEC",
          fullName: ticket.name,
          docType: "N/A",
          docNumber: "N/A",
          unitPrice: 3,
        })),
        ...guestTickets.map((ticket) => ({
          type: "Externo",
          fullName: ticket.name,
          docType: ticket.documentType,
          docNumber: ticket.documentNumber,
          licensePlate: ticket.licensePlate.trim() || "",
          unitPrice: 5,
        })),
        ...Array.from({ length: bingoQty }, (_, index) => ({
          type: "Bingo",
          fullName: bingoShared
            ? (bingoNames[0] ?? "")
            : (bingoNames[index] ?? ""),
          docType: "N/A",
          docNumber: "N/A",
          unitPrice: 2,
        })),
      ];
      const payload = {
        orderId,
        totalAmount: total,
        email: normalizedEmail,
        contact: normalizedEmail,
        yapeSender: yapeSender.trim(),
        imageB64: base64,
        mimeType: proof.type,
        items: normalizedItems,
      };

      const endpoint = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
      if (!endpoint) throw new Error("Falta configurar VITE_GOOGLE_SCRIPT_URL.");

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("No se pudo registrar el pedido.");
      onSuccess(orderId);
    } catch (submitError) {
      setError(submitError instanceof Error
        ? submitError.message
        : "Ocurrió un error al enviar el pedido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-sky-50 px-5 py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 font-bold text-sky-700 hover:text-sky-950">
          <ArrowLeft size={18} /> Volver y editar
        </button>
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-500">Último paso</p>
          <h1 className="mt-2 text-3xl font-black text-sky-950 sm:text-5xl">Confirma tu pago</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-3xl border border-sky-100 bg-white p-5 shadow-xl shadow-sky-950/5 sm:p-7">
            <h2 className="mb-5 text-xl font-black text-sky-950">Resumen de tu pedido</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-sky-100 text-xs uppercase tracking-wider text-sky-500">
                  <tr><th className="pb-3">Concepto</th><th className="pb-3">Asignación</th><th className="pb-3 text-right">Monto</th></tr>
                </thead>
                <tbody className="divide-y divide-sky-100">
                  {utecTickets.map((ticket, index) => (
                    <OrderRow key={ticket.id} name={`Entrada UTEC ${index + 1}`} detail={ticket.name} price="S/ 3.00" />
                  ))}
                  {guestTickets.map((ticket, index) => (
                    <OrderRow key={ticket.id} name={`Entrada externa ${index + 1}`} detail={`${ticket.name} · ${ticket.documentType} ${ticket.documentNumber}`} price="S/ 5.00" />
                  ))}
                  {bingoQty > 0 && (
                    <OrderRow
                      name={`Cartillas de bingo × ${bingoQty}`}
                      detail={bingoShared
                        ? `Responsable: ${bingoNames[0]}`
                        : bingoNames.slice(0, bingoQty).map((name, index) => `${index + 1}. ${name}`).join(" · ")}
                      price={`S/ ${(bingoQty * 2).toFixed(2)}`}
                    />
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-sky-950 px-5 py-4 text-white">
              <span className="font-bold">Monto total a pagar</span>
              <strong className="text-2xl text-orange-300">S/ {total.toFixed(2)}</strong>
            </div>
          </section>

          <aside className="rounded-3xl border border-sky-100 bg-white p-5 shadow-xl shadow-sky-950/5 sm:p-7">
            <h2 className="text-xl font-black text-sky-950">Pago con Yape</h2>
            <div className="mt-5 grid grid-cols-[145px_1fr] items-center gap-4 rounded-2xl bg-sky-50 p-4">
              <img
                src="/images/yape/yape_tamy.webp"
                alt="Código QR de Yape"
                className="aspect-square w-full rounded-xl bg-white p-2"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sky-500">Titular</p>
                <p className="mt-1 font-black text-sky-950">Tamy Kristel Flores Guevara</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-sky-500">Yape</p>
                <p className="mt-1 text-lg font-black text-sky-950">948981074</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-sky-500">CCI</p>
                <p className="mt-1 break-all text-xs font-bold text-sky-950">00219111534103008957</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-sky-500">BCP</p>
                <p className="mt-1 text-sm font-black text-sky-950">19115341030089</p>
              </div>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-sky-700">
                Remitente del Yape (nombre o titular de la cuenta que yapeó) *
              </span>
              <input
                type="text"
                className="form-input"
                value={yapeSender}
                onChange={(event) => setYapeSender(event.target.value)}
                placeholder="Nombre del remitente"
                required
              />
            </label>

            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-sky-700">
                Comprobante de pago *
              </span>
              {preview ? (
                <div className="relative overflow-hidden rounded-2xl border border-sky-200 bg-sky-50">
                  <img src={preview} alt="Vista previa del comprobante" className="h-52 w-full object-contain" />
                  <label className="absolute bottom-3 right-3 cursor-pointer rounded-lg bg-sky-950 px-3 py-2 text-xs font-bold text-white">
                    <span>Cambiar</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky-200 px-4 py-8 text-center transition hover:border-sky-400 hover:bg-sky-50">
                  <ImagePlus className="text-sky-500" size={28} />
                  <span className="mt-3 text-sm font-bold text-sky-900">Subir captura</span>
                  <span className="mt-1 text-xs text-sky-500">JPG, PNG o WEBP</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="hidden" />
                </label>
              )}
            </label>

            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-sky-700">
                Correo electrónico *
              </span>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ejemplo@correo.com"
                autoComplete="email"
                required
              />
            </label>

            {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
            <button type="button" disabled={loading} onClick={submitOrder} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-400 px-5 py-4 font-black text-sky-950 disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? <><LoaderCircle size={19} className="animate-spin" /> Registrando compra y subiendo comprobante...</> : <>Confirmar y enviar pedido <Check size={18} /></>}
            </button>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-sky-500">
              <ShieldCheck size={15} /> Tus datos están protegidos
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

function OrderRow({ name, detail, price }: Readonly<OrderRowProps>) {
  return (
    <tr>
      <td className="py-4 pr-3 font-bold text-sky-950">{name}</td>
      <td className="py-4 pr-3 text-sky-700">{detail}</td>
      <td className="py-4 text-right font-black text-sky-950">{price}</td>
    </tr>
  );
}
