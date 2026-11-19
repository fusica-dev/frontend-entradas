import { Minus, Plus, Trash2, Ticket, Users, Grid3X3, ShoppingBag } from "lucide-react";
import type { ChangeEvent, Dispatch, SetStateAction, InputHTMLAttributes } from "react";
import type { GuestTicket, TicketType, UtecTicket } from "../types";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Field({ label, ...props }: Readonly<FieldProps>) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-sky-700">{label}</span>
      <input {...props} className="form-input" />
    </label>
  );
}

interface TicketCardProps {
  ticket: UtecTicket | GuestTicket;
  index: number;
  type: TicketType;
  onUpdate: (
    type: TicketType,
    id: string,
    field: "name" | "documentType" | "documentNumber",
    value: string,
  ) => void;
  onRemove: (type: TicketType, id: string) => void;
}

function TicketCard({ ticket, index, type, onUpdate, onRemove }: Readonly<TicketCardProps>) {
  const guestTicket = type === "guest" ? ticket as GuestTicket : null;
  return (
    <div className="rounded-2xl border border-sky-100 bg-sky-50/40 p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-black text-sky-950">Entrada {index + 1}</p>
        <button type="button" onClick={() => onRemove(type, ticket.id)} className="icon-button" aria-label="Eliminar entrada">
          <Trash2 size={16} />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1.3fr_1fr_1fr]">
        <Field
          label="Nombre completo"
          value={ticket.name}
          onChange={(event) => onUpdate(type, ticket.id, "name", event.target.value)}
          placeholder="Ej. Ana Torres"
          required
        />
        {type === "guest" && (
          <>
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-sky-700">Tipo de documento</span>
              <select
                className="form-input"
                value={guestTicket?.documentType}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  onUpdate(type, ticket.id, "documentType", event.target.value)}
              >
                <option>DNI</option>
                <option>Pasaporte</option>
                <option>CE</option>
              </select>
            </label>
            <Field
              label="Número de documento"
              value={guestTicket?.documentNumber ?? ""}
              onChange={(event) => onUpdate(type, ticket.id, "documentNumber", event.target.value)}
              placeholder="Número"
              required
            />
          </>
        )}
      </div>
    </div>
  );
}

interface TicketBuilderProps {
  utecTickets: UtecTicket[];
  guestTickets: GuestTicket[];
  bingoQty: number;
  bingoShared: boolean;
  bingoNames: string[];
  total: number;
  onAddTicket: (type: TicketType) => void;
  onRemoveTicket: (type: TicketType, id: string) => void;
  onUpdateTicket: TicketCardProps["onUpdate"];
  onSetBingoQty: Dispatch<SetStateAction<number>>;
  onSetBingoShared: Dispatch<SetStateAction<boolean>>;
  onSetBingoNames: Dispatch<SetStateAction<string[]>>;
  onContinue: () => void;
}

export default function TicketBuilder({
  utecTickets,
  guestTickets,
  bingoQty,
  bingoShared,
  bingoNames,
  total,
  onAddTicket,
  onRemoveTicket,
  onUpdateTicket,
  onSetBingoQty,
  onSetBingoShared,
  onSetBingoNames,
  onContinue,
}: Readonly<TicketBuilderProps>) {
  const setBingoName = (index: number, value: string) => {
    onSetBingoNames((previous) => {
      const next = [...previous];
      next[index] = value;
      return next;
    });
  };

  return (
    <section id="comprar" className="mx-auto max-w-7xl px-5 pb-28 pt-24 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-500">Entradas disponibles</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-sky-950 sm:text-5xl">Arma tu pedido</h2>
        <p className="mx-auto mt-4 max-w-xl text-sky-700">Selecciona tus entradas y completa los datos de cada asistente.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <article className="product-card">
            <div className="product-heading">
              <span className="product-icon bg-sky-100 text-sky-700"><Users size={24} /></span>
              <div className="flex-1">
                <h3>Comunidad UTEC</h3>
                <p>Estudiantes, profesores y trabajadores</p>
              </div>
              <strong className="price">S/ 3.00</strong>
            </div>
            <button type="button" className="add-button" onClick={() => onAddTicket("utec")}>
              <Plus size={18} /> Agregar entrada
            </button>
            {utecTickets.length > 0 && (
              <div className="mt-5 space-y-3">
                {utecTickets.map((ticket, index) => (
                  <TicketCard key={ticket.id} ticket={ticket} index={index} type="utec"
                    onUpdate={onUpdateTicket} onRemove={onRemoveTicket} />
                ))}
              </div>
            )}
          </article>

          <article className="product-card">
            <div className="product-heading">
              <span className="product-icon bg-orange-100 text-orange-600"><Ticket size={24} /></span>
              <div className="flex-1">
                <h3>Externos / Invitados</h3>
                <p>Entrada general para invitados</p>
              </div>
              <strong className="price">S/ 5.00</strong>
            </div>
            <button type="button" className="add-button" onClick={() => onAddTicket("guest")}>
              <Plus size={18} /> Agregar entrada
            </button>
            {guestTickets.length > 0 && (
              <div className="mt-5 space-y-3">
                {guestTickets.map((ticket, index) => (
                  <TicketCard key={ticket.id} ticket={ticket} index={index} type="guest"
                    onUpdate={onUpdateTicket} onRemove={onRemoveTicket} />
                ))}
              </div>
            )}
          </article>

          <article className="product-card">
            <div className="product-heading">
              <span className="product-icon bg-yellow-100 text-yellow-700"><Grid3X3 size={24} /></span>
              <div className="flex-1">
                <h3>Cartillas de Bingo</h3>
                <p>Elige cuántas cartillas necesitas</p>
              </div>
              <strong className="price">S/ 2.00</strong>
            </div>
            <div className="mt-5 flex items-center justify-between rounded-2xl bg-sky-950 px-4 py-3">
              <p className="font-bold text-white">Cantidad</p>
              <div className="flex items-center gap-4">
                <button type="button" className="qty-button" onClick={() => onSetBingoQty(Math.max(0, bingoQty - 1))} aria-label="Quitar cartilla">
                  <Minus size={17} />
                </button>
                <strong className="min-w-6 text-center text-xl text-white">{bingoQty}</strong>
                <button type="button" className="qty-button" onClick={() => onSetBingoQty(bingoQty + 1)} aria-label="Agregar cartilla">
                  <Plus size={17} />
                </button>
              </div>
            </div>

            {bingoQty > 0 && (
              <div className="mt-5 space-y-4">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-sky-100 p-4">
                  <input
                    type="checkbox"
                    checked={bingoShared}
                    onChange={(event) => onSetBingoShared(event.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-sky-700"
                  />
                  <span className="text-sm font-bold leading-relaxed text-sky-900">
                    Asignar todas las cartillas a un mismo responsable para recojo el día del evento
                  </span>
                </label>
                {bingoShared ? (
                  <Field
                    label="Nombre completo del responsable"
                    value={bingoNames[0] ?? ""}
                    onChange={(event) => setBingoName(0, event.target.value)}
                    placeholder="Nombre del responsable"
                    required
                  />
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Array.from({ length: bingoQty }, (_, index) => (
                      <Field
                        key={index}
                        label={`Responsable cartilla ${index + 1}`}
                        value={bingoNames[index] ?? ""}
                        onChange={(event) => setBingoName(index, event.target.value)}
                        placeholder="Nombre completo"
                        required
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </article>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-6 rounded-3xl bg-sky-950 p-6 text-white shadow-2xl shadow-sky-950/20">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-800"><ShoppingBag size={19} /></span>
              <h3 className="font-black">Resumen del pedido</h3>
            </div>
            <div className="space-y-3 py-5 text-sm">
              <SummaryRow label="Entradas UTEC" qty={utecTickets.length} value={utecTickets.length * 3} />
              <SummaryRow label="Entradas externas" qty={guestTickets.length} value={guestTickets.length * 5} />
              <SummaryRow label="Cartillas" qty={bingoQty} value={bingoQty * 2} />
            </div>
            <div className="flex items-end justify-between border-t border-white/10 pt-5">
              <span className="text-sm font-bold text-sky-200">Total a pagar</span>
              <strong className="text-3xl text-orange-300">S/ {total.toFixed(2)}</strong>
            </div>
            <button type="button" onClick={onContinue} className="mt-6 w-full rounded-xl bg-orange-400 px-5 py-4 font-black text-sky-950 transition hover:bg-orange-300">
              Continuar al pago
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}

interface SummaryRowProps {
  readonly label: string;
  readonly qty: number;
  readonly value: number;
}

function SummaryRow({ label, qty, value }: Readonly<SummaryRowProps>) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sky-200">{label} <b className="ml-1 text-white">× {qty}</b></span>
      <span className="font-bold">S/ {value.toFixed(2)}</span>
    </div>
  );
}
